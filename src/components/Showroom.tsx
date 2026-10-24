"use client";
import { assetPath } from "@/lib/asset-path";


import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import type { Product } from "@/lib/types";
import { Icon } from "./Icon";
import { ProductPreview } from "./ProductPreview";

/** ویترین چرخان محصولات در هیرو؛ با هاور یا فوکوس متوقف می‌شود. */
export function Showroom({ products, logo }: { products: Product[]; logo: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!motion || paused || products.length < 2) return;
    const t = setTimeout(() => setI((n) => (n + 1) % products.length), 6000);
    return () => clearTimeout(t);
  }, [i, paused, motion, products.length]);

  const p = products[i];
  if (!p) {
    return <div className="stage stage-logo">{logo && <img src={assetPath(logo)} alt="" width={220} height={190} />}</div>;
  }

  return (
    <div
      className="stage"
      data-paused={paused}
      style={{ "--a": p.accent, "--b": p.accent2 } as CSSProperties}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="tabs" role="tablist" aria-label="محصولات">
        {products.map((x, n) => (
          <button key={x.slug} role="tab" type="button" aria-selected={n === i} className={`tab${motion ? " run" : ""}`} onClick={() => setI(n)}>
            <span className="ltr">{x.name}</span>
          </button>
        ))}
      </div>
      <div key={p.slug} className="pv-swap"><ProductPreview product={p} /></div>
      <div className="stage-cap">
        <p>{p.tagline}</p>
        <Link href={`/products/${p.slug}`} className="btn btn-white btn-sm">مشاهده محصول <Icon name="arrow" /></Link>
      </div>
    </div>
  );
}
