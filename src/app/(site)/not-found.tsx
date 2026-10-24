import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "صفحه پیدا نشد", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className="nf">
      <div className="wrap">
        <strong>۴۰۴</strong>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>این صفحه پیدا نشد</h1>
        <p className="soft" style={{ margin: "8px 0 28px" }}>ممکن است آدرس تغییر کرده یا صفحه حذف شده باشد.</p>
        <Link href="/" className="btn btn-dark">بازگشت به صفحه اصلی</Link>
      </div>
    </section>
  );
}
