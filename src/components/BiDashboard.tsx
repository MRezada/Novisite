"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { toFa } from "@/lib/format";
import { CountUp } from "./CountUp";

type Metric = { label: string; value: string; delta: string };

const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const SETS = [
  { id: "sales", label: "فروش", unit: "میلیون تومان", line: [42, 48, 45, 58, 62, 60, 71, 78, 74, 86, 92, 104], bars: [62, 48, 80, 71, 90, 66, 84], donut: [46, 27, 17, 10], legend: ["وب", "موبایل", "فروشگاه", "سازمانی"] },
  { id: "users", label: "کاربران", unit: "هزار نفر", line: [30, 34, 41, 39, 52, 58, 55, 66, 72, 70, 85, 96], bars: [40, 58, 52, 74, 68, 88, 79], donut: [38, 31, 21, 10], legend: ["ارگانیک", "شبکه‌های اجتماعی", "ارجاع", "تبلیغات"] },
  { id: "perf", label: "عملکرد", unit: "امتیاز", line: [60, 58, 66, 70, 68, 76, 80, 79, 88, 91, 90, 98], bars: [72, 80, 76, 88, 84, 92, 90], donut: [52, 24, 14, 10], legend: ["سرعت", "پایداری", "امنیت", "دسترس‌پذیری"] },
];
const COLORS = ["var(--cyan)", "var(--blue)", "var(--violet)", "#e040c8"];
const W = 600, H = 320, PAD = 28, MAXV = 120, SIDE = 26;

function useTween(target: number[], ms = 900) {
  const [vals, setVals] = useState(target);
  const ref = useRef(target);
  const key = target.join(",");
  useEffect(() => {
    const from = (ref.current ?? target).slice();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { ref.current = target; setVals(target); return; }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      const cur = target.map((v, i) => (from[i] ?? v) + (v - (from[i] ?? v)) * e);
      ref.current = cur;
      setVals(cur);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ms]);
  return vals;
}

/** محور افقی راست‌به‌چپ: فروردین سمت راست */
const xAt = (i: number, n: number) => W - SIDE - (i * (W - SIDE * 2)) / (n - 1);
const yAt = (v: number) => H - PAD - (v / MAXV) * (H - PAD * 2);

