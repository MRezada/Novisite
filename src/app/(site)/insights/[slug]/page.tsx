import { assetPath } from "@/lib/asset-path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/Ui";
import { getPublished, getSettings } from "@/lib/db";
import { faDate, readingMinutes, toFa } from "@/lib/format";
import { extractHeadings, Markdown } from "@/lib/markdown";
import { articleLd, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublished("posts")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [s, posts] = await Promise.all([getSettings(), getPublished("posts")]);
  const p = posts.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta({ settings: s, path: `/insights/${p.slug}`, title: p.seoTitle || p.title, description: p.seoDescription || p.excerpt, image: p.cover, type: "article", publishedTime: p.date, modifiedTime: p.updatedAt });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [s, posts] = await Promise.all([getSettings(), getPublished("posts")]);
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const toc = extractHeadings(p.body);
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 2);

  return (
    <>
      <JsonLd data={articleLd(s, p)} />
      <PageHero
        title={p.title}
        lead={<span className="dot-row"><span>{p.tag}</span><time dateTime={p.date}>{faDate(p.date)}</time><span>{toFa(readingMinutes(p.body))} دقیقه مطالعه</span></span>}
        crumbs={[{ label: "یادداشت‌ها", href: "/insights" }, { label: p.title, href: `/insights/${p.slug}` }]}
      />
      <article className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap article">
          {p.cover && <img className="cover" src={assetPath(p.cover)} alt={p.title} width={1200} height={630} />}
          {p.excerpt && <p className="excerpt">{p.excerpt}</p>}
          {toc.length > 1 && (
            <nav className="toc-box" aria-label="فهرست مطالب">
              <strong>فهرست مطالب</strong>
              <ol>{toc.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
            </nav>
          )}
          <Markdown source={p.body} />
        </div>
      </article>
      {related.length > 0 && (
        <section className="sec sec-tint">
          <div className="wrap">
            <h2 className="h-sm">یادداشت‌های مرتبط</h2>
            <div className="plist">
              {related.map((r) => (
                <Link key={r.slug} href={`/insights/${r.slug}`} className="post"><span className="tag">{r.tag}</span><h3>{r.title}</h3><span className="meta">{faDate(r.date)}</span><span /></Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <div style={{ height: "clamp(72px, 9vw, 124px)" }} />
      <CtaBand />
    </>
  );
}
