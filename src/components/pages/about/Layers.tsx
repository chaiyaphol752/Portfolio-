import type { AboutContent } from "@/content/about";

/** Vertical timeline of conceptual skill layers (no dates: nothing here claims a career history). */
export function Layers({ c }: { c: AboutContent["layers"] }) {
  return (
    <section className="border-y border-line bg-paper-2" aria-labelledby="layers-title">
      <div className="container-page section grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow mb-6"><span className="tabular text-ink">02</span> — {c.eyebrow}</p>
            <h2 id="layers-title" className="h2">{c.title}</h2>
            <p className="body-copy mt-6">{c.intro}</p>
          </div>
        </div>
        <ol className="ml-2 border-l border-ink lg:col-span-7 lg:col-start-6">
          {c.items.map((item, i) => {
            const last = i === c.items.length - 1;
            return (
              <li key={item.title} className="relative pb-12 pl-8 last:pb-0 sm:pl-10">
                <span
                  aria-hidden
                  className={"absolute -left-[6px] top-1.5 size-[11px] rounded-full border border-ink " + (last ? "bg-accent border-accent" : "bg-paper-2")}
                />
                <p className="eyebrow tabular">{c.tag} {String(i + 1).padStart(2, "0")}</p>
                <h3 className="h3 mt-2 text-[1.5rem]">{item.title}</h3>
                <p className="body-copy mt-3">{item.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
