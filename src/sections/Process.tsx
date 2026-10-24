import { SectionHead } from "@/components/Ui";
import { getSettings } from "@/lib/db";
import { toFa } from "@/lib/format";

export async function Process({ title, text }: { title?: string; text?: string }) {
  const s = await getSettings();
  if (!s.process.length) return null;
  return (
    <section className="sec" id="process">
      <div className="wrap">
        <SectionHead title={title} text={text} />
        <ol className="steps" style={{ gridTemplateColumns: `repeat(${Math.min(s.process.length, 4)}, 1fr)` }}>
          {s.process.map((p, i) => (
            <li key={i} className="step">
              <div className="step-n" aria-hidden="true">{toFa(i + 1)}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
