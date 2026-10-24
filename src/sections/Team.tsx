import { assetPath } from "@/lib/asset-path";
import { SectionHead } from "@/components/Ui";
import { getPublished } from "@/lib/db";

export async function Team({ title, text, standalone = false }: { title?: string; text?: string; standalone?: boolean }) {
  const team = await getPublished("team");
  if (!team.length) return null;
  return (
    <section className={`sec${standalone ? "" : " sec-tint"}`} id="team">
      <div className="wrap">
        {!standalone && <SectionHead title={title} text={text} action={{ label: "آشنایی با تیم", href: "/team" }} />}
        <div className="team-grid">
          {team.map((m) => (
            <article key={m.id} className="mem">
              {m.photo ? <img className="av av-img" src={assetPath(m.photo)} alt={m.name} loading="lazy" /> : <div className="av" aria-hidden="true">{m.name.trim().charAt(0)}</div>}
              <h3>{m.link ? <a href={m.link} target="_blank" rel="noopener noreferrer">{m.name}</a> : m.name}</h3>
              <p className="role">{m.role}</p>
              <p>{m.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
