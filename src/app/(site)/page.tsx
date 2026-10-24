import type { Metadata } from "next";
import { ProductLanding } from "@/components/ProductLanding";
import { JsonLd } from "@/components/JsonLd";
import { getPublished, getSettings } from "@/lib/db";
import { pageMeta, webPageLd } from "@/lib/seo";
import { sortSuiteModules } from "@/lib/suite";
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMeta({ settings: s, path: "/", title: "Novi One | یک سازمان، یک فضای کاری", description: "پلتفرم ماژولار نووی‌سافت؛ انبار، هوش تجاری، مدیریت IT و تیکتینگ با هسته مشترک و انتخاب مستقل ماژول‌ها." });
}
export default async function Home() {
  const [s, products] = await Promise.all([getSettings(), getPublished("products")]);
  return <><JsonLd data={webPageLd(s, {name:"Novi One",description:s.description,path:"/"})}/><ProductLanding modules={sortSuiteModules(products)}/></>;
}
