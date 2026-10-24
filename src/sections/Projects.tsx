import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/Ui";
import { getPublished } from "@/lib/db";

export async function Projects({ title, text, standalone = false }: { title?: string; text?: string; standalone?: boolean }) {
  const projects = await getPublished("projects");
  if (!projects.length) return null;
  return (
    <section className="sec" id="projects">
      <div className="wrap">
        {!standalone && <SectionHead title={title} text={text} action={{ label: "همه پروژه‌ها", href: "/projects" }} />}
        <div className="plist project-list">
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="pj" style={{ "--a": p.accent, "--b": p.accent2 } as CSSProperties}>
              {p.cover ? <img className="pj-sw pj-img" src={assetPath(p.cover)} alt="" loading="lazy" /> : <span className="pj-sw" aria-hidden="true" />}
              <div>
                <h3 className="ltr">{p.title}</h3>
                <p className="pj-sub dot-row"><span>{p.category}</span><span>{p.year}</span></p>
              </div>
              <p className="pj-s pj-sub">{p.summary}</p>
              {p.metrics[0] && <div className="pj-m"><strong>{p.metrics[0].value}</strong><span>{p.metrics[0].label}</span></div>}
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
