import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import type { Product, Service, Settings } from "@/lib/types";

export function Footer({ settings: s, products, services }: { settings: Settings; products: Product[]; services: Service[] }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand">{s.logo && <img src={assetPath(s.logo)} alt="" width={46} height={40} />}<span>{s.nameFa}</span></Link>
            <p>{s.footerText}</p>
            <ul className="footer-social">
              {s.social.map((x) => <li key={x.href}><a href={x.href} target="_blank" rel="noopener noreferrer me">{x.label}</a></li>)}
            </ul>
          </div>
          <div>
            <h4>خدمات</h4>
            <ul>{services.slice(0, 6).map((x) => <li key={x.slug}><Link href={`/services/${x.slug}`}>{x.title}</Link></li>)}</ul>
          </div>
          <div>
            <h4>محصولات</h4>
            <ul>{products.map((p) => <li key={p.slug}><Link href={`/products/${p.slug}`}>{p.nameFa} <span className="ltr">({p.name})</span></Link></li>)}</ul>
          </div>
          <div>
            <h4>شرکت</h4>
            <ul>
              <li><Link href="/projects">پروژه‌ها</Link></li>
              <li><Link href="/about">درباره ما</Link></li>
              <li><Link href="/team">تیم</Link></li>
              <li><Link href="/insights">یادداشت‌ها</Link></li>
              <li><Link href="/contact">تماس با ما</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().toLocaleDateString("fa-IR-u-ca-persian", { year: "numeric" })} {s.nameFa}. تمامی حقوق محفوظ است.</span>
          <span className="footer-meta">
            {s.email && <a href={`mailto:${s.email}`} className="ltr">{s.email}</a>}
            {s.phone && <a href={`tel:${s.phone}`} className="ltr">{s.phone}</a>}
            {s.city && <span>{s.city}</span>}
            <a href={assetPath("/feed.xml")}>RSS</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
