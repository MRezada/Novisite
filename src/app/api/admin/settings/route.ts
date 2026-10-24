import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { guard, refreshSite } from "../guard";

export async function GET(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true, settings: await getSettings() });
}

export async function PUT(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "داده نامعتبر است." }, { status: 400 }); }
  const settings = await saveSettings(body);
  refreshSite();
  return NextResponse.json({ ok: true, settings });
}
