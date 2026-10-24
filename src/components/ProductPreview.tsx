import { assetPath } from "@/lib/asset-path";
import type { CSSProperties } from "react";
import { Icon } from "@/components/Icon";
import { suiteVisuals, type SuiteModuleSlug } from "@/lib/suite";
import { seeded } from "@/lib/utils";
import type { Product } from "@/lib/types";

function ModuleMockup({ product }: { product: Product }) {
  const slug = product.slug as SuiteModuleSlug;
  const visual = suiteVisuals[slug];
  const bars = seeded(product.slug, 10);

  if (!visual) return null;

  return (
    <div className={`module-mock module-mock-${slug}`}>
      <aside className="module-side">
        <div className="module-brand"><span className="module-brand-mark"><Icon name="layers" /></span><b>NoviSoft</b></div>
        <span className="module-workspace">فضای کاری سازمان</span>
        {["نمای کلی", visual.shortLabel, "گزارش‌ها", "تنظیمات"].map((x, i) => (
          <span key={x} className={`module-nav${i === 1 ? " on" : ""}`}><i />{x}</span>
        ))}
      </aside>
      <div className="module-main">
        <div className="module-top"><div><small>{visual.eyebrow}</small><strong>{product.nameFa}</strong></div><span className="module-avatar">N</span></div>
        <div className="module-kpis">
          {["وضعیت کل", "فعال", "در انتظار", "این ماه"].map((x, i) => (
            <div key={x}><small>{x}</small><strong>{["۱۲۸", "۹۸", "۱۸", "۳۲٪"][i]}</strong><span /></div>
          ))}
        </div>
        <div className="module-panels">
          <div className="module-chart-card">
            <div className="module-card-head"><b>روند عملکرد</b><small>۳۰ روز اخیر</small></div>
            <div className="module-chart-bars">{bars.map((h, i) => <i key={i} style={{ height: `${34 + h * .56}%` }} />)}</div>
          </div>
          <div className="module-list-card">
            <div className="module-card-head"><b>وضعیت</b><small>به‌روزرسانی زنده</small></div>
            {["عادی", "نیاز به بررسی", "تکمیل‌شده"].map((x, i) => <div className="module-list-row" key={x}><span><i className={`dot d${i}`} />{x}</span><b>{[64, 18, 46][i]}</b></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/** پیش‌نمایش محصول: اگر تصویر واقعی دارد همان را در قاب پنجره نشان می‌دهد، وگرنه یک موکاپ نزدیک به زبان بصری محصول می‌سازد. */
export function ProductPreview({ product }: { product: Product }) {
  const bars = seeded(product.slug, 14);
  const style = { "--a": product.accent || "#2467e8", "--b": product.accent2 || "#16b8d9" } as CSSProperties;
  const isSuite = product.slug in suiteVisuals;
  return (
    <div className="pv" style={style} aria-hidden={product.cover ? undefined : true}>
      <div className="pv-bar"><i /><i /><i /><span className="ltr">{product.name}</span></div>
      {product.cover ? (
        <img className="pv-shot" src={assetPath(product.cover)} alt={`نمایی از ${product.nameFa}`} loading="lazy" />
      ) : isSuite ? (
        <ModuleMockup product={product} />
      ) : (
        <div className="pv-body">
          <ul className="pv-side">
            {product.features.slice(0, 4).map((f, i) => (
              <li key={f.title + i} className={i === 0 ? "on" : ""}><b />{f.title}</li>
            ))}
          </ul>
          <div className="pv-main">
            <div className="pv-tiles">{[0, 1, 2].map((n) => <div key={n}><em /><strong /></div>)}</div>
            <div className="pv-chart">{bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
