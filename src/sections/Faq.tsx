import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { getPublished } from "@/lib/db";
import { faqLd } from "@/lib/seo";

export async function Faq({ title, text }: { title?: string; text?: string }) {
  const faq = await getPublished("faq");
  if (!faq.length) return null;
  return (
    <section className="sec sec-tint" id="faq">
      <JsonLd data={faqLd(faq)} />
      <div className="wrap faq-grid">
        <div className="sec-head">
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <div>
          {faq.map((f) => (
            <details key={f.id}>
              <summary>{f.q}<Icon name="plus" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
