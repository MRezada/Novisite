import { SectionHead } from "@/components/Ui";
import { Icon } from "@/components/Icon";

const items = [
  ["فین‌تک و مالی", "داشبوردهای مالی، اعتبار، تسویه، گزارش‌گیری و جریان‌های حساس به امنیت.", "chart"],
  ["فروش و تجارت", "فروشگاه، مارکت‌پلیس، پنل فروشنده، سفارش، لجستیک و وفاداری مشتری.", "layout"],
  ["سازمان و عملیات", "اتوماسیون داخلی، گردش کار، سطوح دسترسی، گزارش و اتصال سامانه‌ها.", "code"],
  ["سلامت و خدمات", "رزرو، پرونده، پنل متخصص، ارتباط با مشتری و فرایندهای چندنقشی.", "shield"],
  ["آموزش و محتوا", "LMS، آزمون، اشتراک، انتشار محتوا، پنل مدرس و تجربه‌ی یادگیری.", "mobile"],
  ["هوش مصنوعی و داده", "تحلیل متن و سند، جست‌وجوی هوشمند، دستیار داخلی و اتوماسیون.", "spark"],
] as const;

export function Industries({ title, text }: { title?: string; text?: string }) {
  return (
    <section className="sec sec-night industries" id="industries">
      <div className="wrap">
        <SectionHead title={title || "برای فرایندهای واقعی، نه دموهای نمایشی"} text={text || "معماری و تجربه‌ی کاربری هر حوزه متفاوت است. راه‌حل را بر اساس نقش‌ها، داده‌ها، ریسک و مسیر واقعی کار طراحی می‌کنیم."} />
        <div className="industry-grid">
          {items.map(([title, desc, icon]) => (
            <article className="industry-card" key={title}>
              <span className="industry-icon"><Icon name={icon} /></span>
              <h3>{title}</h3><p>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
