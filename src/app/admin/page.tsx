import { isAdmin } from "@/lib/auth";
import Link from "next/link";
import { getAll, getSettings } from "@/lib/db";
import { toFa } from "@/lib/format";

export default async function Dashboard() {
  if (!(await isAdmin())) return null; // دفاع دوم؛ لایه‌ی اصلی در layout است
  const [s, products, projects, services, posts, messages] = await Promise.all([
    getSettings(), getAll("products"), getAll("projects"), getAll("services"), getAll("posts"), getAll("messages"),
  ]);
  const unread = messages.filter((m) => !m.read).length;
  const warns: string[] = [];
  if (s.siteUrl.includes("novisoft.dev")) warns.push("آدرس واقعی سایت را در «تنظیمات ← هویت سایت» وارد کنید تا sitemap و لینک‌های سئو درست باشد.");
  if (!s.googleVerification) warns.push("کد تأیید Google Search Console را در «تنظیمات ← سئو» ثبت کنید.");
  if (!s.logo) warns.push("لوگو تنظیم نشده است.");
  const cards: [string, number, string][] = [
    ["محصولات", products.length, "/admin/c/products"], ["پروژه‌ها", projects.length, "/admin/c/projects"],
    ["خدمات", services.length, "/admin/c/services"], ["یادداشت‌ها", posts.length, "/admin/c/posts"],
    ["پیام‌های خوانده‌نشده", unread, "/admin/c/messages"],
  ];
  return (
    <div>
      <div className="ad-head"><h1>خوش آمدید 👋</h1></div>
      <div className="ad-stats">
        {cards.map(([l, n, h]) => <Link key={l} href={h} className="ad-stat"><strong>{toFa(n)}</strong><span>{l}</span></Link>)}
      </div>
      {warns.length > 0 && (
        <section className="ad-card">
          <h2>پیشنهادهای تکمیل سایت</h2>
          <ul className="ad-todo">{warns.map((w) => <li key={w}>{w}</li>)}</ul>
        </section>
      )}
      <section className="ad-card">
        <h2>میان‌بُرها</h2>
        <div className="ad-row">
          <Link className="ad-btn ad-primary" href="/admin/c/products">افزودن محصول</Link>
          <Link className="ad-btn" href="/admin/c/projects">افزودن پروژه</Link>
          <Link className="ad-btn" href="/admin/c/posts">نوشتن یادداشت</Link>
          <Link className="ad-btn" href="/admin/settings">تغییر لوگو و عنوان</Link>
        </div>
      </section>
    </div>
  );
}
