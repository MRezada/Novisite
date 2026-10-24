"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Icon } from "./Icon";
import styles from "./ConnectedWorkflow.module.css";

const steps = [
  { name: "Novi Desk", label: "ثبت درخواست", icon: "ticket", color: "#ffbc86", title: "یک مشکل، شروع یک مسیر.", text: "همکار شما خرابی دستگاهش را گزارش می‌کند. درخواست به تیم پشتیبانی می‌رسد؛ همراه با شرح مشکل و مشخصات درخواست‌کننده.", handoff: "درخواست و مشخصات دستگاه ← تیم IT", status: "ارجاع به کارشناس", fields: [["درخواست‌کننده", "واحد مالی"], ["موضوع", "دستگاه روشن نمی‌شود"], ["اولویت", "بالا"]] },
  { name: "Novi IT", label: "بررسی دارایی", icon: "monitor", color: "#72dcc1", title: "پشت هر درخواست، یک دارایی.", text: "تیم IT سوابق و مشخصات دستگاه را کنار درخواست می‌بیند. پس از بررسی، قطعه موردنیاز برای تعمیر مشخص می‌شود.", handoff: "مشخصات قطعه موردنیاز ← انبار", status: "نیاز به تعویض قطعه", fields: [["شناسه دارایی", "PC-204"], ["واحد استفاده‌کننده", "مالی"], ["نتیجه بررسی", "تعویض منبع تغذیه"]] },
  { name: "Novi Inventory", label: "تأمین قطعه", icon: "box", color: "#59bcff", title: "قطعه درست، در مسیر درست.", text: "موجودی قطعه بررسی و خروج آن برای تعمیر دستگاه ثبت می‌شود. سابقه مصرف قطعه به درخواست و دارایی مرتبط می‌ماند.", handoff: "گردش قطعه و نتیجه رسیدگی ← گزارش مدیریتی", status: "قطعه تحویل شد", fields: [["قطعه", "منبع تغذیه"], ["محل نگه‌داری", "انبار مرکزی · قفسه ۰۳"], ["گردش", "۱ عدد برای تعمیر PC-204"]] },
  { name: "Novi BI", label: "دید مدیریتی", icon: "chart", color: "#b4a0ff", title: "از یک اتفاق، به یک تصویر کامل.", text: "داده‌های رسیدگی و مصرف قطعه کنار هم قرار می‌گیرند. مدیر می‌تواند روند درخواست‌ها، زمان پاسخ و هزینه‌های نگه‌داری را بررسی کند.", handoff: "درخواست + دارایی + قطعه = گزارش قابل پیگیری", status: "آماده تحلیل", fields: [["درخواست", "رسیدگی‌شده"], ["قطعه مصرفی", "۱ عدد"], ["دارایی مرتبط", "PC-204"]] },
];

export function ConnectedWorkflow() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  return (
    <section className={styles.section} aria-labelledby="connection-title" dir="rtl">
      <div className="wrap">
        <div className={styles.heading}>
          <div><span className="one-label">03 / قدرت ارتباط</span><h2 id="connection-title">چهار تخصص.<br /><span>یک جریان کاری.</span></h2></div>
          <div><p>وقتی ابزارها به هم متصل‌اند، کار در یک تیم متوقف نمی‌شود. مسیر یک درخواست را از اولین پیام تا گزارش مدیریتی دنبال کنید.</p><span className={styles.hint}><Icon name="spark" /> روی هر مرحله کلیک کنید و ارتباط را ببینید.</span></div>
        </div>
        <div className={styles.board} style={{ "--step-color": current.color } as CSSProperties}>
          <div className={styles.boardHeader}><span><i /> سناریوی نمونه / تعمیر دستگاه</span><span dir="ltr">REQUEST #1042</span></div>
          <div className={styles.rail} role="group" aria-label="مراحل گردش درخواست">
            {steps.map((item, i) => <button type="button" key={item.name} className={styles.node} aria-pressed={step === i} aria-controls="connection-detail" onClick={() => setStep(i)} data-complete={i < step} style={{ "--node-color": item.color } as CSSProperties}>
              <span className={styles.nodeIcon}><Icon name={item.icon} /><small>{(i + 1).toLocaleString("fa-IR")}</small></span><b>{item.label}</b><span dir="ltr">{item.name}</span>
            </button>)}
          </div>
          <div id="connection-detail" className={styles.detail}>
            <div className={styles.copy} key={`copy-${step}`}>
              <span className={styles.stepLabel}>مرحله {(step + 1).toLocaleString("fa-IR")} از ۴ <i /> <span dir="ltr">{current.name}</span></span>
              <h3>{current.title}</h3><p>{current.text}</p>
              <div className={styles.handoff}><Icon name="plug" /><span>{current.handoff}</span></div>
              <div className={styles.controls}><button type="button" onClick={() => setStep((step + 1) % steps.length)}>{step === 3 ? "از ابتدا ببینید" : "مرحله بعد"}<Icon name="arrow" /></button><span>{(step + 1).toLocaleString("fa-IR")} / ۴</span></div>
            </div>
            <div className={styles.preview} key={`preview-${step}`} aria-label={`پیش‌نمایش نمونه ${current.name}`}>
              <div className={styles.previewHeader}><span><Icon name={current.icon} /><b dir="ltr">{current.name}</b></span><small>داده نمایشی</small></div>
              <div className={styles.recordTitle}><div><small>{step === 3 ? "گزارش گردش درخواست" : "پرونده مشترک"}</small><strong dir="ltr">{step === 1 ? "PC-204" : step === 2 ? "PART / PSU-01" : "REQ-1042"}</strong></div><span className={styles.badge}>{current.status}</span></div>
              {step === 3 && <div className={styles.chart} aria-hidden="true">{[35, 58, 44, 73, 60, 87, 74, 95, 80, 100].map((height, i) => <i key={i} style={{ "--height": `${height}%`, "--delay": `${i * 40}ms` } as CSSProperties} />)}</div>}
              <dl className={styles.fields}>{current.fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              <div className={styles.recordFooter}><Icon name="check" /><span>مرتبط با درخواست <b dir="ltr">#1042</b></span><span className={styles.dots} aria-hidden="true"><i /><i /><i /></span></div>
            </div>
          </div>
          <p className={styles.srOnly} role="status">مرحله {(step + 1).toLocaleString("fa-IR")}: {current.label} — {current.title}</p>
          <div className={styles.foundation}><span><Icon name="layers" /><b dir="ltr">Novi One Core</b></span><p>هویت مشترک <i /> دسترسی یکپارچه <i /> سابقه قابل پیگیری</p><span className={styles.foundationTag}>همراه تمام مراحل</span></div>
        </div>
        <div className={styles.footer}><p>یک سناریوی نمونه از یکپارچه‌سازی؛ دامنه اتصال‌ها در جلسه نیازسنجی مشخص می‌شود.</p><Link href="/contact?subject=suite-demo">سناریوی سازمان شما چیست؟<Icon name="arrow" /></Link></div>
      </div>
    </section>
  );
}
