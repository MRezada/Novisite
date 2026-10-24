export type Meta = { id: string; published: boolean; order: number; updatedAt: string };
export type SeoFields = { seoTitle: string; seoDescription: string };

export type ProductStatus = "live" | "beta" | "dev";

export type Product = Meta & SeoFields & {
  slug: string; name: string; nameFa: string; tagline: string; description: string; longDescription: string;
  status: ProductStatus; version: string; category: string; platforms: string[]; price: string;
  accent: string; accent2: string; cover: string; gallery: string[];
  features: { title: string; text: string }[]; stack: string[];
  ctaLabel: string; ctaHref: string; links: { label: string; href: string }[];
};

export type Project = Meta & SeoFields & {
  slug: string; title: string; client: string; category: string; year: string; status: string;
  summary: string; challenge: string; solution: string; cover: string; gallery: string[];
  accent: string; accent2: string; services: string[]; stack: string[];
  metrics: { value: string; label: string }[]; website: string; quote: string; quoteAuthor: string;
};

export type Service = Meta & SeoFields & {
  slug: string; title: string; icon: string; summary: string; body: string; points: string[];
  faq: { q: string; a: string }[];
};

export type Post = Meta & SeoFields & {
  slug: string; title: string; tag: string; excerpt: string; body: string; cover: string; date: string; author: string;
};

export type Member = Meta & { name: string; role: string; bio: string; photo: string; link: string };
export type Faq = Meta & { q: string; a: string };
export type Client = Meta & { name: string; logo: string; url: string };
export type Testimonial = Meta & { quote: string; author: string; role: string; company: string };
export type Message = Meta & {
  name: string; email: string; phone: string; company?: string; subject: string; budget: string; timeline?: string; message: string; createdAt: string; read: boolean;
};

export type CollectionMap = {
  products: Product; projects: Project; services: Service; posts: Post; team: Member;
  faq: Faq; clients: Client; testimonials: Testimonial; messages: Message;
};
export type CollectionName = keyof CollectionMap;

export type HomeSectionId =
  | "hero" | "proof" | "stats" | "services" | "solutions" | "products" | "projects" | "industries"
  | "process" | "whyus" | "engagement" | "tech" | "clients" | "testimonials" | "team" | "posts" | "faq" | "cta";

export type Settings = {
  name: string; nameFa: string; tagline: string; description: string; siteUrl: string;
  logo: string; ogImage: string;
  email: string; phone: string; whatsapp: string; telegram: string; address: string; city: string; hours: string;
  social: { label: string; href: string }[];
  nav: { label: string; href: string }[];
  colorBlue: string; colorCyan: string; colorViolet: string;
  announcementText: string; announcementHref: string;
  heroLine1: string; heroLine2: string; heroLine3: string; heroLead: string;
  heroCtaLabel: string; heroCtaHref: string; heroCta2Label: string; heroCta2Href: string;
  homeSections: { id: HomeSectionId; enabled: boolean; title: string; text: string }[];
  stats: { value: string; label: string }[];
  tech: string[];
  process: { title: string; text: string }[];
  aboutTitle: string; aboutLead: string; values: { title: string; text: string }[];
  ctaTitle: string; ctaText: string; footerText: string;
  googleVerification: string; gaId: string;
};
