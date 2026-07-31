// =====================================================================
// Netlify Function: snapshot-intake
// Path: /.netlify/functions/snapshot-intake
// Method: POST  (and OPTIONS for CORS preflight)
// Body (JSON): {
//   email:          string  (required) — work email of requester
//   company:        string  (required) — company / org name
//   prompt:         string  (required) — system prompt / AI context to audit
//   brand_color?:   string  (optional) — hex color for the snapshot brand
//   ai_model?:      string  (optional) — e.g. "gpt-4", "claude-3-opus"
//   deployment_type?:string (optional) — "customer-facing" | "internal" | "hybrid"
//   bot-field?:     string  (honeypot, MUST be empty)
//   …any other fields are preserved into the saved intake record
// }
//
// Behaviour:
//   1. Handles OPTIONS preflight with CORS headers.
//   2. Rejects non-POST requests with 405.
//   3. Honeypot check: if `bot-field` is non-empty, returns 400 silently.
//   4. Validates that email, company, and prompt are present + non-empty.
//   5. Persists the full intake as JSON to
//        C:\Users\matt\snapshots\intake\{timestamp}-{company}.json
//      (creates the directory if it doesn't exist).
//   6. Appends a summary line to
//        C:\Users\matt\snapshots\deliveries.json
//      initializing it with { "deliveries": [] } on first run.
//   7. Returns 200 with { ok: true, id, next } where `next` is the
//      Stripe payment link the client should redirect to.
//
// Notes:
//   - No npm dependencies. Uses Node 18+ built-in `fs/promises` and `path`.
//   - Server-side slugifies the company name so the filename is safe
//     across filesystems.
//   - This function is idempotent in the sense that retries with the
//     same payload will create a new timestamped record; the deliveries
//     log is append-only.
// =====================================================================

const fs = require('fs/promises');
const path = require('path');

// Where intakes get stored on the Netlify instance filesystem.
// On Netlify, `process.cwd()` is usually /var/task; for local `netlify dev`
// it is the project root. We resolve relative to that so the path is stable.
// We allow override via env var SNAPSHOTS_DIR for flexibility.
const SNAPSHOTS_DIR = process.env.SNAPSHOTS_DIR
  ? path.resolve(process.env.SNAPSHOTS_DIR)
  : path.resolve(process.cwd(), 'snapshots');

// On Netlify the writable filesystem is /tmp; on local dev it's the project root.
// For production we recommend mounting a persistent volume or using a DB.
// For this build we default to /tmp in Netlify production so writes always succeed.
const IS_NETLIFY = !!process.env.NETLIFY || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const INTAKE_DIR = IS_NETLIFY
  ? '/tmp/snapshots/intake'
  : path.join(SNAPSHOTS_DIR, 'intake');
const DELIVERIES_LOG = IS_NETLIFY
  ? '/tmp/snapshots/deliveries.json'
  : path.join(SNAPSHOTS_DIR, 'deliveries.json');

// Hardcoded Stripe payment link — verified from the landing page.
// TODO: move to env var when we add multi-product support.
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/28EdRacdk5GueEx82da3u04';

// ---- CORS / response helpers ----
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function respond(statusCode, payload) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(payload)
  };
}

// ---- Filename helpers ----
function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'unnamed';
}

function timestampForFile() {
  // ISO-8601 with `:` and `.` removed so it's safe on every filesystem.
  // 2026-06-29T16-30-00-123Z
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function timestampForLog() {
  // Pretty ISO-8601, matches deliveries.json shape.
  return new Date().toISOString();
}

// ---- Body parsing (JSON or urlencoded) ----
function parseBody(event) {
  const raw = event.body || '{}';
  const ct =
    event.headers['content-type'] ||
    event.headers['Content-Type'] ||
    '';
  if (ct.includes('application/json')) {
    return JSON.parse(raw);
  }
  if (ct.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    const out = {};
    for (const [k, v] of params) out[k] = v;
    return out;
  }
  // Best-effort fallback: try JSON, then urlencoded.
  try { return JSON.parse(raw); }
  catch (_) {
    const params = new URLSearchParams(raw);
    const out = {};
    for (const [k, v] of params) out[k] = v;
    return out;
  }
}

// ---- Async file helpers ----
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readJsonSafe(filePath, fallback) {
  try {
    const txt = await fs.readFile(filePath, 'utf8');
    return JSON.parse(txt);
  } catch (_) {
    return fallback;
  }
}

async function writeJsonAtomic(filePath, data) {
  // Write to a temp file then rename so we never corrupt deliveries.json
  // if the function is killed mid-write.
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, filePath);
}

