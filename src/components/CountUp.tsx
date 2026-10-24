"use client";

import { useEffect, useRef, useState } from "react";
import { parseNum } from "@/lib/format";

const RE = /^(\D*?)([\d۰-۹٠-٩][\d۰-۹٠-٩,٬.٫]*)(.*)$/;

/** عدد شمارنده‌ی متحرک: هنگام دیده شدن از صفر تا مقدار نهایی می‌شمارد (متن نهایی در HTML سرور هست). */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const m = RE.exec(value.trim());
    const el = ref.current;
    if (!m || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = parseNum(m[2]);
    if (!Number.isFinite(target)) return;
    const dec = (m[2].split(/[.٫]/)[1] ?? "").length;
    const group = /[,٬]/.test(m[2]);
    const fmt = new Intl.NumberFormat("fa-IR", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: group });
    const render = (n: number) => `${m[1]}${fmt.format(n)}${m[3]}`;
    setText(render(0));
    let raf = 0;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / duration);
        setText(render(target * (1 - Math.pow(1 - k, 4))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);

  return <span ref={ref}>{text}</span>;
}
