import { SectionHead } from "@/components/Ui";
import { getPublished } from "@/lib/db";

export async function Testimonials({ title, text }: { title?: string; text?: string }) {
  const items = await getPublished("testimonials");
  if (!items.length) return null;
  return (
    <section className="sec sec-tint" id="testimonials">
      <div className="wrap">
        <SectionHead title={title} text={text} />
        <div className="quotes">
          {items.map((t) => (
            <figure key={t.id} className="quote">
              <blockquote>{t.quote}</blockquote>
              <figcaption><strong>{t.author}</strong><span>{[t.role, t.company].filter(Boolean).join("، ")}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
