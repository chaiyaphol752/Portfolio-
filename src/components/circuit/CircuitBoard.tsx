"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";
import {
  CIRCUIT_SELECT_EVENT,
  circuit,
  highlightFor,
  isAgent,
  nearestNode,
  nodeById,
  nodesInReadingOrder,
  relatedTo,
  type EdgeKind,
  type NodeKind,
} from "./circuit-data";
import { circuitCopy, type LegendKey } from "./labels";
import styles from "./CircuitBoard.module.css";

interface Props {
  locale: Locale;
  /** Node selected on first render, e.g. "n8n" on an automation-focused section. */
  initial?: string | null;
  /** "full" adds inspector, selector and legend; "compact" is the board alone. */
  variant?: "full" | "compact";
  className?: string;
}

const kindStroke: Record<NodeKind, string> = {
  input: "var(--color-night-ink)",
  core: "var(--color-accent)",
  model: "var(--color-night-ink)",
  agent: "var(--color-night-mute)",
  tool: "var(--color-night-ink)",
  data: "var(--color-ok)",
  control: "var(--color-ok)",
  delivery: "var(--color-night-ink)",
};

const traceColor: Record<EdgeKind, string> = {
  flow: "#3a3e4a",
  delivery: "#3a3e4a",
  model: "#5a5f6d",
  "agent-bus": "#5a5f6d",
  automation: "#9c2a0d",
  data: "#2f6b4f",
  control: "#2f6b4f",
};
const litColor = (kind: EdgeKind) => (kind === "data" || kind === "control" ? "var(--color-ok)" : "var(--color-accent)");

const legendSwatch: Record<LegendKey, { color: string; width: number }> = {
  flow: { color: "#6b6f7b", width: 2 },
  bus: { color: "#5a5f6d", width: 4 },
  automation: { color: "var(--color-accent)", width: 2 },
  control: { color: "var(--color-ok)", width: 2 },
};

const featured = ["orchestrator", "n8n", "chatgpt", "claude", "local-ai", "python", "research-agent"] as const;

