export const config = { path: "/count" };

export default async (request) => {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get("p") || url.searchParams.get("path") || "/";
    return new Response(JSON.stringify({ ok: true, path, count: 1 }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
