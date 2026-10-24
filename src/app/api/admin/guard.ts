import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin, sameOrigin } from "@/lib/auth";

/** بررسی ورود ادمین و منشأ درخواست؛ در صورت خطا پاسخ آماده برمی‌گرداند */
export async function guard(req: Request): Promise<NextResponse | null> {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: "درخواست نامعتبر است." }, { status: 403 });
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "ابتدا وارد شوید." }, { status: 401 });
  return null;
}

/** پس از هر تغییر، صفحه‌های عمومی دوباره ساخته می‌شوند */
export const refreshSite = () => revalidatePath("/", "layout");
