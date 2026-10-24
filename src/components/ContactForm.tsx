"use client";

import { FormEvent, useState } from "react";
import { Icon } from "./Icon";

const subjects = [
  { value: "suite-demo", label: "دمو و برآورد پلتفرم Novi One" },
  { value: "inventory-demo", label: "دموی انبار و مدیریت قطعات" },
  { value: "bi-demo", label: "دموی هوش تجاری" },
  { value: "it-demo", label: "دموی مدیریت و پشتیبانی IT" },
  { value: "desk-demo", label: "دموی تیکتینگ و میز خدمت" },
  { value: "project", label: "سفارش پروژه نرم‌افزاری" },
  { value: "consult", label: "مشاوره فنی" },
  { value: "support", label: "پشتیبانی" },
  { value: "other", label: "موضوع دیگر" },
];
const budgets = ["هنوز مشخص نیست / نیاز به برآورد", "تا ۱۵۰ میلیون تومان", "۱۵۰ تا ۵۰۰ میلیون تومان", "۵۰۰ میلیون تا ۱ میلیارد تومان", "بیش از ۱ میلیارد تومان"];
const timelines = ["زمان‌بندی هنوز مشخص نیست", "کمتر از ۱ ماه", "۱ تا ۳ ماه", "۳ تا ۶ ماه", "بیش از ۶ ماه"];

export function ContactForm({ defaultSubject = "project", defaultMessage = "", email = "" }: { defaultSubject?: string; defaultMessage?: string; email?: string }) {
  const preview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true";
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (preview) return;
    const form = e.currentTarget;
    setState("sending");
    try {
      const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
      const label = subjects.find((s) => s.value === raw.subject)?.label ?? raw.subject;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...raw, subject: label }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "ارسال انجام نشد.");
      form.reset();
      setState("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال انجام نشد. دوباره تلاش کنید.");
      setState("err");
    }
  }

  const known = subjects.some((s) => s.value === defaultSubject);

  return (
    <form className="form" onSubmit={submit}>
      {preview && <p className="form-note">این نسخه برای نمایش سایت است و پیام ثبت نمی‌کند.{email && <> برای ارتباط، <a href={`mailto:${email}`}>ایمیل بفرستید</a>.</>}</p>}
      <div className="two">
        <label>نام شما<input name="name" required autoComplete="name" placeholder="مثلاً علی رضایی" /></label>
        <label>ایمیل<input name="email" type="email" required dir="ltr" autoComplete="email" placeholder="you@company.com" /></label>
      </div>
      <div className="two">
        <label>نام شرکت / محصول (اختیاری)<input name="company" autoComplete="organization" placeholder="مثلاً شرکت نمونه" /></label>
        <label>شماره تماس (اختیاری)<input name="phone" type="tel" dir="ltr" autoComplete="tel" placeholder="09123456789" /></label>
      </div>
      <div className="two">
        <label>موضوع
          <select name="subject" defaultValue={known ? defaultSubject : "other"}>
            {subjects.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label>زمان‌بندی تقریبی
          <select name="timeline" defaultValue={timelines[0]}>{timelines.map((x) => <option key={x}>{x}</option>)}</select>
        </label>
      </div>
      <label>بودجه‌ی تقریبی
        <select name="budget" defaultValue={budgets[0]}>{budgets.map((b) => <option key={b}>{b}</option>)}</select>
      </label>
      <label>پیام شما<textarea name="message" required rows={6} defaultValue={defaultMessage} placeholder="مسئله‌ی فعلی، کاربران، چیزی که می‌خواهید ساخته یا بهتر شود و هر محدودیت مهمی را بنویسید." /></label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div>
        <button className="btn btn-dark" type="submit" disabled={preview || state === "sending"}>
          {preview ? "ارسال در نسخه نمایشی غیرفعال است" : state === "sending" ? "در حال ارسال…" : "ارسال پیام"} <Icon name="arrow" />
        </button>
      </div>
      <div aria-live="polite">
        {state === "ok" && <p className="form-note ok">پیام شما ثبت شد. ظرف یک روز کاری با شما تماس می‌گیریم.</p>}
        {state === "err" && <p className="form-note err">{error}</p>}
      </div>
    </form>
  );
}
