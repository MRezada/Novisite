"use client";

import { useState } from "react";
import { faDate, toFa } from "@/lib/format";
import type { Message } from "@/lib/types";

export function MessagesView({ initial }: { initial: Message[] }) {
  const [items, setItems] = useState<Message[]>([...initial].reverse());
  const [open, setOpen] = useState<string | null>(null);

  async function call(url: string, init: RequestInit) {
    const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
    const data = await res.json();
    if (data.ok && data.items) setItems([...(data.items as Message[])].reverse());
  }
  const read = (m: Message, v: boolean) => call("/api/admin/messages", { method: "POST", body: JSON.stringify({ id: m.id, read: v }) });
  const del = (m: Message) => confirm("این پیام حذف شود؟") && call(`/api/admin/messages?id=${m.id}`, { method: "DELETE" });

  return (
    <div>
      <div className="ad-head"><h1>پیام‌های دریافتی</h1><span className="ad-help">{toFa(items.filter((m) => !m.read).length)} خوانده‌نشده</span></div>
      {items.length === 0 && <p className="ad-empty">هنوز پیامی دریافت نشده است.</p>}
      <ul className="ad-rows">
        {items.map((m) => (
          <li key={m.id} className={`ad-msg${m.read ? "" : " unread"}`}>
            <button type="button" className="ad-msg-h" onClick={() => { setOpen(open === m.id ? null : m.id); if (!m.read) read(m, true); }}>
              <strong>{m.name}</strong>
              <span>{m.subject || "—"}</span>
              <time>{faDate(m.createdAt)}</time>
            </button>
            {open === m.id && (
              <div className="ad-msg-b">
                <p style={{ whiteSpace: "pre-wrap" }}>{m.message}</p>
                <dl>
                  <dt>ایمیل</dt><dd dir="ltr">{m.email}</dd>
                  {m.phone && <><dt>تلفن</dt><dd dir="ltr">{m.phone}</dd></>}
                  {m.company && <><dt>شرکت / محصول</dt><dd>{m.company}</dd></>}
                  {m.timeline && <><dt>زمان‌بندی</dt><dd>{m.timeline}</dd></>}
                  {m.budget && <><dt>بودجه</dt><dd>{m.budget}</dd></>}
                </dl>
                <div className="ad-row">
                  <a className="ad-btn ad-primary" href={`mailto:${m.email}`}>پاسخ با ایمیل</a>
                  <button type="button" className="ad-btn ad-ghost" onClick={() => read(m, !m.read)}>{m.read ? "علامت‌گذاری خوانده‌نشده" : "خوانده شد"}</button>
                  <button type="button" className="ad-btn ad-danger" onClick={() => del(m)}>حذف</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
