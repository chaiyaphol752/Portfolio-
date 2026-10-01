import { aiNativeContent } from "@/content/ai-native";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CtaBand } from "@/components/ui/CtaBand";
import { CircuitBoard } from "@/components/circuit/CircuitBoard";
import { Ecosystem } from "./Ecosystem";
import { HybridRouter } from "./HybridRouter";
import { AutonomousLoop } from "./AutonomousLoop";
import { AgentSystem } from "./AgentSystem";
import { SystemsCatalog } from "./SystemsCatalog";
import { ReadKey } from "./ReadKey";
import { FlowDiagram } from "./FlowDiagram";
import { circuit } from "@/components/circuit/circuit-data";

const workflowIds = ["lead-form", "scheduled", "ai-business"] as const;

function SectionHead({ id, eyebrow, title, lede, dark }: { id: string; eyebrow: string; title: string; lede: string; dark?: boolean }) {
  return (
    <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h2 id={id} className="h2">{title}</h2>
      </div>
      <p className={"max-w-[48ch] lg:col-span-5 " + (dark ? "text-night-mute" : "text-ink-2")}>{lede}</p>
    </div>
  );
}

export function AiNativeView({ locale }: { locale: Locale }) {
  const c = aiNativeContent[locale];
  return (
    <>
      <section aria-labelledby="ai-title" className="on-night night grid-night">
        <div className="container-page pt-[clamp(3.5rem,8vw,7rem)] pb-[clamp(3rem,6vw,5rem)]">
          <p className="eyebrow rise mb-8">{c.hero.eyebrow}</p>
          <h1 id="ai-title" className="rise max-w-[18ch] text-[clamp(2.6rem,7vw,6.75rem)] font-medium leading-[0.95] tracking-[-0.04em]" style={{ "--d": 1 } as React.CSSProperties}>
            {c.hero.titleA} <span className="display-serif text-accent">{c.hero.titleB}</span>
          </h1>
          <div className="rise mt-10 grid gap-8 lg:grid-cols-12 lg:items-end" style={{ "--d": 2 } as React.CSSProperties}>
            <p className="max-w-[52ch] text-lg text-night-mute lg:col-span-6">{c.hero.lede}</p>
            <div className="flex flex-wrap gap-3 lg:col-span-6 lg:justify-end">
              <ButtonLink href={localizedPath(locale, "contact")}>{c.hero.ctaPrimary}</ButtonLink>
              <ButtonLink href="#agents-title" variant="ghost">{c.hero.ctaSecondary}</ButtonLink>
            </div>
          </div>
        </div>

        <div className="container-page pb-[clamp(4rem,8vw,7rem)]">
          <div className="mb-6 grid gap-3 border-t border-night-line pt-6 lg:grid-cols-12">
            <h2 className="text-xl font-medium tracking-tight lg:col-span-4">{c.hero.boardHeading}</h2>
            <p className="max-w-[64ch] text-sm text-night-mute lg:col-span-8">{c.hero.boardBody}</p>
          </div>
          <ReadKey copy={c.key} />
          <CircuitBoard locale={locale} />
        </div>
      </section>

      <section aria-labelledby="eco-title" className="container-page section">
        <SectionHead id="eco-title" eyebrow={c.ecosystem.eyebrow} title={c.ecosystem.title} lede={c.ecosystem.lede} />
        <Ecosystem copy={c.ecosystem} />
      </section>

      <section aria-labelledby="hybrid-title" className="on-night night">
        <div className="container-page section">
          <SectionHead id="hybrid-title" eyebrow={c.hybrid.eyebrow} title={c.hybrid.title} lede={c.hybrid.lede} dark />
          <HybridRouter copy={c.hybrid} />
        </div>
      </section>

      <section aria-labelledby="automation-title" className="container-page section">
        <SectionHead id="automation-title" eyebrow={c.automation.eyebrow} title={c.automation.title} lede={c.automation.lede} />
        <p className="mono mb-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-line py-3 text-[0.72rem] text-ink-2">
          <span className="rounded-full border border-accent-ink px-2.5 py-0.5 uppercase tracking-wider text-accent-ink">{c.automation.badge}</span>
          <span>{c.automation.honesty}</span>
        </p>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h3 className="h3">{c.automation.productionTitle}</h3>
            <p className="mt-2 text-sm text-ink-2">{c.automation.productionBody}</p>
          </div>
          <div className="min-w-0 lg:col-span-9">
            <FlowDiagram steps={circuit.flows.production} locale={locale} parallelLabel={c.automation.parallel} dark={false} emphasis={["n8n", "approval-when-required"]} />
          </div>
        </div>

        <h3 className="eyebrow mt-16 mb-6">{c.automation.workflowsTitle}</h3>
        <ul className="border-t border-ink">
          {workflowIds.map((id) => (
            <li key={id} className="grid gap-4 border-b border-line py-6 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="font-medium">{c.automation.workflows[id].title}</p>
                <p className="mt-1 text-sm text-ink-2">{c.automation.workflows[id].body}</p>
              </div>
              <div className="min-w-0 lg:col-span-9">
                <FlowDiagram steps={circuit.flows[id]} locale={locale} parallelLabel={c.automation.parallel} dark={false} emphasis={["n8n", "n8n-trigger"]} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="auto-title" className="bg-paper-2">
        <div className="container-page section">
          <SectionHead id="auto-title" eyebrow={c.autonomy.eyebrow} title={c.autonomy.title} lede={c.autonomy.lede} />
          <AutonomousLoop copy={c.autonomy} />
        </div>
      </section>

      <section aria-labelledby="agents-title" className="on-night night">
        <div className="container-page section">
          <SectionHead id="agents-title" eyebrow={c.agents.eyebrow} title={c.agents.title} lede={c.agents.lede} dark />
          <AgentSystem copy={c.agents} locale={locale} />
          <div className="mt-10 grid gap-4 border-t border-night-line pt-8 lg:grid-cols-12">
            <p className="text-xl font-medium tracking-tight lg:col-span-4">{c.agents.proofTitle}</p>
            <p className="max-w-[70ch] text-night-mute lg:col-span-8">{c.agents.proofBody}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="catalog-title" className="container-page section">
        <SectionHead id="catalog-title" eyebrow={c.catalog.eyebrow} title={c.catalog.title} lede={c.catalog.lede} />
        <SystemsCatalog copy={c.catalog} />
      </section>

      <CtaBand locale={locale} title={c.cta.title} body={c.cta.body} label={c.cta.label} />
    </>
  );
}
