import { getStore } from "@netlify/blobs";

export const config = { path: "/stats" };

export default async (request, context) => {
  const store = getStore("galeops_counts");
  const j = async (k) => {
    try { return JSON.parse((await store.get(k)) || "{}"); } catch { return {}; }
  };
  const n = async (k) => parseInt((await store.get(k)) || "0", 10) || 0;

  const body = {
    total_pageviews: await n("total"),
    unique_visitors: await n("uniques"),
    daily: await j("daily"),
    top_paths: await j("paths"),
    generated_at: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
};