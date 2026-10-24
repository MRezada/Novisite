import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/Ui";

const modes = [
  { badge: "برای شروع", title: "MVP و نسخه‌ی اول", text: "وقتی باید ایده را سریع اما اصولی به یک نسخه‌ی قابل استفاده تبدیل کنید.", items: ["تعریف دامنه و اولویت‌ها", "پروتوتایپ قابل تست", "توسعه و انتشار نسخه اول"] },
  { badge: "برای رشد", title: "توسعه‌ی محصول موجود", text: "وقتی محصول دارید و برای فیچر جدید، بازطراحی یا رفع بدهی فنی به یک تیم باتجربه نیاز دارید.", items: ["Audit فنی و UX", "Roadmap اجرایی", "توسعه‌ی چرخه‌ای و قابل سنجش"] },
  { badge: "برای سازمان", title: "تیم توسعه‌ی اختصاصی", text: "برای پروژه‌های مداوم و سامانه‌هایی که به ظرفیت ثابت طراحی و مهندسی نیاز دارند.", items: ["ظرفیت ماهانه مشخص", "فرایند و گزارش شفاف", "انتقال دانش و مستندسازی"] },
];

export function Engagement({ title, text }: { title?: string; text?: string }) {
  return (
    <section className="sec sec-tint engagement" id="engagement">
      <div className="wrap">
        <SectionHead title={title || "مدل همکاری متناسب با مرحله‌ی محصول"} text={text || "از ساخت نسخه‌ی اول تا توسعه‌ی بلندمدت؛ شکل همکاری را با ریسک، بودجه و سرعت موردنیاز شما هماهنگ می‌کنیم."} />
        <div className="engage-grid">
          {modes.map((m) => <article className="engage-card" key={m.title}>
            <span className="chip">{m.badge}</span><h3>{m.title}</h3><p>{m.text}</p>
            <ul>{m.items.map((x) => <li key={x}><Icon name="check" />{x}</li>)}</ul>
            <Link href="/contact?subject=project" className="more">درباره این مدل گفتگو کنیم <Icon name="arrow" /></Link>
          </article>)}
        </div>
      </div>
    </section>
  );
}
