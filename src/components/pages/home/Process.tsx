import type { Locale } from "@/i18n/config";
import { homeContent } from "@/content/home";

/** Engagement steps on a single track; no numbers, the order is the track. */
export function Process({ locale }: { locale: Locale }) {
  const c = homeContent[locale].process;
  return (
    <section className="container-page section" aria-labelledby="process-title">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-5">{c.eyebrow}</p>
          <h2 id="process-title" className="h2 max-w-[14ch]">{c.title}</h2>
        </div>
        <ol className="grid gap-0 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <li key={s.title} className="relative border-t border-ink pb-8 pr-6 pt-6">
              <span aria-hidden className={"absolute -top-[5px] left-0 size-[9px] rounded-full " + (i === c.steps.length - 1 ? "bg-accent" : "border border-ink bg-paper")} />
              <h3 className="h3">{s.title}</h3>
              <p className="mt-3 text-[0.95rem] text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
