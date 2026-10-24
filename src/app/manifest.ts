import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/db";
import { assetPath } from "@/lib/asset-path";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  return {
    name: s.nameFa, short_name: s.nameFa, description: s.description, lang: "fa", dir: "rtl",
    start_url: assetPath("/"), display: "standalone", background_color: "#f6f8fc", theme_color: s.colorBlue,
    icons: [{ src: assetPath("/icon-192.png"), sizes: "192x192", type: "image/png" }, { src: assetPath("/icon-512.png"), sizes: "512x512", type: "image/png" }],
  };
}
