import { assetPath } from "@/lib/asset-path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/Ui";
import { getPublished, getSettings } from "@/lib/db";
import { pageMeta, projectLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublished("projects")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [s, projects] = await Promise.all([getSettings(), getPublished("projects")]);
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta({ settings: s, path: `/projects/${p.slug}`, title: p.seoTitle || `${p.title} — پروژه ${p.category}`, description: p.seoDescription || p.summary, image: p.cover, modifiedTime: p.updatedAt });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [s, projects] = await Promise.all([getSettings(), getPublished("projects")]);
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];

  return (
    <div style={{ "--a": p.accent, "--b": p.accent2 } as CSSProperties}>
      <JsonLd data={projectLd(s, p)} />
      <PageHero title={<span className="ltr">{p.title}</span>} lead={p.summary} crumbs={[{ label: "پروژه‌ها", href: "/projects" }, { label: p.title, href: `/projects/${p.slug}` }]} />
      {p.cover && <div className="wrap"><img className="cover" src={assetPath(p.cover)} alt={p.title} width={1200} height={630} /></div>}
      {p.metrics.length > 0 && (
        <div className="wrap" style={{ marginTop: p.cover ? 24 : 0 }}>
          <div className="metrics">{p.metrics.map((m, i) => <div key={i}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div>
        </div>
      )}
      <section className="sec">
        <div className="wrap detail">
          <div>
            {p.challenge && <section className="prose"><h2>مسئله</h2><p>{p.challenge}</p></section>}
            {p.solution && <section className="prose"><h2>راه‌حل</h2><p>{p.solution}</p></section>}
            {p.quote && <figure className="quote big"><blockquote>{p.quote}</blockquote>{p.quoteAuthor && <figcaption><strong>{p.quoteAuthor}</strong></figcaption>}</figure>}
            {p.gallery.length > 0 && <section><h2>تصاویر</h2><div className="gallery">{p.gallery.map((g) => <img key={g} src={assetPath(g)} alt={`تصویری از ${p.title}`} loading="lazy" />)}</div></section>}
          </div>
          <dl className="facts">
            {p.client && <div><dt>مشتری</dt><dd>{p.client}</dd></div>}
            {p.category && <div><dt>حوزه</dt><dd>{p.category}</dd></div>}
            {p.year && <div><dt>سال</dt><dd>{p.year}</dd></div>}
            {p.status && <div><dt>وضعیت</dt><dd>{p.status}</dd></div>}
            {p.services.length > 0 && <div><dt>خدمات</dt><dd>{p.services.map((x) => <span key={x} className="tag">{x}</span>)}</dd></div>}
            {p.stack.length > 0 && <div><dt>فناوری</dt><dd>{p.stack.map((x) => <span key={x} className="tag ltr">{x}</span>)}</dd></div>}
            {p.website && <div><dt>وب‌سایت</dt><dd><a href={p.website} target="_blank" rel="noopener noreferrer" className="ltr">{p.website.replace(/^https?:\/\//, "")}</a></dd></div>}
          </dl>
        </div>
      </section>
      {next && next.slug !== p.slug && (
        <div className="wrap" style={{ marginBottom: "clamp(72px, 9vw, 124px)" }}>
          <Link href={`/projects/${next.slug}`} className="next-link"><span className="soft">پروژه‌ی بعدی</span><strong className="ltr">{next.title}</strong></Link>
        </div>
      )}
      <CtaBand text="اگر مسئله‌ای شبیه این دارید، تعریفش کنید تا با هم بررسی کنیم." />
    </div>
  );
}
