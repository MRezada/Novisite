"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Field } from "./schema";

type Rec = Record<string, unknown>;

export function emptyValue(f: Field): unknown {
  switch (f.type) {
    case "tags": case "images": case "list": return [];
    case "bool": return false;
    case "select": return f.options[0]?.value ?? "";
    case "color": return "#1d5bff";
    default: return "";
  }
}

export const emptyRecord = (fields: Field[]): Rec => Object.fromEntries(fields.map((f) => [f.key, emptyValue(f)]));

async function upload(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || "آپلود انجام نشد.");
  return data.url as string;
}

export function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(file?: File) {
    if (!file) return;
    setBusy(true); setErr("");
    try { onChange(await upload(file)); } catch (e) { setErr(e instanceof Error ? e.message : "خطا"); }
    setBusy(false);
  }

  return (
    <div className="ad-img">
      <div className="ad-img-prev">{value ? <img src={value} alt="" /> : <span>بدون تصویر</span>}</div>
      <div className="ad-img-ctl">
        <input dir="ltr" value={value} placeholder="/uploads/… یا https://…" onChange={(e) => onChange(e.target.value)} />
        <div className="ad-row">
          <button type="button" className="ad-btn" onClick={() => ref.current?.click()} disabled={busy}>{busy ? "در حال آپلود…" : "آپلود تصویر"}</button>
          {value && <button type="button" className="ad-btn ad-ghost" onClick={() => onChange("")}>حذف</button>}
        </div>
        {err && <p className="ad-err">{err}</p>}
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
    </div>
  );
}

function TagsInput({ value, onChange, ltr }: { value: string[]; onChange: (v: string[]) => void; ltr?: boolean }) {
  const [text, setText] = useState("");
  const add = () => {
    const parts = text.split(/[,،]/).map((x) => x.trim()).filter(Boolean);
    if (parts.length) onChange(Array.from(new Set([...value, ...parts])));
    setText("");
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && !text && value.length) onChange(value.slice(0, -1));
  };
  return (
    <div className="ad-tags">
      {value.map((t) => (
        <span key={t} className="ad-tag">{t}<button type="button" aria-label={`حذف ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}>×</button></span>
      ))}
      <input dir={ltr ? "ltr" : undefined} value={text} placeholder="تایپ کنید و Enter بزنید" onChange={(e) => setText(e.target.value)} onKeyDown={key} onBlur={add} />
    </div>
  );
}

function ListInput({ field, value, onChange }: { field: Extract<Field, { type: "list" }>; value: Rec[]; onChange: (v: Rec[]) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(open === i ? j : open === j ? i : open);
  };
  const title = (it: Rec, i: number) => {
    const k = field.itemTitle ?? field.of[0]?.key;
    const sub = field.of.find((f) => f.key === k);
    let v = String(it[k ?? ""] ?? "");
    if (sub?.type === "select") v = sub.options.find((o) => o.value === v)?.label ?? v;
    return v || `مورد ${i + 1}`;
  };
  return (
    <div className="ad-list">
      {value.map((it, i) => (
        <div key={i} className={`ad-li${open === i ? " open" : ""}`}>
          <div className="ad-li-h">
            <button type="button" className="ad-li-t" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>{title(it, i)}</button>
            <button type="button" className="ad-ic" onClick={() => move(i, -1)} aria-label="بالا">↑</button>
            <button type="button" className="ad-ic" onClick={() => move(i, 1)} aria-label="پایین">↓</button>
            <button type="button" className="ad-ic ad-del" onClick={() => onChange(value.filter((_, n) => n !== i))} aria-label="حذف">×</button>
          </div>
          {open === i && (
            <div className="ad-li-b">
              {field.of.map((sub) => (
                <FieldRow key={sub.key} field={sub} value={it[sub.key]} onChange={(v) => onChange(value.map((x, n) => (n === i ? { ...x, [sub.key]: v } : x)))} />
              ))}
            </div>
          )}
        </div>
      ))}
      {(!field.max || value.length < field.max) && (
        <button type="button" className="ad-btn ad-ghost" onClick={() => { onChange([...value, emptyRecord(field.of)]); setOpen(value.length); }}>+ افزودن</button>
      )}
    </div>
  );
}

export function FieldRow({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const ltr = "ltr" in field && field.ltr ? "ltr" : undefined;
  let control;
  switch (field.type) {
    case "textarea": control = <textarea rows={4} dir={ltr} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />; break;
    case "markdown": control = <textarea rows={16} className="ad-md" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />; break;
    case "bool": control = <label className="ad-check"><input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} /> فعال</label>; break;
    case "select": control = (
      <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ); break;
    case "color": control = (
      <div className="ad-color">
        <input type="color" value={/^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : "#1d5bff"} onChange={(e) => onChange(e.target.value)} />
        <input dir="ltr" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
      </div>
    ); break;
    case "image": control = <ImageInput value={String(value ?? "")} onChange={onChange} />; break;
    case "images": {
      const imgs = (value as string[]) ?? [];
      control = (
        <div className="ad-gal">
          {imgs.map((u, i) => (
            <div key={`${u}-${i}`} className="ad-gal-i">
              <ImageInput value={u} onChange={(v) => onChange(v ? imgs.map((x, n) => (n === i ? v : x)) : imgs.filter((_, n) => n !== i))} />
            </div>
          ))}
          <button type="button" className="ad-btn ad-ghost" onClick={() => onChange([...imgs, ""])}>+ افزودن تصویر</button>
        </div>
      );
      break;
    }
    case "tags": control = <TagsInput value={(value as string[]) ?? []} onChange={onChange} ltr={Boolean(ltr)} />; break;
    case "list": control = <ListInput field={field} value={(value as Rec[]) ?? []} onChange={onChange} />; break;
    case "number": control = <input type="number" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />; break;
    case "date": control = <input type="date" dir="ltr" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />; break;
    default: control = <input dir={field.type === "slug" || field.type === "url" ? "ltr" : ltr} value={String(value ?? "")} placeholder={"placeholder" in field ? field.placeholder : undefined} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <div className="ad-f">
      <span className="ad-lbl">{field.label}</span>
      {control}
      {field.help && <small className="ad-help">{field.help}</small>}
    </div>
  );
}
