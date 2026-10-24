import { assetPath } from "@/lib/asset-path";
import { SectionHead } from "@/components/Ui";
import { getPublished } from "@/lib/db";

export async function Clients({ title, text }: { title?: string; text?: string }) {
  const clients = await getPublished("clients");
  if (!clients.length) return null;
  return (
    <section className="sec" id="clients">
      <div className="wrap">
        <SectionHead title={title} text={text} />
        <ul className="clients">
          {clients.map((c) => (
            <li key={c.id}>
              {c.logo ? <img src={assetPath(c.logo)} alt={c.name} loading="lazy" /> : <span>{c.name}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
