import Link from "next/link";
import type { ReactNode } from "react";
import { getSettings } from "@/lib/db";
import { breadcrumbLd } from "@/lib/seo";
import { statusLabel } from "@/lib/status";
import type { ProductStatus } from "@/lib/types";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";

export function SectionHead({ title, text, action }: { title: ReactNode; text?: ReactNode; action?: { label: string; href: string } }) {
  return (
    <div className="sec-head">
      <h2>{title}</h2>
      {(text || action) && (
        <div>
          {text && <p>{text}</p>}
          {action && <Link href={action.href} className="btn btn-line btn-sm" style={{ marginTop: 18 }}>{action.label} <Icon name="arrow" /></Link>}
        </div>
      )}
    </div>
  );
}

export function StatusChip({ status }: { status: ProductStatus }) {
  return <span className={`chip chip-${status}`}><i />{statusLabel[status]}</span>;
}

export type Crumb = { label: string; href: string };

export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const s = await getSettings();
  return (
    <>
      <JsonLd data={breadcrumbLd(s, [{ name: s.nameFa, path: "/" }, ...items.map((c) => ({ name: c.label, path: c.href }))])} />
      <nav className="crumbs" aria-label="مسیر صفحه">
        <Link href="/">خانه</Link>
        {items.map((c, i) => (
          <span key={c.href} style={{ display: "contents" }}>
            <span aria-hidden="true">/</span>
            {i < items.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </span>
        ))}
      </nav>
    </>
  );
}

export function PageHero({ title, lead, crumbs, children }: { title: ReactNode; lead?: ReactNode; crumbs?: Crumb[]; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export async function CtaBand({ title, text }: { title?: string; text?: string }) {
  const s = await getSettings();
  return (
    <section className="cta-wrap">
      <div className="wrap">
        <div className="cta">
          <h2>{title ?? s.ctaTitle}</h2>
          <p>{text ?? s.ctaText}</p>
          <div className="cta-actions">
            <Link href="/contact" className="btn btn-white">شروع گفتگو <Icon name="arrow" /></Link>
            {s.email && <a href={`mailto:${s.email}`} className="mail ltr">{s.email}</a>}
          </div>
        </div>
      </div>
    </section>
  );
}
