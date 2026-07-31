// Netlify Function: Create Stripe Checkout Session
// Path: /.netlify/functions/create-stripe-session
// Method: POST
// Body: { tier, amount, customer_email, product_name, metadata? }
//
// Creates a hosted Stripe Checkout Session and returns { url } so the
// client can redirect the buyer. Uses server-side STRIPE_SECRET_KEY.
//
// We use the Stripe REST API directly (no npm install needed) so the
// function works in any Netlify deploy without a build step.
//
// Pricing is whitelisted server-side — the `amount` from the client is
// only used as a sanity check against the tier's canonical price. The
// authoritative price comes from the TIER_PRICES map below.

const https = require('https');

// Tier definitions — canonical server-side prices (USD cents).
// This is the source of truth; the client cannot override it.
const TIER_PRICES = {
  'quiz-report-49': {
    product_name: 'AI Security Risk Report (7-page PDF)',
    amount_cents: 4900,
    description: 'Personalized PDF with your top prompt injection risks, tested exploits, and remediation checklist. Delivered in 15 min.'
  },
  'snapshot-149': {
    product_name: 'AI Security Audit Snapshot (15-min video)',
    amount_cents: 14900,
    description: '15-min video walkthrough + branded PDF audit. Delivered in 48 hours.'
  },
  'starter-kit-499': {
    product_name: 'AI Compliance Starter Kit',
    amount_cents: 49900,
    description: 'GDPR / EU AI Act / Colorado AI Act compliance bundle: PDF + video + policy templates + 1hr live consult. Delivered in 7 days.'
  }
};

// Map tier to Stripe Price ID once Matt creates them via the CLI / dashboard.
// These can be set via Netlify env vars (STRIPE_PRICE_QUIZ, STRIPE_PRICE_SNAPSHOT,
// STRIPE_PRICE_STARTER) OR left blank to fall back to price_data.
const PRICE_IDS = {
  'quiz-report-49': process.env.STRIPE_PRICE_QUIZ || null,
  'snapshot-149':   process.env.STRIPE_PRICE_SNAPSHOT || null,
  'starter-kit-499':process.env.STRIPE_PRICE_STARTER || null
};

const SITE_URL = process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://galeops.xyz';

