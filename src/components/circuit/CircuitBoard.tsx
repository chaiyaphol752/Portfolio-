"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";
import { circuit, connectionsOf, groupOrder, highlightFor, nearestNode, nodesInReadingOrder, type CircuitGroup, type EdgeKind } from "./circuit-data";
import { circuitCopy } from "./labels";
import styles from "./CircuitBoard.module.css";

interface Props {
  locale: Locale;
  /** Node selected on first render, e.g. "python" on a Python-focused section. */
  initial?: string | null;
  /** "full" adds inspector, selector and legend; "compact" is the board alone. */
  variant?: "full" | "compact";
  className?: string;
}

const groupStroke: Record<CircuitGroup, string> = {
  human: "var(--color-night-ink)",
  orchestration: "var(--color-accent)",
  model: "var(--color-accent)",
  agent: "var(--color-night-mute)",
  tool: "var(--color-night-ink)",
  data: "var(--color-ok)",
  quality: "var(--color-ok)",
  delivery: "var(--color-night-ink)",
};

const traceColor = (kind: EdgeKind) => (kind === "data" ? "#2f5b47" : kind === "bus" || kind === "agent-bus" ? "#4a4f5c" : "var(--color-trace)");
const litColor = (kind: EdgeKind) => (kind === "data" ? "var(--color-ok)" : "var(--color-accent)");

const featured = ["chatgpt", "claude", "local-ai", "python"] as const;

