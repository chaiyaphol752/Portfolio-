import type { AboutContent } from "@/content/about";

export function Balance({ c }: { c: AboutContent["balance"] }) {
  const columns = [
    { title: c.fastTitle, items: c.fast },
    { title: c.slowTitle, items: c.slow },
  ];
  return (
    <section className="container-page section" aria-labelledby="balance-title">
      <p className="eyebrow mb-6"><span className="tabular text-ink">07</span> — {c.eyebrow}</p>
      <h2 id="balance-title" className="h1 max-w-[20ch]">{c.title}</h2>
      <div className="mt-14 grid gap-12 md:grid-cols-2">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="h3 border-b border-ink pb-3">{col.title}</h3>
            <ul>
              {col.items.map((item) => (
                <li key={item} className="border-b border-line py-3.5 text-ink-2">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="display-serif mt-16 max-w-[34ch] text-[clamp(1.5rem,3vw,2.4rem)] leading-tight">{c.closing}</p>
    </section>
  );
}
