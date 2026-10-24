export const dynamic = 'force-static';
import type { MetadataRoute } from "next";
import { getPublished, getSettings } from "@/lib/db";
import { absUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [s, products, projects, services, posts] = await Promise.all([
    getSettings(), getPublished("products"), getPublished("projects"), getPublished("services"), getPublished("posts"),
  ]);
  const fixed = [["", 1], ["/services", 0.9], ["/products", 0.9], ["/projects", 0.8], ["/about", 0.6], ["/team", 0.5], ["/insights", 0.7], ["/contact", 0.7]] as const;
  return [
    ...fixed.map(([p, priority]) => ({ url: absUrl(s, p || "/"), priority })),
    ...services.map((x) => ({ url: absUrl(s, `/services/${x.slug}`), lastModified: x.updatedAt, priority: 0.8 })),
    ...products.map((x) => ({ url: absUrl(s, `/products/${x.slug}`), lastModified: x.updatedAt, priority: 0.8 })),
    ...projects.map((x) => ({ url: absUrl(s, `/projects/${x.slug}`), lastModified: x.updatedAt, priority: 0.6 })),
    ...posts.map((x) => ({ url: absUrl(s, `/insights/${x.slug}`), lastModified: x.updatedAt, priority: 0.6 })),
  ];
}
