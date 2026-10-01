"use client";

import { useId, useMemo, useState } from "react";
import { ArrowDownRight, Search, X } from "lucide-react";
import { clsx } from "clsx";
import { interpolate } from "@/lib/interpolate";
import type { ProjectsContent } from "@/content/projects";
import { categoryIds, type CategoryId, type ProjectId } from "./data";
import { countByCategory, filterItems, type Searchable } from "./filter";

export interface IndexItem extends Searchable {
  id: ProjectId;
  name: string;
  kindLabel: string;
  demo: boolean;
  serviceLabel: string;
}

interface Props {
  items: readonly IndexItem[];
  /** Server-rendered showcase per project; the browser only decides which ones are shown. */
  sections: Record<string, React.ReactNode>;
  t: ProjectsContent;
}

export function ProjectsBrowser({ items, sections, t }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const searchId = useId();

  const visible = useMemo(() => filterItems(items, { query, category }), [items, query, category]);
  const counts = useMemo(() => countByCategory(items, query, categoryIds), [items, query]);
  const filtered = query.trim() !== "" || category !== "all";
  const reset = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <>
      <section aria-labelledby="index-title" className="container-page pb-[clamp(3rem,6vw,5rem)]">
        <div className="grid gap-8 border-t border-ink pt-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <h2 id="index-title" className="eyebrow">{t.ui.indexTitle}</h2>
            <label htmlFor={searchId} className="sr-only">{t.ui.searchLabel}</label>
            <div className="mt-4 flex items-center gap-2 border-b border-ink">
              <Search className="size-4 shrink-0 text-ink-3" aria-hidden />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.ui.searchPlaceholder}
                className="min-h-11 min-w-0 flex-1 bg-transparent text-base placeholder:text-ink-3 focus:outline-none sm:text-[0.95rem]"
              />
            </div>
            <fieldset className="mt-6">
              <legend className="eyebrow mb-3">{t.ui.filterLabel}</legend>
              <div className="flex flex-wrap gap-1.5">
                {(["all", ...categoryIds] as const).map((c) => {
                  const active = category === c;
                  const n = counts[c] ?? 0;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={active}
                      disabled={!active && n === 0}
                      onClick={() => setCategory(c)}
                      className={clsx(
                        "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.85rem] transition-colors disabled:opacity-40 sm:min-h-0 sm:px-3 sm:text-[0.8rem]",
                        active ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                      )}
                    >
                      {c === "all" ? t.ui.all : t.categories[c]}
                      <span className="mono tabular text-[0.72rem] opacity-70 sm:text-[0.68rem]">{n}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <p className="mono mt-5 text-xs text-ink-3" aria-live="polite">
              {interpolate(t.ui.results, { n: visible.length, total: items.length })}
              {filtered && (
                <button type="button" onClick={reset} className="ml-3 inline-flex min-h-11 items-center gap-1 underline underline-offset-4 sm:min-h-0">
                  <X className="size-3" aria-hidden />
                  {t.ui.reset}
                </button>
              )}
            </p>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <table className="w-full border-collapse text-left">
              <thead className="max-sm:sr-only">
                <tr className="eyebrow border-b border-line">
                  <th scope="col" className="py-2 font-normal">{t.ui.columns.project}</th>
                  <th scope="col" className="py-2 font-normal max-md:hidden">{t.ui.columns.service}</th>
                  <th scope="col" className="py-2 text-right font-normal">{t.ui.columns.type}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id} className="group border-b border-line">
                    <th scope="row" className="py-3 pr-4 font-normal">
                      <a href={`#project-${item.id}`} className="inline-flex min-h-11 items-center gap-2 text-[1.05rem] font-medium tracking-tight group-hover:text-accent-ink md:min-h-0">
                        {item.name}
                        <ArrowDownRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                        <span className="sr-only"> — {t.ui.jump}</span>
                      </a>
                      <span className="mono block text-[0.75rem] text-ink-3 md:hidden">{item.serviceLabel}</span>
                    </th>
                    <td className="py-3 pr-4 text-sm text-ink-2 max-md:hidden">{item.serviceLabel}</td>
                    <td className="py-3 text-right">
                      <span className={clsx("mono text-[0.72rem] uppercase tracking-wider sm:whitespace-nowrap sm:text-[0.68rem]", item.demo ? "text-accent-ink" : "text-ink-3")}>{item.kindLabel}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visible.length === 0 && <p className="py-8 text-ink-2">{t.ui.empty}</p>}
          </div>
        </div>
      </section>

      {visible.map((item) => (
        <div key={item.id} id={`project-${item.id}`} className="scroll-mt-[var(--header-h)]">
          {sections[item.id]}
        </div>
      ))}
    </>
  );
}
