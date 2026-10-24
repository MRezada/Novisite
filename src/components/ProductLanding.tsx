"use client";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { Icon } from "./Icon";
import { ConnectedWorkflow } from "./ConnectedWorkflow";
import { OneEcosystem } from "./OneEcosystem";
import { ProductPreview } from "./ProductPreview";
import { SuiteConfigurator } from "./SuiteConfigurator";
import { sharedPlatformFeatures, suiteVisuals } from "@/lib/suite";
import type { Product } from "@/lib/types";

const colors = ["#59bcff", "#b4a0ff", "#72dcc1", "#ffbc86"];
const questions = [
  ["Novi One یک محصول است یا چهار نرم‌افزار؟", "یک پلتفرم سازمانی است که چهار ماژول تخصصی دارد. هر ماژول را متناسب با نیازتان انتخاب می‌کنید؛ کاربران، نقش‌ها و فضای کاری روی هسته مشترک باقی می‌مانند."],
  ["برای شروع باید همه ماژول‌ها را بخریم؟", "خیر. از یک ماژول شروع کنید و در ادامه ماژول‌های دیگر را به همان فضای سازمانی اضافه کنید. محدوده و شرایط هر ماژول در برآورد مشخص می‌شود."],
  ["قیمت چگونه مشخص می‌شود؟", "بر اساس ماژول‌های انتخابی، تعداد کاربران، نیازهای استقرار و اتصال به سیستم‌های دیگر. ترکیب موردنیازتان را انتخاب کنید و برای برآورد ارسال کنید."],
  ["اگر فرایند ما اختصاصی باشد چطور؟", "نووی‌سافت در کنار پلتفرم، خدمات توسعه اختصاصی و یکپارچه‌سازی ارائه می‌کند. ابتدا فاصله نیاز شما با امکانات ماژول بررسی می‌شود."],
  ["آیا دموی آنلاین به داده واقعی متصل است؟", "خیر. محیط تعاملی سایت با داده ساختگی اجرا می‌شود. تغییرات فقط در حافظه همان صفحه هستند و با بازخوانی پاک می‌شوند. برای بررسی سناریوی سازمان خودتان درخواست جلسه بدهید."],
];
export function ProductLanding({ modules, catalog = false }: { modules: Product[]; catalog?: boolean }) {
  const [selected, setSelected] = useState(0);
  const [moduleChosen, setModuleChosen] = useState(false);

  useEffect(() => {
    if (modules.length < 2 || moduleChosen) return;
    const staticPreview = window.matchMedia("(max-width: 760px), (pointer: coarse), (prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const sync = () => {
      window.clearInterval(timer);
      if (!staticPreview.matches) timer = window.setInterval(() => setSelected((current) => (current + 1) % modules.length), 4000);
    };
    sync();
    staticPreview.addEventListener("change", sync);
    return () => { window.clearInterval(timer); staticPreview.removeEventListener("change", sync); };
  }, [modules.length, moduleChosen]);
  const current = modules[selected];
  return <div className="one-site">
    <section className="one-hero"><div className="one-grid" aria-hidden="true"/><div className="wrap">
      <div className="one-hero-top"><span className="one-kicker"><i/> NOVI ONE / BY NOVISOFT</span><span className="one-edition">پلتفرم سازمانی ماژولار</span></div>
      <div className="one-hero-layout"><div className="one-intro"><span className="one-announcement">یک محصول. چهار ماژول. بی‌نهایت امکان رشد.</span><h1>{catalog ? <>فضای کارتان را<br/><em>خودتان بسازید.</em></> : <>سازمان شما،<br/>در یک <em>مدار مشترک.</em></>}</h1><p>انبار، هوش تجاری، مدیریت IT و تیکتینگ؛ در یک فضای کاری. فقط ماژولی را بخرید که امروز نیاز دارید و فردا، بدون شروع دوباره، گسترش دهید.</p><div className="one-actions"><Link href="#build-your-plan" className="one-button">انتخاب ماژول‌های سازمان <Icon name="arrow"/></Link><Link href="/demo" className="one-button ghost">تجربه دموی تعاملی <span>↗</span></Link></div><div className="one-promises"><span><Icon name="check"/> خرید ماژولار</span><span><Icon name="check"/> هسته مشترک</span><span><Icon name="check"/> توسعه‌پذیر</span></div></div>
      <OneEcosystem modules={modules}/></div>
      <div className="one-hero-bottom"><span>ساخته‌شده برای اتصال تیم‌ها</span><div>OPERATIONS <i/> DATA <i/> IT <i/> SERVICE</div><a href="#modules">کشف پلتفرم ↓</a></div>
    </div></section>
    <section className="one-section" id="modules"><div className="wrap"><div className="one-heading"><div><span className="one-label">01 / ماژول‌های پلتفرم</span><h2>تخصص‌های متفاوت.<br/>یک زبان مشترک.</h2></div><p>چهار ابزار تخصصی، بدون چهار جزیره جدا. روی هر ماژول کلیک کنید و ببینید چه چیزی به فضای کاری شما اضافه می‌کند.</p></div>
      <div className="one-tabs" role="tablist" aria-label="ماژول‌های Novi One">{modules.map((m,i) => <button id={`module-tab-${i}`} aria-controls="module-panel" role="tab" aria-selected={selected === i} key={m.slug} onClick={() => { setSelected(i); setModuleChosen(true); }} style={{"--module-color": colors[i]} as CSSProperties}><span className="one-tab-no">0{i+1}</span><Icon name={suiteVisuals[m.slug as keyof typeof suiteVisuals]?.icon || "layers"}/><b>{suiteVisuals[m.slug as keyof typeof suiteVisuals]?.shortLabel}</b><span>↙</span></button>)}</div>
      {current && <div id="module-panel" role="tabpanel" aria-labelledby={`module-tab-${selected}`} className="one-module-panel" style={{"--module-color": colors[selected], "--a":current.accent,"--b":current.accent2} as CSSProperties}><div className="one-module-copy" key={current.slug}><span className="one-label" dir="ltr">{current.name}</span><h3>{current.tagline}</h3><p>{current.description}</p><ul>{suiteVisuals[current.slug as keyof typeof suiteVisuals]?.bullets.map(b => <li key={b}><Icon name="check"/>{b}</li>)}</ul><Link className="one-link" href={`/products/${current.slug}`}>قابلیت‌ها و جزئیات ماژول <Icon name="arrow"/></Link></div><div className="one-preview"><div className="one-preview-cap"><span><i/> نمای ماژول</span><span>{current.name}</span></div><ProductPreview product={current}/><span className="one-preview-note">پیش‌نمایش رابط کاربری · برای تجربه عملکرد به دموی تعاملی بروید</span></div></div>}
    </div></section>
    <section className="one-section one-dark"><div className="wrap"><div className="one-heading"><div><span className="one-label">02 / زیرساخت مشترک</span><h2>یک‌بار وارد شوید.<br/><em>همه‌جا در جریان باشید.</em></h2></div><p>تفاوت Novi One فقط کنار هم بودن ابزارها نیست. هویت، دسترسی و ارتباط میان ماژول‌ها از یک هسته مشترک می‌آید.</p></div><div className="one-foundation">{sharedPlatformFeatures.map((f,i) => <article key={f.title}><div><Icon name={f.icon}/><span>0{i+1}</span></div><h3>{f.title}</h3><p>{f.text}</p></article>)}</div><div className="one-core-strip"><b>Novi One Core</b><span>هسته مشترک، همراه هر ترکیب از ماژول‌ها</span><Icon name="layers"/></div></div></section>
    <ConnectedWorkflow />
    <section className="one-demo-band"><div className="wrap"><div><span className="one-label">بدون ثبت‌نام، با داده نمونه</span><h2>قبل از گفت‌وگو، کمی با آن کار کنید.</h2><p>موجودی را جست‌وجو کنید، رسید ثبت کنید و وضعیت یک تیکت را تغییر دهید.</p></div><Link className="one-button" href="/demo">ورود به محیط تعاملی <Icon name="arrow"/></Link></div></section>
    <section id="build-your-plan" className="one-section one-plan"><div className="wrap"><span className="one-label">04 / ترکیب مناسب شما</span><SuiteConfigurator modules={modules.map(m => ({slug:m.slug,nameFa:m.nameFa,category:m.category,icon:suiteVisuals[m.slug as keyof typeof suiteVisuals]?.icon || "layers",audience:suiteVisuals[m.slug as keyof typeof suiteVisuals]?.audience || m.category}))}/><div className="one-price-note"><Icon name="info"/><p>قیمت بر اساس ماژول‌ها، کاربران و نیازهای استقرار و اتصال تعیین می‌شود. انتخاب‌های شما به فرم درخواست منتقل می‌شود؛ این مرحله خرید یا فعال‌سازی واقعی نیست.</p></div></div></section>
    <section className="one-section one-faq"><div className="wrap one-faq-grid"><div><span className="one-label">پیش از تصمیم</span><h2>شفاف شروع کنیم.</h2><p>سؤال دیگری دارید؟ درباره نیاز واقعی سازمانتان صحبت کنیم.</p><Link href="/contact?subject=suite-demo" className="one-link">گفت‌وگو با نووی‌سافت <Icon name="arrow"/></Link></div><div>{questions.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></div></section>
    <section className="one-final"><div className="wrap"><span className="one-label">YOUR NEXT WORKSPACE</span><h2>از نیاز امروز شروع کنید.<br/><em>برای فردا آماده بمانید.</em></h2><Link className="one-button" href="/contact?subject=suite-demo">درخواست جلسه و دمو <Icon name="arrow"/></Link><Link className="one-final-secondary" href="/services">فرایند اختصاصی دارید؟ خدمات توسعه نرم‌افزار ↗</Link></div></section>
  </div>;
}
