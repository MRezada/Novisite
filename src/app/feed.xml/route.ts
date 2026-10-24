export const dynamic = 'force-static';
export const dynamic = 'force-dynamic';
import { absUrl } from "@/lib/seo";
import { getPublished, getSettings } from "@/lib/db";

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const [s, posts] = await Promise.all([getSettings(), getPublished("posts")]);
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const items = sorted.map((p) => `<item><title>${esc(p.title)}</title><link>${absUrl(s, `/insights/${p.slug}`)}</link><guid>${absUrl(s, `/insights/${p.slug}`)}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(s.nameFa)}</title><link>${absUrl(s, "/")}</link><description>${esc(s.description)}</description><language>fa</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