export function CircuitBoard({ locale, initial = null, variant = "full", className }: Props) {
  const copy = circuitCopy[locale];
  const [selected, setSelected] = useState<string | null>(initial);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string>(initial ?? "intent");
  const nodeRefs = useRef<Map<string, SVGGElement>>(new Map());
  const titleId = useId();
  const selectId = useId();

  const active = hovered ?? selected;
  const highlight = useMemo(() => highlightFor(active), [active]);
  const activeNode = active ? circuit.nodes.find((n) => n.id === active) : undefined;
  const connections = useMemo(() => (active ? connectionsOf(active) : []), [active]);
  const label = (id: string) => copy.nodes[id]?.label ?? circuit.nodes.find((n) => n.id === id)?.label ?? id;

  const [, , vbW, vbH] = circuit.viewBox;
  const { width: nw, height: nh } = circuit.node;

  const select = useCallback((id: string | null) => {
    setSelected((cur) => (id && cur === id ? null : id));
    if (id) setFocusId(id);
  }, []);

  const moveFocus = (id: string | null) => {
    if (!id) return;
    setFocusId(id);
    nodeRefs.current.get(id)?.focus();
  };

  const onNodeKey = (e: React.KeyboardEvent, id: string) => {
    const dir = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" } as const;
    if (e.key in dir) {
      e.preventDefault();
      moveFocus(nearestNode(id, dir[e.key as keyof typeof dir]));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(id);
    } else if (e.key === "Escape") {
      setSelected(null);
    }
  };

  const caption = interpolate(copy.ui.caption, {
    generator: circuit.meta.generator,
    hash: circuit.meta.topologyHash,
    nodes: circuit.meta.nodeCount,
    traces: circuit.meta.edgeCount,
  });

  const board = (
    <div
      role="region"
      aria-label={copy.ui.scrollHint}
      tabIndex={-1}
      className="relative overflow-x-auto overscroll-x-contain"
      onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
    >
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        role="group"
        aria-labelledby={titleId}
        className={clsx(styles.board, "block h-auto w-full min-w-[860px] lg:min-w-0")}
        style={{ fontFamily: "var(--font-sans)" }}
        onMouseLeave={() => setHovered(null)}
      >
        <title id={titleId}>{copy.ui.boardLabel}</title>

        <g aria-hidden>
          {circuit.edges.map((e) => {
            const lit = highlight?.edges.has(e.id);
            return (
              <g key={e.id} className={highlight ? (lit ? styles.lit : styles.dimmed) : undefined}>
                <path d={e.d} fill="none" stroke={lit ? litColor(e.kind) : traceColor(e.kind)} strokeWidth={e.kind === "agent-bus" ? 3 : lit ? 2.25 : 2} strokeLinejoin="round" />
                {lit && <path d={e.d} fill="none" stroke="#fff" strokeOpacity={0.85} strokeWidth={1.5} className={styles.pulse} />}
                {[e.points[0], e.points[e.points.length - 1]].map((p, i) =>
                  p ? <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="var(--color-night)" stroke={lit ? litColor(e.kind) : "#6b3a2c"} strokeWidth={1.5} /> : null,
                )}
              </g>
            );
          })}
        </g>

        {nodesInReadingOrder.map((n) => {
          const lit = !highlight || highlight.nodes.has(n.id);
          const isActive = n.id === active;
          const c = copy.nodes[n.id];
          const x = n.x - nw / 2;
          const y = n.y - nh / 2;
          return (
            <g
              key={n.id}
              ref={(el) => {
                if (el) nodeRefs.current.set(n.id, el);
                else nodeRefs.current.delete(n.id);
              }}
              role="button"
              tabIndex={n.id === focusId ? 0 : -1}
              aria-pressed={selected === n.id}
              aria-label={`${c?.label ?? n.label} — ${c?.sub ?? n.sub}`}
              className={clsx(styles.node, highlight && (lit ? styles.lit : styles.dimmed))}
              onClick={() => select(n.id)}
              onMouseEnter={() => setHovered(n.id)}
              onFocus={() => setFocusId(n.id)}
              onKeyDown={(e) => onNodeKey(e, n.id)}
            >
              <rect className={styles.ring} x={x - 5} y={y - 5} width={nw + 10} height={nh + 10} rx={6} fill="none" stroke="var(--color-night-ink)" strokeWidth={1.5} strokeDasharray="3 3" />
              <rect
                className={styles.body}
                x={x}
                y={y}
                width={nw}
                height={nh}
                rx={3}
                fill={isActive ? "#1d1512" : "var(--color-night)"}
                stroke={isActive ? "var(--color-accent)" : groupStroke[n.group]}
                strokeWidth={isActive ? 2 : 1.2}
              />
              <text x={x + 8} y={y - 6} fontSize={8.5} fill="var(--color-night-mute)" letterSpacing={1} style={{ fontFamily: "var(--font-mono)" }}>
                {n.designator}
              </text>
              <text x={n.x} y={n.y - 2} fontSize={12.5} fontWeight={600} textAnchor="middle" fill="var(--color-night-ink)">
                {c?.label ?? n.label}
              </text>
              <text x={n.x} y={n.y + 13} fontSize={8.5} textAnchor="middle" fill="var(--color-night-mute)" style={{ fontFamily: "var(--font-mono)" }}>
                {c?.sub ?? n.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );

  const legend = (
    <ul aria-label={copy.ui.legend} className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-night-mute">
      {groupOrder.map((g) => (
        <li key={g} className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-2.5 w-4 rounded-[2px] border" style={{ borderColor: groupStroke[g] }} />
          {copy.groups[g]}
        </li>
      ))}
    </ul>
  );

  const captionEl = (
    <p className="mono text-[0.7rem] leading-relaxed text-night-mute">
      {caption} ·{" "}
      <a href="/generated/ai-circuit.svg" className="underline decoration-night-line underline-offset-2 hover:text-night-ink">
        {copy.ui.staticSvg}
      </a>
    </p>
  );

  if (variant === "compact") {
    return (
      <figure className={clsx("on-night grid-night rounded-md border border-night-line text-night-ink", className)}>
        <div className="p-3 sm:p-5">{board}</div>
        <figcaption className="border-t border-night-line px-4 py-3">{captionEl}</figcaption>
      </figure>
    );
  }

  return (
    <div className={clsx("on-night grid gap-px overflow-hidden rounded-md border border-night-line bg-night-line text-night-ink lg:grid-cols-12", className)}>
      <figure className="grid-night min-w-0 lg:col-span-9">
        <p className="mono hidden px-5 pt-4 text-[0.7rem] text-night-mute lg:block">{copy.ui.keyboardHint}</p>
        <p className="mono px-4 pt-4 text-[0.7rem] text-night-mute lg:hidden">{copy.ui.scrollHint} →</p>
        <div className="p-3 sm:p-5">{board}</div>
        <figcaption className="flex flex-col gap-4 border-t border-night-line px-5 py-4">
          {legend}
          {captionEl}
        </figcaption>
      </figure>

      <aside aria-label={copy.ui.inspector} className="flex min-w-0 flex-col gap-6 bg-night-2 p-5 lg:col-span-3">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">{copy.ui.inspector}</p>
          {selected && (
            <button type="button" onClick={() => setSelected(null)} className="mono rounded-full border border-night-line px-3 py-1 text-[0.7rem] hover:border-night-ink">
              {copy.ui.clear}
            </button>
          )}
        </div>

        <div>
          <label htmlFor={selectId} className="eyebrow mb-2 block">
            {copy.ui.selectLabel}
          </label>
          <select
            id={selectId}
            value={selected ?? ""}
            onChange={(e) => select(e.target.value || null)}
            className="w-full rounded-md border border-night-line bg-night px-3 py-2.5 text-sm text-night-ink"
          >
            <option value="">{copy.ui.selectPlaceholder}</option>
            {nodesInReadingOrder.map((n) => (
              <option key={n.id} value={n.id}>
                {n.designator} · {label(n.id)}
              </option>
            ))}
          </select>
        </div>

        {activeNode ? (
          <div className="flex flex-col gap-4">
            <div>
              <p className="mono text-[0.7rem] text-night-mute">
                {copy.ui.designator} {activeNode.designator} · {copy.ui.group}: {copy.groups[activeNode.group]}
              </p>
              <p className="mt-2 text-2xl font-medium tracking-tight">{label(activeNode.id)}</p>
              <p className="mt-3 text-sm leading-relaxed text-night-mute">{copy.nodes[activeNode.id]?.role}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">{copy.ui.connected}</p>
              <ul className="flex flex-wrap gap-1.5">
                {connections.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => select(c.id)}
                      className="mono rounded-full border border-night-line px-2.5 py-1 text-[0.7rem] text-night-ink hover:border-accent"
                    >
                      {label(c.id)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium">{copy.ui.idle}</p>
            <p className="mt-2 text-sm leading-relaxed text-night-mute">{copy.ui.idleBody}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {featured.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => select(id)}
                    className="rounded-full border border-night-line px-3 py-1.5 text-xs text-night-ink hover:border-accent"
                  >
                    {label(id)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {selected ? interpolate(copy.ui.live, { label: label(selected), count: (highlightFor(selected)?.nodes.size ?? 1) - 1 }) : ""}
        </p>
      </aside>
    </div>
  );
}
