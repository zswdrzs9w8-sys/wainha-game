import { NextRequest } from "next/server";

const FALLBACK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760"><defs><linearGradient id="b" x2="0" y2="1"><stop stop-color="#071b2d"/><stop offset="1" stop-color="#02070d"/></linearGradient><radialGradient id="g"><stop stop-color="#1c718b" stop-opacity=".55"/><stop offset="1" stop-color="#03101a" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="760" fill="url(#b)"/><circle cx="600" cy="360" r="330" fill="url(#g)"/><path d="M345 610h510M470 610l36-270h188l36 270M520 340l80-170 80 170M540 432h120M525 505h150" fill="none" stroke="#83dfff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/><circle cx="600" cy="260" r="18" fill="#ffbe63"/><text x="600" y="690" fill="#c7e9f7" font-family="Arial" font-size="34" text-anchor="middle">LANDMARK IMAGE</text></svg>`;

export async function GET(req: NextRequest) {
  const query = (req.nextUrl.searchParams.get("q") || "").replace(/\.[a-z0-9]+$/i, "").trim().slice(0, 100);
  if (!query) return new Response(FALLBACK, { headers: { "content-type": "image/svg+xml", "cache-control": "public,max-age=3600" } });
  try {
    const api = new URL("https://commons.wikimedia.org/w/api.php");
    api.searchParams.set("action", "query");
    api.searchParams.set("generator", "search");
    api.searchParams.set("gsrsearch", query);
    api.searchParams.set("gsrnamespace", "6");
    api.searchParams.set("gsrlimit", "8");
    api.searchParams.set("prop", "imageinfo");
    api.searchParams.set("iiprop", "url|mime");
    api.searchParams.set("iiurlwidth", "1400");
    api.searchParams.set("format", "json");
    const found = await fetch(api, { headers: { "user-agent": "WainhaGame/1.0 (landmark image resolver)" } });
    if (!found.ok) throw new Error(`commons search ${found.status}`);
    const data = await found.json() as { query?: { pages?: Record<string, { imageinfo?: Array<{ thumburl?: string; url?: string; mime?: string }> }> } };
    const candidates = Object.values(data.query?.pages || {}).flatMap(page => page.imageinfo || []);
    const item = candidates.find(info => (info.mime || "").startsWith("image/") && !info.mime?.includes("svg")) || candidates[0];
    const source = item?.thumburl || item?.url;
    if (!source) throw new Error("image not found");
    const image = await fetch(source, { headers: { "user-agent": "WainhaGame/1.0 (landmark image resolver)" } });
    if (!image.ok || !image.body) throw new Error(`image fetch ${image.status}`);
    return new Response(image.body, { headers: { "content-type": image.headers.get("content-type") || "image/jpeg", "cache-control": "public,max-age=604800,stale-while-revalidate=2592000" } });
  } catch (error) {
    console.error("landmark image error", error);
    return new Response(FALLBACK, { headers: { "content-type": "image/svg+xml", "cache-control": "public,max-age=900" } });
  }
}
