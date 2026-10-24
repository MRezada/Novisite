import type { CollectionName } from "@/lib/types";

/** توصیف فیلدها؛ هم فرم پنل ادمین از آن ساخته می‌شود و هم اعتبارسنجی سمت سرور. */
export type SimpleType =
  | "text" | "textarea" | "markdown" | "url" | "color" | "number" | "date" | "slug" | "image" | "tags" | "images" | "bool";

export type Field =
  | { key: string; label: string; type: SimpleType; help?: string; ltr?: boolean; placeholder?: string }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; help?: string }
  | { key: string; label: string; type: "list"; of: Field[]; itemTitle?: string; help?: string; max?: number };

export type Group = { title: string; hint?: string; fields: Field[] };

export type CollectionSchema = {
  name: CollectionName;
  label: string;
  singular: string;
  titleKey: string;
  subKey?: string;
  slugged?: boolean;
  /** پیشوند آدرس عمومی هر مورد (برای دکمه «مشاهده در سایت») */
  publicBase?: string;
  groups: Group[];
};

const seo: Group = {
  title: "تنظیمات سئو",
  hint: "اگر خالی بماند از عنوان و توضیح خودِ مورد استفاده می‌شود. عنوان حداکثر حدود ۶۰ و توضیح حدود ۱۶۰ کاراکتر باشد.",
  fields: [
    { key: "seoTitle", label: "عنوان سئو (Title)", type: "text" },
    { key: "seoDescription", label: "توضیح سئو (Meta description)", type: "textarea" },
  ],
};

const colorFields = (a = "accent", b = "accent2"): Field[] => [
  { key: a, label: "رنگ اول", type: "color" },
  { key: b, label: "رنگ دوم", type: "color" },
];

export const iconOptions = ["code", "layout", "spark", "cloud", "mobile", "shield", "chart"].map((v) => ({
  value: v,
  label: { code: "کد", layout: "طراحی", spark: "هوش مصنوعی", cloud: "ابر و زیرساخت", mobile: "موبایل", shield: "امنیت", chart: "تحلیل و نمودار" }[v] as string,
}));

export const sectionOptions = [
  ["hero", "بالای صفحه (قهرمان)"], ["proof", "دلایل اعتماد"], ["stats", "آمار و اعداد"], ["services", "خدمات"],
  ["solutions", "راه‌حل‌ها و کاربردها"], ["projects", "پروژه‌ها"], ["industries", "حوزه‌های کاری"], ["process", "مراحل کار"],
  ["whyus", "چرا نووی‌سافت"], ["engagement", "مدل همکاری"], ["tech", "فناوری‌ها"], ["products", "محصولات"], ["clients", "مشتریان"],
  ["testimonials", "نظر مشتریان"], ["team", "تیم"], ["posts", "یادداشت‌ها"], ["faq", "پرسش‌های متداول"], ["cta", "دعوت به اقدام"],
].map(([value, label]) => ({ value, label }));

