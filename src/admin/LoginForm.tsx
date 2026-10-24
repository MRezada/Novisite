"use client";

import { FormEvent, useState } from "react";

export function LoginForm({ enabled }: { enabled: boolean }) {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    try {
      const password = String(new FormData(e.currentTarget).get("password") ?? "");
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({ error: "پاسخ نامعتبر از سرور دریافت شد." }));

      if (res.ok && data.ok) {
        window.location.reload();
        return;
      }
      setErr(data.error || "ورود انجام نشد.");
    } catch {
      setErr("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ad-login">
      <form onSubmit={submit} className="ad-card">
        <img src="/novisoft-logo.png" alt="" width={56} height={48} />
        <h1>ورود به پنل مدیریت</h1>
        {!enabled && <p className="ad-err">رمز ادمین تنظیم نشده است. در فایل <code>.env</code> مقدار <code>ADMIN_PASSWORD</code> را بنویسید و سرور را دوباره اجرا کنید.</p>}
        <label className="ad-f"><span className="ad-lbl">رمز عبور</span><input name="password" type="password" dir="ltr" autoComplete="current-password" required autoFocus /></label>
        {err && <p className="ad-err" role="alert">{err}</p>}
        <button className="ad-btn ad-primary" type="submit" disabled={busy || !enabled}>{busy ? "…" : "ورود"}</button>
      </form>
    </div>
  );
}
