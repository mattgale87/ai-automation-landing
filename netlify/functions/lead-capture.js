// Netlify Function: Backup email capture for galeops.xyz
// Receives form posts when Modal API is down, or directly as primary capture.
//
// Now also accepts explicit follow-up enrolment from the tester results page.
// Fields: follow_up: boolean, follow_up_step: string (sequence step tag).
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'method_not_allowed' })
    };
  }

  let body = {};
  try {
    if (event.headers['content-type']?.includes('application/json')) {
      body = JSON.parse(event.body || '{}');
    } else if (event.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(event.body || '');
      for (const [k, v] of params) body[k] = v;
    }
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: 'invalid_body' })
    };
  }

  const email = body.email?.trim() || '';
  if (!email || !email.includes('@')) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: 'valid_email_required' })
    };
  }

  const follow_up = body.follow_up === true || body.follow_up === 'true';
  const follow_up_step = typeof body.follow_up_step === 'string'
    ? body.follow_up_step.slice(0, 64)
    : null;

  const record = {
    timestamp: new Date().toISOString(),
    source: body.source || 'unknown',
    email,
    prompt: body.prompt || null,
    score: body.score || null,
    product: body.product || null,
    tier: body.tier || null,
    amount: body.amount || null,
    intent: body.intent || null,
    company: body.company || null,
    follow_up_eligible: follow_up,
    follow_up_step,
    ip: event.requestContext?.identity?.sourceIp || 'unknown',
    user_agent: event.headers['user-agent'] || 'unknown',
    event_type: body.intent === 'purchase'
      ? 'PRODUCT_PURCHASE'
      : (follow_up
        ? 'FOLLOW_UP_ENROLLED'
        : (body.email ? 'LEAD_CAPTURED' : 'OTHER'))
  };

  console.log('LEAD CAPTURE:', JSON.stringify(record));
  if (follow_up) {
    console.log('FOLLOW_UP_ENROLLED:', email, 'source=' + record.source, 'step=' + (follow_up_step || '0'));
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ok: true,
      captured: true,
      follow_up_enrolled: follow_up,
      source: record.source
    })
  };
};
