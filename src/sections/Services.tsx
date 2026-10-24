import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/Ui";
import { getPublished } from "@/lib/db";

export async function Services({ title, text, standalone = false }: { title?: string; text?: string; standalone?: boolean }) {
  const services = await getPublished("services");
  if (!services.length) return null;
  return (
    <section className={`sec${standalone ? "" : " sec-tint"}`} id="services">
      <div className="wrap">
        {!standalone && <SectionHead title={title} text={text} action={{ label: "همه خدمات", href: "/services" }} />}
        <div className="svc-grid">
          {services.map((s) => (
            <article key={s.slug} className="svc">
              <div className="ico"><Icon name={s.icon} /></div>
              <h3><Link href={`/services/${s.slug}`}>{s.title}</Link></h3>
              <p>{s.summary}</p>
              <ul>{s.points.map((x) => <li key={x} className="tag">{x}</li>)}</ul>
              <Link href={`/services/${s.slug}`} className="more">اطلاعات بیشتر <Icon name="arrow" /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
