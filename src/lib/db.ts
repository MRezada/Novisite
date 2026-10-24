import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { cache } from "react";
import { collections, settingsGroups } from "@/admin/schema";
import { flatten, sanitizeFields } from "./sanitize";
import { seedCollections, seedSettings } from "./seed";
import type { CollectionMap, CollectionName, Settings } from "./types";

export const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

type Item = CollectionMap[CollectionName];
const file = (name: string) => path.join(DATA_DIR, `${name}.json`);

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file(name), "utf8")) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw e;
  }
}

let chain: Promise<unknown> = Promise.resolve();
/** نوشتن پشت‌سرهم و اتمیک تا فایل‌ها خراب نشوند */
function writeJson(name: string, data: unknown): Promise<void> {
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${file(name)}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
    await fs.rename(tmp, file(name));
  };
  const next = chain.then(run, run);
  chain = next.catch(() => undefined);
  return next;
}

/* ───────── تنظیمات ───────── */
export const getSettings = cache(async (): Promise<Settings> => {
  const stored = await readJson<Partial<Settings>>("settings", {});
  const s = { ...seedSettings, ...stored } as Settings;

  // مهاجرت نرم تنظیمات صفحه اصلی: اگر پروژه از نسخه قدیمی ارتقا پیدا کند،
  // بخش‌های جدید به ترتیب پیش‌فرض اضافه می‌شوند و تنظیمات قبلی کاربر حفظ می‌شود.
  if (stored.homeSections?.length) {
    const old = new Map(stored.homeSections.map((section) => [section.id, section]));
    s.homeSections = seedSettings.homeSections.map((section) => ({ ...section, ...(old.get(section.id) ?? {}) }));
  }

  if (process.env.NEXT_PUBLIC_SITE_URL && !stored.siteUrl) s.siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return s;
});

export async function saveSettings(input: Record<string, unknown>): Promise<Settings> {
  const clean = sanitizeFields(flatten(settingsGroups), input) as unknown as Settings;
  const current = await getSettings();
  const merged: Settings = { ...current, ...clean };
  await writeJson("settings", merged);
  return merged;
}

/* ───────── مجموعه‌ها ───────── */
export async function listAll<K extends CollectionName>(name: K): Promise<CollectionMap[K][]> {
  const items = await readJson<CollectionMap[K][]>(name, seedCollections[name] as unknown as CollectionMap[K][]);
  return [...items].sort((a, b) => a.order - b.order);
}

export const getAll = cache(listAll) as typeof listAll;

export async function getPublished<K extends CollectionName>(name: K): Promise<CollectionMap[K][]> {
  return (await getAll(name)).filter((i) => i.published);
}

export async function upsertItem<K extends Exclude<CollectionName, "messages">>(
  name: K,
  input: Record<string, unknown>,
): Promise<{ item?: CollectionMap[K]; error?: string }> {
  const schema = collections[name];
  const items = await listAll(name);
  const id = typeof input.id === "string" && input.id ? input.id : "";
  const existing = items.find((i) => i.id === id);
  const clean = sanitizeFields(flatten(schema.groups), input);

  if (schema.slugged) {
    const slug = clean.slug as string;
    if (!slug) return { error: "نشانی (slug) را با حروف انگلیسی وارد کنید." };
    if (items.some((i) => (i as unknown as { slug: string }).slug === slug && i.id !== id)) {
      return { error: "این نشانی قبلاً استفاده شده است." };
    }
  }
  const title = String(clean[schema.titleKey] ?? "").trim();
  if (!title) return { error: "عنوان را وارد کنید." };

  const meta = {
    id: existing?.id ?? randomUUID(),
    published: input.published === false ? false : true,
    order: existing?.order ?? (items.reduce((m, i) => Math.max(m, i.order), 0) + 1),
    updatedAt: new Date().toISOString(),
  };
  const item = { ...(existing ?? {}), ...clean, ...meta } as unknown as CollectionMap[K];
  const next = existing ? items.map((i) => (i.id === existing.id ? item : i)) : [...items, item];
  await writeJson(name, next);
  return { item };
}

export async function removeItem(name: CollectionName, id: string): Promise<void> {
  const items = await listAll(name);
  await writeJson(name, items.filter((i) => i.id !== id));
}

export async function reorderItems(name: CollectionName, ids: string[]): Promise<void> {
  const items = await listAll(name);
  const pos = new Map(ids.map((id, i) => [id, i + 1]));
  await writeJson(name, items.map((i) => ({ ...i, order: pos.get(i.id) ?? i.order })));
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const items = await listAll("messages");
  await writeJson("messages", items.map((m) => (m.id === id ? { ...m, read } : m)));
}

export async function addMessage(
  m: Pick<CollectionMap["messages"], "name" | "email" | "phone" | "company" | "subject" | "budget" | "timeline" | "message">,
): Promise<void> {
  const items = await listAll("messages");
  const now = new Date().toISOString();
  const item = { ...m, id: randomUUID(), published: true, order: items.length + 1, updatedAt: now, createdAt: now, read: false };
  await writeJson("messages", [...items, item]);
}