// ---- HTTP helpers (no dependencies) ----
function postForm(host, path, body, headers = {}) {
  const data = typeof body === 'string' ? body : new URLSearchParams(body).toString();
  return new Promise((resolve, reject) => {
    const req = https.request({
      host,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        ...headers
      }
    }, (res) => {
      let chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve({ status: res.statusCode, body: text });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function respond(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };
}

// ---- Rate limiter: 10 requests per IP per 5-minute window (in-memory) ----
// Not bulletproof (a determined attacker can bypass), but stops casual abuse
// and runaway clients. In-memory means it resets on cold start.
function checkRateLimit(event) {
  const clientIp = (event.headers['x-forwarded-for'] || event.headers['X-Forwarded-For'] || '')
    .split(',')[0].trim()
    || event.headers['client-ip']
    || event.headers['Client-Ip']
    || 'unknown';
  const WINDOW_MS = 5 * 60 * 1000;
  const MAX_PER_WINDOW = 10;
  if (!global.__galeops_rl) global.__galeops_rl = {};
  const bucket = global.__galeops_rl[clientIp] || (global.__galeops_rl[clientIp] = []);
  const now = Date.now();
  while (bucket.length && bucket[0] < now - WINDOW_MS) bucket.shift();
  if (bucket.length >= MAX_PER_WINDOW) {
    return { allowed: false, clientIp };
  }
  bucket.push(now);
  return { allowed: true, clientIp };
}

// ---- Handler ----
exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return respond(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return respond(405, { ok: false, error: 'method_not_allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return respond(500, {
      ok: false,
      error: 'stripe_not_configured',
      message: 'STRIPE_SECRET_KEY env var is missing. Set it in the Netlify dashboard.'
    });
  }

  // Rate limit check
  const rl = checkRateLimit(event);
  if (!rl.allowed) {
    console.warn('RATE LIMIT HIT:', rl.clientIp);
    return respond(429, {
      ok: false,
      error: 'rate_limited',
      message: 'Too many checkout requests from this IP. Try again in a few minutes.'
    });
  }

  // Parse body (JSON or form-encoded)
  let body = {};
  try {
    const ct = event.headers['content-type'] || event.headers['Content-Type'] || '';
    if (ct.includes('application/json')) {
      body = JSON.parse(event.body || '{}');
    } else if (ct.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(event.body || '');
      for (const [k, v] of params) body[k] = v;
    } else {
      // try JSON first, then form
      try { body = JSON.parse(event.body || '{}'); }
      catch (_) {
        const params = new URLSearchParams(event.body || '');
        for (const [k, v] of params) body[k] = v;
      }
    }
  } catch (e) {
    return respond(400, { ok: false, error: 'invalid_body' });
  }

  const tier = (body.tier || '').toString().trim();
  const customerEmail = (body.customer_email || body.email || '').toString().trim();
  const metadata = body.metadata && typeof body.metadata === 'object' ? body.metadata : {};

  if (!tier || !TIER_PRICES[tier]) {
    return respond(400, {
      ok: false,
      error: 'invalid_tier',
      message: `Unknown tier "${tier}". Valid tiers: ${Object.keys(TIER_PRICES).join(', ')}`
    });
  }

  const tierDef = TIER_PRICES[tier];
  const priceId = PRICE_IDS[tier];

  // Build form params for Stripe API
  const form = {
    'mode': 'payment',
    'success_url': `${SITE_URL}/thanks/?session_id={CHECKOUT_SESSION_ID}&tier=${encodeURIComponent(tier)}`,
    'cancel_url': `${SITE_URL}/products/${tier.startsWith('starter-kit') ? 'starter-kit' : tier.startsWith('snapshot') ? 'snapshot' : 'quiz-report'}/?canceled=1`,
    'customer_email': customerEmail || undefined,
    'metadata[tier]': tier,
    'metadata[source]': 'galeops-product-page',
    ...Object.fromEntries(Object.entries(metadata).map(([k, v]) => [`metadata[${k}]`, String(v)])),
    'payment_intent_data[metadata][tier]': tier,
    'payment_intent_data[metadata][source]': 'galeops-product-page',
    ...Object.fromEntries(Object.entries(metadata).map(([k, v]) => [`payment_intent_data[metadata][${k}]`, String(v)]))
  };

  // Use existing Price ID if Matt set one, otherwise inline price_data
  if (priceId) {
    form['line_items[0][price]'] = priceId;
    form['line_items[0][quantity]'] = '1';
  } else {
    form['line_items[0][quantity]'] = '1';
    form['line_items[0][price_data][currency]'] = 'usd';
    form['line_items[0][price_data][unit_amount]'] = String(tierDef.amount_cents);
    form['line_items[0][price_data][product_data][name]'] = tierDef.product_name;
    form['line_items[0][price_data][product_data][description]'] = tierDef.description;
  }

  // Remove empty customer_email so Stripe collects it
  if (!form.customer_email) delete form.customer_email;

  try {
    const res = await postForm('api.stripe.com', '/v1/checkout/sessions', form);
    let parsed;
    try { parsed = JSON.parse(res.body); } catch (_) { parsed = { raw: res.body }; }

    if (res.status >= 200 && res.status < 300 && parsed.url) {
      console.log('STRIPE SESSION CREATED:', JSON.stringify({
        session_id: parsed.id,
        tier,
        amount: tierDef.amount_cents,
        customer_email: customerEmail || '(collected)',
        livemode: parsed.livemode
      }));
      return respond(200, {
        ok: true,
        url: parsed.url,
        session_id: parsed.id,
        tier,
        amount_cents: tierDef.amount_cents
      });
    }

    console.error('STRIPE ERROR:', res.status, parsed);
    return respond(res.status >= 400 && res.status < 600 ? res.status : 502, {
      ok: false,
      error: 'stripe_error',
      stripe_status: res.status,
      message: parsed.error?.message || 'Stripe did not return a checkout URL.',
      stripe_request_id: parsed.request_id || null
    });
  } catch (e) {
    console.error('STRIPE NETWORK ERROR:', e.message);
    return respond(502, {
      ok: false,
      error: 'stripe_network_error',
      message: e.message
    });
  }
};
