import type { AboutContent } from "@/content/about";

/** Night-surface contrast block: what AI accelerates vs. what stays a human decision. */
export function AiRole({ c }: { c: AboutContent["ai"] }) {
  const columns = [
    { title: c.helpsTitle, items: c.helps },
    { title: c.ownTitle, items: c.owns },
  ] as const;
  return (
    <section className="night on-night" aria-labelledby="ai-title">
      <div className="container-page section">
        <p className="eyebrow mb-6"><span className="tabular text-night-ink">06</span> — {c.eyebrow}</p>
        <h2 id="ai-title" className="h1 max-w-[18ch]">
          {c.title} <span className="display-serif text-accent">{c.accent}</span>
        </h2>
        <p className="mt-8 max-w-[52ch] text-lg text-night-mute">{c.lede}</p>
        <div className="mt-16 grid gap-px bg-night-line md:grid-cols-2">
          {columns.map((col, idx) => (
            <div key={col.title} className="bg-night py-2 md:py-0 md:pr-10 md:[&:nth-child(2)]:pl-10">
              <h3 className="mono flex items-center gap-3 border-b border-night-line pb-4 pt-6 text-xs uppercase tracking-wider text-night-mute">
                <span className={"size-2 rounded-full " + (idx === 0 ? "bg-night-mute" : "bg-accent")} aria-hidden />
                {col.title}
              </h3>
              <ul>
                {col.items.map((item) => (
                  <li key={item} className="border-b border-night-line py-4 text-night-ink">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
