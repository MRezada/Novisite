import type { Metadata } from "next";
import { ProductLanding } from "@/components/ProductLanding";
import { JsonLd } from "@/components/JsonLd";
import { getPublished, getSettings } from "@/lib/db";
import { itemListLd, pageMeta } from "@/lib/seo";
import { sortSuiteModules } from "@/lib/suite";
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMeta({settings:s,path:"/products",title:"ماژول‌های Novi One | ترکیب مناسب سازمان شما"});
}
export default async function ProductsPage() {
  const [s, products] = await Promise.all([getSettings(),getPublished("products")]);
  const modules = sortSuiteModules(products);
  return <><JsonLd data={itemListLd(s,"ماژول‌های Novi One",modules.map(m=>({name:m.nameFa,path:`/products/${m.slug}`})))}/><ProductLanding modules={modules} catalog/></>;
}
