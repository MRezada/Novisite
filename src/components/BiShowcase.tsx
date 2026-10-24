import Link from "next/link";
import { BiDashboard } from "./BiDashboard";
import { DataPipeline } from "./DataPipeline";
import { Icon } from "./Icon";
import "./BiShowcase.css";

// Original reference dashboard's illustrative metrics.
const metrics = [
  { label: "درآمد ماهانه (میلیون تومان)", value: "۱۲۸۴", delta: "+۱۸٪" },
  { label: "کاربران فعال", value: "۴۸۲۰", delta: "+۱۲٪" },
  { label: "نرخ تبدیل", value: "۳٫۸", delta: "+۰٫۶" },
  { label: "رضایت مشتریان", value: "۹۶", delta: "+۲٪" },
];
const pipeline = [
  { title: "اتصال به منابع", text: "داده‌های انبار، تیکتینگ، دارایی‌های IT و دیگر نرم‌افزارهای سازمان از پایگاه‌داده، API یا فایل‌های اکسل دریافت می‌شوند." },
  { title: "پاک‌سازی و تبدیل (ETL)", text: "داده‌های منابع مختلف پاک‌سازی، یکدست و به ساختاری مناسب برای تحلیل تبدیل می‌شوند." },
  { title: "انبار داده", text: "اطلاعات مرتبط در یک مدل تحلیلی مشترک کنار هم قرار می‌گیرند تا گزارش‌ها بر پایه داده‌ای منسجم ساخته شوند." },
  { title: "داشبورد و گزارش", text: "شاخص‌ها، نمودارها و فیلترهای موردنیاز هر واحد بر اساس سؤال‌های واقعی کسب‌وکار طراحی می‌شوند." },
];

export function BiShowcase() {
  return <div className="bi-showcase" dir="rtl">
    <section className="bi-pipeline-section" aria-labelledby="bi-pipeline-title"><div className="wrap">
      <div className="bi-intro"><div><span className="eyebrow">از داده‌های پراکنده تا تصمیم روشن</span><h2 id="bi-pipeline-title">داده از هر بخش نرم‌افزار،<br />در یک مسیر تحلیلی.</h2></div><p>اطلاعات لازم برای تصمیم‌گیری در بخش‌های مختلف سازمان جریان دارد. با اتصال منابع و طراحی فرایند ETL، داده‌های انبار، پشتیبانی، IT، فروش و مالی را می‌توان به یک تصویر مشترک تبدیل کرد.</p></div>
      <div className="pl-card"><div className="bi-pipeline-scroll" role="region" aria-label="نمودار مسیر داده؛ برای دیدن تمام مراحل افقی پیمایش کنید" tabIndex={0}><DataPipeline /></div></div>
      <p className="bi-scroll-hint">برای دنبال‌کردن مسیر داده، نمودار را به چپ و راست بکشید.</p>
      <ol className="pl-steps">{pipeline.map((item, i) => <li key={item.title}><b>{(i + 1).toLocaleString("fa-IR")}</b><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
    </div></section>
    <section className="bi-dashboard-section" aria-labelledby="bi-dashboard-title"><div className="wrap">
      <div className="bi-intro"><div><span className="eyebrow">داشبورد اختصاصی، متناسب با سؤال شما</span><h2 id="bi-dashboard-title">هر واحد، هر شاخص،<br />داشبوردی به انتخاب شما.</h2></div><p>از موجودی و گردش کالا تا عملکرد کارشناسان، وضعیت تجهیزات و گزارش‌های مالی؛ انواع داشبوردهای مدیریتی و عملیاتی را با ترکیب داده‌های بخش‌های مختلف نرم‌افزار طراحی می‌کنیم. منابع، شاخص‌ها، سطح دسترسی و زمان به‌روزرسانی متناسب با نیاز سازمان شما تعیین می‌شوند.</p></div>
      <BiDashboard metrics={metrics} />
      <p className="bi-note"><Icon name="chart" />نمونه نمایشی با داده‌های ساختگی؛ بین فروش، کاربران و عملکرد جابه‌جا شوید. برای دیدن مقدارها، نمودار را لمس کنید یا ماوس را روی آن ببرید.</p>
      <p className="visually-link"><Link href="/contact?subject=suite-demo&modules=هوش%20تجاری" className="btn btn-dark">درخواست داشبورد اختصاصی<Icon name="arrow" /></Link></p>
    </div></section>
  </div>;
}
