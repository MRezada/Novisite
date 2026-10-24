import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Ui";
import { getSettings } from "@/lib/db";
import { pageMeta } from "@/lib/seo";
import { Projects } from "@/sections/Projects";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMeta({ settings: s, path: "/projects", title: "نمونه کارها و پروژه‌ها", description: `پروژه‌های نرم‌افزاری که ${s.nameFa} برای مشتریان طراحی و پیاده‌سازی کرده است.` });
}

export default function ProjectsPage() {
  return (
    <>
      <PageHero title="پروژه‌هایی که ساخته‌ایم" lead="از داشبورد مالی تا فروشگاه اینترنتی؛ هر پروژه یک مسئله‌ی واقعی و نتیجه‌ای قابل‌اندازه‌گیری داشته است." crumbs={[{ label: "پروژه‌ها", href: "/projects" }]} />
      <Projects standalone />
      <CtaBand />
    </>
  );
}
