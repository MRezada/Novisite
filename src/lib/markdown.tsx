import Link from "next/link";
import type { ReactNode } from "react";
import { slugifyHeading } from "./format";
import { safeUrl } from "./sanitize";

/** مارک‌داون ساده و امن (بدون HTML خام): عنوان، فهرست، نقل‌قول، پررنگ، کج، کد و لینک */

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  let last = 0;
  let i = 0;
  for (const match of text.matchAll(re)) {
    const idx = match.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const tok = match[0];
    const key = `${keyBase}-${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={key} className="ltr">{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("[")) {
      const m = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      const href = m ? safeUrl(m[2]) : "";
      if (m && href) {
        out.push(
          href.startsWith("/") || href.startsWith("#")
            ? <Link key={key} href={href}>{m[1]}</Link>
            : <a key={key} href={href} target="_blank" rel="noopener noreferrer">{m[1]}</a>,
        );
      } else out.push(tok);
    } else out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export type Heading = { id: string; text: string };

export function extractHeadings(md: string): Heading[] {
  return md.split("\n").filter((l) => l.startsWith("## ")).map((l) => {
    const text = l.slice(3).trim();
    return { id: slugifyHeading(text), text };
  });
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      nodes.push(<pre key={k++} className="ltr"><code>{code.join("\n")}</code></pre>);
    } else if (line.startsWith("### ")) {
      nodes.push(<h3 key={k++}>{inline(line.slice(4), `h${k}`)}</h3>);
      i++;
    } else if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      nodes.push(<h2 key={k++} id={slugifyHeading(text)}>{inline(text, `h${k}`)}</h2>);
      i++;
    } else if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) items.push(lines[i++].slice(2));
      nodes.push(<ul key={k++}>{items.map((t, n) => <li key={n}>{inline(t, `u${k}-${n}`)}</li>)}</ul>);
    } else if (/^\d+[.)] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)] /.test(lines[i])) items.push(lines[i++].replace(/^\d+[.)] /, ""));
      nodes.push(<ol key={k++}>{items.map((t, n) => <li key={n}>{inline(t, `o${k}-${n}`)}</li>)}</ol>);
    } else if (line.startsWith("> ")) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) q.push(lines[i++].slice(2));
      nodes.push(<blockquote key={k++}>{inline(q.join(" "), `q${k}`)}</blockquote>);
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(#{2,3} |[-*] |\d+[.)] |> |```)/.test(lines[i])) para.push(lines[i++]);
      nodes.push(<p key={k++}>{inline(para.join(" "), `p${k}`)}</p>);
    }
  }
  return <div className="md">{nodes}</div>;
}
