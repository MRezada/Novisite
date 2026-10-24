import Link from "next/link";
import { Icon } from "./Icon";
import { suiteVisuals } from "@/lib/suite";
import type { Product } from "@/lib/types";

export function WorkspacePreview({ modules }: { modules: Product[] }) {
  return (
    <div className="workspace-preview" aria-label="نمونه پنل یکپارچه Novi One">
      <aside className="workspace-side">
        <div className="workspace-brand"><span><Icon name="layers" /></span><div><b>نووی‌سافت</b><small>Novi One</small></div></div>
        <div className="workspace-org"><small>فضای کاری</small><b>سازمان نمونه</b></div>
        <nav>
          <span className="on"><Icon name="layout" /> نمای کلی</span>
          <span><Icon name="users" /> کاربران و دسترسی</span>
          <span><Icon name="bell" /> اعلان‌ها</span>
          <span><Icon name="shield" /> گزارش فعالیت</span>
        </nav>
        <div className="workspace-user"><span>م</span><div><b>مدیر سیستم</b><small>Administrator</small></div></div>
      </aside>
      <div className="workspace-main">
        <header><div><span className="workspace-kicker">NOVISOFT · ENTERPRISE WORKSPACE</span><h3>فضای کاری سازمان</h3></div><div className="workspace-actions"><span><Icon name="search" /></span><span><Icon name="bell" /></span></div></header>
        <section className="workspace-welcome"><div><span className="workspace-pill"><i /> پلتفرم یکپارچه فعال است</span><h4>چه کاری می‌خواهید انجام دهید؟</h4><p>ماژول‌های فعال برای این سازمان از همین فضای کاری باز می‌شوند.</p></div><span className="workspace-orbit"><Icon name="layers" /></span></section>
        <div className="workspace-module-grid">
          {modules.map((m, i) => {
            const v = suiteVisuals[m.slug as keyof typeof suiteVisuals];
            const active = i < 3;
            return (
              <Link href={`/products/${m.slug}`} className={`workspace-module${active ? " active" : " locked"}`} key={m.slug}>
                <span className="workspace-module-icon"><Icon name={v?.icon || "layout"} /></span>
                <div><small>{v?.eyebrow}</small><b>{m.nameFa}</b><p>{v?.audience}</p></div>
                <span className="workspace-module-state">{active ? <>فعال <Icon name="arrow" /></> : <><Icon name="lock" /> قابل افزودن</>}</span>
              </Link>
            );
          })}
        </div>
        <footer><span><i /> اتصال امن به سرویس‌های سازمانی</span><span>یک حساب، چند ماژول</span></footer>
      </div>
    </div>
  );
}
