import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/Ui";
import { getPublished } from "@/lib/db";
import { faDate, readingMinutes, toFa } from "@/lib/format";

export async function Posts({ title, text, standalone = false, limit }: { title?: string; text?: string; standalone?: boolean; limit?: number }) {
  const all = [...(await getPublished("posts"))].sort((a, b) => b.date.localeCompare(a.date));
  const posts = limit ? all.slice(0, limit) : all;
  if (!posts.length) return null;
  return (
    <section className="sec" id="posts">
      <div className="wrap">
        {!standalone && <SectionHead title={title} text={text} action={{ label: "همه یادداشت‌ها", href: "/insights" }} />}
        <div className="plist">
          {posts.map((p) => (
            <Link key={p.slug} href={`/insights/${p.slug}`} className="post">
              <span className="tag" style={{ justifySelf: "start" }}>{p.tag}</span>
              <h3>{p.title}</h3>
              <span className="meta dot-row"><span>{faDate(p.date)}</span><span>{toFa(readingMinutes(p.body))} دقیقه</span></span>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
