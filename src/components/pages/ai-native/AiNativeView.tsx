import { aiNativeContent } from "@/content/ai-native";
import type { Locale } from "@/i18n/config";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageFooterNav } from "@/components/ui/PageFooterNav";
import { Flow } from "@/components/pages/case-studies/Diagram";
import { WorkflowExplorer } from "./WorkflowExplorer";

const pad = (n: number) => String(n).padStart(2, "0");

export function AiNativeView({ locale }: { locale: Locale }) {
  const c = aiNativeContent[locale];
  const lastPractice = c.practices.items.length - 1;

  return (
    <>
      <PageHero
        number={6}
        eyebrow={c.hero.eyebrow}
        title={
          <>
            {c.hero.titleLead} <span className="display-serif">{c.hero.titleEmph}</span>
          </>
        }
        lede={c.hero.lede}
        complexityLabel={c.hero.complexityLabel}
      />

      {/* Definition */}
      <section aria-labelledby="definition-title" className="container-page pb-[clamp(4rem,8vw,7rem)]">
        <div className="grid gap-12 border-t border-ink pt-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">{c.definition.eyebrow}</p>
            <h2 id="definition-title" className="h2">{c.definition.title}</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-xl leading-snug text-ink-2 sm:text-2xl" style={{ textWrap: "pretty" }}>{c.definition.body}</p>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-x-10">
              {[
                { key: "is", data: c.definition.is, mark: "bg-signal" },
                { key: "isNot", data: c.definition.isNot, mark: "bg-accent" },
              ].map(({ key, data, mark }) => (
                <div key={key}>
                  <h3 className="eyebrow mb-4 flex items-center gap-2 border-b border-ink pb-3 text-ink">
                    <span aria-hidden className={`size-2 rounded-full ${mark}`} />
                    {data.title}
                  </h3>
                  <ul className="space-y-3">
                    {data.items.map((item) => (
                      <li key={item} className="flex gap-3 text-ink-2">
                        <span aria-hidden className="mt-[0.85em] h-px w-3 shrink-0 bg-ink-3" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow explorer */}
      <section aria-labelledby="workflow-title" className="night on-night">
        <div className="container-page section">
          <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-5">{c.explorer.eyebrow}</p>
              <h2 id="workflow-title" className="h1">{c.explorer.title}</h2>
            </div>
            <p className="max-w-[40ch] text-night-mute lg:col-span-4">{c.explorer.intro}</p>
          </div>
          <WorkflowExplorer content={c} />
        </div>
      </section>

      {/* Idea to production */}
      <section aria-labelledby="chain-title" className="container-page section">
        <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">{c.chain.eyebrow}</p>
            <h2 id="chain-title" className="h1">{c.chain.title}</h2>
          </div>
          <p className="body-copy lg:col-span-5">{c.chain.intro}</p>
        </div>
        <figure aria-label={c.chain.diagramTitle}>
          <Flow nodes={c.chain.steps} tone="paper" columns={4} />
          <figcaption className="mono mt-8 border-t border-line pt-4 text-xs text-ink-3">{c.chain.footnote}</figcaption>
        </figure>
      </section>

      {/* Practices */}
      <section aria-labelledby="practices-title" className="container-page pb-[clamp(4rem,9vw,8rem)]">
        <div className="grid gap-12 border-t border-ink pt-10 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="eyebrow mb-5">{c.practices.eyebrow}</p>
              <h2 id="practices-title" className="h2">{c.practices.title}</h2>
              <p className="body-copy mt-5">{c.practices.intro}</p>
            </div>
          </div>
          <ol className="lg:col-span-8">
            {c.practices.items.map((item, i) => {
              const isRule = i === lastPractice;
              return (
                <li
                  key={item.name}
                  className={
                    "grid gap-x-8 gap-y-1 border-b py-6 sm:grid-cols-[2.5rem_minmax(0,14rem)_1fr] " +
                    (isRule ? "border-ink bg-paper-2 px-4 sm:px-6" : "border-line")
                  }
                >
                  <span className="mono tabular text-xs text-ink-3 sm:pt-1.5">{pad(i + 1)}</span>
                  <h3 className={"font-medium " + (isRule ? "text-accent-ink" : "")}>{item.name}</h3>
                  <p className="text-ink-2 max-sm:col-span-1 sm:col-start-3">{item.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* What it means for a client */}
      <section aria-labelledby="clients-title" className="container-page pb-[clamp(4rem,9vw,8rem)]">
        <p className="eyebrow mb-5">{c.clients.eyebrow}</p>
        <h2 id="clients-title" className="h1 mb-12 max-w-[16ch]">{c.clients.title}</h2>
        <ul className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {c.clients.items.map((item, i) => (
            <li key={item.title} className="border-b border-line py-7 sm:pr-8 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0">
              <p className="mono tabular text-xs text-accent-ink">{pad(i + 1)}</p>
              <h3 className="h3 mt-3">{item.title}</h3>
              <p className="mt-3 text-ink-2">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand locale={locale} label={c.cta.label} title={c.cta.title} />
      <PageFooterNav locale={locale} current="ai-native" />
    </>
  );
}
