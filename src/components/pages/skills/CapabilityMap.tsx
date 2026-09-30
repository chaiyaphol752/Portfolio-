"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { interpolate } from "@/lib/interpolate";
import type { SkillsContent } from "@/content/skills";
import { groupIds, groupOf, skillGroups, type SkillId } from "./data";
import { connectorPath, relatedTo } from "./graph";

type Point = { x: number; y: number };

/**
 * Four-column capability map. Lines are drawn from the dot of the selected item to the dots of
 * everything it is used with. Rendered as a normal list first, so it stays readable without JS.
 */
export function CapabilityMap({ content }: { content: SkillsContent }) {
  const [selected, setSelected] = useState<SkillId>("nextjs");
  const [points, setPoints] = useState<Partial<Record<SkillId, Point>>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dots = useRef(new Map<SkillId, HTMLElement>());
  const observer = useRef<ResizeObserver | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    const next: Partial<Record<SkillId, Point>> = {};
    dots.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      next[id] = { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
    setPoints(next);
    setSize({ w: box.width, h: box.height });
  }, []);

  // Callback ref: start observing when the container mounts, stop when it unmounts.
  const attachContainer = useCallback(
    (el: HTMLDivElement | null) => {
      observer.current?.disconnect();
      containerRef.current = el;
      if (!el) return;
      observer.current = new ResizeObserver(measure);
      observer.current.observe(el);
    },
    [measure],
  );

  const related = useMemo(() => relatedTo(selected), [selected]);
  const relatedSet = useMemo(() => new Set<SkillId>(related), [related]);
  const selectedItem = content.items[selected];
  const selectedGroup = groupOf(selected);

  const lines = useMemo(() => {
    const from = points[selected];
    if (!from) return [];
    return related.flatMap((id) => {
      const to = points[id];
      return to ? [{ id, d: connectorPath(from, to) }] : [];
    });
  }, [points, selected, related]);

  return (
    <div>
      <div className="night on-night mb-10 grid gap-6 p-6 sm:p-8 lg:grid-cols-12" aria-live="polite" aria-atomic="true">
        <div className="lg:col-span-5">
          <p className="eyebrow">
            {content.map.inspectorHint} · {content.map.groupLabel}: {content.groups[selectedGroup].name}
          </p>
          <h3 className="display-serif mt-3 text-4xl leading-none sm:text-5xl">{selectedItem.name}</h3>
          <p className="mt-4 max-w-[46ch] text-night-mute">{selectedItem.note}</p>
        </div>
        <div className="lg:col-span-7 lg:border-l lg:border-night-line lg:pl-8">
          <p className="eyebrow">
            {content.map.worksWith} · {interpolate(content.map.connections, { n: related.length })}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {related.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => setSelected(id)} className="link-underline text-[0.95rem] text-night-ink">
                  {content.items[id].name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div ref={attachContainer} className="relative">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden lg:block"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
        >
          {lines.map((line) => (
            <path key={line.id} d={line.d} fill="none" stroke="var(--color-accent)" strokeWidth="1.25" opacity="0.75" />
          ))}
        </svg>
        <div className="relative grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {groupIds.map((g, gi) => (
            <section key={g} aria-labelledby={`skills-group-${g}`}>
              <header className="border-t border-ink pt-3">
                <p className="eyebrow">{String(gi + 1).padStart(2, "0")}</p>
                <h3 id={`skills-group-${g}`} className="h3 mt-1">{content.groups[g].name}</h3>
                <p className="mt-2 min-h-[4.5em] text-sm text-ink-3">{content.groups[g].blurb}</p>
              </header>
              <ul aria-label={interpolate(content.map.listLabel, { group: content.groups[g].name })} className="mt-4">
                {skillGroups[g].map((id) => {
                  const isSelected = id === selected;
                  const isRelated = relatedSet.has(id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelected(id)}
                        className={
                          "group flex w-full items-center gap-3 border-b border-line py-2 text-left text-[0.95rem] transition-colors " +
                          (isSelected ? "font-semibold text-ink" : isRelated ? "text-ink" : "text-ink-3 hover:text-ink")
                        }
                      >
                        <span
                          ref={(el) => {
                            if (el) dots.current.set(id, el);
                            else dots.current.delete(id);
                          }}
                          aria-hidden
                          className={
                            "size-2.5 shrink-0 rounded-full border transition-colors " +
                            (isSelected
                              ? "border-accent bg-accent ring-4 ring-accent-soft"
                              : isRelated
                                ? "border-accent bg-paper"
                                : "border-ink-3 bg-paper")
                          }
                        />
                        <span className="relative bg-paper pr-1">{content.items[id].name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
