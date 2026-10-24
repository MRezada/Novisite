"use client";

import { useState } from "react";
import { FieldRow } from "./Fields";
import { settingsGroups } from "./schema";

export function SettingsEditor({ initial }: { initial: Record<string, unknown> }) {
  const [draft, setDraft] = useState<Record<string, unknown>>(initial);
  const [tab, setTab] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "ذخیره انجام نشد.");
      setDraft(data.settings);
      setMsg({ ok: true, text: "تنظیمات ذخیره شد و در سایت اعمال شد." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "خطا" });
    }
    setBusy(false);
  }

  const g = settingsGroups[tab];
  return (
    <div>
      <div className="ad-head"><h1>تنظیمات سایت</h1></div>
      <div className="ad-tabs" role="tablist">
        {settingsGroups.map((x, i) => (
          <button key={x.title} type="button" role="tab" aria-selected={i === tab} className={i === tab ? "on" : ""} onClick={() => setTab(i)}>{x.title}</button>
        ))}
      </div>
      {msg && <p className={msg.ok ? "ad-ok" : "ad-err"} role="alert">{msg.text}</p>}
      <section className="ad-card">
        <h2>{g.title}</h2>
        {g.hint && <p className="ad-help">{g.hint}</p>}
        {g.fields.map((f) => <FieldRow key={f.key} field={f} value={draft[f.key]} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />)}
      </section>
      <div className="ad-bar">
        <span style={{ flex: 1 }} className="ad-help">تغییرات همه‌ی تب‌ها با هم ذخیره می‌شود.</span>
        <button className="ad-btn ad-primary" type="button" onClick={save} disabled={busy}>{busy ? "در حال ذخیره…" : "ذخیره تنظیمات"}</button>
      </div>
    </div>
  );
}
