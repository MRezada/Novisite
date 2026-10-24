import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/Icon";
import { ProductPreview } from "@/components/ProductPreview";
import { SectionHead, StatusChip } from "@/components/Ui";
import { getPublished } from "@/lib/db";
import { sortSuiteModules, suiteVisuals } from "@/lib/suite";
import type { Product } from "@/lib/types";

export function ProductRow({ product: p }: { product: Product }) {
  const visual = suiteVisuals[p.slug as keyof typeof suiteVisuals];
  return (
    <article className="suite-card" style={{ "--a": p.accent, "--b": p.accent2 } as CSSProperties}>
      <div className="suite-card-top">
        <span className="suite-card-icon"><Icon name={visual?.icon || "layout"} /></span>
        <StatusChip status={p.status} />
      </div>
      <div className="suite-card-copy">
        <span className="suite-eyebrow ltr">{visual?.eyebrow || p.category}</span>
        <h3><Link href={`/products/${p.slug}`}>{p.nameFa}</Link></h3>
        <p className="suite-card-tag">{p.tagline}</p>
        <p className="suite-card-desc">{p.description}</p>
      </div>
      <div className="suite-card-preview"><ProductPreview product={p} /></div>
      <ul className="suite-mini-features">
        {(visual?.bullets || p.features.map((f) => f.title)).slice(0, 3).map((f) => <li key={f}><Icon name="check" />{f}</li>)}
      </ul>
      <div className="suite-card-actions">
        <Link href={`/products/${p.slug}`} className="btn btn-white">جزئیات ماژول <Icon name="arrow" /></Link>
        <Link href={p.ctaHref || "/contact?subject=suite-demo"} className="suite-text-link">درخواست دمو</Link>
      </div>
    </article>
  );
}

export async function Products({ title, text, standalone = false }: { title?: string; text?: string; standalone?: boolean }) {
  const products = sortSuiteModules(await getPublished("products"));
  if (!products.length) return null;
  return (
    <section className={`sec suite-section${standalone ? " suite-standalone" : ""}`} id="products">
      <div className="wrap">
        {!standalone && <SectionHead title={title} text={text} action={{ label: "دیدن معماری پلتفرم", href: "/products" }} />}
        {!standalone && (
          <div className="suite-core-strip">
            <div><span className="suite-core-mark"><Icon name="layers" /></span><div><b>Novi One</b><small>هسته مشترک پلتفرم</small></div></div>
            <span><Icon name="users" /> کاربر و نقش مشترک</span>
            <span><Icon name="bell" /> اعلان مشترک</span>
            <span><Icon name="shield" /> امنیت و Audit</span>
            <span><Icon name="plug" /> API و یکپارچه‌سازی</span>
          </div>
        )}
        <div className="suite-grid">
          {products.map((p) => <ProductRow key={p.slug} product={p} />)}
        </div>
        {!standalone && (
          <div className="suite-after">
            <p><strong>مدل محصول:</strong> هر ماژول مستقل خریداری می‌شود؛ اما ورود، کاربران، دسترسی‌ها و زیرساخت پایه بین همه مشترک است.</p>
            <Link href="/products#build-your-plan" className="btn btn-dark">پلن خودتان را بسازید <Icon name="arrow" /></Link>
          </div>
        )}
      </div>
    </section>
  );
}
