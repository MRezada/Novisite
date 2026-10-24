/** نمودار متحرک مسیر داده: منابع ← ETL ← انبار داده ← داشبورد (SVG خالص با ذرات داده‌ی در حال حرکت) */
const PATHS = [
  "M785,70 C705,70 715,170 675,170",
  "M785,170 L675,170",
  "M785,270 C705,270 715,170 675,170",
  "M525,170 L435,170",
  "M285,170 L205,170",
];

function Dot({ d, begin, color }: { d: string; begin: number; color: string }) {
  return (
    <circle r="5.5" fill={color} className="pl-dot">
      <animateMotion dur="2.8s" begin={`${begin}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
    </circle>
  );
}

export function DataPipeline() {
  return (
    <svg className="pl" viewBox="0 0 1000 340" role="img" aria-label="مسیر داده از منابع تا داشبورد">
      <defs>
        <linearGradient id="pl-g" x1="0" x2="1"><stop offset="0" stopColor="var(--cyan)" /><stop offset="1" stopColor="var(--violet)" /></linearGradient>
      </defs>
      {PATHS.map((d) => <path key={d} d={d} className="pl-line" />)}
      {PATHS.map((d, i) => (
        <g key={`d${i}`}>
          <Dot d={d} begin={i * 0.35} color="var(--cyan)" />
          <Dot d={d} begin={i * 0.35 + 1.4} color="var(--violet)" />
        </g>
      ))}

      {[["پایگاه‌داده", 70], ["API", 170], ["اکسل و فایل", 270]].map(([t, y]) => (
        <g key={t as string} className="pl-node" style={{ animationDelay: `${Number(y) / 100}s` }}>
          <rect x="785" y={Number(y) - 28} width="150" height="56" rx="16" />
          <text x="860" y={Number(y) + 6} textAnchor="middle">{t}</text>
        </g>
      ))}
      <g className="pl-node pl-big" style={{ animationDelay: ".4s" }}>
        <rect x="525" y="120" width="150" height="100" rx="20" />
        <text x="600" y="162" textAnchor="middle" className="pl-t1">ETL</text>
        <text x="600" y="190" textAnchor="middle" className="pl-t2">پاک‌سازی و تبدیل</text>
      </g>
      <g className="pl-node pl-big" style={{ animationDelay: ".8s" }}>
        <rect x="285" y="120" width="150" height="100" rx="20" />
        <ellipse cx="360" cy="146" rx="26" ry="8" className="pl-ico" />
        <path d="M334,146v30c0,4.5 11.6,8 26,8s26-3.5 26-8v-30" className="pl-ico" fill="none" />
        <text x="360" y="208" textAnchor="middle" className="pl-t2">انبار داده</text>
      </g>
      <g className="pl-node pl-big pl-final" style={{ animationDelay: "1.2s" }}>
        <rect x="35" y="105" width="170" height="130" rx="22" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={60 + i * 26} y={190 - [24, 44, 32, 58, 40][i]} width="16" height={[24, 44, 32, 58, 40][i]} rx="4" className="pl-bar" style={{ animationDelay: `${1.4 + i * 0.12}s` }} />)}
        <text x="120" y="222" textAnchor="middle" className="pl-t2">داشبورد</text>
      </g>
    </svg>
  );
}
