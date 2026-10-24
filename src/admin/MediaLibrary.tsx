"use client";

import { useRef, useState } from "react";

type F = { name: string; url: string; size: number };

export function MediaLibrary({ initial }: { initial: F[] }) {
  const [files, setFiles] = useState<F[]>(initial);
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  async function reload() {
    const res = await fetch("/api/admin/upload");
    const data = await res.json();
    if (data.ok) setFiles(data.files);
  }
  async function send(list: FileList | null) {
    if (!list) return;
    setMsg("");
    for (const file of Array.from(list)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) setMsg(data.error);
    }
    await reload();
  }
  async function del(f: F) {
    if (!confirm("این تصویر حذف شود؟ اگر جایی استفاده شده باشد، از آنجا ناپدید می‌شود.")) return;
    await fetch(`/api/admin/upload?name=${f.name}`, { method: "DELETE" });
    await reload();
  }

  return (
    <div>
      <div className="ad-head">
        <h1>رسانه‌ها</h1>
        <button type="button" className="ad-btn ad-primary" onClick={() => ref.current?.click()}>+ آپلود تصویر</button>
        <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => { send(e.target.files); e.target.value = ""; }} />
      </div>
      {msg && <p className="ad-err">{msg}</p>}
      {files.length === 0 && <p className="ad-empty">هنوز تصویری آپلود نشده است.</p>}
      <div className="ad-media">
        {files.map((f) => (
          <figure key={f.name}>
            <img src={f.url} alt="" loading="lazy" />
            <figcaption>
              <input dir="ltr" readOnly value={f.url} onFocus={(e) => e.currentTarget.select()} />
              <button type="button" className="ad-ic ad-del" onClick={() => del(f)} aria-label="حذف">×</button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
