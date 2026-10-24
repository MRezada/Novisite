import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/Ui";

const solutions = [
  { n: "01", title: "سامانه‌های سازمانی و پنل‌های عملیاتی", text: "اتوماسیون فرایند، نقش‌های کاربری، گزارش‌گیری، اتصال به حسابداری، CRM، ERP و سرویس‌های موجود.", href: "/services/custom-software", tags: ["داشبورد", "اتوماسیون", "یکپارچه‌سازی"] },
  { n: "02", title: "SaaS و پلتفرم‌های آنلاین", text: "محصول اشتراکی، مارکت‌پلیس و سرویس آنلاین با احراز هویت، پرداخت، پنل مشتری و معماری قابل رشد.", href: "/services/web-application", tags: ["SaaS", "Marketplace", "Web App"] },
  { n: "03", title: "محصولات موبایل", text: "اپلیکیشن Android و iOS با تجربه‌ی روان، اعلان، پرداخت، حالت آفلاین و اتصال کامل به بک‌اند.", href: "/services/mobile-app", tags: ["Android", "iOS", "Cross-platform"] },
  { n: "04", title: "AI و اتوماسیون هوشمند", text: "دستیار سازمانی، تحلیل اسناد و متن فارسی، جست‌وجوی معنایی، خلاصه‌سازی و گردش کار خودکار.", href: "/services/ai-automation", tags: ["LLM", "RAG", "Automation"] },
  { n: "05", title: "بازطراحی محصول و تجربه کاربری", text: "وقتی محصول کار می‌کند اما استفاده از آن سخت است؛ جریان‌ها را ساده و سیستم طراحی را یکپارچه می‌کنیم.", href: "/services/ui-ux-design", tags: ["UX Audit", "Design System", "RTL"] },
  { n: "06", title: "زیرساخت، DevOps و نگه‌داری", text: "استقرار مطمئن، CI/CD، پایش خطا، پشتیبان‌گیری و برنامه‌ی نگه‌داری برای محصولی که باید همیشه در دسترس باشد.", href: "/services/support-devops", tags: ["Cloud", "CI/CD", "Monitoring"] },
];

export function Solutions({ title, text }: { title?: string; text?: string }) {
  return (
    <section className="sec solutions" id="solutions">
      <div className="wrap">
        <SectionHead title={title || "چه چیزی می‌توانیم برای کسب‌وکار شما بسازیم؟"} text={text || "به‌جای فروش یک پکیج ثابت، راه‌حل را با مسئله‌ی واقعی شما تطبیق می‌دهیم."} />
        <div className="solution-list">
          {solutions.map((x) => (
            <Link href={x.href} className="solution-row" key={x.title}>
              <span className="solution-n ltr">{x.n}</span>
              <div className="solution-copy"><h3>{x.title}</h3><p>{x.text}</p></div>
              <div className="solution-tags">{x.tags.map((t) => <span className="tag ltr" key={t}>{t}</span>)}</div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
