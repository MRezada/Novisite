import type { Metadata } from "next";
import type { Faq, Post, Product, Project, Service, Settings } from "./types";

export const absUrl = (s: Settings, path = "/") => {
  const base = s.siteUrl.replace(/\/$/, "");
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

type MetaInput = {
  settings: Settings; title?: string; description?: string; path: string; image?: string;
  type?: "website" | "article"; noindex?: boolean; publishedTime?: string; modifiedTime?: string;
};

export function pageMeta(i: MetaInput): Metadata {
  const { settings: s } = i;
  const description = (i.description || s.description).slice(0, 300);
  const image = absUrl(s, i.image || s.ogImage || "/og-default.png");
  const url = absUrl(s, i.path);
  return {
    title: i.title,
    description,
    authors: [{ name: s.nameFa, url: absUrl(s, "/about") }],
    creator: s.nameFa,
    publisher: s.nameFa,
    alternates: { canonical: url, languages: { "fa-IR": url } },
    robots: i.noindex ? { index: false, follow: false } : {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      title: i.title ?? `${s.nameFa} | ${s.tagline}`, description, url, siteName: s.nameFa, locale: "fa_IR",
      type: i.type ?? "website", images: [{ url: image, width: 1200, height: 630 }],
      ...(i.publishedTime ? { publishedTime: i.publishedTime } : {}),
      ...(i.modifiedTime ? { modifiedTime: i.modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: i.title ?? s.nameFa, description, images: [image] },
  };
}

type Ld = Record<string, unknown>;

export const organizationLd = (s: Settings): Ld => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${absUrl(s, "/")}#organization`,
  name: s.nameFa, alternateName: s.name, url: absUrl(s, "/"),
  logo: absUrl(s, s.logo), description: s.description,
  email: s.email || undefined, telephone: s.phone || undefined,
  address: s.city ? { "@type": "PostalAddress", addressLocality: s.city, streetAddress: s.address || undefined, addressCountry: "IR" } : undefined,
  sameAs: s.social.map((x) => x.href).filter((h) => h.startsWith("http")),
  areaServed: { "@type": "Country", name: "Iran" },
  knowsAbout: ["توسعه نرم‌افزار سفارشی", "وب اپلیکیشن", "اپلیکیشن موبایل", "طراحی محصول", "هوش مصنوعی", "DevOps"],
  contactPoint: (s.email || s.phone) ? [{
    "@type": "ContactPoint", contactType: "sales", email: s.email || undefined, telephone: s.phone || undefined,
    availableLanguage: ["fa"], areaServed: "IR",
  }] : undefined,
});

export const websiteLd = (s: Settings): Ld => ({
  "@context": "https://schema.org", "@type": "WebSite", "@id": `${absUrl(s, "/")}#website`, name: s.nameFa, url: absUrl(s, "/"), inLanguage: "fa-IR",
  publisher: { "@id": `${absUrl(s, "/")}#organization` },
});

export const breadcrumbLd = (s: Settings, items: { name: string; path: string }[]): Ld => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((it, n) => ({ "@type": "ListItem", position: n + 1, name: it.name, item: absUrl(s, it.path) })),
});

export const faqLd = (items: Pick<Faq, "q" | "a">[]): Ld => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const productLd = (s: Settings, p: Product): Ld => ({
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: p.nameFa, alternateName: p.name, description: p.description, applicationCategory: "BusinessApplication",
  operatingSystem: p.platforms.join(", ") || "Web", softwareVersion: p.version, url: absUrl(s, `/products/${p.slug}`),
  image: p.cover ? absUrl(s, p.cover) : undefined,
  publisher: { "@id": `${absUrl(s, "/")}#organization` },
  featureList: p.features.map((f) => f.title),
});

export const serviceLd = (s: Settings, v: Service): Ld => ({
  "@context": "https://schema.org", "@type": "Service", name: v.title, description: v.summary, serviceType: v.title,
  provider: { "@id": `${absUrl(s, "/")}#organization` }, areaServed: { "@type": "Country", name: "Iran" },
  availableLanguage: ["fa"], url: absUrl(s, `/services/${v.slug}`),
});

export const projectLd = (s: Settings, p: Project): Ld => ({
  "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: p.summary,
  url: absUrl(s, `/projects/${p.slug}`), dateCreated: p.year, image: p.cover ? absUrl(s, p.cover) : undefined,
  creator: { "@id": `${absUrl(s, "/")}#organization` },
});

export const articleLd = (s: Settings, p: Post): Ld => ({
  "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.excerpt,
  datePublished: p.date, dateModified: p.updatedAt, inLanguage: "fa-IR",
  image: absUrl(s, p.cover || s.ogImage), mainEntityOfPage: absUrl(s, `/insights/${p.slug}`),
  author: { "@type": "Organization", name: p.author || s.nameFa },
  publisher: { "@id": `${absUrl(s, "/")}#organization` },
});


export const webPageLd = (s: Settings, input: { name: string; description: string; path: string }): Ld => ({
  "@context": "https://schema.org", "@type": "WebPage", name: input.name, description: input.description,
  url: absUrl(s, input.path), inLanguage: "fa-IR", isPartOf: { "@type": "WebSite", "@id": `${absUrl(s, "/")}#website`, url: absUrl(s, "/"), name: s.nameFa },
  about: { "@id": `${absUrl(s, "/")}#organization` },
});

export const itemListLd = (s: Settings, name: string, items: { name: string; path: string }[]): Ld => ({
  "@context": "https://schema.org", "@type": "ItemList", name, numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: absUrl(s, item.path) })),
});
