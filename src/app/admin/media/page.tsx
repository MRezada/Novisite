import { isAdmin } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { MediaLibrary } from "@/admin/MediaLibrary";
import { UPLOAD_DIR } from "@/lib/db";

export default async function AdminMedia() {
  if (!(await isAdmin())) return null; // دفاع دوم؛ لایه‌ی اصلی در layout است
  let files: { name: string; url: string; size: number; mtime: number }[] = [];
  try {
    const names = await fs.readdir(UPLOAD_DIR);
    files = await Promise.all(names.map(async (n) => {
      const st = await fs.stat(path.join(UPLOAD_DIR, n));
      return { name: n, url: `/uploads/${n}`, size: st.size, mtime: st.mtimeMs };
    }));
    files.sort((a, b) => b.mtime - a.mtime);
  } catch { /* پوشه هنوز ساخته نشده */ }
  return <MediaLibrary initial={files} />;
}
