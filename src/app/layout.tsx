import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import "./one.css";
import "./mobile.css";
import { getSettings } from "@/lib/db";
import { absUrl, pageMeta } from "@/lib/seo";
import { assetPath } from "@/lib/asset-path";

const vazir = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazir", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    ...pageMeta({ settings: s, path: "/" }),
    metadataBase: new URL(absUrl(s, "/")),
    title: { default: `${s.nameFa} | ${s.tagline}`, template: `%s | ${s.nameFa}` },
    applicationName: s.nameFa,
    icons: { icon: assetPath(s.logo || "/novisoft-logo.png"), apple: assetPath("/icon-192.png") },
    manifest: assetPath("/manifest.webmanifest"),
    verification: s.googleVerification ? { google: s.googleVerification } : undefined,
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = { themeColor: "#f6f8fc", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const s = await getSettings();
  const theme = `:root{--blue:${s.colorBlue};--cyan:${s.colorCyan};--violet:${s.colorViolet}}`;
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <head><style dangerouslySetInnerHTML={{ __html: theme }} /></head>
      <body>
        {children}
        {s.gaId && /^[A-Za-z0-9-]+$/.test(s.gaId) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${s.gaId}`} strategy="afterInteractive" />
            <Script id="novisoft-ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${s.gaId}');`}</Script>
          </>
        )}
      </body>
    </html>
  );
}
