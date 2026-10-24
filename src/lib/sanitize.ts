import type { Field, Group } from "@/admin/schema";

type Rec = Record<string, unknown>;

const str = (v: unknown, max = 4000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function safeUrl(v: unknown): string {
  const s = str(v, 2000);
  if (!s) return "";
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(s)) return s;
  if (s.startsWith("#")) return s;
  return "";
}

function safeImage(v: unknown): string {
  const s = str(v, 2000);
  if (!s) return "";
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  if (/^https:\/\//i.test(s)) return s;
  return "";
}

function clean(f: Field, v: unknown): unknown {
  switch (f.type) {
    case "text": return str(v, 500);
    case "textarea": return str(v, 5000);
    case "markdown": return str(v, 100000);
    case "url": return safeUrl(v);
    case "color": return typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : "";
    case "number": { const n = Number(v); return Number.isFinite(n) ? n : 0; }
    case "date": return typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : "";
    case "slug": return str(v, 120).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    case "image": return safeImage(v);
    case "images": return Array.isArray(v) ? v.map(safeImage).filter(Boolean).slice(0, 30) : [];
    case "tags": return Array.isArray(v) ? Array.from(new Set(v.map((x) => str(x, 80)).filter(Boolean))).slice(0, 60) : [];
    case "bool": return v === true || v === "true";
    case "select": {
      const val = str(v, 80);
      return f.options.some((o) => o.value === val) ? val : f.options[0]?.value ?? "";
    }
    case "list": {
      if (!Array.isArray(v)) return [];
      return v.slice(0, f.max ?? 100).map((it) => sanitizeFields(f.of, (it ?? {}) as Rec));
    }
  }
}

export function sanitizeFields(fields: Field[], input: Rec): Rec {
  const out: Rec = {};
  for (const f of fields) out[f.key] = clean(f, input[f.key]);
  return out;
}

export const flatten = (groups: Group[]): Field[] => groups.flatMap((g) => g.fields);
