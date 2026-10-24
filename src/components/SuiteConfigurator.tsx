"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Icon } from "./Icon";
import { suiteVisuals, type SuiteModuleSlug } from "@/lib/suite";
import styles from "./SuiteConfigurator.module.css";

type Module = { slug: string; nameFa: string; category: string; icon: string; audience: string };
const accents = ["#397cb9", "#8264c8", "#258571", "#b67435"];

export function SuiteConfigurator({ modules }: { modules: Module[] }) {
  const [selected, setSelected] = useState<string[]>(modules.slice(0, 1).map((m) => m.slug));
  const active = modules.filter((m) => selected.includes(m.slug));
  const allSelected = modules.length > 0 && active.length === modules.length;
  const href = `/contact?subject=suite-demo&modules=${encodeURIComponent(active.map((m) => m.nameFa).join("،"))}`;
  function toggle(slug: string) {
    setSelected((old) => old.includes(slug) ? old.filter((item) => item !== slug) : [...old, slug]);
  }
  return (
    <section className={styles.builder} aria-labelledby="suite-config-title" dir="rtl">
      <div className={styles.heading}>
        <div><span className={styles.eyebrow}>متناسب با سازمان شما</span><h2 id="suite-config-title">پلن شما، <span>به انتخاب شما.</span></h2></div>
        <p>از نیاز امروز شروع کنید. ماژول‌های موردنیازتان را کنار هم بگذارید و با رشد سازمان، ترکیب را گسترش دهید.</p>
      </div>
      <div className={styles.layout}>
        <div className={styles.selection}>
          <div className={styles.selectionHeading}>
            <h3><span>۰۱</span> ماژول‌ها را انتخاب کنید</h3>
            {modules.length > 0 && <button type="button" className={styles.selectAll} onClick={() => setSelected(allSelected ? [] : modules.map((m) => m.slug))}>{allSelected ? "حذف همه انتخاب‌ها" : "انتخاب همه ماژول‌ها"}<Icon name={allSelected ? "close" : "plus"} /></button>}
          </div>
          <div className={styles.cards} role="group" aria-label="انتخاب ماژول‌های پلن">
            {modules.map((m, index) => {
              const on = selected.includes(m.slug);
              const visual = suiteVisuals[m.slug as SuiteModuleSlug];
              return (
                <button type="button" key={m.slug} className={styles.card} aria-pressed={on} onClick={() => toggle(m.slug)} style={{ "--accent": accents[index % accents.length] } as CSSProperties}>
                  <span className={styles.cardTop}><span className={styles.icon}><Icon name={m.icon} /></span><span className={styles.check}><Icon name={on ? "check" : "plus"} /></span></span>
                  <span className={styles.moduleName}>{visual?.shortLabel || m.nameFa}</span>
                  <span className={styles.audience}>{m.audience}</span>
                  <span className={styles.features}>{(visual?.bullets || [m.category]).slice(0, 2).map((feature) => <span key={feature}><i />{feature}</span>)}</span>
                  <span className={styles.cardBottom}><span>{on ? "به پلن اضافه شد" : "افزودن به پلن"}</span><span lang="en" dir="ltr">{visual?.eyebrow || "Novi One"}</span></span>
                </button>
              );
            })}
          </div>
          {modules.length === 0 && <p className={styles.unavailable}>ماژولی برای انتخاب موجود نیست. برای بررسی نیاز سازمان با ما گفت‌وگو کنید.</p>}
          <div className={styles.foundation}>
            <span className={styles.foundationIcon}><Icon name="layers" /></span>
            <div><b>یک هسته مشترک، همراه هر ترکیب</b><p>حساب سازمانی، کاربران و نقش‌ها، اعلان‌ها و API مشترک</p></div>
            <span className={styles.included}><Icon name="check" /> همراه پلن</span>
          </div>
        </div>
        <aside className={styles.summary} aria-label="خلاصه پلن انتخابی">
          <div className={styles.summaryBrand}><span dir="ltr">Novi<span> One</span></span><span>پلن سازمان شما</span></div>
          <div className={styles.count}><strong key={active.length}>{active.length.toLocaleString("fa-IR")}</strong><div><b>ماژول انتخاب‌شده</b><small>از {modules.length.toLocaleString("fa-IR")} ماژول قابل انتخاب</small></div><span className={styles.countIcon}><Icon name="layers" /></span></div>
          <p className={styles.srOnly} role="status" aria-live="polite">{active.length ? `${active.length.toLocaleString("fa-IR")} ماژول انتخاب شده: ${active.map((m) => m.nameFa).join("، ")}` : "هنوز ماژولی انتخاب نشده است"}</p>
          <div className={styles.summaryList}>
            <div className={styles.coreRow}><span><Icon name="shield" /> هسته مشترک Novi One</span><small>همراه پلن</small></div>
            {active.length ? <ul>{active.map((m) => <li key={m.slug}><span><Icon name={m.icon} />{m.nameFa}</span><button type="button" onClick={() => toggle(m.slug)} aria-label={`حذف ${m.nameFa} از پلن`}><Icon name="close" /></button></li>)}</ul> : <div className={styles.empty}><Icon name="plus" /><p>جای اولین ماژول شما اینجاست.</p><small>برای شروع، یک ماژول انتخاب کنید.</small></div>}
          </div>
          <div className={styles.nextStep}><span>قدم بعدی</span><h3>بیایید درباره نیازتان صحبت کنیم.</h3><p>دموی متناسب با انتخاب شما و برآورد هزینه، بر اساس کاربران و نیازهای استقرار.</p></div>
          {active.length ? <Link className={styles.cta} href={href}>درخواست دمو و برآورد<Icon name="arrow" /></Link> : <button type="button" className={styles.cta} disabled>ابتدا یک ماژول انتخاب کنید<Icon name="arrow" /></button>}
          <p className={styles.note}><Icon name="lock" /> بدون پرداخت یا تعهد خرید</p>
          {modules.length === 0 && <Link className={styles.contact} href="/contact?subject=suite-demo">گفت‌وگو درباره نیاز سازمان</Link>}
        </aside>
      </div>
    </section>
  );
}
