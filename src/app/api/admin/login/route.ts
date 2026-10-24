export const dynamic = 'force-static';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminEnabled, checkPassword, clientIp, COOKIE, cookieOptions, createToken, rateLimit, sameOrigin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: "درخواست نامعتبر است." }, { status: 403 });
  if (!adminEnabled()) return NextResponse.json({ ok: false, error: "رمز ادمین تنظیم نشده است (ADMIN_PASSWORD)." }, { status: 503 });
  if (!rateLimit(`login:${clientIp(req)}`, 6, 60_000)) {
    return NextResponse.json({ ok: false, error: "تلاش‌های زیاد؛ یک دقیقه دیگر دوباره امتحان کنید." }, { status: 429 });
  }
  let password = "";
  try { password = String((await req.json()).password ?? ""); } catch { /* خالی */ }
  if (!checkPassword(password)) return NextResponse.json({ ok: false, error: "رمز عبور اشتباه است." }, { status: 401 });
  (await cookies()).set(COOKIE, createToken(), cookieOptions);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return NextResponse.json({ ok: true });
}

