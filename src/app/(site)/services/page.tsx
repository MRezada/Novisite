import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Ui";
import { getSettings } from "@/lib/db";
import { pageMeta } from "@/lib/seo";
import { Services } from "@/sections/Services";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMeta({ settings: s, path: "/services", title: "خدمات توسعه نرم‌افزار", description: `خدمات ${s.nameFa}: توسعه نرم‌افزار سفارشی، طراحی وب‌اپلیکیشن، اپلیکیشن موبایل، طراحی رابط کاربری، هوش مصنوعی و پشتیبانی.` });
}

export default function ServicesPage() {
  return (
    <>
      <PageHero title="خدمات توسعه نرم‌افزار" lead="از تحلیل و طراحی تا توسعه، انتشار و پشتیبانی؛ همه‌ی مراحل ساخت نرم‌افزار را در یک تیم انجام می‌دهیم." crumbs={[{ label: "خدمات", href: "/services" }]} />
      <Services standalone />
      <div style={{ height: "clamp(72px, 9vw, 124px)" }} />
      <CtaBand />
    </>
  );
}
