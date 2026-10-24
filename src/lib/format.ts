const faDigits = "۰۱۲۳۴۵۶۷۸۹";
export const toFa = (v: string | number) => String(v).replace(/\d/g, (d) => faDigits[Number(d)]);

/** تاریخ شمسی از رشته‌ی ISO، مثلاً «۱۸ مهر ۱۴۰۵» */
export function faDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export function slugifyHeading(text: string): string {
  return text.trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-").slice(0, 80);
}

/** تبدیل رشته‌ی عددی فارسی/عربی/انگلیسی به عدد */
export function parseNum(v: string): number {
  const latin = v
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[,٬]/g, "")
    .replace(/٫/g, ".");
  return Number(latin);
}

