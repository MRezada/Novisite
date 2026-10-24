export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { clientIp, rateLimit, sameOrigin } from "@/lib/auth";
import { addMessage } from "@/lib/db";

type Payload = Record<string, unknown>;
const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("درخواست نامعتبر است.", 403);
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000)) return fail("تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.", 429);

  let body: Payload;
  try { body = await req.json(); } catch { return fail("درخواست نامعتبر است.", 400); }
  if (body.website) return NextResponse.json({ ok: true }); // فیلد مخفی ضد اسپم

  const name = s(body.name, 120);
  const email = s(body.email, 200);
  const message = s(body.message, 5000);
  if (name.length < 2) return fail("نام را وارد کنید.", 422);
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail("ایمیل معتبر وارد کنید.", 422);
  if (message.length < 10) return fail("پیام کمی کوتاه است؛ چند جمله بنویسید.", 422);

  await addMessage({ name, email, phone: s(body.phone, 40), company: s(body.company, 120), subject: s(body.subject, 80), budget: s(body.budget, 80), timeline: s(body.timeline, 80), message });
  return NextResponse.json({ ok: true });
}

