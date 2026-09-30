import type { AboutContent } from "@/content/about";

export function Principles({ c }: { c: AboutContent["principles"] }) {
  return (
    <section className="container-page section" aria-labelledby="principles-title">
      <div className="mb-12 grid gap-6 lg:grid-cols-12">
        <p className="eyebrow lg:col-span-3"><span className="tabular text-ink">03</span> — {c.eyebrow}</p>
        <h2 id="principles-title" className="h1 lg:col-span-9">{c.title}</h2>
      </div>
      <ol className="border-t border-ink">
        {c.items.map((item, i) => (
          <li key={item.title} className="grid gap-3 border-b border-line py-7 md:grid-cols-12 md:gap-6 md:py-9">
            <span className="mono tabular text-xs text-ink-3 md:col-span-1 md:pt-2">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-2xl font-medium leading-tight tracking-tight md:col-span-5 md:text-[1.9rem]">{item.title}</h3>
            <p className="body-copy md:col-span-5 md:col-start-8">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
