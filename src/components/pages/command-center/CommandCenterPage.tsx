import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import type { Locale } from "@/i18n/config";
import { locales, localeMeta } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { pages } from "@/config/pages";
import { profile } from "@/config/profile";
import { common } from "@/content/common";
import { commandCenterContent } from "@/content/command-center";
import circuit from "@/generated/ai-circuit.json";
import { buildTerminalContext } from "@/lib/terminal/context";
import { getRepoFacts } from "@/lib/terminal/repo-facts";
import { capabilityGroups, loopSteps } from "@/lib/terminal/data";
import { CtaBand } from "@/components/ui/CtaBand";
import { HealthProvider } from "./HealthProvider";
import { ChannelList, DeploymentPanel, EmailPanel, RepositoryPanel, StatusPanel } from "./LivePanels";
import { ConsoleTabs } from "./ConsoleTabs";
import { Chips, Note, Panel, Rows, type PanelSource } from "./Panel";
import { PaletteButton } from "./PaletteButton";
import { Terminal } from "./Terminal";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import styles from "./console.module.css";

const repoLabel = profile.sourceRepo.replace(/^https:\/\/github\.com\//, "");

export function CommandCenterPage({ locale }: { locale: Locale }) {
  const c = commandCenterContent[locale];
  const t = common[locale];
  const p = c.panels;
  const facts = getRepoFacts();
  const src: Record<PanelSource, string> = { live: c.header.legendLive, build: c.header.legendBuild, concept: c.header.legendConcept };
  const groups = [
    { id: "stack", label: c.tabs.groups.stack },
    { id: "platform", label: c.tabs.groups.platform },
    { id: "map", label: c.tabs.groups.map },
  ];
  const webGroups = capabilityGroups.filter((g) => g.id === "web" || g.id === "backend" || g.id === "delivery");

  const factItems = [
    { label: c.facts.items.pages, value: facts.pages },
    { label: c.facts.items.languages, value: facts.languages },
    { label: c.facts.items.routes, value: facts.routes },
    { label: c.facts.items.content, value: facts.contentModules },
    { label: c.facts.items.api, value: facts.apiEndpoints },
    { label: c.facts.items.tests, value: facts.testFiles },
    { label: c.facts.items.python, value: facts.pythonScripts },
  ].filter((f): f is { label: string; value: number } => f.value !== null);

  return (
    <HealthProvider>
      <div className="night on-night grid-night">
        <div className="container-page pb-[clamp(3rem,6vw,5rem)] pt-[clamp(2rem,4vw,3.5rem)]">
          {/* Title bar: the owner's name stays small; the system is the subject. */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-night-line pb-4">
            <p className="mono min-w-0 truncate text-[0.72rem] text-night-mute">
              {profile.githubUsername} <span aria-hidden>/</span> portfolio <span aria-hidden>/</span> <span className="text-night-ink">command-center</span>
            </p>
            <PaletteButton label={c.header.paletteButton} keysLabel={c.header.paletteKeys} ctrl={locale === "de" ? "Strg" : "Ctrl"} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-3">{c.header.eyebrow}</p>
              <h1 className="h2 max-w-[20ch]">{c.header.title}</h1>
              <p className="mt-4 max-w-[58ch] text-night-mute">{c.header.lede}</p>
            </div>
            <ul className="mono flex flex-wrap gap-x-5 gap-y-2 text-[0.72rem] text-night-mute lg:col-span-5 lg:justify-end">
              <li className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-ok" />
                {c.header.legendLive}
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-night-ink" />
                {c.header.legendBuild}
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full border border-night-mute" />
                {c.header.legendConcept}
              </li>
            </ul>
          </div>

          {/* Primary row: live status next to the terminal. */}
          <div className={clsx(styles.grid, "mt-8")}>
            <StatusPanel copy={c.status} values={c.values} sourceLabel={src.live} className={clsx(styles.span4, styles.wide)} />
            <section aria-labelledby="terminal-title" className={clsx("flex min-w-0 flex-col bg-night-2", styles.span8, styles.wide)}>
              <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pb-3 pt-5">
                <h2 id="terminal-title" className="mono text-[0.72rem] uppercase tracking-[0.14em] text-night-ink">
                  {c.terminal.eyebrow}
                </h2>
                <p className="text-[0.8rem] text-night-mute">{c.terminal.body}</p>
              </header>
              <div className="flex flex-1 flex-col border-t border-night-line">
                <Terminal ctx={buildTerminalContext(locale)} copy={c.terminal} />
              </div>
            </section>
          </div>

          <div className="mt-6 lg:-mt-px">
            <ConsoleTabs label={c.tabs.label} groups={groups}>
              <Panel id="web" title={p.web.title} source="build" sourceLabel={src.build} group="stack" className={styles.span4}>
                <Note>{p.web.note}</Note>
                <div className="space-y-4">
                  {webGroups.map((g) => (
                    <div key={g.id}>
                      <p className="mono mb-2 text-[0.68rem] uppercase tracking-wider text-night-mute">{c.terminal.capabilities.groups[g.id]}</p>
                      <Chips items={g.items.map((i) => c.terminal.capabilities.items[i] ?? i)} />
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel id="ai" title={p.ai.title} source="concept" sourceLabel={src.concept} group="stack" className={styles.span4}>
                <Note>{p.ai.note}</Note>
                <ul className="divide-y divide-night-line border-y border-night-line">
                  {p.ai.roles.map((r) => (
                    <li key={r.name} className="py-2.5">
                      <p className="text-[0.9rem] font-medium">{r.name}</p>
                      <p className="text-[0.8rem] text-night-mute">{r.role}</p>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel id="autonomous" title={p.autonomous.title} source="concept" sourceLabel={src.concept} group="stack" className={clsx(styles.span4, styles.wide)}>
                <Note>{p.autonomous.note}</Note>
                <ol className="space-y-2.5 border-l border-night-line pl-4">
                  {loopSteps.map((step) => (
                    <li key={step} className="relative text-[0.82rem]">
                      <span
                        aria-hidden
                        className={clsx("absolute -left-[1.3rem] top-1.5 size-2 rounded-full border", step === "review" ? "border-accent bg-accent" : "border-night-mute bg-night-2")}
                      />
                      <span className="mono mr-2 text-[0.68rem] uppercase tracking-wider text-night-mute">{step}</span>
                      {p.autonomous.steps[step]}
                    </li>
                  ))}
                </ol>
                <div className="mt-4">
                  <Chips items={p.autonomous.guardrails} />
                </div>
              </Panel>

              <Panel id="local-ai" title={p.localAi.title} source="concept" sourceLabel={src.concept} group="stack" className={clsx(styles.span5, styles.wide)}>
                <p className="mono mb-3 self-start rounded-sm border border-night-mute px-2 py-0.5 text-[0.66rem] uppercase tracking-wider text-night-mute">{p.localAi.badge}</p>
                <Note>{p.localAi.note}</Note>
                <ul className="space-y-2 text-[0.84rem]">
                  {p.localAi.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-night-mute" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel id="python" title={p.python.title} source="build" sourceLabel={src.build} group="stack" className={clsx(styles.span7, styles.wide)}>
                <Note>{p.python.note}</Note>
                <Chips items={p.python.uses} />
                <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                  <div className="min-w-0">
                    <p className="mono mb-2 text-[0.68rem] uppercase tracking-wider text-night-mute">{p.python.generator}</p>
                    <Rows
                      rows={[
                        [p.python.fields.file, circuit.meta.generator],
                        [p.python.fields.nodes, String(circuit.meta.nodeCount)],
                        [p.python.fields.traces, String(circuit.meta.edgeCount)],
                        [p.python.fields.groups, String(circuit.meta.groupCount)],
                        [p.python.fields.copper, `${circuit.meta.traceLength.toLocaleString("en-US")} px`],
                        [p.python.fields.hash, circuit.meta.topologyHash],
                      ]}
                    />
                  </div>
                  <Link href={localizedPath(locale, "ai-native")} className="group block min-w-0 self-start border border-night-line">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static SVG produced by the Python generator; next/image adds nothing for SVG */}
                    <img
                      src="/generated/ai-circuit.svg"
                      alt={p.python.thumbAlt}
                      width={circuit.viewBox[2]}
                      height={circuit.viewBox[3]}
                      loading="lazy"
                      className="block h-auto w-full opacity-90 transition-opacity group-hover:opacity-100"
                    />
                    <span className="mono flex items-center justify-between border-t border-night-line px-3 py-2 text-[0.72rem] text-night-mute group-hover:text-night-ink">
                      {p.python.view}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </Link>
                </div>
              </Panel>

              <Panel id="backend" title={p.backend.title} source="build" sourceLabel={src.build} group="platform" className={styles.span3}>
                <Note>{p.backend.note}</Note>
                <Rows rows={p.backend.rows.map((r) => [r.label, r.value] as const)} />
                <ChannelList label={p.backend.channels} none={p.backend.none} />
              </Panel>
              <div data-group="platform" className={clsx("flex min-w-0 flex-col *:flex-1", styles.span3)}>
                <EmailPanel copy={p.email} statusCopy={c.status} values={c.values} destination={profile.contact.email} sourceLabel={src.live} />
              </div>
              <div data-group="platform" className={clsx("flex min-w-0 flex-col *:flex-1", styles.span3)}>
                <RepositoryPanel copy={p.repository} repoUrl={profile.sourceRepo} repoLabel={repoLabel} sourceLabel={src.live} />
              </div>
              <div data-group="platform" className={clsx("flex min-w-0 flex-col *:flex-1", styles.span3)}>
                <DeploymentPanel copy={p.deployment} values={c.values} sourceLabel={src.live} />
              </div>

              <Panel id="routes" title={p.routes.title} source="build" sourceLabel={src.build} group="map" className={clsx(styles.span7, styles.wide)}>
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="tabular text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-none tracking-tight">{facts.routes}</span>
                  <span className="text-[0.84rem] text-night-mute">
                    {p.routes.total} · {facts.pages} {p.routes.pages} × {facts.languages}
                  </span>
                </p>
                <ul className="mono mt-5 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[0.76rem] sm:grid-cols-2">
                  {pages.map((page) => (
                    <li key={page.id} className="flex min-w-0 justify-between gap-3 border-b border-night-line pb-1.5">
                      <Link href={localizedPath(locale, page.slug)} className="truncate text-night-ink hover:underline">
                        /[locale]{page.slug ? `/${page.slug}` : ""}
                      </Link>
                      <span className="shrink-0 text-night-mute">{t.nav[page.id]}</span>
                    </li>
                  ))}
                  <li className="flex justify-between gap-3 border-b border-night-line pb-1.5">
                    <span className="text-night-ink">/api/health</span>
                    <span className="text-night-mute">{p.routes.api}</span>
                  </li>
                </ul>
              </Panel>

              <Panel id="locales" title={p.locales.title} source="build" sourceLabel={src.build} group="map" className={clsx(styles.span5, styles.wide)}>
                <table className="w-full border-collapse text-left text-[0.82rem]">
                  <caption className="sr-only">{p.locales.caption}</caption>
                  <thead>
                    <tr className="border-b border-night-line">
                      {[p.locales.cols.language, p.locales.cols.prefix, p.locales.cols.html].map((col) => (
                        <th key={col} scope="col" className="mono pb-2 pr-3 text-[0.68rem] font-normal uppercase tracking-wider text-night-mute">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {locales.map((l) => (
                      <tr key={l} className="border-b border-night-line last:border-b-0">
                        <th scope="row" className="py-2.5 pr-3 font-medium" lang={localeMeta[l].htmlLang}>
                          {localeMeta[l].name}
                          {l === locale && <span aria-hidden className="ml-2 inline-block size-1.5 rounded-full bg-accent align-middle" />}
                        </th>
                        <td className="mono py-2.5 pr-3 text-[0.76rem]">
                          <Link href={localizedPath(l, "command-center")} hrefLang={localeMeta[l].htmlLang} className="hover:underline">
                            /{l}
                          </Link>
                        </td>
                        <td className="mono py-2.5 text-[0.76rem] text-night-mute">{localeMeta[l].htmlLang}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            </ConsoleTabs>
          </div>
        </div>
      </div>

      <section className="section" aria-labelledby="architecture-title">
        <div className="container-page">
          <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="min-w-0 lg:col-span-7">
              <p className="eyebrow mb-4">{c.architecture.eyebrow}</p>
              <h2 id="architecture-title" className="h1">{c.architecture.title}</h2>
            </div>
            <p className="lede lg:col-span-5">{c.architecture.lede}</p>
          </div>
          <ArchitectureDiagram copy={c.architecture} />

          <div className="mt-20">
            <h3 className="h2 max-w-[22ch]">{c.facts.title}</h3>
            <p className="body-copy mt-3">{c.facts.lede}</p>
            <dl className="mt-8 grid grid-cols-2 border-t border-ink sm:grid-cols-4 lg:grid-cols-7">
              {factItems.map((f) => (
                <div key={f.label} className="flex flex-col-reverse border-b border-line py-6 pr-4">
                  <dt className="eyebrow mt-2">{f.label}</dt>
                  <dd className="tabular text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-none tracking-tight">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CtaBand locale={locale} label={t.cta.startProject} />
    </HealthProvider>
  );
}
