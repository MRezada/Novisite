import { SectionHead } from "@/components/Ui";
import { Icon } from "@/components/Icon";
import { getSettings } from "@/lib/db";

const dataStack = ["Data Warehouse", "ETL Pipeline", "KPI Dashboard", "Realtime Analytics", "Data Modeling", "AI / RAG", "PostgreSQL", "Reporting API"];

function MotionRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className={`tech-marquee${reverse ? " reverse" : ""}`} aria-hidden="true">
      <div className="tech-motion-track">
        {doubled.map((t, i) => <span key={`${t}-${i}`} className="ltr">{t}</span>)}
      </div>
    </div>
  );
}

export async function Tech({ title, text }: { title?: string; text?: string }) {
  const s = await getSettings();
  if (!s.tech.length) return null;
  return (
    <section className="sec sec-tint tech tech-motion" id="tech">
      <div className="wrap">
        <SectionHead title={title} text={text} />
        <div className="tech-motion-grid">
          <div className="tech-motion-card">
            <div className="tech-motion-head"><span><Icon name="code" /></span><div><b>مهندسی نرم‌افزار</b><small>Frontend · Backend · API · Infrastructure</small></div></div>
            <MotionRow items={s.tech} />
          </div>
          <div className="tech-motion-card bi">
            <div className="tech-motion-head"><span><Icon name="chart" /></span><div><b>هوش تجاری و داده</b><small>Data · BI · Analytics · AI</small></div></div>
            <MotionRow items={dataStack} reverse />
          </div>
        </div>
      </div>
    </section>
  );
}
