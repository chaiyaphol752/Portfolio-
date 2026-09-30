import type { AboutContent } from "@/content/about";

export function Workflow({ c }: { c: AboutContent["workflow"] }) {
  return (
    <section className="container-page pb-[clamp(4rem,9vw,8.5rem)]" aria-labelledby="workflow-title">
      <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6"><span className="tabular text-ink">04</span> — {c.eyebrow}</p>
          <h2 id="workflow-title" className="h1">{c.title}</h2>
        </div>
        <p className="body-copy lg:col-span-4 lg:col-start-9">{c.intro}</p>
      </div>
      <ol className="grid border-t border-ink md:grid-cols-2 xl:grid-cols-4">
        {c.items.map((item, i) => (
          <li key={item.title} className="flex flex-col border-b border-line py-7 md:pr-8 xl:border-b-0 xl:border-r xl:px-7 xl:first:pl-0 xl:last:border-r-0">
            <span className="mono tabular text-xs text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="h3 mt-4 text-[1.35rem]">{item.title}</h3>
            <p className="body-copy mt-3 flex-1 text-[0.95rem]">{item.text}</p>
            <p className="mt-6 border-t border-line pt-4 text-sm">
              <span className="eyebrow block">{c.outcomeLabel}</span>
              <span className="mt-1 block text-ink">{item.outcome}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
