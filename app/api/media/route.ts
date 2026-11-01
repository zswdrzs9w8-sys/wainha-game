import { NextRequest } from "next/server";

const missing = () => new Response(null, {
  status: 404,
  headers: { "cache-control": "public,max-age=120" },
});

export async function GET(req: NextRequest) {
  const query = (req.nextUrl.searchParams.get("q") || "").replace(/\.[a-z0-9]+$/i, "").trim().slice(0, 100);
  if (!query) return missing();
  try {
    const api = new URL("https://commons.wikimedia.org/w/api.php");
    api.searchParams.set("action", "query");
    api.searchParams.set("generator", "search");
    api.searchParams.set("gsrsearch", query);
    api.searchParams.set("gsrnamespace", "6");
    api.searchParams.set("gsrlimit", "15");
    api.searchParams.set("prop", "imageinfo");
    api.searchParams.set("iiprop", "url|mime");
    api.searchParams.set("iiurlwidth", "1400");
    api.searchParams.set("format", "json");
    const found = await fetch(api, { headers: { "user-agent": "WainhaGame/1.0 (landmark image resolver)" } });
    if (!found.ok) throw new Error(`commons search ${found.status}`);
    const data = await found.json() as { query?: { pages?: Record<string, { imageinfo?: Array<{ thumburl?: string; url?: string; mime?: string }> }> } };
    const candidates = Object.values(data.query?.pages || {})
      .flatMap(page => page.imageinfo || [])
      .filter(info => (info.mime || "").startsWith("image/") && !info.mime?.includes("svg"));
    for (const item of candidates) {
      const source = item.thumburl || item.url;
      if (!source) continue;
      try {
        const image = await fetch(source, {
          redirect: "follow",
          headers: { "user-agent": "WainhaGame/2.0 (geography game image resolver)" },
        });
        if (!image.ok || !image.body) continue;
        const type = image.headers.get("content-type") || "";
        if (!type.startsWith("image/")) continue;
        return new Response(image.body, { headers: { "content-type": type, "cache-control": "public,max-age=604800,stale-while-revalidate=2592000" } });
      } catch {}
    }
    throw new Error("image not found");
  } catch (error) {
    console.error("landmark image error", error);
    return missing();
  }
}