export function CircuitBoard({ locale, initial = null, variant = "full", className }: Props) {
  const copy = circuitCopy[locale];
  const [selected, setSelected] = useState<string | null>(initial);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string>(initial ?? "orchestrator");
  const nodeRefs = useRef<Map<string, SVGGElement>>(new Map());
  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const selectId = useId();

  const active = hovered ?? selected;
  const highlight = useMemo(() => highlightFor(active), [active]);
  const activeNode = active ? nodeById.get(active) : undefined;
  const related = useMemo(() => (active ? relatedTo(active) : []), [active]);
  const label = (id: string) => copy.nodes[id]?.label ?? nodeById.get(id)?.label ?? id;

  const [, , vbW = 1340, vbH = 1040] = circuit.viewBox;

  const select = useCallback((id: string | null) => {
    setSelected((cur) => (id && cur === id ? null : id));
    if (id) setFocusId(id);
  }, []);

  // Flow diagrams and the reading key elsewhere on the page can select a node here.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!nodeById.has(id)) return;
      setSelected(id);
      setFocusId(id);
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener(CIRCUIT_SELECT_EVENT, onSelect);
    return () => window.removeEventListener(CIRCUIT_SELECT_EVENT, onSelect);
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
    agents: circuit.meta.agentCount,
  });

  const dim = (lit: boolean) => (highlight ? (lit ? styles.lit : styles.dimmed) : undefined);
  const mb = circuit.modelBox;

  const board = (
    <div
      role="region"
      aria-label={copy.ui.scrollHint}
      className="relative overflow-x-auto overscroll-x-contain"
      onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
    >
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        role="group"
        aria-labelledby={titleId}
        className={clsx(styles.board, "block h-auto w-full min-w-[1000px] lg:min-w-0")}
        style={{ fontFamily: "var(--font-sans)" }}
        onMouseLeave={() => setHovered(null)}
      >
        <title id={titleId}>{copy.ui.boardLabel}</title>

        {/* Layer bands with rotated labels in the left margin. */}
        <g aria-hidden>
          {circuit.layers.map((l) => {
            const cy = (l.y0 + l.y1) / 2;
            return (
              <g key={l.id}>
                <rect x={16} y={l.y0} width={vbW - 32} height={l.y1 - l.y0} fill="#14161c" fillOpacity={0.55} stroke="#22252e" />
                <text
                  x={circuit.labelX}
                  y={cy}
                  transform={`rotate(-90 ${circuit.labelX} ${cy})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={9}
                  letterSpacing={1}
                  fill="var(--color-night-mute)"
                  style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
                >
                  {copy.layers[l.id]}
                </text>
              </g>
            );
          })}
          <rect x={mb.x0} y={mb.y0} width={mb.x1 - mb.x0} height={mb.y1 - mb.y0} fill="none" stroke="#5a5f6d" strokeDasharray="4 4" />
          <text x={mb.x1} y={mb.y0 - 6} textAnchor="end" fontSize={9} letterSpacing={1} fill="var(--color-night-mute)" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
            {copy.layers.models}
          </text>
        </g>

        {/* Buses, taps and traces. */}
        <g aria-hidden>
          {circuit.buses.map((b) => {
            const lit = highlight?.buses.has(b.id) ?? false;
            return <path key={b.id} d={b.d} fill="none" stroke={lit ? "var(--color-accent)" : "#5a5f6d"} strokeWidth={4} strokeLinecap="round" className={dim(lit)} />;
          })}
          {circuit.taps.map((t) => {
            const lit = highlight?.taps.has(t.id) ?? false;
            return <path key={t.id} d={t.d} fill="none" stroke={lit ? "var(--color-night-mute)" : "#3a3e4a"} strokeWidth={1.6} className={dim(lit)} />;
          })}
          {circuit.edges.map((e) => {
            const lit = highlight?.edges.has(e.id) ?? false;
            return (
              <g key={e.id} className={dim(lit)}>
                <path d={e.d} fill="none" stroke={lit ? litColor(e.kind) : traceColor[e.kind]} strokeWidth={lit ? 2.4 : 2} strokeLinejoin="round" />
                {lit && <path d={e.d} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={1.4} className={styles.pulse} />}
              </g>
            );
          })}
          {highlight?.routes.map((r) => (
            <g key={r.id}>
              <path d={r.d} fill="none" stroke="var(--color-accent)" strokeWidth={2.6} strokeLinejoin="round" />
              <path d={r.d} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={1.4} className={styles.pulse} />
            </g>
          ))}
        </g>

        {nodesInReadingOrder.map((n) => {
          const lit = !highlight || highlight.nodes.has(n.id);
          const isActive = n.id === active;
          const c = copy.nodes[n.id];
          const x = n.x - n.w / 2;
          const y = n.y - n.h / 2;
          const core = n.id === "orchestrator";
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
              <rect className={styles.ring} x={x - 5} y={y - 5} width={n.w + 10} height={n.h + 10} rx={6} fill="none" stroke="var(--color-night-ink)" strokeWidth={1.5} strokeDasharray="3 3" />
              <rect
                className={styles.body}
                x={x}
                y={y}
                width={n.w}
                height={n.h}
                rx={3}
                fill={isActive ? "#1d1512" : "var(--color-night)"}
                stroke={isActive ? "var(--color-accent)" : kindStroke[n.kind]}
                strokeWidth={isActive || core ? 2 : 1.2}
              />
              <text x={x + 6} y={y - 5} fontSize={8} fill="var(--color-night-mute)" letterSpacing={1} style={{ fontFamily: "var(--font-mono)" }}>
                {n.designator}
              </text>
              {n.status === "live" && <circle cx={x + n.w - 8} cy={y + 8} r={2.6} fill="var(--color-ok)" />}
              <text x={n.x} y={n.y - 2} fontSize={core ? 14 : 12} fontWeight={600} textAnchor="middle" fill="var(--color-night-ink)">
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
      {(Object.keys(legendSwatch) as LegendKey[]).map((k) => (
        <li key={k} className="inline-flex items-center gap-2">
          <svg aria-hidden width="22" height="6" viewBox="0 0 22 6">
            <line x1="1" y1="3" x2="21" y2="3" stroke={legendSwatch[k].color} strokeWidth={legendSwatch[k].width} strokeLinecap="round" />
          </svg>
          {copy.legend[k]}
        </li>
      ))}
      <li className="inline-flex items-center gap-2">
        <span aria-hidden className="size-2 rounded-full bg-ok" />
        {copy.status.liveDot}
      </li>
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

  const chip = (id: string, accent?: boolean) => (
    <li key={id}>
      <button
        type="button"
        onClick={() => select(id)}
        className={clsx(
          "mono rounded-full border px-2.5 py-1 text-[0.7rem] text-night-ink hover:border-accent",
          accent ? "border-accent/60" : "border-night-line",
        )}
      >
        {label(id)}
      </button>
    </li>
  );

  const agentSpec = activeNode && isAgent(activeNode.id) ? circuit.agents[activeNode.id] : undefined;
  const agentCopy = activeNode ? copy.agents[activeNode.id] : undefined;
  const statusLine = activeNode
    ? activeNode.id === "n8n"
      ? copy.status.n8n
      : activeNode.status === "live"
        ? copy.status.live
        : copy.status.capability
    : "";

  return (
    <div ref={rootRef} className={clsx("on-night grid scroll-mt-24 gap-px overflow-hidden rounded-md border border-night-line bg-night-line text-night-ink lg:grid-cols-12", className)}>
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
            {circuit.layers.map((l) => (
              <optgroup key={l.id} label={copy.layers[l.id]}>
                {nodesInReadingOrder
                  .filter((n) => n.layer === l.id || (l.id === "orchestration" && n.layer === "models"))
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.designator} · {label(n.id)}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        {activeNode ? (
          <div className="flex flex-col gap-5">
            <div>
              <p className="mono text-[0.7rem] text-night-mute">
                {activeNode.designator} · {copy.inspector.layer}: {copy.layers[activeNode.layer]}
              </p>
              <p className="mt-2 text-2xl font-medium tracking-tight">{label(activeNode.id)}</p>
              <p className="mt-3 text-sm leading-relaxed text-night-mute">{copy.nodes[activeNode.id]?.role}</p>
              <p className={clsx("mono mt-3 flex items-start gap-2 text-[0.7rem] leading-relaxed", activeNode.status === "live" ? "text-ok" : "text-night-mute")}>
                <span aria-hidden className={clsx("mt-1 size-2 shrink-0 rounded-full", activeNode.status === "live" ? "bg-ok" : "border border-night-mute")} />
                {statusLine}
              </p>
            </div>

            {agentSpec && agentCopy ? (
              <dl className="grid gap-4 text-sm">
                <div>
                  <dt className="eyebrow mb-1.5">{copy.inspector.responsibility}</dt>
                  <dd>{agentCopy.responsibility}</dd>
                </div>
                <div>
                  <dt className="eyebrow mb-1.5">{copy.inspector.inputs}</dt>
                  <dd className="text-night-mute">{agentCopy.inputs}</dd>
                </div>
                <div>
                  <dt className="eyebrow mb-2">{copy.inspector.tools}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">{agentSpec.tools.map((t) => chip(t, true))}</ul>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow mb-2">
                    {copy.inspector.models} <span className="normal-case tracking-normal">· {copy.inspector.viaRouter}</span>
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">{agentSpec.models.map((m) => chip(m))}</ul>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow mb-1.5">{copy.inspector.output}</dt>
                  <dd className="text-night-mute">{agentCopy.output}</dd>
                </div>
                <div>
                  <dt className="eyebrow mb-2">{copy.inspector.checkpoint}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">{chip(agentSpec.checkpoint)}</ul>
                  </dd>
                </div>
              </dl>
            ) : (
              <div>
                <p className="eyebrow mb-2">{copy.inspector.related}</p>
                <ul className="flex flex-wrap gap-1.5">{related.map((r) => chip(r.id))}</ul>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium">{copy.ui.idle}</p>
            <p className="mt-2 text-sm leading-relaxed text-night-mute">{copy.ui.idleBody}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">{featured.map((id) => chip(id))}</ul>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {selected ? interpolate(copy.ui.live, { label: label(selected), count: (highlightFor(selected)?.nodes.size ?? 1) - 1 }) : ""}
        </p>
      </aside>
    </div>
  );
}
