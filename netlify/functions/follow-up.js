// Netlify Function: follow-up.js
// Explicit endpoint for tester visitors who opt into the email follow-up
// sequence. Separate file so we can later swap in a real ESP
// (Resend / ConvertKit / AWeber) without touching lead-capture.js.
//
// Today this just logs the enrol event with structured fields. Tomorrow it
// will forward to whatever ESP we wire up.

exports.handler = async (event, context) => {
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
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: 'invalid_body' })
    };
  }

  const email = (body.email || '').trim();
  if (!email || !email.includes('@')) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: 'valid_email_required' })
    };
  }

  const record = {
    timestamp: new Date().toISOString(),
    event_type: 'FOLLOW_UP_ENROLLED',
    email,
    source: body.source || 'prompt-tester',
    score: body.score || null,
    vuln_count: body.vuln_count || null,
    level: body.level || null,
    step: body.step || 'enrol',
    ip: event.requestContext?.identity?.sourceIp || 'unknown',
    user_agent: event.headers['user-agent'] || 'unknown'
  };

  // Single-line log for easy grep in Netlify function logs
  console.log('FOLLOW_UP_ENROLLED', JSON.stringify(record));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ok: true,
      enrolled: true,
      step: record.step
    })
  };
};
