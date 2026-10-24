import type { Product } from "./types";

export const suiteModuleSlugs = ["inventory", "business-intelligence", "it-support", "service-desk"] as const;
export type SuiteModuleSlug = (typeof suiteModuleSlugs)[number];

export type SuiteModuleVisual = {
  icon: string;
  shortLabel: string;
  eyebrow: string;
  audience: string;
  bullets: string[];
};

export const suiteVisuals: Record<SuiteModuleSlug, SuiteModuleVisual> = {
  inventory: {
    icon: "box",
    shortLabel: "انبار",
    eyebrow: "Inventory & Parts",
    audience: "برای انبار، تدارکات و عملیات",
    bullets: ["موجودی و نقطه سفارش", "ورود، خروج و انتقال", "انبار، مکان و گردش قطعه"],
  },
  "business-intelligence": {
    icon: "chart",
    shortLabel: "هوش تجاری",
    eyebrow: "Business Intelligence",
    audience: "برای مدیران و تیم داده",
    bullets: ["داشبورد مدیریتی", "KPI و گزارش‌های تعاملی", "اتصال به منابع داده"],
  },
  "it-support": {
    icon: "monitor",
    shortLabel: "مدیریت IT",
    eyebrow: "IT Operations",
    audience: "برای واحد فناوری اطلاعات",
    bullets: ["مدیریت دارایی IT", "پایش شبکه و تجهیزات", "سلامت و ظرفیت زیرساخت"],
  },
  "service-desk": {
    icon: "ticket",
    shortLabel: "تیکتینگ",
    eyebrow: "Service Desk / ITSM",
    audience: "برای پشتیبانی و خدمات سازمانی",
    bullets: ["تیکت و SLA", "صف و ارجاع کارشناسان", "گزارش عملکرد و رضایت"],
  },
};

export const sharedPlatformFeatures = [
  { icon: "users", title: "کاربر و سطح دسترسی مشترک", text: "یک حساب سازمانی، نقش‌ها و مجوزهای یکپارچه برای تمام ماژول‌های فعال." },
  { icon: "search", title: "جست‌وجوی سراسری", text: "دسترسی سریع به قطعه، تیکت، دارایی یا گزارش از یک نوار جست‌وجو." },
  { icon: "bell", title: "اعلان و رویداد مشترک", text: "هشدارها و فعالیت‌های مهم هر ماژول در یک مرکز اعلان جمع می‌شوند." },
  { icon: "shield", title: "امنیت و Audit Log", text: "ثبت رویداد، کنترل نشست و قابلیت توسعه برای SSO و سیاست‌های سازمانی." },
  { icon: "plug", title: "API و یکپارچه‌سازی", text: "هسته مشترک برای اتصال ماژول‌ها به ERP، حسابداری، پیامک، Active Directory و سرویس‌های داخلی." },
  { icon: "spark", title: "فعال‌سازی ماژول بدون مهاجرت", text: "مشتری با یک ماژول شروع می‌کند و بعداً بدون ساخت حساب و زیرساخت جدا، ماژول بعدی را اضافه می‌کند." },
];

export function isSuiteModule(product: Product): product is Product & { slug: SuiteModuleSlug } {
  return suiteModuleSlugs.includes(product.slug as SuiteModuleSlug);
}

export function sortSuiteModules(products: Product[]) {
  const order = new Map<string, number>(suiteModuleSlugs.map((slug, i) => [slug, i]));
  return products.filter(isSuiteModule).sort((a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99));
}