export const collections: Record<Exclude<CollectionName, "messages">, CollectionSchema> = {
  products: {
    name: "products", label: "محصولات", singular: "محصول", titleKey: "nameFa", subKey: "tagline", slugged: true,
    publicBase: "/products",
    groups: [
      { title: "اطلاعات اصلی", fields: [
        { key: "nameFa", label: "نام فارسی", type: "text" },
        { key: "name", label: "نام لاتین", type: "text", ltr: true },
        { key: "slug", label: "نشانی (slug)", type: "slug", help: "فقط حروف انگلیسی کوچک، عدد و خط تیره؛ مثل my-product" },
        { key: "tagline", label: "شعار کوتاه", type: "text" },
        { key: "description", label: "توضیح کوتاه", type: "textarea" },
        { key: "longDescription", label: "توضیح کامل", type: "markdown", help: "با ## عنوان بسازید. در صفحه محصول نمایش داده می‌شود." },
        { key: "status", label: "وضعیت", type: "select", options: [{ value: "live", label: "منتشر شده" }, { value: "beta", label: "نسخه بتا" }, { value: "dev", label: "در حال توسعه" }] },
        { key: "version", label: "نسخه", type: "text" },
        { key: "category", label: "دسته‌بندی", type: "text" },
        { key: "platforms", label: "پلتفرم‌ها", type: "tags" },
        { key: "price", label: "قیمت / طرح", type: "text", help: "مثلاً «رایگان» یا «از ماهانه ۲۹۰ هزار تومان» یا «تماس بگیرید»" },
      ] },
      { title: "ظاهر", fields: [
        ...colorFields(),
        { key: "cover", label: "تصویر شاخص", type: "image", help: "اگر خالی باشد، پیش‌نمایش خودکار ساخته می‌شود." },
        { key: "gallery", label: "گالری تصاویر", type: "images" },
      ] },
      { title: "قابلیت‌ها و فناوری", fields: [
        { key: "features", label: "قابلیت‌ها", type: "list", itemTitle: "title", of: [
          { key: "title", label: "عنوان", type: "text" }, { key: "text", label: "توضیح", type: "textarea" },
        ] },
        { key: "stack", label: "فناوری‌ها", type: "tags", ltr: true },
      ] },
      { title: "دکمه‌ها و لینک‌ها", fields: [
        { key: "ctaLabel", label: "متن دکمه اصلی", type: "text" },
        { key: "ctaHref", label: "لینک دکمه اصلی", type: "url", ltr: true },
        { key: "links", label: "لینک‌های دیگر (مستندات، دانلود...)", type: "list", itemTitle: "label", of: [
          { key: "label", label: "عنوان", type: "text" }, { key: "href", label: "لینک", type: "url", ltr: true },
        ] },
      ] },
      seo,
    ],
  },
  projects: {
    name: "projects", label: "پروژه‌ها", singular: "پروژه", titleKey: "title", subKey: "category", slugged: true,
    publicBase: "/projects",
    groups: [
      { title: "اطلاعات اصلی", fields: [
        { key: "title", label: "عنوان پروژه", type: "text" },
        { key: "slug", label: "نشانی (slug)", type: "slug" },
        { key: "client", label: "مشتری", type: "text" },
        { key: "category", label: "حوزه", type: "text" },
        { key: "year", label: "سال", type: "text" },
        { key: "status", label: "وضعیت", type: "text" },
        { key: "website", label: "لینک پروژه", type: "url", ltr: true },
        { key: "summary", label: "خلاصه", type: "textarea" },
        { key: "challenge", label: "مسئله", type: "textarea" },
        { key: "solution", label: "راه‌حل", type: "textarea" },
      ] },
      { title: "ظاهر", fields: [
        ...colorFields(),
        { key: "cover", label: "تصویر شاخص", type: "image" },
        { key: "gallery", label: "گالری تصاویر", type: "images" },
      ] },
      { title: "نتیجه و جزئیات", fields: [
        { key: "metrics", label: "نتایج قابل‌اندازه‌گیری", type: "list", itemTitle: "label", of: [
          { key: "value", label: "عدد", type: "text" }, { key: "label", label: "عنوان", type: "text" },
        ] },
        { key: "services", label: "خدمات انجام‌شده", type: "tags" },
        { key: "stack", label: "فناوری‌ها", type: "tags", ltr: true },
        { key: "quote", label: "نظر مشتری", type: "textarea" },
        { key: "quoteAuthor", label: "نام گوینده", type: "text" },
      ] },
      seo,
    ],
  },
  services: {
    name: "services", label: "خدمات", singular: "خدمت", titleKey: "title", subKey: "summary", slugged: true,
    publicBase: "/services",
    groups: [
      { title: "اطلاعات اصلی", fields: [
        { key: "title", label: "عنوان", type: "text" },
        { key: "slug", label: "نشانی (slug)", type: "slug" },
        { key: "icon", label: "آیکن", type: "select", options: iconOptions },
        { key: "summary", label: "خلاصه", type: "textarea" },
        { key: "body", label: "متن کامل صفحه", type: "markdown", help: "برای سئو، متن مفصل بنویسید؛ با ## زیرعنوان بسازید." },
        { key: "points", label: "نکته‌های کلیدی", type: "tags" },
        { key: "faq", label: "پرسش‌های همین خدمت", type: "list", itemTitle: "q", of: [
          { key: "q", label: "پرسش", type: "text" }, { key: "a", label: "پاسخ", type: "textarea" },
        ] },
      ] },
      seo,
    ],
  },
  posts: {
    name: "posts", label: "یادداشت‌ها", singular: "یادداشت", titleKey: "title", subKey: "tag", slugged: true,
    publicBase: "/insights",
    groups: [
      { title: "محتوا", fields: [
        { key: "title", label: "عنوان", type: "text" },
        { key: "slug", label: "نشانی (slug)", type: "slug" },
        { key: "tag", label: "دسته", type: "text" },
        { key: "date", label: "تاریخ انتشار", type: "date" },
        { key: "author", label: "نویسنده", type: "text" },
        { key: "cover", label: "تصویر شاخص", type: "image" },
        { key: "excerpt", label: "چکیده", type: "textarea" },
        { key: "body", label: "متن یادداشت", type: "markdown", help: "## عنوان، ### زیرعنوان، - فهرست، **پررنگ**، [متن](لینک)" },
      ] },
      seo,
    ],
  },
  team: {
    name: "team", label: "تیم", singular: "عضو", titleKey: "name", subKey: "role",
    groups: [{ title: "اطلاعات", fields: [
      { key: "name", label: "نام", type: "text" }, { key: "role", label: "سمت", type: "text" },
      { key: "bio", label: "معرفی کوتاه", type: "textarea" }, { key: "photo", label: "عکس", type: "image" },
      { key: "link", label: "لینک (لینکدین، گیت‌هاب...)", type: "url", ltr: true },
    ] }],
  },
  faq: {
    name: "faq", label: "پرسش‌های متداول", singular: "پرسش", titleKey: "q",
    groups: [{ title: "پرسش و پاسخ", fields: [
      { key: "q", label: "پرسش", type: "text" }, { key: "a", label: "پاسخ", type: "textarea" },
    ] }],
  },
  clients: {
    name: "clients", label: "مشتریان", singular: "مشتری", titleKey: "name",
    groups: [{ title: "اطلاعات", fields: [
      { key: "name", label: "نام", type: "text" }, { key: "logo", label: "لوگو", type: "image" },
      { key: "url", label: "وب‌سایت", type: "url", ltr: true },
    ] }],
  },
  testimonials: {
    name: "testimonials", label: "نظر مشتریان", singular: "نظر", titleKey: "author", subKey: "company",
    groups: [{ title: "نظر", fields: [
      { key: "quote", label: "متن نظر", type: "textarea" }, { key: "author", label: "نام", type: "text" },
      { key: "role", label: "سمت", type: "text" }, { key: "company", label: "شرکت", type: "text" },
    ] }],
  },
};

