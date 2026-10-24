"use client";

import { useMemo, useState } from "react";
import { collections } from "./schema";
import { emptyRecord, FieldRow } from "./Fields";
import type { CollectionName } from "@/lib/types";

type Rec = Record<string, unknown> & { id?: string; published?: boolean };
type Name = Exclude<CollectionName, "messages">;

export function CollectionEditor({ name, initial }: { name: Name; initial: Rec[] }) {
  const schema = collections[name];
  const fields = useMemo(() => schema.groups.flatMap((g) => g.fields), [schema]);
  const [items, setItems] = useState<Rec[]>(initial);
  const [draft, setDraft] = useState<Rec | null>(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const api = `/api/admin/${name}`;

  async function call(url: string, init: RequestInit) {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "خطا در انجام عملیات");
      if (data.items) setItems(data.items);
      return data;
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "خطا" });
      return null;
    } finally { setBusy(false); }
  }

  async function save() {
    if (!draft) return;
    const data = await call(api, { method: "POST", body: JSON.stringify(draft) });
    if (data) { setDraft(null); setMsg({ ok: true, text: "ذخیره شد و در سایت اعمال شد." }); window.scrollTo({ top: 0 }); }
  }
  async function remove(it: Rec) {
    if (!confirm(`«${String(it[schema.titleKey])}» حذف شود؟ این کار قابل بازگشت نیست.`)) return;
    const data = await call(`${api}?id=${it.id}`, { method: "DELETE" });
    if (data) setMsg({ ok: true, text: "حذف شد." });
  }
  async function move(i: number, d: number) {
    const ids = items.map((x) => String(x.id));
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    await call(`${api}?action=reorder`, { method: "POST", body: JSON.stringify({ ids }) });
  }
  async function toggle(it: Rec) {
    await call(api, { method: "POST", body: JSON.stringify({ ...it, published: !it.published }) });
  }

  if (draft) {
    return (
      <div>
        <div className="ad-head">
          <h1>{draft.id ? `ویرایش ${schema.singular}` : `${schema.singular} جدید`}</h1>
        </div>
        {msg && <p className={msg.ok ? "ad-ok" : "ad-err"} role="alert">{msg.text}</p>}
        {schema.groups.map((g) => (
          <section key={g.title} className="ad-card">
            <h2>{g.title}</h2>
            {g.hint && <p className="ad-help">{g.hint}</p>}
            {g.fields.map((f) => (
              <FieldRow key={f.key} field={f} value={draft[f.key]} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
            ))}
          </section>
        ))}
        <div className="ad-bar">
          <label className="ad-check"><input type="checkbox" checked={draft.published !== false} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> منتشر شود</label>
          <span style={{ flex: 1 }} />
          <button className="ad-btn ad-ghost" type="button" onClick={() => { setDraft(null); setMsg(null); }}>انصراف</button>
          <button className="ad-btn ad-primary" type="button" onClick={save} disabled={busy}>{busy ? "در حال ذخیره…" : "ذخیره"}</button>
        </div>
      </div>
    );
  }

  const shown = items.filter((it) => !q || String(it[schema.titleKey]).includes(q));
  return (
    <div>
      <div className="ad-head">
        <h1>{schema.label}</h1>
        <button className="ad-btn ad-primary" type="button" onClick={() => { setMsg(null); setDraft({ ...emptyRecord(fields), published: true }); }}>+ {schema.singular} جدید</button>
      </div>
      {msg && <p className={msg.ok ? "ad-ok" : "ad-err"} role="alert">{msg.text}</p>}
      {items.length > 6 && <input className="ad-search" placeholder="جست‌وجو…" value={q} onChange={(e) => setQ(e.target.value)} />}
      {shown.length === 0 && <p className="ad-empty">هنوز موردی ثبت نشده است. با دکمه‌ی بالا اولین {schema.singular} را اضافه کنید.</p>}
      <ul className="ad-rows">
        {shown.map((it) => {
          const i = items.indexOf(it);
          return (
            <li key={String(it.id)} className="ad-row-i">
              <div className="ad-row-t">
                <strong>{String(it[schema.titleKey] ?? "")}</strong>
                {schema.subKey && <span>{String(it[schema.subKey] ?? "")}</span>}
              </div>
              <button type="button" className={`ad-pill ${it.published ? "on" : ""}`} onClick={() => toggle(it)} disabled={busy}>{it.published ? "منتشر شده" : "پیش‌نویس"}</button>
              <button type="button" className="ad-ic" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="بالا">↑</button>
              <button type="button" className="ad-ic" onClick={() => move(i, 1)} disabled={busy || i === items.length - 1} aria-label="پایین">↓</button>
              {schema.publicBase && it.slug ? <a className="ad-btn ad-ghost" href={`${schema.publicBase}/${String(it.slug)}`} target="_blank" rel="noreferrer">مشاهده</a> : null}
              <button type="button" className="ad-btn" onClick={() => { setMsg(null); setDraft({ ...emptyRecord(fields), ...it }); }}>ویرایش</button>
              <button type="button" className="ad-btn ad-danger" onClick={() => remove(it)} disabled={busy}>حذف</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
