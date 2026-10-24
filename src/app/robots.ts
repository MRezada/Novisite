import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/db";
import { absUrl } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSettings();
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }, sitemap: absUrl(s, "/sitemap.xml"), host: absUrl(s, "/") };
}