export const settingsGroups: Group[] = [
  { title: "هویت سایت", hint: "نام، لوگو و شعار در همه‌جای سایت و نتایج گوگل استفاده می‌شود.", fields: [
    { key: "nameFa", label: "نام فارسی", type: "text" },
    { key: "name", label: "نام لاتین", type: "text", ltr: true },
    { key: "tagline", label: "شعار", type: "text" },
    { key: "description", label: "توضیح سایت (Meta description)", type: "textarea", help: "حدود ۱۶۰ کاراکتر؛ در نتایج گوگل نمایش داده می‌شود." },
    { key: "siteUrl", label: "آدرس سایت", type: "url", ltr: true, help: "مثل https://novisoft.dev — برای sitemap و لینک‌های کانونیکال لازم است." },
    { key: "logo", label: "لوگو", type: "image", help: "PNG یا SVG با پس‌زمینه شفاف، ترجیحاً مربعی." },
    { key: "ogImage", label: "تصویر اشتراک‌گذاری", type: "image", help: "اندازه پیشنهادی ۱۲۰۰×۶۳۰؛ هنگام اشتراک لینک در شبکه‌ها نمایش داده می‌شود." },
  ] },
  { title: "رنگ‌های برند", fields: [
    { key: "colorCyan", label: "رنگ اول", type: "color" },
    { key: "colorBlue", label: "رنگ اصلی", type: "color" },
    { key: "colorViolet", label: "رنگ سوم", type: "color" },
  ] },
  { title: "اطلاعات تماس", fields: [
    { key: "email", label: "ایمیل", type: "text", ltr: true },
    { key: "phone", label: "تلفن", type: "text", ltr: true },
    { key: "whatsapp", label: "واتس‌اپ (شماره با کد کشور)", type: "text", ltr: true, help: "مثلاً 989121234567" },
    { key: "telegram", label: "تلگرام (نام کاربری بدون @)", type: "text", ltr: true },
    { key: "city", label: "شهر", type: "text" },
    { key: "address", label: "نشانی", type: "textarea" },
    { key: "hours", label: "ساعت کاری", type: "text" },
    { key: "social", label: "شبکه‌های اجتماعی", type: "list", itemTitle: "label", of: [
      { key: "label", label: "نام", type: "text" }, { key: "href", label: "لینک", type: "url", ltr: true },
    ] },
  ] },
  { title: "منوی بالای سایت", fields: [
    { key: "nav", label: "آیتم‌های منو", type: "list", itemTitle: "label", of: [
      { key: "label", label: "عنوان", type: "text" }, { key: "href", label: "لینک", type: "url", ltr: true },
    ] },
  ] },
  { title: "بالای صفحه اصلی", fields: [
    { key: "announcementText", label: "متن اعلان (خالی = بدون اعلان)", type: "text" },
    { key: "announcementHref", label: "لینک اعلان", type: "url", ltr: true },
    { key: "heroLine1", label: "عنوان — خط اول", type: "text" },
    { key: "heroLine2", label: "عنوان — خط دوم", type: "text" },
    { key: "heroLine3", label: "عنوان — خط سوم", type: "text" },
    { key: "heroLead", label: "متن زیر عنوان", type: "textarea" },
    { key: "heroCtaLabel", label: "دکمه اصلی — متن", type: "text" },
    { key: "heroCtaHref", label: "دکمه اصلی — لینک", type: "url", ltr: true },
    { key: "heroCta2Label", label: "دکمه دوم — متن", type: "text" },
    { key: "heroCta2Href", label: "دکمه دوم — لینک", type: "url", ltr: true },
  ] },
  { title: "بخش‌های صفحه اصلی", hint: "ترتیب، نمایش و عنوان هر بخش را اینجا تعیین کنید. با دکمه‌های بالا/پایین جابه‌جا کنید.", fields: [
    { key: "homeSections", label: "بخش‌ها", type: "list", itemTitle: "id", of: [
      { key: "id", label: "بخش", type: "select", options: sectionOptions },
      { key: "enabled", label: "نمایش داده شود", type: "bool" },
      { key: "title", label: "عنوان بخش", type: "text" },
      { key: "text", label: "متن زیر عنوان", type: "textarea" },
    ] },
  ] },
  { title: "آمار، فناوری و مراحل کار", fields: [
    { key: "stats", label: "آمار و اعداد (خالی = مخفی)", type: "list", itemTitle: "label", of: [
      { key: "value", label: "عدد", type: "text" }, { key: "label", label: "عنوان", type: "text" },
    ] },
    { key: "tech", label: "فناوری‌ها", type: "tags", ltr: true },
    { key: "process", label: "مراحل کار", type: "list", itemTitle: "title", of: [
      { key: "title", label: "عنوان", type: "text" }, { key: "text", label: "توضیح", type: "textarea" },
    ] },
  ] },
  { title: "درباره ما و دعوت به اقدام", fields: [
    { key: "aboutTitle", label: "عنوان صفحه درباره ما", type: "text" },
    { key: "aboutLead", label: "متن معرفی", type: "textarea" },
    { key: "values", label: "ارزش‌ها", type: "list", itemTitle: "title", of: [
      { key: "title", label: "عنوان", type: "text" }, { key: "text", label: "توضیح", type: "textarea" },
    ] },
    { key: "ctaTitle", label: "عنوان دعوت به اقدام", type: "text" },
    { key: "ctaText", label: "متن دعوت به اقدام", type: "textarea" },
    { key: "footerText", label: "متن پایین سایت", type: "textarea" },
  ] },
  { title: "سئو و آمار بازدید", fields: [
    { key: "googleVerification", label: "کد تأیید Google Search Console", type: "text", ltr: true, help: "فقط مقدار content از متاتگ تأیید." },
    { key: "gaId", label: "شناسه Google Analytics", type: "text", ltr: true, help: "مثل G-XXXXXXXXXX" },
  ] },
];
