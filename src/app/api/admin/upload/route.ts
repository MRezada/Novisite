   export const dynamic = 'force-dynamic';

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { UPLOAD_DIR } from "@/lib/db";
import { guard } from "../guard";

const TYPES: Record<string, string> = {
  "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg", "image/avif": "avif",
};
const MAX = 5 * 1024 * 1024;
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function GET(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const names = await fs.readdir(UPLOAD_DIR);
    const files = await Promise.all(names.map(async (n) => {
      const st = await fs.stat(path.join(UPLOAD_DIR, n));
      return { name: n, url: `/uploads/${n}`, size: st.size, mtime: st.mtimeMs };
    }));
    return NextResponse.json({ ok: true, files: files.sort((a, b) => b.mtime - a.mtime) });
  } catch {
    return NextResponse.json({ ok: true, files: [] });
  }
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return fail("فایلی ارسال نشد.");
  const ext = TYPES[file.type];
  if (!ext) return fail("فقط تصویر (PNG، JPG، WebP، GIF، SVG، AVIF) مجاز است.");
  if (file.size > MAX) return fail("حجم فایل نباید بیشتر از ۵ مگابایت باشد.");
  const buf = Buffer.from(await file.arrayBuffer());
  if (ext === "svg" && /<script|onload\s*=|javascript:/i.test(buf.toString("utf8"))) return fail("این SVG شامل کد اجرایی است و پذیرفته نمی‌شود.");
  const name = `${randomUUID().replace(/-/g, "").slice(0, 14)}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}

export async function DELETE(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const name = new URL(req.url).searchParams.get("name") ?? "";
  if (!/^[a-z0-9]+\.(png|jpg|webp|gif|svg|avif)$/.test(name)) return fail("نام فایل نامعتبر است.");
  await fs.unlink(path.join(UPLOAD_DIR, name)).catch(() => undefined);
  return NextResponse.json({ ok: true });
}

