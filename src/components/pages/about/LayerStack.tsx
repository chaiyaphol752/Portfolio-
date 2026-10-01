import type { Locale } from "@/i18n/config";
import { aboutContent } from "@/content/about";

/** The layers of a web product drawn as stacked strata, each one inset a little further. */
export function LayerStack({ locale }: { locale: Locale }) {
  const c = aboutContent[locale].path;
  return (
    <section className="border-t border-line bg-paper-2/60" aria-labelledby="layers-title">
      <div className="container-page section">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-5">{c.eyebrow}</p>
            <h2 id="layers-title" className="h2 max-w-[18ch]">{c.title}</h2>
          </div>
          <p className="body-copy lg:col-span-5 lg:col-start-8">{c.body}</p>
        </div>

        <ol className="mt-[clamp(2.5rem,5vw,4.5rem)]">
          {c.layers.map((layer, i) => (
            <li
              key={layer.title}
              className="relative border-t border-ink bg-paper py-5 pl-5 pr-5 sm:py-6 md:ml-[calc(var(--i)*3.5rem)]"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span aria-hidden className="absolute bottom-0 left-0 top-0 w-1 bg-accent" style={{ opacity: 0.25 + i * 0.18 }} />
              <div className="grid gap-2 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-10">
                <h3 className="h3">{layer.title}</h3>
                <p className="max-w-[60ch] text-ink-2">{layer.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
