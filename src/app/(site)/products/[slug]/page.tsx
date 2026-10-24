import { assetPath } from "@/lib/asset-path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ProductPreview } from "@/components/ProductPreview";
import { BiShowcase } from "@/components/BiShowcase";
import { CtaBand, PageHero, StatusChip } from "@/components/Ui";
import { getPublished, getSettings } from "@/lib/db";
import { Markdown } from "@/lib/markdown";
import { pageMeta, productLd } from "@/lib/seo";
import { sharedPlatformFeatures, suiteVisuals } from "@/lib/suite";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublished("products")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [s, products] = await Promise.all([getSettings(), getPublished("products")]);
  const p = products.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta({
    settings: s, path: `/products/${p.slug}`,
    title: p.seoTitle || `${p.nameFa} (${p.name}) — ${p.tagline}`,
    description: p.seoDescription || p.description, image: p.cover, modifiedTime: p.updatedAt,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [s, products] = await Promise.all([getSettings(), getPublished("products")]);
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const others = products.filter((x) => x.slug !== p.slug);
  const visual = suiteVisuals[p.slug as keyof typeof suiteVisuals];

  return (
    <>
      <JsonLd data={productLd(s, p)} />
      <PageHero
        title={p.nameFa}
        lead={<><span className="product-latin ltr">{p.name}</span><strong className="lead-strong">{p.tagline}</strong>{p.description}</>}
        crumbs={[{ label: "پلتفرم سازمانی", href: "/products" }, { label: p.nameFa, href: `/products/${p.slug}` }]}
      >
        <div className="hero-actions product-hero-actions" style={{ opacity: 1, animation: "none", marginTop: 28 }}>
          {p.ctaLabel && <Link href={p.ctaHref || "/contact"} className="btn btn-dark">{p.ctaLabel} <Icon name="arrow" /></Link>}
          <Link href="/products#build-your-plan" className="btn btn-line">ترکیب با ماژول‌های دیگر</Link>
          <StatusChip status={p.status} />
        </div>
      </PageHero>

      <div className="wrap" style={{ "--a": p.accent, "--b": p.accent2 } as CSSProperties}>
        <div className="prow-vis big product-hero-shot"><ProductPreview product={p} /></div>
      </div>

      {p.slug === "business-intelligence" && <BiShowcase />}

      <section className="product-platform-note">
        <div className="wrap">
          <div className="product-platform-card">
            <span className="product-platform-icon"><Icon name={visual?.icon || "layers"} /></span>
            <div><small>این ماژول بخشی از Novi One است</small><h2>مستقل بخرید؛ روی هسته مشترک اجرا کنید.</h2><p>کاربران، نقش‌ها، اعلان‌ها، Audit Log و تنظیمات سازمان بین ماژول‌ها مشترک می‌مانند؛ بنابراین اضافه‌کردن ماژول بعدی به معنی ساخت یک سیستم جدا نیست.</p></div>
            <Link href="/products" className="btn btn-line btn-sm">معماری پلتفرم <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      <section className="sec product-detail-sec">
        <div className="wrap detail">
          <div>
            {p.longDescription && <section><Markdown source={p.longDescription} /></section>}
            <section>
              <h2>قابلیت‌های اصلی</h2>
              <ul className="fgrid product-feature-grid" style={{ marginTop: 20 }}>
                {p.features.map((f, i) => <li key={i}><span className="feature-no">{String(i + 1).padStart(2, "0")}</span><h3>{f.title}</h3><p>{f.text}</p></li>)}
              </ul>
            </section>
            {p.gallery.length > 0 && (
              <section>
                <h2>نمای محصول</h2>
                <div className="gallery product-gallery">{p.gallery.map((g) => <img key={g} src={assetPath(g)} alt={`تصویری از ${p.nameFa}`} loading="lazy" />)}</div>
              </section>
            )}
            <section>
              <h2>هسته مشترک پلتفرم</h2>
              <div className="product-shared-grid">
                {sharedPlatformFeatures.slice(0, 4).map((f) => <article key={f.title}><Icon name={f.icon} /><div><h3>{f.title}</h3><p>{f.text}</p></div></article>)}
              </div>
            </section>
          </div>
          <dl className="facts product-facts">
            <div><dt>مدل خرید</dt><dd>ماژول مستقل</dd></div>
            <div><dt>وضعیت</dt><dd>{p.status === "live" ? "آماده ارائه" : p.status === "beta" ? "نسخه بتا" : "در حال توسعه"}</dd></div>
            {p.version && <div><dt>نسخه</dt><dd>{p.version}</dd></div>}
            {p.price && <div><dt>قیمت‌گذاری</dt><dd>{p.price}</dd></div>}
            {p.category && <div><dt>حوزه</dt><dd>{p.category}</dd></div>}
            {p.platforms.length > 0 && <div><dt>پلتفرم</dt><dd>{p.platforms.map((x) => <span key={x} className="tag">{x}</span>)}</dd></div>}
            {p.stack.length > 0 && <div><dt>فناوری</dt><dd>{p.stack.map((x) => <span key={x} className="tag ltr">{x}</span>)}</dd></div>}
            <div className="facts-cta"><dt>قدم بعدی</dt><dd><Link href={p.ctaHref || "/contact?subject=suite-demo"} className="btn btn-dark btn-sm">درخواست دمو <Icon name="arrow" /></Link></dd></div>
          </dl>
        </div>
      </section>

      {others.length > 0 && (
        <section className="sec sec-tint">
          <div className="wrap">
            <div className="related-head"><div><span className="eyebrow">ماژول‌های دیگر</span><h2>همین فضای کاری را گسترش دهید.</h2></div><Link className="btn btn-line btn-sm" href="/products#build-your-plan">ساخت پلن</Link></div>
            <div className="plist">
              {others.map((o) => (
                <Link key={o.slug} href={`/products/${o.slug}`} className="pj" style={{ "--a": o.accent, "--b": o.accent2 } as CSSProperties}>
                  <span className="pj-sw" aria-hidden="true" />
                  <div><h3>{o.nameFa}</h3><p className="pj-sub ltr">{o.name}</p></div>
                  <p className="pj-s pj-sub">{o.tagline}</p>
                  <StatusChip status={o.status} />
                  <Icon name="arrow" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <div style={{ height: "clamp(72px, 9vw, 124px)" }} />
      <CtaBand title={`دموی ${p.nameFa} را روی سناریوی واقعی سازمان ببینید.`} text="درخواست دمو را با تعداد کاربران و فرایند فعلی بفرستید تا جلسه روی نیاز واقعی شما تنظیم شود." />
    </>
  );
}
