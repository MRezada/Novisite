import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Ui";
import { getSettings } from "@/lib/db";
import { pageMeta } from "@/lib/seo";
import { Posts } from "@/sections/Posts";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMeta({ settings: s, path: "/insights", title: "یادداشت‌ها و مقالات", description: `یادداشت‌ها و تجربه‌های تیم ${s.nameFa} درباره طراحی و ساخت نرم‌افزار و محصول.` });
}

export default function InsightsPage() {
  return (
    <>
      <PageHero title="یادداشت‌ها و تجربه‌ها" lead="آنچه هنگام طراحی و ساختن نرم‌افزار یاد می‌گیریم." crumbs={[{ label: "یادداشت‌ها", href: "/insights" }]} />
      <Posts standalone />
      <CtaBand />
    </>
  );
}
