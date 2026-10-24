import { FloatingContact } from "@/components/FloatingContact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getPublished, getSettings } from "@/lib/db";
import { organizationLd, websiteLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, products, services] = await Promise.all([getSettings(), getPublished("products"), getPublished("services")]);
  return (
    <>
      <JsonLd data={[organizationLd(s), websiteLd(s)]} />
      <a href="#main" className="skip-link">پرش به محتوا</a>
      <Header nav={s.nav} logo={s.logo} name={s.nameFa} />
      <main id="main">{children}</main>
      <Footer settings={s} products={products} services={services} />
      <FloatingContact whatsapp={s.whatsapp} telegram={s.telegram} phone={s.phone} />
    </>
  );
}
