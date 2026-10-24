export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { collections } from "@/admin/schema";
import { listAll, removeItem, reorderItems, setMessageRead, upsertItem } from "@/lib/db";
import type { CollectionName } from "@/lib/types";
import { guard, refreshSite } from "../guard";

type Ctx = { params: Promise<{ collection: string }> };
type Editable = keyof typeof collections;

const isEditable = (n: string): n is Editable => n in collections;
const isName = (n: string): n is CollectionName => isEditable(n) || n === "messages";
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function GET(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  const { collection } = await params;
  if (!isName(collection)) return fail("مجموعه پیدا نشد.", 404);
  return NextResponse.json({ ok: true, items: await listAll(collection) });
}

export async function POST(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  const { collection } = await params;
  if (!isName(collection)) return fail("مجموعه پیدا نشد.", 404);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return fail("داده نامعتبر است."); }

  const action = new URL(req.url).searchParams.get("action");
  if (action === "reorder") {
    if (!Array.isArray(body.ids)) return fail("داده نامعتبر است.");
    await reorderItems(collection, body.ids.map(String));
    refreshSite();
    return NextResponse.json({ ok: true, items: await listAll(collection) });
  }
  if (collection === "messages") {
    await setMessageRead(String(body.id ?? ""), body.read === true);
    return NextResponse.json({ ok: true, items: await listAll(collection) });
  }
  const result = await upsertItem(collection, body);
  if (result.error) return fail(result.error, 422);
  refreshSite();
  return NextResponse.json({ ok: true, item: result.item, items: await listAll(collection) });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  const { collection } = await params;
  if (!isName(collection)) return fail("مجموعه پیدا نشد.", 404);
  const id = new URL(req.url).searchParams.get("id") ?? "";
  await removeItem(collection, id);
  refreshSite();
  return NextResponse.json({ ok: true, items: await listAll(collection) });
}
