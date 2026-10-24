import { getSettings } from "@/lib/db";

export async function Stats() {
  const s = await getSettings();
  if (!s.stats.length) return null;
  return (
    <section className="stats" aria-label="آمار">
      <div className="wrap">
        <dl className="stats-grid">
          {s.stats.map((x, i) => (
            <div key={i}><dd>{x.value}</dd><dt>{x.label}</dt></div>
          ))}
        </dl>
      </div>
    </section>
  );
}
