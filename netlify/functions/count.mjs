import { getStore } from "@netlify/blobs";

export const config = { path: "/count" };

export default async (request, context) => {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get("p") || url.searchParams.get("path") || "/";

    const cookies = context.cookies;
    let isNew = false;
    let vid = cookies.get("galeops_vid");
    if (!vid) {
      vid = (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : String(Date.now()) + Math.random().toString(16).slice(2);
      isNew = true;
      cookies.set({
        name: "galeops_vid",
        value: vid,
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        httpOnly: false,
        sameSite: "lax",
      });
    }

    const store = getStore("galeops_counts");
    const bump = async (key, by = 1) => {
      const cur = parseInt((await store.get(key)) || "0", 10) || 0;
      await store.set(key, String(cur + by));
    };

    await bump("total");
    if (isNew) await bump("uniques");

    const day = new Date().toISOString().slice(0, 10);
    const daily = JSON.parse((await store.get("daily")) || "{}");
    daily[day] = (daily[day] || 0) + 1;
    await store.set("daily", JSON.stringify(daily));

    const paths = JSON.parse((await store.get("paths")) || "{}");
    paths[path] = (paths[path] || 0) + 1;
    await store.set("paths", JSON.stringify(paths));

    return new Response("ok", { status: 200, headers: { "Content-Type": "text/plain" } });
  } catch (e) {
    return new Response("err:" + (e && e.message), { status: 200 });
  }
};