import type { AboutContent } from "@/content/about";

export function Mindset({ c }: { c: AboutContent["mindset"] }) {
  return (
    <section className="border-y border-ink" aria-labelledby="mindset-title">
      <div className="container-page section grid gap-12 lg:grid-cols-12">
        <p className="eyebrow lg:col-span-3"><span className="tabular text-ink">05</span> — {c.eyebrow}</p>
        <div className="lg:col-span-9">
          <h2 id="mindset-title" className="display-serif text-[clamp(1.9rem,4.6vw,4.1rem)] leading-[1.1] text-balance">
            “{c.quote}”
          </h2>
          <ul className="mt-14 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {c.points.map((p) => (
              <li key={p} className="flex gap-3 border-t border-line pt-4 text-ink-2">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
