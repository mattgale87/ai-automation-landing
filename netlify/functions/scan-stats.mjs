import { getStore } from "@netlify/blobs";

// Path: /scan-stats
// GET  -> anonymized grade distribution + totals + last-20 per-scan event tail
// POST -> append one scan: aggregate counters + per-scan event in a JSONL blob
// Stores: galeops_scanstats  (blobs: "aggregate", "events-<YYYY-MM-DD>" JSONL, "events-archive")
//
// Privacy contract for per-scan events (added 2026-09-05):
//   NO prompt content, NO emails (only a boolean "one was provided"),
//   NO finding names/evidence/OWASP refs — severity NAMES only.
//   The "event" field is whitelisted: "scan" (default) or "test".
//   "test" records are logged but do NOT touch the public aggregate —
//   used for pipeline verification without polluting the industry report.
export const config = { path: "/scan-stats" };

const VALID = ["A", "B", "C", "D", "F"];
const SEVERITIES = new Set(["Critical", "High", "Medium", "Low", "None"]);
const MAX_TAIL = 20;              // recent events returned by GET
const DAY_FILE_ROTATE_LINES = 800; // roll a huge day file into events-archive

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}

function buildEventRecord(body, grade, score) {
  // event type: whitelisted; anything but "test" is treated as a real scan
  const event = body.event === "test" ? "test" : "scan";

  const findingCount =
    Number.isInteger(body.findingCount) && body.findingCount >= 0
      ? Math.min(body.findingCount, 50)
      : null;

  const topSeverities = Array.isArray(body.topSeverities)
    ? body.topSeverities.filter((s) => SEVERITIES.has(s)).slice(0, 3)
    : [];

  const findingsBySeverity = {};
  if (
    body.findingsBySeverity &&
    typeof body.findingsBySeverity === "object" &&
    !Array.isArray(body.findingsBySeverity)
  ) {
    for (const s of SEVERITIES) {
      const n = body.findingsBySeverity[s];
      if (Number.isInteger(n) && n > 0) findingsBySeverity[s] = Math.min(n, 50);
    }
  }

  const rec = {
    ts: new Date().toISOString(),
    event,
    grade,
    score,
    deep: body.deep === true,
    emailProvided: body.emailProvided === true,
    findingCount,
    topSeverities,
    findingsBySeverity: Object.keys(findingsBySeverity).length
      ? findingsBySeverity
      : undefined,
    aiModel:
      typeof body.aiModel === "string"
        ? body.aiModel.replace(/[^\x20-\x7E]/g, "").slice(0, 40) || undefined
        : undefined,
  };
  for (const k of Object.keys(rec)) {
    if (rec[k] === undefined) delete rec[k];
  }
  return rec;
}

async function appendEvent(store, rec) {
  const today = new Date().toISOString().slice(0, 10);
  const dayKey = `events-${today}`;
  let lines = [];
  try {
    const content = (await store.get(dayKey)) || "";
    lines = content.split("\n").filter(Boolean);
  } catch {
    lines = [];
  }
  // Roll a monster day file into the archive so the hot key stays small.
  if (lines.length >= DAY_FILE_ROTATE_LINES) {
    try {
      const prevArch = (await store.get("events-archive")) || "";
      await store.set("events-archive", prevArch + lines.join("\n") + "\n");
    } catch {
      // archive write is best-effort; never block the hot path
    }
    lines = [];
  }
  lines.push(JSON.stringify(rec));
  await store.set(dayKey, lines.join("\n") + "\n");
  return lines.length;
}

async function readTail(store, max) {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const content = (await store.get(`events-${today}`)) || "";
    return content
      .split("\n")
      .filter(Boolean)
      .slice(-max)
      .map((l) => {
        try { return JSON.parse(l); }
        catch { return { raw: l.slice(0, 200) }; }
      });
  } catch {
    return [];
  }
}

export default async (request) => {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return json({ ok: true });
  }

  const store = getStore("galeops_scanstats");

  try {
    // ---- POST: append one scan ----
    if (request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({ ok: false, error: "bad_json" }, 400); }

      const grade = (body.grade || "").toString().toUpperCase();
      const score = typeof body.score === "number" ? body.score : null;
      if (!VALID.includes(grade)) {
        return json({ ok: false, error: "invalid_grade" }, 400);
      }

      const rec = buildEventRecord(body, grade, score);
      const todayCount = await appendEvent(store, rec);

      // Aggregate counters: real scans only — "test" events stay out of the report.
      let agg = {};
      if (rec.event === "scan") {
        try { agg = JSON.parse((await store.get("aggregate")) || "{}"); } catch { agg = {}; }
        if (!agg.grades) agg.grades = {};
        if (!agg.byDate) agg.byDate = {};

        agg.grades[grade] = (agg.grades[grade] || 0) + 1;
        agg.total = (agg.total || 0) + 1;

        const today = new Date().toISOString().slice(0, 10);
        const d = (agg.byDate[today] = agg.byDate[today] || { total: 0, grades: {} });
        d.total += 1;
        d.grades[grade] = (d.grades[grade] || 0) + 1;

        if (typeof score === "number") {
          if (!agg.scoreSum) agg.scoreSum = 0;
          if (!agg.scoreCount) agg.scoreCount = 0;
          agg.scoreSum += score;
          agg.scoreCount += 1;
          agg.avgScore = +(agg.scoreSum / agg.scoreCount).toFixed(1);
        }

        await store.set("aggregate", JSON.stringify(agg));
      }

      return json({ ok: true, total: agg.total ?? null, events_today: todayCount, event: rec.event });
    }

    // ---- GET: aggregate + today's per-scan tail ----
    let agg = {};
    try { agg = JSON.parse((await store.get("aggregate")) || "{}"); } catch { agg = {}; }

    const grades = agg.grades || {};
    const gradeDist = Object.fromEntries(
      VALID.map((g) => [g, grades[g] || 0])
    );
    const total = agg.total || 0;
    const gradePct = {};
    if (total > 0) {
      for (const g of VALID) gradePct[g] = +(((gradeDist[g] || 0) / total) * 100).toFixed(1);
    }

    const recentEvents = await readTail(store, MAX_TAIL);

    return json({
      ok: true,
      total,
      avgScore: agg.avgScore ?? null,
      grade_distribution: gradeDist,
      grade_percent: gradePct,
      by_date: agg.byDate || {},
      recent_events: recentEvents,
      generated_at: new Date().toISOString(),
    });
  } catch (e) {
    return json({ ok: false, error: e.message }, 500);
  }
};