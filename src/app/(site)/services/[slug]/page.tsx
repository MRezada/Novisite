import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/Ui";
import { getPublished, getSettings } from "@/lib/db";
import { extractHeadings, Markdown } from "@/lib/markdown";
import { faqLd, pageMeta, serviceLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublished("services")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [s, services] = await Promise.all([getSettings(), getPublished("services")]);
  const v = services.find((x) => x.slug === slug);
  if (!v) return {};
  return pageMeta({ settings: s, path: `/services/${v.slug}`, title: v.seoTitle || v.title, description: v.seoDescription || v.summary, modifiedTime: v.updatedAt });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [s, services, projects] = await Promise.all([getSettings(), getPublished("services"), getPublished("projects")]);
  const v = services.find((x) => x.slug === slug);
  if (!v) notFound();
  const toc = extractHeadings(v.body);
  const others = services.filter((x) => x.slug !== v.slug);

  return (
    <>
      <JsonLd data={[serviceLd(s, v), ...(v.faq.length ? [faqLd(v.faq)] : [])]} />
      <PageHero title={v.title} lead={v.summary} crumbs={[{ label: "خدمات", href: "/services" }, { label: v.title, href: `/services/${v.slug}` }]}>
        <div className="service-hero-points">{v.points.map((x) => <span className="tag" key={x}>{x}</span>)}</div>
        <div className="hero-actions" style={{ opacity: 1, animation: "none", marginTop: 24 }}>
          <Link href="/contact?subject=project" className="btn btn-dark">بررسی پروژه شما <Icon name="arrow" /></Link>
          <Link href="/projects" className="btn btn-line">دیدن پروژه‌ها</Link>
        </div>
      </PageHero>
      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap detail">
          <article>
            <Markdown source={v.body} />
            {v.faq.length > 0 && (
              <section style={{ marginTop: 56 }}>
                <h2 className="h-sm">پرسش‌های متداول</h2>
                {v.faq.map((f, i) => <details key={i}><summary>{f.q}<Icon name="plus" /></summary><p>{f.a}</p></details>)}
              </section>
            )}
          </article>
          <aside className="facts">
            {toc.length > 1 && (
              <div><dt>در این صفحه</dt><dd className="toc">{toc.map((h) => <a key={h.id} href={`#${h.id}`}>{h.text}</a>)}</dd></div>
            )}
            {v.points.length > 0 && <div><dt>شامل</dt><dd>{v.points.map((x) => <span key={x} className="tag">{x}</span>)}</dd></div>}
            {others.length > 0 && <div><dt>خدمات دیگر</dt><dd className="toc">{others.map((o) => <Link key={o.slug} href={`/services/${o.slug}`}>{o.title}</Link>)}</dd></div>}
          </aside>
        </div>
      </section>
      {projects.length > 0 && (
        <section className="sec sec-tint related-work">
          <div className="wrap">
            <div className="related-head"><div><span className="eyebrow">نمونه خروجی</span><h2>چند نمونه از پروژه‌های منتخب</h2></div><Link href="/projects" className="btn btn-line btn-sm">همه پروژه‌ها <Icon name="arrow" /></Link></div>
            <div className="related-grid">
              {projects.slice(0, 3).map((p) => (
                <Link href={`/projects/${p.slug}`} className="related-card" key={p.slug}>
                  <span className="tag">{p.category}</span><h3 className="ltr">{p.title}</h3><p>{p.summary}</p>
                  {p.metrics[0] && <strong>{p.metrics[0].value} <small>{p.metrics[0].label}</small></strong>}
                  <span className="more">مطالعه کیس‌استادی <Icon name="arrow" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand title={`برای ${v.title} آماده‌اید؟`} text="مسئله، وضعیت فعلی و هدف پروژه را بنویسید؛ برای قدم بعدی یک مسیر روشن پیشنهاد می‌کنیم." />
    </>
  );
}
