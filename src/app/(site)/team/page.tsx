import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Ui";
import { getSettings } from "@/lib/db";
import { pageMeta } from "@/lib/seo";
import { Team } from "@/sections/Team";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMeta({ settings: s, path: "/team", title: "تیم", description: `آشنایی با تیم ${s.nameFa}؛ طراحان و مهندسانی که مستقیم با شما کار می‌کنند.` });
}

export default function TeamPage() {
  return (
    <>
      <PageHero title="تیم نووی‌سافت" lead="گروهی کوچک از طراح و مهندس که مستقیم با شما کار می‌کنند؛ بدون لایه‌های مدیریتی اضافه." crumbs={[{ label: "تیم", href: "/team" }]} />
      <Team standalone />
      <CtaBand title="دوست دارید با ما کار کنید؟" text="اگر طراح یا مهندس هستید و به ساختن نرم‌افزار علاقه دارید، برایمان بنویسید." />
    </>
  );
}
