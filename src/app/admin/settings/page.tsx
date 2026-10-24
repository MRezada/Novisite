import { isAdmin } from "@/lib/auth";
import { SettingsEditor } from "@/admin/SettingsEditor";
import { getSettings } from "@/lib/db";

export default async function AdminSettings() {
  if (!(await isAdmin())) return null; // دفاع دوم؛ لایه‌ی اصلی در layout است
  const s = await getSettings();
  return <SettingsEditor initial={s as unknown as Record<string, unknown>} />;
}
