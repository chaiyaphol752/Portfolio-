"use client";

import { useRef, useState } from "react";
import { actorIds, collaboration, type AiNativeContent } from "@/content/ai-native";

const pad = (n: number) => String(n).padStart(2, "0");

function Dot({ level }: { level: number }) {
  if (level === 2) return <span aria-hidden className="inline-block size-3.5 rounded-full bg-accent" />;
  if (level === 1) return <span aria-hidden className="inline-block size-3.5 rounded-full border-2 border-night-ink" />;
  return <span aria-hidden className="inline-block h-px w-3 bg-night-line" />;
}

/**
 * Interactive nine-stage workflow. All panels are rendered in the DOM (inactive ones `hidden`),
 * and a <noscript> rule reveals every panel, so the content is readable without JavaScript.
 */
export function WorkflowExplorer({ content }: { content: AiNativeContent }) {
  const { stages, explorer } = content;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    const next = (index + stages.length) % stages.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number | undefined> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: stages.length - 1,
    };
    const target = keys[e.key];
    if (target === undefined) return;
    e.preventDefault();
    select(target, true);
  };

  const legend = explorer.matrix.legend;
  const levelLabel = (level: number) => (level === 2 ? legend.lead : level === 1 ? legend.support : legend.none);

  return (
    <div>
      <noscript>
        <style>{`.stage-panel[hidden]{display:block!important;margin-top:4rem}`}</style>
      </noscript>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-14">
        <div
          role="tablist"
          aria-label={explorer.tablist}
          onKeyDown={onKeyDown}
          className="grid grid-cols-9 gap-1 lg:col-span-4 lg:grid-cols-1 lg:gap-0 lg:border-t lg:border-night-line lg:self-start"
        >
          {stages.map((stage, i) => (
            <button
              key={stage.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`stage-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`stage-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              className="group flex h-11 items-center justify-center border border-night-line text-night-mute transition-colors hover:text-night-ink aria-selected:border-night-ink aria-selected:bg-night-ink aria-selected:text-night lg:h-auto lg:justify-start lg:gap-5 lg:border-0 lg:border-b lg:py-3.5 lg:aria-selected:bg-transparent lg:aria-selected:text-night-ink"
            >
              <span className="mono tabular text-xs">{pad(i + 1)}</span>
              <span className="hidden text-lg tracking-tight transition-transform duration-300 lg:inline lg:group-hover:translate-x-1 lg:group-aria-selected:translate-x-1">
                {stage.name}
              </span>
              <span aria-hidden className="ml-auto hidden size-2 rounded-full bg-transparent lg:block lg:group-aria-selected:bg-accent" />
            </button>
          ))}
        </div>

        <div className="min-w-0 lg:col-span-8">
          {stages.map((stage, i) => (
            <div
              key={stage.name}
              role="tabpanel"
              id={`stage-panel-${i}`}
              aria-labelledby={`stage-tab-${i}`}
              hidden={i !== active}
              tabIndex={0}
              className="stage-panel rounded-sm focus-visible:outline-offset-8"
            >
              <div className="space-y-8 max-lg:pt-2">
                <header>
                  <p className="eyebrow tabular">
                    {explorer.stage} {pad(i + 1)}/{pad(stages.length)}
                  </p>
                  <h3 className="h2 mt-2">{stage.name}</h3>
                  <p className="mt-3 max-w-[48ch] text-lg text-night-mute">{stage.summary}</p>
                </header>

                <dl className="grid divide-y divide-night-line border-y border-night-line md:grid-cols-3 md:divide-x md:divide-y-0">
                  {(
                    [
                      ["human", explorer.panel.human, stage.human],
                      ["ai", explorer.panel.ai, stage.ai],
                      ["tools", explorer.panel.tools, stage.tools],
                    ] as const
                  ).map(([key, label, text]) => (
                    <div key={key} className="py-5 md:px-6 md:first:pl-0 md:last:pr-0">
                      <dt className="eyebrow flex items-center gap-2">
                        <span
                          aria-hidden
                          className={
                            "size-2.5 " +
                            (key === "human" ? "rounded-full bg-accent" : key === "ai" ? "rotate-45 border border-night-ink" : "border border-night-mute")
                          }
                        />
                        {label}
                      </dt>
                      <dd className="mt-3 text-[0.95rem] leading-relaxed text-night-ink/90">{text}</dd>
                    </div>
                  ))}
                </dl>

                <div>
                  <p className="eyebrow">{explorer.panel.artifacts}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {stage.artifacts.map((artifact) => (
                      <li key={artifact} className="mono rounded-full border border-night-line px-3 py-1.5 text-xs text-night-ink/90">
                        {artifact}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-l-2 border-accent bg-night-2 p-5 sm:p-6">
                  <p className="eyebrow text-accent!">{explorer.panel.gate}</p>
                  <p className="mt-2 text-lg leading-snug">{stage.gate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 border-t border-night-line pt-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h3 className="h3">{explorer.matrix.title}</h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-night-mute">
            {[2, 1, 0].map((level) => (
              <li key={level} className="flex items-center gap-2">
                <Dot level={level} />
                {levelLabel(level)}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 max-w-[64ch] text-sm text-night-mute">{explorer.matrix.caption}</p>

        <div role="region" aria-label={explorer.matrix.scrollLabel} tabIndex={0} className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <caption className="sr-only">{explorer.matrix.title}</caption>
            <thead>
              <tr>
                <th scope="col" className="eyebrow w-44 pb-3 pr-4 text-left font-normal">
                  {explorer.matrix.actorHeader}
                </th>
                {stages.map((stage, i) => (
                  <th key={stage.name} scope="col" className="pb-3 text-center font-normal">
                    <button
                      type="button"
                      onClick={() => select(i)}
                      aria-label={`${pad(i + 1)} ${stage.name}`}
                      title={stage.name}
                      className={
                        "mono tabular mx-auto flex h-8 w-9 items-center justify-center border-b text-xs transition-colors " +
                        (i === active ? "border-accent text-night-ink" : "border-transparent text-night-mute hover:text-night-ink")
                      }
                    >
                      {pad(i + 1)}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actorIds.map((actor) => (
                <tr key={actor} className="border-t border-night-line">
                  <th scope="row" className="py-3.5 pr-4 text-left font-medium">
                    {explorer.actors[actor]}
                  </th>
                  {collaboration[actor].map((level, i) => (
                    <td key={i} className={"py-3.5 text-center transition-colors " + (i === active ? "bg-night-2" : "")}>
                      <Dot level={level} />
                      <span className="sr-only">{levelLabel(level)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
