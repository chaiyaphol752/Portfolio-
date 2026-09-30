"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { ProjectsContent } from "@/content/projects";
import { interpolate } from "@/lib/interpolate";
import { categoryIds, projectsMeta, type ProjectMeta } from "./data";
import { buildHaystack, countByCategory, filterItems } from "./filter";
import { KindBadge, ProjectDetail } from "./ProjectDetail";

interface Props {
  content: ProjectsContent;
  locale: Locale;
  externalHint: string;
}

type Item = ProjectMeta & { haystack: string };

/** Editorial index + detail panel. On small screens the detail expands inline under the chosen row. */
export function ProjectsExplorer({ content, locale, externalHint }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string>(projectsMeta[0]?.id ?? "");

  const items = useMemo<Item[]>(
    () =>
      projectsMeta.map((meta) => {
        const copy = content.projects[meta.id];
        return {
          ...meta,
          haystack: buildHaystack([
            meta.name,
            copy.tagline,
            copy.problem,
            copy.solution,
            ...copy.decisions,
            ...meta.stack,
            ...meta.categories.map((c) => content.categories[c]),
            content.kind[meta.kind],
          ]),
        };
      }),
    [content],
  );

  const filtered = useMemo(() => filterItems(items, { query, category }), [items, query, category]);
  const counts = useMemo(() => countByCategory(items, query, categoryIds), [items, query]);
  const activeId = filtered.some((p) => p.id === selectedId) ? selectedId : filtered[0]?.id;
  const active = filtered.find((p) => p.id === activeId);
  const ui = content.ui;

  const reset = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <div>
      <div className="grid gap-8 border-y border-ink py-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <label htmlFor="project-search" className="eyebrow mb-2 block">
            {ui.searchLabel}
          </label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.searchPlaceholder}
            autoComplete="off"
            className="w-full border-0 border-b border-ink bg-transparent py-2 text-lg placeholder:text-ink-3"
          />
        </div>
        <div className="lg:col-span-7">
          <p id="project-filter-label" className="eyebrow mb-3">
            {ui.filterLabel}
          </p>
          <div role="group" aria-labelledby="project-filter-label" className="flex flex-wrap gap-2">
            {(["all", ...categoryIds] as const).map((id) => {
              const count = counts[id] ?? 0;
              const selected = category === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  disabled={count === 0 && !selected}
                  onClick={() => setCategory(id)}
                  className={
                    "inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 text-[0.85rem] transition-colors disabled:cursor-not-allowed disabled:opacity-40 " +
                    (selected ? "border-ink bg-ink text-paper" : "border-line hover:border-ink")
                  }
                >
                  {id === "all" ? ui.all : content.categories[id]}
                  <span className="mono tabular text-[0.7rem] opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="eyebrow mt-5" aria-live="polite">
        {interpolate(ui.results, { n: filtered.length, total: items.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="py-20">
          <p className="lede">{ui.empty}</p>
          <button type="button" onClick={reset} className="btn btn-ghost mt-8">
            {ui.reset}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <ol aria-label={ui.listLabel} className="border-t border-ink lg:col-span-5">
            {filtered.map((p, index) => {
              const isActive = p.id === activeId;
              return (
                <li key={p.id} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isActive}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setSelectedId(p.id)}
                      className={
                        "grid w-full grid-cols-[2.25rem_1fr_auto] items-start gap-2 border-l-2 py-4 pl-3 pr-2 text-left transition-colors " +
                        (isActive ? "border-accent bg-paper-2" : "border-transparent hover:bg-paper-2/60")
                      }
                    >
                      <span className="mono tabular pt-1.5 text-xs text-ink-3">{String(index + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block text-xl font-medium leading-tight tracking-tight">{p.name}</span>
                        <span className="eyebrow mt-1 block normal-case tracking-normal">
                          {p.categories.map((c) => content.categories[c]).join(" · ")}
                        </span>
                        <span className="mt-2 block">
                          <KindBadge kind={p.kind} label={content.kind[p.kind]} />
                        </span>
                      </span>
                      <span className="pt-1.5" aria-hidden>
                        <ChevronDown className={"size-5 transition-transform lg:hidden " + (isActive ? "rotate-180" : "")} />
                        <ArrowRight className={"hidden size-5 transition-opacity lg:block " + (isActive ? "opacity-100" : "opacity-0")} />
                      </span>
                    </button>
                  </h3>
                  {isActive && (
                    <div className="px-3 pb-8 pt-2 lg:hidden">
                      <ProjectDetail meta={p} content={content} locale={locale} externalHint={externalHint} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          <aside
            aria-label={ui.detailLabel}
            // Scrollable region: keyboard users can focus it to scroll long detail content.
            tabIndex={0}
            className="hidden lg:col-span-7 lg:block lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:max-h-[calc(100dvh-var(--header-h)-3rem)] lg:self-start lg:overflow-y-auto lg:pr-2"
          >
            {active && <ProjectDetail key={active.id} meta={active} content={content} locale={locale} externalHint={externalHint} showTitle />}
          </aside>
        </div>
      )}
    </div>
  );
}