function smooth(vals: number[]) {
  const pts = vals.map((v, i) => [xAt(i, vals.length), yAt(v)] as const);
  return pts.reduce((d, [x, y], i) => {
    if (!i) return `M${x.toFixed(1)},${y.toFixed(1)}`;
    const [px, py] = pts[i - 1];
    const mx = (px + x) / 2;
    return `${d} C${mx.toFixed(1)},${py.toFixed(1)} ${mx.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
  }, "");
}

/** داشبورد هوش تجاری تعاملی؛ شاخص‌ها، نمودار خطی زنده، ستونی و دونات با انیمیشن روان */
export function BiDashboard({ metrics }: { metrics: Metric[] }) {
  const [tab, setTab] = useState(0);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [live, setLive] = useState(SETS[0].line);
  const root = useRef<HTMLDivElement>(null);
  const set = SETS[tab];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => { setLive(SETS[tab].line); }, [tab]);

  // داده‌ی «زنده»: هر چند ثانیه یک نقطه‌ی تازه اضافه می‌شود
  useEffect(() => {
    if (!seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setLive((p) => [...p.slice(1), Math.max(24, Math.min(112, p[p.length - 1] + (Math.random() - 0.42) * 14))]);
    }, 2600);
    return () => clearInterval(t);
  }, [seen]);

  const zeros = (n: number) => Array.from({ length: n }, () => 0);
  const line = useTween(seen ? live : zeros(12), 1100);
  const bars = useTween(seen ? set.bars : zeros(7), 900);
  const donut = useTween(seen ? set.donut : zeros(4), 1000);

  const path = useMemo(() => smooth(line), [line]);
  const area = `${path} L${SIDE},${H - PAD} L${W - SIDE},${H - PAD} Z`;
  const total = donut.reduce((a, b) => a + b, 0) || 1;
  const C = 2 * Math.PI * 50;

  const onMove = (e: RPointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const k = 1 - (e.clientX - r.left) / r.width;
    setHover(Math.max(0, Math.min(11, Math.round(k * 11))));
  };

  let acc = 0;
  return (
    <div ref={root} className="bi" role="group" aria-label="نمونه‌ی داشبورد هوش تجاری">
      <div className="bi-top">
        <span className="bi-live"><i />زنده</span>
        <div className="bi-tabs" role="tablist">
          {SETS.map((s, i) => (
            <button key={s.id} role="tab" type="button" aria-selected={i === tab} className={i === tab ? "on" : ""} onClick={() => setTab(i)}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="bi-kpis">
        {metrics.map((m, i) => (
          <div key={i} className="bi-kpi" data-spotlight>
            <small>{m.label}</small>
            <strong><CountUp value={m.value} /></strong>
            {m.delta && <em className={m.delta.trim().startsWith("-") ? "down" : "up"}>{m.delta}</em>}
          </div>
        ))}
      </div>

      <div className="bi-grid">
        <div className="bi-card bi-line">
          <header><b>روند {set.label}</b><span>{set.unit}</span></header>
          <svg viewBox={`0 0 ${W} ${H}`} onPointerDown={onMove} onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label={`نمودار روند ${set.label}`}>
            <defs>
              <linearGradient id="bi-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--blue)" stopOpacity=".28" /><stop offset="1" stopColor="var(--blue)" stopOpacity="0" /></linearGradient>
              <linearGradient id="bi-stroke" x1="0" x2="1"><stop offset="0" stopColor="var(--cyan)" /><stop offset="1" stopColor="var(--violet)" /></linearGradient>
            </defs>
            {[0, 1, 2, 3].map((g) => <line key={g} x1="0" x2={W} y1={PAD + (g * (H - PAD * 2)) / 3} y2={PAD + (g * (H - PAD * 2)) / 3} className="bi-grid-l" />)}
            <path d={area} fill="url(#bi-fill)" />
            <path d={path} fill="none" stroke="url(#bi-stroke)" strokeWidth="3.5" strokeLinecap="round" />
            {hover !== null && (
              <g>
                <line x1={xAt(hover, 12)} x2={xAt(hover, 12)} y1={PAD - 8} y2={H - PAD} className="bi-cross" />
                <circle cx={xAt(hover, 12)} cy={yAt(line[hover])} r="6" className="bi-dot" />
                <g transform={`translate(${Math.min(Math.max(xAt(hover, 12), 70), W - 70)}, ${Math.max(yAt(line[hover]) - 46, 4)})`}>
                  <rect x="-62" width="124" height="34" rx="9" className="bi-tip" />
                  <text y="22" textAnchor="middle" className="bi-tip-t">{MONTHS[hover]}: {toFa(Math.round(line[hover]))}</text>
                </g>
              </g>
            )}
            {MONTHS.map((m, i) => (i % 2 === 0 ? <text key={m} x={xAt(i, 12)} y={H - 6} textAnchor="middle" className="bi-ax">{m}</text> : null))}
          </svg>
        </div>

        <div className="bi-card bi-donut">
          <header><b>سهم هر بخش</b></header>
          <div className="bi-donut-in">
            <svg viewBox="0 0 140 140" role="img" aria-label="نمودار دونات">
              <circle cx="70" cy="70" r="50" className="bi-ring" />
              {donut.map((v, i) => {
                const len = (v / total) * C;
                const off = -acc;
                acc += len;
                return <circle key={i} cx="70" cy="70" r="50" fill="none" stroke={COLORS[i]} strokeWidth="16" strokeDasharray={`${Math.max(len - 3, 0)} ${C}`} strokeDashoffset={off} transform="rotate(-90 70 70)" />;
              })}
              <text x="70" y="76" textAnchor="middle" className="bi-center">{toFa(Math.round(donut[0] || 0))}٪</text>
            </svg>
            <ul>{set.legend.map((l, i) => <li key={l}><i style={{ background: COLORS[i] }} />{l}</li>)}</ul>
          </div>
        </div>

        <div className="bi-card bi-bars">
          <header><b>عملکرد هفتگی</b><span>هفته‌ی جاری</span></header>
          <div className="bi-bars-in">
            {bars.map((v, i) => (
              <div key={i}><i style={{ height: `${v}%`, background: `linear-gradient(180deg, ${COLORS[i % 3]}, var(--blue))` }} /><span>{["ش", "ی", "د", "س", "چ", "پ", "ج"][i]}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
