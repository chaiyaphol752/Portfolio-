"use client";

import { useId, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { Check, ChevronRight, Search, X } from "lucide-react";
import { interpolate } from "@/lib/interpolate";
import type { CapabilitiesContent } from "@/content/capabilities";
import { chains, getNode, isFeatured, type CapabilityId, type Family } from "./data";
import { chainsFor, defaultCapability, familyTabs, filterCapabilities, groupByDomain, normalize } from "./explore";
import { padClass } from "./style";

/** Swatches on the dark detail panel: the ink swatch would disappear on night. */
const nightPad: Record<Family, string> = { ...padClass, web: "bg-night-ink", ai: "border-[1.5px] border-accent bg-night" };

/**
 * Phone and tablet representation of the capability network. Same data as the desktop
 * board, presented as search + area tabs + a detail panel instead of a squeezed graph.
 */
export function CapabilityExplorer({ t }: { t: CapabilitiesContent }) {
  const uid = useId();
  const [selected, setSelected] = useState<CapabilityId>(defaultCapability);
  const [tab, setTab] = useState<Family>("python");
  const [query, setQuery] = useState("");
  const detailRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabRefs = useRef(new Map<Family, HTMLButtonElement>());

  const label = useMemo(() => (id: CapabilityId) => t.labels[id] ?? getNode(id).label, [t]);
  const searching = normalize(query).length > 0;
  const results = useMemo(() => filterCapabilities(query, label, tab), [query, label, tab]);
  const groups = groupByDomain(results.map((n) => n.id));
  const node = getNode(selected);
  const paths = chainsFor(selected);

  const select = (id: CapabilityId, from: "list" | "detail") => {
    setSelected(id);
    if (from === "detail" && !searching) setTab(getNode(id).family);
    // On phones the detail panel sits above the list: bring it back into view.
    const phone = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (phone || from === "detail") detailRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  };

  const chooseTab = (f: Family) => {
    setTab(f);
    setQuery("");
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const last = familyTabs.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    const f = familyTabs[next]!;
    chooseTab(f);
    tabRefs.current.get(f)?.focus();
  };

  const listLabel = searching ? interpolate(t.ui.results, { n: results.length }) : interpolate(t.ui.browse, { area: t.families[tab].label });

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-x-8 md:[grid-template-areas:'search_detail'_'tabs_detail'_'list_detail'] md:[grid-template-rows:auto_auto_1fr]">
      <p className="sr-only" aria-live="polite">
        {interpolate(t.ui.status, { label: label(selected), n: node.related.length })}
      </p>

      {/* Search */}
      <div className="md:[grid-area:search]">
        <label htmlFor={`${uid}-q`} className="eyebrow">{t.ui.search}</label>
        <div className="relative mt-2">
          <Search aria-hidden className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
          <input
            id={`${uid}-q`}
            type="search"
            inputMode="search"
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.ui.searchPlaceholder}
            aria-controls={`${uid}-list`}
            className="min-h-12 w-full border-b border-ink bg-transparent pl-7 pr-12 text-base placeholder:text-ink-3 focus:outline-none focus-visible:border-accent [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t.ui.clear}
              className="absolute right-0 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-ink-2 hover:text-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Area tabs */}
      <div className="md:[grid-area:tabs]">
        <p id={`${uid}-areas`} className="sr-only">{t.ui.areas}</p>
        <div role="tablist" aria-labelledby={`${uid}-areas`} className="grid grid-cols-4 border border-ink">
          {familyTabs.map((f, i) => {
            const active = !searching && tab === f;
            const count = filterCapabilities("", label, f).length;
            return (
              <button
                key={f}
                ref={(el) => {
                  if (el) tabRefs.current.set(f, el);
                  else tabRefs.current.delete(f);
                }}
                id={`${uid}-tab-${f}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`${uid}-list`}
                tabIndex={tab === f ? 0 : -1}
                onClick={() => chooseTab(f)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={clsx(
                  "flex min-h-14 flex-col items-center justify-center gap-1 border-ink px-1 text-center transition-colors [&:not(:first-child)]:border-l",
                  active ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
                )}
              >
                <span className="flex items-center gap-1.5 text-[0.82rem] font-medium leading-tight">
                  <span aria-hidden className={clsx("size-2 shrink-0", f === "web" && active ? "bg-paper" : padClass[f])} />
                  {t.ui.tabs[f]}
                </span>
                <span className={clsx("mono tabular text-[0.7rem]", active ? "text-paper/75" : "text-ink-3")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected capability */}
      <section
        ref={detailRef}
        aria-labelledby={`${uid}-title`}
        className="night on-night scroll-mt-[calc(var(--header-h)+1rem)] rounded-md p-5 sm:p-6 md:sticky md:top-[calc(var(--header-h)+1rem)] md:max-h-[calc(100dvh-var(--header-h)-2rem)] md:self-start md:overflow-y-auto md:[grid-area:detail]"
      >
        <p className="eyebrow">
          {t.ui.selected} · {t.domains[node.domain].label}
          {node.family === "local" && <> · {t.ui.concept}</>}
        </p>
        <h3 id={`${uid}-title`} ref={headingRef} tabIndex={-1} className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 focus:outline-none">
          <span className="display-serif break-words text-[clamp(2.1rem,9vw,3rem)] leading-none">{label(selected)}</span>
          {selected === "python" && <span className="mono rounded-sm border border-accent px-2 py-0.5 text-[0.7rem] uppercase tracking-wider text-accent">{t.ui.hub}</span>}
        </h3>
        <p className="mono mt-3 text-xs text-night-mute">{interpolate(t.ui.connections, { n: node.related.length })}</p>

        <div className="mt-6">
          <p className="eyebrow mb-2">{t.ui.builds}</p>
          <p className="text-[0.95rem] leading-relaxed text-night-ink">{isFeatured(selected) ? t.notes[selected] : t.domains[node.domain].body}</p>
        </div>

        {(selected === "chatgpt" || selected === "claude-code") && (
          <div className="mt-6">
            <p className="eyebrow mb-2">{t.ui.usedFor}</p>
            <ul className="flex flex-wrap gap-1.5">
              {t.uses[selected].map((u) => (
                <li key={u} className="rounded-sm border border-night-line px-2 py-1 text-[0.78rem] text-night-ink">{u}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <p className="eyebrow mb-3">{t.ui.connectsTo}</p>
          <div className="space-y-4">
            {groupByDomain(node.related).map((g) => (
              <div key={g.domain}>
                <p className="mono mb-1.5 text-[0.7rem] uppercase tracking-wider text-night-mute">{t.domains[g.domain].label}</p>
                <ul className="flex flex-wrap gap-2">
                  {g.ids.map((id) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => select(id, "detail")}
                        className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-night-line px-3 text-[0.875rem] text-night-ink transition-colors hover:border-night-ink"
                      >
                        <span aria-hidden className={clsx("size-2 shrink-0", nightPad[getNode(id).family])} />
                        {label(id)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {paths.length > 0 && (
          // Progressive disclosure: the traces are secondary to "connects to" on a small screen.
          <details key={selected} className="group mt-7 border-t border-night-line pt-2">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="eyebrow block">
                  {t.ui.paths} · {paths.length}
                </span>
                <span className="mt-1 block text-sm text-night-mute">{t.ui.pathsHint}</span>
              </span>
              <ChevronRight aria-hidden className="size-4 shrink-0 text-night-mute transition-transform group-open:rotate-90" />
            </summary>
            <div className="mt-4 space-y-6">
              {paths.map((c) => (
                <div key={c}>
                  <p className="text-sm font-semibold">{t.chains.items[c].title}</p>
                  <ol aria-label={t.chains.items[c].title} className="ml-[5px] mt-2 border-l border-night-line">
                    {chains[c].map((step) => {
                      const here = step === selected;
                      return (
                        <li key={step}>
                          <button
                            type="button"
                            aria-current={here ? "step" : undefined}
                            onClick={() => select(step, "detail")}
                            className={clsx("-ml-[5.5px] flex min-h-11 w-full items-center gap-3 text-left text-[0.875rem]", here ? "font-semibold text-night-ink" : "text-night-mute hover:text-night-ink")}
                          >
                            <span aria-hidden className={clsx("size-2.5 shrink-0", nightPad[getNode(step).family], here && "outline outline-2 outline-offset-2 outline-accent")} />
                            {label(step)}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
          </details>
        )}
      </section>

      {/* List */}
      <div
        id={`${uid}-list`}
        role="tabpanel"
        aria-labelledby={searching ? undefined : `${uid}-tab-${tab}`}
        aria-label={searching ? listLabel : undefined}
        className="md:[grid-area:list]"
      >
        <p className="eyebrow mb-3" aria-live="polite">{listLabel}</p>
        {results.length === 0 ? (
          <div className="border-t border-line py-6">
            <p className="text-ink-2">{interpolate(t.ui.noResults, { q: query.trim() })}</p>
            <button type="button" onClick={() => setQuery("")} className="btn btn-ghost mt-4">{t.ui.clear}</button>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((g) => (
              <div key={g.domain}>
                {(searching || groups.length > 1) && (
                  <h4 className="mono border-b border-ink pb-2 text-[0.72rem] uppercase tracking-wider text-ink-2">{t.domains[g.domain].label}</h4>
                )}
                <ul className={clsx(!searching && groups.length === 1 && "border-t border-ink")}>
                  {g.ids.map((id) => {
                    const n = getNode(id);
                    const isSel = id === selected;
                    const hub = id === "python";
                    return (
                      <li key={id} className="border-b border-line">
                        <button
                          type="button"
                          aria-pressed={isSel}
                          onClick={() => select(id, "list")}
                          className={clsx(
                            "relative flex min-h-12 w-full items-center gap-3 py-2.5 pl-3 pr-1 text-left transition-colors",
                            isSel ? "bg-paper-2" : "hover:bg-paper-2/60",
                          )}
                        >
                          <span aria-hidden className={clsx("absolute inset-y-0 left-0 w-[3px]", isSel ? "bg-accent" : "bg-transparent")} />
                          <span aria-hidden className={clsx("size-2.5 shrink-0", padClass[n.family])} />
                          <span className={clsx("min-w-0 flex-1 break-words", hub ? "text-[1.05rem] font-semibold" : "text-[0.95rem]", isSel && "font-semibold")}>
                            {label(id)}
                            {hub && <span className="mono ml-2 align-middle text-[0.7rem] uppercase tracking-wider text-accent-ink">{t.ui.hub}</span>}
                          </span>
                          <span className="mono tabular text-[0.72rem] text-ink-3">
                            {n.related.length}
                            <span className="sr-only"> {interpolate(t.ui.connections, { n: n.related.length })}</span>
                          </span>
                          {isSel ? <Check aria-hidden className="size-4 shrink-0 text-accent-ink" /> : <ChevronRight aria-hidden className="size-4 shrink-0 text-ink-3" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
