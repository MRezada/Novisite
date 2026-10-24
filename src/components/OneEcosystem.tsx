import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "./Icon";
import { suiteVisuals } from "@/lib/suite";
import type { Product } from "@/lib/types";
import styles from "./OneEcosystem.module.css";

const colors = ["#59bcff", "#b4a0ff", "#72dcc1", "#ffbc86"];

export function OneEcosystem({ modules }: { modules: Product[] }) {
  return (
    <div className={styles.scene}>
      <div className={styles.toolbar}>
        <span><i /> CONNECTED ECOSYSTEM</span>
      </div>
      <div className={styles.space}>
        <div className={styles.binary} aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <span key={i} style={{ "--i": i } as CSSProperties}>01001 10110 00101 11010</span>)}</div>
        <div className={styles.radar} aria-hidden="true" />
        <div className={styles.ring} aria-hidden="true" />
        <div className={styles.innerRing} aria-hidden="true" />
        <div className={styles.core}>
          <span className={styles.mark}>n<span>o</span></span>
          <b>Novi One</b><small>ONE CONNECTED WORKSPACE</small>
          <span className={styles.coreSignal} aria-hidden="true"><i /><i /><i /><i /><i /></span>
        </div>
        <div className={styles.orbit}>
          {modules.slice(0, 4).map((m, i) => {
            const visual = suiteVisuals[m.slug as keyof typeof suiteVisuals];
            return <div className={styles.position} key={m.slug} style={{ "--phase": `${-i * 18}s`, "--angle": `${i * 90}deg`, "--color": colors[i] } as CSSProperties}>
              <Link className={styles.product} href={`/products/${m.slug}`}>
                <span className={styles.productIcon}><Icon name={visual?.icon || "layers"} /></span>
                <span><b>{visual?.shortLabel || m.nameFa}</b><small>{m.name}</small></span>
                <i className={styles.status} aria-hidden="true" />
              </Link>
            </div>;
          })}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.chart} aria-hidden="true"><span>DATA FLOW</span><div>{[35, 62, 45, 80, 55, 95, 70, 100, 65, 85, 75, 100].map((height, i) => <i key={i} style={{ height: `${height}%`, "--i": i } as CSSProperties} />)}</div></div>
        <p><i /> یک حساب سازمانی، یک تجربه یکپارچه</p>
      </div>
    </div>
  );
}
