export const dynamic = 'force-dynamic';
import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_DIR } from "@/lib/db";

const MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml", avif: "image/avif",
};

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const m = /^[a-z0-9]+\.(png|jpg|webp|gif|svg|avif)$/.exec(name);
  if (!m) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(UPLOAD_DIR, name));
    const headers: Record<string, string> = {
      "Content-Type": MIME[m[1]],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    };
    if (m[1] === "svg") headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";
    return new Response(buf as unknown as BodyInit, { headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
