import { getStore } from "@netlify/blobs";

// Path: /scan-stats
// GET  -> anonymized grade distribution + totals from captured scans
// POST -> append one anonymized scan record {grade, score, date}
// Store: galeops_scanstats
export const config = { path: "/scan-stats" };

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

const VALID = ["A", "B", "C", "D", "F"];

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

      const today = new Date().toISOString().slice(0, 10);
      // Load aggregate
      let agg = {};
      try { agg = JSON.parse((await store.get("aggregate")) || "{}"); } catch { agg = {}; }
      if (!agg.grades) agg.grades = {};
      if (!agg.byDate) agg.byDate = {};

      agg.grades[grade] = (agg.grades[grade] || 0) + 1;
      agg.total = (agg.total || 0) + 1;

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
      return json({ ok: true, total: agg.total });
    }

    // ---- GET: return aggregate ----
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

    return json({
      ok: true,
      total,
      avgScore: agg.avgScore ?? null,
      grade_distribution: gradeDist,
      grade_percent: gradePct,
      by_date: agg.byDate || {},
      generated_at: new Date().toISOString(),
    });
  } catch (e) {
    return json({ ok: false, error: e.message }, 500);
  }
};
