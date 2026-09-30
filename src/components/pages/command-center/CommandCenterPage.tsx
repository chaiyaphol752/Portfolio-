import type { Locale } from "@/i18n/config";
import { common } from "@/content/common";
import { commandCenterContent } from "@/content/command-center";
import { buildTerminalContext } from "@/lib/terminal/context";
import { getRepoFacts } from "@/lib/terminal/repo-facts";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageFooterNav } from "@/components/ui/PageFooterNav";
import { Terminal } from "./Terminal";
import { PaletteHint } from "./PaletteHint";
import { HealthWidget } from "./HealthWidget";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { LocaleTable } from "./LocaleTable";

export function CommandCenterPage({ locale }: { locale: Locale }) {
  const c = commandCenterContent[locale];
  const t = common[locale];
  const facts = getRepoFacts();
  const factItems = [
    { label: c.facts.items.pages, value: facts.pages },
    { label: c.facts.items.languages, value: facts.languages },
    { label: c.facts.items.routes, value: facts.routes },
    ...(facts.contentModules !== null ? [{ label: c.facts.items.content, value: facts.contentModules }] : []),
    ...(facts.apiEndpoints !== null ? [{ label: c.facts.items.api, value: facts.apiEndpoints }] : []),
  ];

  return (
    <>
      <PageHero
        number={9}
        eyebrow={c.hero.eyebrow}
        complexityLabel={c.hero.complexity}
        title={
          <>
            {c.hero.title.lead} <span className="display-serif">{c.hero.title.accent}</span>
          </>
        }
        lede={c.hero.lede}
      />

      <section className="night on-night" aria-labelledby="terminal-title">
        <div className="container-page section">
          <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-4">{c.terminal.eyebrow}</p>
              <h2 id="terminal-title" className="h1">{c.terminal.title}</h2>
            </div>
            <p className="max-w-[52ch] text-night-mute lg:col-span-5">{c.terminal.body}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Terminal
                ctx={buildTerminalContext(locale)}
                copy={{
                  label: c.terminal.label,
                  logLabel: c.terminal.logLabel,
                  badge: c.terminal.badge,
                  prompt: c.terminal.prompt,
                  placeholder: c.terminal.placeholder,
                  submit: c.terminal.submit,
                  quick: c.terminal.quick,
                  intro: c.terminal.intro,
                }}
              />
            </div>
            <div className="lg:col-span-4">
              <HealthWidget copy={c.health} rawHref="/api/health" />
            </div>
            <div className="lg:col-span-12">
              <PaletteHint {...c.palette} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="architecture-title">
        <div className="container-page">
          <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-4">{c.architecture.eyebrow}</p>
              <h2 id="architecture-title" className="h1">{c.architecture.title}</h2>
            </div>
            <p className="lede lg:col-span-4">{c.architecture.lede}</p>
          </div>
          <ArchitectureDiagram copy={c.architecture} />

          <div className="mt-20">
            <h3 className="h2 max-w-[22ch]">{c.facts.title}</h3>
            <p className="body-copy mt-3">{c.facts.lede}</p>
            <dl className="mt-8 grid grid-cols-2 border-t border-ink sm:grid-cols-3 lg:grid-cols-5">
              {factItems.map((f) => (
                <div key={f.label} className="border-b border-line py-6 pr-4 sm:border-b-0">
                  <dd className="display tabular !text-[clamp(2.5rem,5vw,4.5rem)]">{f.value}</dd>
                  <dt className="eyebrow mt-2">{f.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="pb-[clamp(4rem,9vw,8.5rem)]" aria-labelledby="overview-title">
        <div className="container-page">
          <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow mb-4">{c.overview.eyebrow}</p>
              <h2 id="overview-title" className="h1">{c.overview.title}</h2>
            </div>
            <p className="lede lg:col-span-4">{c.overview.lede}</p>
          </div>
          <LocaleTable copy={c.overview} />
        </div>
      </section>

      <CtaBand locale={locale} label={t.cta.startConversation} />
      <PageFooterNav locale={locale} current="command-center" />
    </>
  );
}
