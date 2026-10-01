import type { Metadata } from "next";
import { clsx } from "clsx";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { capabilitiesContent } from "@/content/capabilities";
import { CtaBand } from "@/components/ui/CtaBand";
import { CapabilityNetwork } from "@/components/pages/capabilities/CapabilityNetwork";
import { Chains } from "@/components/pages/capabilities/Chains";
import { capabilityEdges, capabilityNodes, familyIds } from "@/components/pages/capabilities/data";
import { padClass } from "@/components/pages/capabilities/style";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = capabilitiesContent[locale].meta;
  return buildMetadata({ locale, slug: "capabilities", title, description });
}

export default async function CapabilitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = capabilitiesContent[locale];

  return (
    <>
      <header className="grid-paper border-b border-ink">
        <div className="container-page grid gap-12 pb-[clamp(3rem,6vw,5rem)] pt-[clamp(3rem,7vw,6rem)] lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow rise">{t.hero.eyebrow}</p>
            <h1 className="h1 rise mt-6" style={{ "--d": 1 } as React.CSSProperties}>
              <span className="block text-ink-3">{t.hero.title}</span>
              <span className="display-serif block text-accent-ink">{t.hero.titleAccent}</span>
            </h1>
            <p className="lede rise mt-8 max-w-[56ch]" style={{ "--d": 2 } as React.CSSProperties}>{t.hero.lede}</p>
          </div>
          <aside aria-label={t.hero.legendTitle} className="rise border border-ink bg-paper p-5 lg:col-span-4" style={{ "--d": 3 } as React.CSSProperties}>
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <p className="eyebrow">{t.hero.legendTitle}</p>
              <p className="mono tabular text-xs text-ink-2">
                {capabilityNodes.length} {t.hero.nodes} · {capabilityEdges.length} {t.hero.links}
              </p>
            </div>
            <ul className="mt-1">
              {familyIds.map((f) => (
                <li key={f} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-3 border-b border-line py-3 last:border-0">
                  <span aria-hidden className={clsx("size-2.5 translate-y-0.5", padClass[f])} />
                  <span>
                    <span className="block text-sm font-semibold">{t.families[f].label}</span>
                    <span className="block text-xs text-ink-3">{t.families[f].body}</span>
                  </span>
                  <span className="mono tabular text-xs text-ink-3">{capabilityNodes.filter((n) => n.family === f).length}</span>
                </li>
              ))}
            </ul>
            <p className="mono mt-3 border-t border-ink pt-3 text-[0.7rem] uppercase tracking-wider text-ink-2">{t.hero.noScores}</p>
          </aside>
        </div>
      </header>

      <section aria-labelledby="board-title" className="container-page py-[clamp(3rem,6vw,5rem)]">
        <h2 id="board-title" className="sr-only">{t.ui.boardLabel}</h2>
        <CapabilityNetwork t={t} />
      </section>

      <section aria-labelledby="chains-title" className="border-t border-line bg-paper-2">
        <div className="container-page section">
          <div className="mb-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="eyebrow mb-4">{t.chains.eyebrow}</p>
              <h2 id="chains-title" className="h2">{t.chains.title}</h2>
            </div>
            <p className="body-copy lg:col-span-5 lg:col-start-8 lg:self-end">{t.chains.body}</p>
          </div>
          <Chains t={t} />
        </div>
      </section>

      <CtaBand locale={locale} title={t.cta.title} label={t.cta.label} />
    </>
  );
}
