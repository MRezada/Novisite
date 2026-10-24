import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Ui";
import { getSettings } from "@/lib/db";
import { pageMeta } from "@/lib/seo";
import { Team } from "@/sections/Team";
import { Process } from "@/sections/Process";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMeta({ settings: s, path: "/about", title: "درباره ما", description: s.aboutLead });
}

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero title={s.aboutTitle} lead={s.aboutLead} crumbs={[{ label: "درباره ما", href: "/about" }]} />
      <section className="sec about-story" style={{ paddingTop: 24 }}>
        <div className="wrap about-story-grid">
          <div><span className="eyebrow">نگاه ما</span><h2>نرم‌افزار را یک محصول زنده می‌بینیم، نه پروژه‌ای که روز تحویل تمام شود.</h2></div>
          <div className="about-copy">
            <p>تصمیم‌های طراحی، معماری و محتوا به هم وابسته‌اند. اگر هرکدام جداگانه جلو بروند، نتیجه معمولاً محصولی است که ظاهر خوبی دارد اما تغییر دادن و استفاده‌کردنش سخت است.</p>
            <p>برای همین تحلیل، طراحی تجربه، مهندسی و انتشار را در یک مسیر نگه می‌داریم. نسخه‌های کوچک و قابل بررسی را زود نشان می‌دهیم تا ریسک تصمیم‌های بزرگ کمتر شود.</p>
          </div>
        </div>
      </section>
      {s.values.length > 0 && (
        <section className="sec sec-tint">
          <div className="wrap vals">{s.values.map((v, i) => <div key={i}><h3>{v.title}</h3><p>{v.text}</p></div>)}</div>
        </section>
      )}
      <Process title="روش همکاری ما" text="از مسئله و نمونه اولیه شروع می‌کنیم، در چرخه‌های کوتاه می‌سازیم و بعد از انتشار نیز محصول را قابل نگه‌داری تحویل می‌دهیم." />
      <div className="sec sec-tint" style={{ paddingBottom: 0 }}>
        <div className="wrap"><span className="eyebrow">تیم</span><h2 className="h-sm">آدم‌هایی که واقعاً روی محصول کار می‌کنند</h2></div>
      </div>
      <Team standalone />
      <div style={{ height: "clamp(72px, 9vw, 124px)" }} />
      <CtaBand />
    </>
  );
}
