"use client";

import { useId, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { interpolate } from "@/lib/interpolate";
import {
  circuit,
  desktop,
  highlightFor,
  highlightForWorkflow,
  nearestNode,
  nodeById,
  nodesInReadingOrder,
  type ConnectionKind,
  type NodeType,
  type WorkflowId,
} from "./circuit-data";
import type { CircuitCopy, LegendKey } from "./labels";
import { NodeDetail } from "./NodeDetail";
import styles from "./CircuitBoard.module.css";

interface Props {
  copy: CircuitCopy;
  selected: string | null;
  workflow: WorkflowId | null;
  onSelect: (id: string | null) => void;
}

const typeStroke: Record<NodeType, string> = {
  input: "var(--color-night-ink)",
  core: "var(--color-accent)",
  model: "var(--color-night-ink)",
  agent: "var(--color-night-mute)",
  tool: "var(--color-night-ink)",
  data: "var(--color-ok)",
  control: "var(--color-ok)",
  delivery: "var(--color-night-ink)",
};

const traceColor: Record<ConnectionKind, string> = {
  flow: "#3a3e4a",
  delivery: "#3a3e4a",
  model: "#5a5f6d",
  "agent-bus": "#5a5f6d",
  automation: "#9c2a0d",
  data: "#2f6b4f",
  control: "#2f6b4f",
};
const litColor = (kind: ConnectionKind) => (kind === "data" || kind === "control" ? "var(--color-ok)" : "var(--color-accent)");

const legendSwatch: Record<LegendKey, { color: string; width: number }> = {
  flow: { color: "#6b6f7b", width: 2 },
  bus: { color: "#5a5f6d", width: 4 },
  automation: { color: "var(--color-accent)", width: 2 },
  control: { color: "var(--color-ok)", width: 2 },
};

const featured = ["orchestrator", "n8n", "python", "chatgpt", "claude", "local-ai", "research-agent"] as const;

/**
 * The full layered architecture board, used at ≥1280px. Controlled: selection and the
 * active workflow live in OrchestrationExplorer so every presentation stays in sync.
 */
export function ArchitectureBoard({ copy, selected, workflow, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string>(selected ?? "orchestrator");
  const nodeRefs = useRef<Map<string, SVGGElement>>(new Map());
  const titleId = useId();
  const selectId = useId();
  const detailHeadingId = useId();

  const active = hovered ?? selected;
  const highlight = useMemo(() => (active ? highlightFor(active) : highlightForWorkflow(workflow)), [active, workflow]);
  const label = (id: string) => copy.nodes[id]?.label ?? nodeById.get(id)?.label ?? id;
  const [, , vbW = 1340, vbH = 1040] = desktop.viewBox;

  const select = (id: string | null) => {
    onSelect(id && id === selected ? null : id);
    if (id) setFocusId(id);
  };

  const onNodeKey = (e: React.KeyboardEvent, id: string) => {
    const dir = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" } as const;
    if (e.key in dir) {
      e.preventDefault();
      const next = nearestNode(id, dir[e.key as keyof typeof dir]);
      if (next) {
        setFocusId(next);
        nodeRefs.current.get(next)?.focus();
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(id);
    } else if (e.key === "Escape") {
      onSelect(null);
    }
  };

  const dim = (lit: boolean) => (highlight ? (lit ? styles.lit : styles.dimmed) : undefined);
  const mb = desktop.modelBox;
  const caption = interpolate(copy.ui.caption, {
    generator: circuit.meta.generator,
    hash: circuit.meta.topologyHash,
    nodes: circuit.meta.nodeCount,
    connections: circuit.meta.connectionCount,
    agents: circuit.meta.agentCount,
  });

  return (
    <div className="on-night grid gap-px overflow-hidden rounded-md border border-night-line bg-night-line text-night-ink 2xl:grid-cols-12">
      <figure className="grid-night min-w-0 2xl:col-span-9">
        <p className="mono px-5 pt-4 text-xs text-night-mute">{copy.ui.keyboardHint}</p>
        <div className="p-4" onKeyDown={(e) => e.key === "Escape" && onSelect(null)}>
          <svg
            viewBox={`0 0 ${vbW} ${vbH}`}
            role="group"
            aria-labelledby={titleId}
            className={clsx(styles.board, "block h-auto w-full")}
            style={{ fontFamily: "var(--font-sans)" }}
            onMouseLeave={() => setHovered(null)}
          >
            <title id={titleId}>{copy.ui.boardLabel}</title>

            <g aria-hidden>
              {desktop.layers.map((l) => {
                const cy = (l.y0 + l.y1) / 2;
                return (
                  <g key={l.id}>
                    <rect x={16} y={l.y0} width={vbW - 32} height={l.y1 - l.y0} fill="#14161c" fillOpacity={0.55} stroke="#22252e" />
                    <text
                      x={desktop.labelX}
                      y={cy}
                      transform={`rotate(-90 ${desktop.labelX} ${cy})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={10}
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
              <text x={mb.x1} y={mb.y0 - 6} textAnchor="end" fontSize={10} letterSpacing={1} fill="var(--color-night-mute)" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                {copy.layers.models}
              </text>
            </g>

            <g aria-hidden>
              {desktop.buses.map((b) => {
                const lit = highlight?.buses.has(b.id) ?? false;
                return <path key={b.id} d={b.d} fill="none" stroke={lit ? "var(--color-accent)" : "#5a5f6d"} strokeWidth={4} strokeLinecap="round" className={dim(lit)} />;
              })}
              {desktop.taps.map((t) => {
                const lit = highlight?.taps.has(t.id) ?? false;
                return <path key={t.id} d={t.d} fill="none" stroke={lit ? "var(--color-night-mute)" : "#3a3e4a"} strokeWidth={1.6} className={dim(lit)} />;
              })}
              {desktop.traces.map((t) => {
                const lit = highlight?.traces.has(t.id) ?? false;
                return (
                  <g key={t.id} className={dim(lit)}>
                    <path d={t.d} fill="none" stroke={lit ? litColor(t.kind) : traceColor[t.kind]} strokeWidth={lit ? 2.6 : 2} strokeLinejoin="round" />
                    {lit && <path d={t.d} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={1.4} className={styles.pulse} />}
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
              const p = desktop.positions[n.id]!;
              const lit = !highlight || highlight.nodes.has(n.id);
              const isActive = n.id === active;
              const c = copy.nodes[n.id];
              const x = p.x - p.w / 2;
              const y = p.y - p.h / 2;
              const core = n.id === "orchestrator";
              const step = highlight?.stepOf?.get(n.id);
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
                  aria-label={`${c?.label ?? n.label} — ${c?.sub ?? n.sub}${step ? ` · ${interpolate(copy.ui.step, { n: step })}` : ""}`}
                  className={clsx(styles.node, highlight && (lit ? styles.lit : styles.dimmed))}
                  onClick={() => select(n.id)}
                  onMouseEnter={() => setHovered(n.id)}
                  onFocus={() => setFocusId(n.id)}
                  onKeyDown={(e) => onNodeKey(e, n.id)}
                >
                  <rect className={styles.ring} x={x - 5} y={y - 5} width={p.w + 10} height={p.h + 10} rx={6} fill="none" stroke="var(--color-night-ink)" strokeWidth={1.5} strokeDasharray="3 3" />
                  <rect
                    className={styles.body}
                    x={x}
                    y={y}
                    width={p.w}
                    height={p.h}
                    rx={3}
                    fill={isActive ? "#1d1512" : "var(--color-night)"}
                    stroke={isActive ? "var(--color-accent)" : typeStroke[n.type]}
                    strokeWidth={isActive ? 2.6 : core ? 2 : 1.2}
                  />
                  <text x={x + 6} y={y - 5} fontSize={9} fill="var(--color-night-mute)" letterSpacing={1} style={{ fontFamily: "var(--font-mono)" }}>
                    {p.designator}
                  </text>
                  {n.status === "live" && <circle cx={x + p.w - 8} cy={y + 8} r={2.8} fill="var(--color-ok)" />}
                  <text x={p.x} y={p.y - 2} fontSize={core ? 16 : 14} fontWeight={600} textAnchor="middle" fill="var(--color-night-ink)">
                    {c?.label ?? n.label}
                  </text>
                  <text x={p.x} y={p.y + 14} fontSize={9.5} textAnchor="middle" fill="var(--color-night-mute)" style={{ fontFamily: "var(--font-mono)" }}>
                    {c?.sub ?? n.sub}
                  </text>
                  {step !== undefined && (
                    <g>
                      <circle cx={x} cy={y} r={11} fill="var(--color-accent)" />
                      <text x={x} y={y + 4} fontSize={11} fontWeight={700} textAnchor="middle" fill="#fff">
                        {step}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <figcaption className="flex flex-col gap-4 border-t border-night-line px-5 py-4">
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
          <p className="mono text-xs leading-relaxed text-night-mute">
            {caption} ·{" "}
            <a href="/generated/ai-circuit.svg" className="underline decoration-night-line underline-offset-2 hover:text-night-ink">
              {copy.ui.staticSvg}
            </a>
          </p>
        </figcaption>
      </figure>

      <aside aria-label={copy.ui.inspector} className="flex min-w-0 flex-col gap-6 bg-night-2 p-6 2xl:col-span-3">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-[16rem] flex-1">
            <label htmlFor={selectId} className="eyebrow mb-2 block">
              {copy.ui.selectLabel}
            </label>
            <select
              id={selectId}
              value={selected ?? ""}
              onChange={(e) => onSelect(e.target.value || null)}
              className="min-h-11 w-full rounded-md border border-night-line bg-night px-3 text-sm text-night-ink"
            >
              <option value="">{copy.ui.selectPlaceholder}</option>
              {circuit.stages.map((s) => (
                <optgroup key={s.id} label={copy.stages[s.id].label}>
                  {s.nodeIds.map((id) => (
                    <option key={id} value={id}>
                      {label(id)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          {selected && (
            <button type="button" onClick={() => onSelect(null)} className="mono min-h-11 rounded-full border border-night-line px-4 text-xs hover:border-night-ink">
              {copy.ui.clear}
            </button>
          )}
        </div>

        {selected ? (
          <NodeDetail id={selected} copy={copy} onSelect={(id) => select(id)} headingId={detailHeadingId} />
        ) : (
          <div>
            <p className="text-lg font-medium">{copy.ui.idle}</p>
            <p className="mt-2 text-sm leading-relaxed text-night-mute">{copy.ui.idleBody}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {featured.map((id) => (
                <li key={id}>
                  <button type="button" onClick={() => select(id)} className="inline-flex min-h-10 items-center rounded-full border border-night-line px-3.5 text-[0.82rem] hover:border-accent">
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
