import type { AboutContent } from "@/content/about";

export function Story({ c }: { c: AboutContent["story"] }) {
  return (
    <section className="container-page section grid gap-10 lg:grid-cols-12" aria-labelledby="story-title">
      <p className="eyebrow lg:col-span-3">
        <span className="tabular text-ink">01</span> — {c.eyebrow}
      </p>
      <div className="lg:col-span-9">
        <h2 id="story-title" className="display-serif text-[clamp(1.9rem,4.4vw,3.9rem)] leading-[1.08] text-balance">
          {c.statement}
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {c.paragraphs.map((p) => (
            <p key={p} className="body-copy">{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
