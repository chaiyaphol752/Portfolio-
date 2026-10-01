"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { interpolate } from "@/lib/interpolate";
import type { CapabilitiesContent } from "@/content/capabilities";
import {
  capabilityEdges,
  getNode,
  isFeatured,
  nodesIn,
  type CapabilityId,
  type DomainId,
  type Family,
} from "./data";
import { hubEdges, relatedSet, tracePath, type Point } from "./graph";
import { padClass } from "./style";

/** Board columns: web on the left, Python + local AI in the middle, the AI ecosystem on the right. */
const columns: readonly (readonly DomainId[])[] = [
  ["interface", "server", "delivery"],
  ["python", "local"],
  ["models", "autonomy", "ai-engineering"],
];

const familyAnchor: Record<Family, DomainId> = { web: "interface", python: "python", ai: "models", local: "local" };


export function CapabilityNetwork({ t }: { t: CapabilitiesContent }) {
  const [selected, setSelected] = useState<CapabilityId>("python");
  const [points, setPoints] = useState<Partial<Record<CapabilityId, Point>>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });
  const pads = useRef(new Map<CapabilityId, HTMLElement>());
  const observer = useRef<ResizeObserver | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const box = board.getBoundingClientRect();
    const next: Partial<Record<CapabilityId, Point>> = {};
    pads.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      if (r.width) next[id] = { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
    setPoints(next);
    setSize({ w: box.width, h: box.height });
  }, []);

  const attachBoard = useCallback(
    (el: HTMLDivElement | null) => {
      observer.current?.disconnect();
      boardRef.current = el;
      if (!el) return;
      observer.current = new ResizeObserver(measure);
      observer.current.observe(el);
    },
    [measure],
  );

  const highlight = useMemo(() => relatedSet(selected), [selected]);
  const node = getNode(selected);
  const label = (id: CapabilityId) => t.labels[id] ?? getNode(id).label;

  const traces = useMemo(() => {
    const line = (a: CapabilityId, b: CapabilityId) => {
      const pa = points[a];
      const pb = points[b];
      return pa && pb ? tracePath(pa, pb) : null;
    };
    const active = capabilityEdges.filter(([a, b]) => a === selected || b === selected);
    return {
      hub: hubEdges.flatMap(([a, b]) => {
        const d = line(a, b);
        return d ? [{ key: `${a}-${b}`, d }] : [];
      }),
      active: active.flatMap(([a, b]) => {
        const d = line(a, b);
        return d ? [{ key: `${a}-${b}`, d }] : [];
      }),
    };
  }, [points, selected]);

  const select = (id: CapabilityId, scroll = false) => {
    setSelected(id);
    if (scroll) pads.current.get(id)?.closest("button")?.focus({ preventScroll: false });
  };

  const inspector = (compact: boolean) => (
    <div className={clsx("night on-night", compact ? "mt-5 rounded-md p-5" : "grid gap-8 rounded-md p-7 lg:grid-cols-12")}>
      <div className={compact ? "" : "lg:col-span-5"}>
        <p className="eyebrow">
          {t.ui.selected} · {t.domains[node.domain].label}
          {node.family === "local" && <> · {t.ui.concept}</>}
        </p>
        <p className="display-serif mt-2 text-[clamp(2rem,4vw,3.25rem)] leading-none">{label(selected)}</p>
        <p className="mono mt-3 text-xs text-night-mute">{interpolate(t.ui.connections, { n: node.related.length })}</p>
      </div>
      <div className={compact ? "mt-4 space-y-4" : "space-y-5 lg:col-span-7"}>
        <div>
          <p className="eyebrow mb-2">{t.ui.builds}</p>
          <p className="max-w-[60ch] text-[0.95rem] leading-relaxed text-night-ink">
            {isFeatured(selected) ? t.notes[selected] : t.domains[node.domain].body}
          </p>
        </div>
        {(selected === "chatgpt" || selected === "claude-code") && (
          <div>
            <p className="eyebrow mb-2">{t.ui.usedFor}</p>
            <ul className="flex flex-wrap gap-1.5">
              {t.uses[selected].map((u) => (
                <li key={u} className="mono rounded-sm border border-night-line px-2 py-1 text-[0.72rem] text-night-ink">{u}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <p className="eyebrow mb-2">{t.ui.connectsTo}</p>
          <ul className="flex flex-wrap gap-1.5">
            {node.related.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => select(id, true)}
                  className="inline-flex items-center gap-2 rounded-sm border border-night-line px-2 py-1 text-[0.8rem] text-night-ink transition-colors hover:border-night-ink"
                >
                  <span aria-hidden className={clsx("size-1.5 shrink-0", padClass[getNode(id).family])} />
                  {label(id)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {interpolate(t.ui.status, { label: label(selected), n: node.related.length })}
      </p>

      {/* Mobile: jump links between families instead of a squeezed graph. */}
      <nav aria-label={t.ui.jump} className="sticky top-[var(--header-h)] z-20 -mx-[var(--gutter)] mb-6 border-b border-line bg-paper/95 px-[var(--gutter)] py-3 lg:hidden">
        <ul className="flex gap-2 overflow-x-auto">
          {(Object.keys(familyAnchor) as Family[]).map((f) => (
            <li key={f} className="shrink-0">
              <a href={`#cap-${familyAnchor[f]}`} className="mono inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[0.72rem] uppercase tracking-wider">
                <span aria-hidden className={clsx("size-2", padClass[f])} />
                {t.families[f].label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mb-6 hidden lg:block">{inspector(false)}</div>

      <div ref={attachBoard} role="group" aria-label={t.ui.boardLabel} className="relative">
        <svg aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block" width={size.w} height={size.h} viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}>
          {traces.hub.map((l) => (
            <path key={l.key} d={l.d} fill="none" className="stroke-paper-3" strokeWidth={1.25} />
          ))}
          {traces.active.map((l) => (
            <path key={l.key} d={l.d} fill="none" className="stroke-accent" strokeWidth={1.5} />
          ))}
        </svg>

        <div className="relative grid gap-10 lg:grid-cols-3 lg:gap-x-14">
          {columns.map((col, ci) => (
            <div key={ci} className={clsx("flex flex-col gap-10", ci === 1 && "lg:pt-6")}>
              {col.map((domain) => {
                const items = nodesIn(domain);
                const isPython = domain === "python";
                const containsSelected = items.some((n) => n.id === selected);
                return (
                  <section
                    key={domain}
                    id={`cap-${domain}`}
                    aria-labelledby={`cap-${domain}-title`}
                    className={clsx("scroll-mt-[calc(var(--header-h)+4.5rem)]", isPython && "night on-night rounded-md p-6")}
                  >
                    <header className={clsx("mb-4 border-b pb-3", isPython ? "border-night-line" : "border-ink")}>
                      <p className={clsx("eyebrow", isPython && "text-night-mute")}>{t.families[items[0]!.family].label}</p>
                      <h3 id={`cap-${domain}-title`} className={clsx("mt-1", isPython ? "display-serif text-5xl leading-none" : "h3")}>
                        {t.domains[domain].label}
                      </h3>
                      {isPython && <p className="mt-3 text-sm leading-relaxed text-night-mute">{t.domains.python.body}</p>}
                    </header>
                    <ul className={clsx("grid gap-x-4", isPython ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
                      {items.map((n) => {
                        const isSel = n.id === selected;
                        const isRel = highlight.has(n.id) && !isSel;
                        return (
                          <li key={n.id} className={clsx("border-b", isPython ? "border-night-line" : "border-line")}>
                            <button
                              type="button"
                              aria-pressed={isSel}
                              onClick={() => select(n.id)}
                              className={clsx(
                                "group flex w-full items-center gap-3 py-2 text-left text-[0.88rem] transition-colors",
                                isPython ? "bg-night" : "bg-paper",
                                isSel ? (isPython ? "text-night-ink" : "text-ink") : isRel ? (isPython ? "text-night-ink" : "text-ink") : isPython ? "text-night-mute hover:text-night-ink" : "text-ink-2 hover:text-ink",
                                n.id === "python" && "!py-3 text-base font-semibold",
                              )}
                            >
                              <span
                                ref={(el) => {
                                  if (el) pads.current.set(n.id, el);
                                  else pads.current.delete(n.id);
                                }}
                                aria-hidden
                                className={clsx(
                                  "relative size-2.5 shrink-0 transition-transform",
                                  padClass[n.family],
                                  isSel && "scale-150 outline outline-2 outline-offset-2 outline-accent",
                                  isRel && "outline outline-1 outline-offset-2 outline-accent",
                                )}
                              />
                              <span className={clsx(isSel && "font-semibold", (n.id === "chatgpt" || n.id === "claude" || n.id === "claude-code") && "font-medium")}>{label(n.id)}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {containsSelected && <div className="lg:hidden">{inspector(true)}</div>}
                  </section>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mono mt-6 text-xs text-ink-3">{t.ui.hint}</p>
    </div>
  );
}
