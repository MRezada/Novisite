import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/Ui";
import { getSettings } from "@/lib/db";

export async function WhyUs({ title, text }: { title?: string; text?: string }) {
  const s = await getSettings();
  const values = s.values.slice(0, 3);
  return (
    <section className="sec whyus" id="why-us">
      <div className="wrap why-grid">
        <div>
          <span className="eyebrow">چرا نووی‌سافت</span>
          <h2>{title || "کمتر پیچیده‌اش می‌کنیم؛ بهتر می‌سازیمش."}</h2>
          <p className="lead">{text || "تیم کوچک و مستقیم، تصمیم‌های شفاف و خروجی‌های قابل مشاهده. هدف این است که هر هفته بدانید پروژه کجاست و چرا یک تصمیم گرفته شده است."}</p>
          <Link className="btn btn-dark" href="/about">روش کار و تیم ما <Icon name="arrow" /></Link>
        </div>
        <div className="why-cards">
          {values.map((v, i) => <article key={v.title}><span>{["۰۱", "۰۲", "۰۳"][i] ?? ""}</span><h3>{v.title}</h3><p>{v.text}</p></article>)}
          <article><span>۰۴</span><h3>تحویل بدون قفل‌شدن</h3><p>سورس، مستندات و دسترسی‌های اصلی با ساختاری شفاف قابل تحویل‌اند تا مسیر ادامه توسعه روشن و مستقل بماند.</p></article>
        </div>
      </div>
    </section>
  );
}