// ---- Validation ----
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function looksLikeEmail(v) {
  // Light validation — we just need an `@` and a dot in the domain.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ---- Handler ----
exports.handler = async (event) => {
  // 1) CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return respond(200, { ok: true });
  }

  // 2) Method guard
  if (event.httpMethod !== 'POST') {
    return respond(405, { ok: false, error: 'method_not_allowed' });
  }

  // 3) Parse body
  let body;
  try {
    body = parseBody(event);
  } catch (e) {
    return respond(400, { ok: false, error: 'invalid_body', message: e.message });
  }

  // 4) Honeypot — if a bot filled this field, return 400 silently.
  //    Real users never see this input; bots fill every field.
  if (isNonEmptyString(body['bot-field'])) {
    console.log('SNAPSHOT INTAKE: honeypot triggered, dropping submission');
    return respond(400, { ok: false, error: 'bot_detected' });
  }

  // 5) Required-field validation
  const email = (body.email || '').toString().trim();
  const company = (body.company || '').toString().trim();
  const prompt = (body.prompt || '').toString().trim();

  const missing = [];
  if (!isNonEmptyString(email)) missing.push('email');
  if (!isNonEmptyString(company)) missing.push('company');
  if (!isNonEmptyString(prompt)) missing.push('prompt');
  if (missing.length > 0) {
    return respond(400, {
      ok: false,
      error: 'missing_fields',
      missing,
      message: `Required fields missing: ${missing.join(', ')}`
    });
  }

  if (!looksLikeEmail(email)) {
    return respond(400, {
      ok: false,
      error: 'invalid_email',
      message: 'Email does not look valid.'
    });
  }

  // 6) Compose the saved record (full intake + metadata)
  const now = new Date();
  const timestampIso = now.toISOString();
  const id = timestampIso; // <timestamp> in the return value

  const record = {
    id,
    received_at: timestampIso,
    source: body.source || 'galeops-snapshot-form',
    user_agent: event.headers['user-agent'] || event.headers['User-Agent'] || 'unknown',
    ip:
      event.requestContext?.identity?.sourceIp ||
      event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      'unknown',
    email,
    company,
    brand_color: body.brand_color || null,
    ai_model: body.ai_model || null,
    deployment_type: body.deployment_type || null,
    prompt,
    // Preserve any extra fields the form sends (e.g. team_size, urgency).
    extra: Object.fromEntries(
      Object.entries(body).filter(([k]) =>
        !['email', 'company', 'prompt', 'brand_color', 'ai_model',
          'deployment_type', 'bot-field', 'source'].includes(k)
      )
    )
  };

  // 7) Persist the full intake as JSON
  const fileStamp = timestampForFile();
  const fileName = `${fileStamp}-${slugify(company)}.json`;
  const intakePath = path.join(INTAKE_DIR, fileName);

  try {
    await ensureDir(INTAKE_DIR);
    await writeJsonAtomic(intakePath, record);
  } catch (e) {
    console.error('SNAPSHOT INTAKE: failed to write intake file:', e.message);
    return respond(500, {
      ok: false,
      error: 'intake_write_failed',
      message: e.message
    });
  }

  // 8) Append a summary line to deliveries.json
  const summary = {
    id,
    company,
    email,
    brand_color: record.brand_color,
    ai_model: record.ai_model,
    deployment_type: record.deployment_type,
    status: 'pending',
    intake_file: path.relative(SNAPSHOTS_DIR, intakePath),
    created_at: timestampIso
  };

  try {
    const log = await readJsonSafe(DELIVERIES_LOG, { deliveries: [] });
    if (!Array.isArray(log.deliveries)) log.deliveries = [];
    log.deliveries.push(summary);

    await ensureDir(path.dirname(DELIVERIES_LOG));
    await writeJsonAtomic(DELIVERIES_LOG, log);
  } catch (e) {
    console.error('SNAPSHOT INTAKE: failed to update deliveries log:', e.message);
    // Don't fail the request — the intake file was saved successfully.
    // Log this so an operator can reconcile manually.
  }

  // 9) Success response — front-end uses `next` to redirect to Stripe.
  console.log('SNAPSHOT INTAKE OK:', JSON.stringify({
    id,
    company,
    email,
    brand_color: record.brand_color,
    ai_model: record.ai_model,
    deployment_type: record.deployment_type,
    intake_file: fileName
  }));

  return respond(200, {
    ok: true,
    id,
    next: STRIPE_PAYMENT_LINK
  });
};