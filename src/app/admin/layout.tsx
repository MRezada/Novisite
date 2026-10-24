import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/admin/LoginForm";
import { LogoutButton } from "@/admin/LogoutButton";
import { adminEnabled, isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "پنل مدیریت", robots: { index: false, follow: false } };

const links = [
  ["/admin", "داشبورد"], ["/admin/settings", "تنظیمات سایت"],
  ["/admin/c/products", "محصولات"], ["/admin/c/projects", "پروژه‌ها"], ["/admin/c/services", "خدمات"],
  ["/admin/c/posts", "یادداشت‌ها"], ["/admin/c/team", "تیم"], ["/admin/c/faq", "پرسش‌های متداول"],
  ["/admin/c/clients", "مشتریان"], ["/admin/c/testimonials", "نظر مشتریان"],
  ["/admin/c/messages", "پیام‌ها"], ["/admin/media", "رسانه‌ها"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) return <LoginForm enabled={adminEnabled()} />;
  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <Link href="/admin" className="ad-brand"><img src="/novisoft-logo.png" alt="" width={34} height={30} />پنل مدیریت</Link>
        <nav aria-label="مدیریت">{links.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
        <div className="ad-side-f">
          <a className="ad-btn ad-ghost" href="/" target="_blank" rel="noreferrer">مشاهده سایت</a>
          <LogoutButton />
        </div>
      </aside>
      <div className="ad-main">{children}</div>
    </div>
  );
}
