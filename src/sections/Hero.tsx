import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/Icon";
import { Showroom } from "@/components/Showroom";
import { getPublished, getSettings } from "@/lib/db";

const heroTech = ["Next.js", "React", "API", ".NET", "Python", "ETL", "KPI", "Realtime"];

export async function Hero() {
  const [s, products] = await Promise.all([getSettings(), getPublished("products")]);
  const lines = [s.heroLine1, s.heroLine2, s.heroLine3].filter(Boolean);
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          {s.announcementText && (
            <Link href={s.announcementHref || "/"} className="announce"><b>تازه</b>{s.announcementText}</Link>
          )}
          <h1>
            {lines.map((l, i) => (
              <span key={i} style={{ "--i": i } as CSSProperties}>
                <i>{l}</i>
              </span>
            ))}
          </h1>
          <p className="lead">{s.heroLead}</p>
          <div className="hero-actions">
            {s.heroCtaLabel && <Link href={s.heroCtaHref || "/products"} className="btn btn-dark">{s.heroCtaLabel} <Icon name="arrow" /></Link>}
            {s.heroCta2Label && <Link href={s.heroCta2Href || "/contact"} className="btn btn-line">{s.heroCta2Label}</Link>}
          </div>
          <ul className="hero-trust" aria-label="مزیت‌های همکاری">
            <li><Icon name="check" /> مالکیت شفاف سورس و مستندات</li>
            <li><Icon name="check" /> طراحی و توسعه در یک تیم</li>
            <li><Icon name="check" /> پشتیبانی و توسعه پس از انتشار</li>
          </ul>
        </div>

        <div className="hero-visual">
          <div className="hero-float hero-float-code" aria-hidden="true">
            <span className="hero-float-icon"><Icon name="code" /></span>
            <div><small>Software Engineering</small><b>API · React · .NET</b></div>
            <span className="hero-live-dot" />
          </div>

          <div className="hero-float hero-float-bi" aria-hidden="true">
            <span className="hero-float-icon"><Icon name="chart" /></span>
            <div><small>Business Intelligence</small><b>KPI & Live Analytics</b></div>
            <span className="hero-mini-bars"><i /><i /><i /><i /></span>
          </div>

          <Showroom products={products} logo={s.logo} />

          <div className="hero-tech-stream" aria-hidden="true">
            <div className="hero-tech-track">
              {[...heroTech, ...heroTech].map((t, i) => (
                <span key={`${t}-${i}`}><i />{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
