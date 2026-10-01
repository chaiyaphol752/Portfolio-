"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import type { AiNativeContent } from "@/content/ai-native";
import { criteria, decideRoute, pathFor, type Criterion } from "./routing";
import styles from "./ai-native.module.css";

type NodeId = "app" | "router" | "cloud" | "local" | "tools" | "validation" | "result";

const W = 400;
const nodes: Record<NodeId, { x: number; y: number; w: number; h: number }> = {
  app: { x: 200, y: 34, w: 230, h: 44 },
  router: { x: 200, y: 118, w: 230, h: 44 },
  cloud: { x: 104, y: 214, w: 176, h: 56 },
  local: { x: 296, y: 214, w: 176, h: 56 },
  tools: { x: 200, y: 312, w: 230, h: 56 },
  validation: { x: 200, y: 404, w: 230, h: 44 },
  result: { x: 200, y: 484, w: 230, h: 44 },
};
const H = 520;

const edges: [NodeId, NodeId][] = [
  ["app", "router"],
  ["router", "cloud"],
  ["router", "local"],
  ["cloud", "tools"],
  ["local", "tools"],
  ["tools", "validation"],
  ["validation", "result"],
];

function edgePath(a: NodeId, b: NodeId) {
  const s = nodes[a];
  const t = nodes[b];
  const sy = s.y + s.h / 2;
  const ty = t.y - t.h / 2;
  if (Math.abs(s.x - t.x) < 1) return `M${s.x} ${sy} L${t.x} ${ty}`;
  const mid = (sy + ty) / 2;
  const sx = s.x + (t.x > s.x ? 30 : -30) * (a === "router" ? 1 : 0);
  const tx = t.x + (s.x > t.x ? 30 : -30) * (b === "tools" ? 1 : 0);
  return `M${sx} ${sy} L${sx} ${mid} L${tx} ${mid} L${tx} ${ty}`;
}

export function HybridRouter({ copy }: { copy: AiNativeContent["hybrid"] }) {
  const [active, setActive] = useState<Set<Criterion>>(() => new Set());
  const decision = useMemo(() => decideRoute(active), [active]);
  const lit = pathFor(decision.route);

  const toggle = (c: Criterion) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  const label = (id: NodeId) => copy.nodes[id];
  const sub: Partial<Record<NodeId, string>> = { cloud: copy.nodes.cloudSub, local: copy.nodes.localSub, tools: copy.nodes.toolsSub };

  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-night-line bg-night-line lg:grid-cols-12">
      <div className="flex flex-col gap-6 bg-night-2 p-5 sm:p-7 lg:col-span-5">
        <fieldset>
          <legend className="eyebrow mb-4">{copy.criteriaLabel}</legend>
          <ul className="flex flex-col gap-2">
            {criteria.map((c) => {
              const on = active.has(c);
              return (
                <li key={c}>
                  <label
                    className={clsx(
                      "flex cursor-pointer items-start gap-4 rounded-md border px-4 py-3 transition-colors",
                      on ? "border-accent bg-night-3" : "border-night-line hover:border-night-mute",
                    )}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggle(c)} className="peer sr-only" />
                    <span
                      aria-hidden
                      className={clsx(
                        "relative mt-0.5 inline-flex h-5 w-9 shrink-0 rounded-full border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-night-ink",
                        on ? "border-accent bg-accent" : "border-night-line bg-night",
                      )}
                    >
                      <span className={clsx("absolute top-0.5 size-3.5 rounded-full bg-night-ink transition-transform", on ? "translate-x-[18px]" : "translate-x-0.5")} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-night-ink">{copy.criteria[c].label}</span>
                      <span className="block text-xs text-night-mute">{copy.criteria[c].hint}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div aria-live="polite" className="border-t border-night-line pt-5">
          <p className="eyebrow">{copy.resultLabel}</p>
          <p className="mt-2 text-2xl font-medium tracking-tight text-night-ink">{copy.routes[decision.route].title}</p>
          <p className="mt-2 text-sm text-night-mute">{copy.routes[decision.route].body}</p>
          <p className="mono mt-4 text-[0.72rem] text-night-mute">
            {copy.decidedBy}:{" "}
            {decision.decidedBy.length ? decision.decidedBy.map((c) => copy.criteria[c].label).join(" + ") : copy.defaultReason}
          </p>
        </div>
      </div>

      <figure className="grid-night flex flex-col justify-between gap-4 p-5 sm:p-7 lg:col-span-7">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[460px]" role="img" aria-label={`${copy.routes[decision.route].title}: ${(Object.keys(nodes) as NodeId[]).filter((n) => lit.has(n)).map(label).join(" → ")}`} style={{ fontFamily: "var(--font-sans)" }}>
          {edges.map(([a, b]) => {
            const on = lit.has(a) && lit.has(b);
            const d = edgePath(a, b);
            return (
              <g key={`${a}-${b}`}>
                <path d={d} fill="none" stroke={on ? "var(--color-accent)" : "var(--color-trace)"} strokeWidth={on ? 2.25 : 1.5} strokeLinejoin="round" opacity={on ? 1 : 0.6} />
                {on && <path d={d} fill="none" stroke="#fff" strokeWidth={1.5} strokeOpacity={0.8} className={styles.pulse} />}
              </g>
            );
          })}
          {(Object.keys(nodes) as NodeId[]).map((id) => {
            const n = nodes[id];
            const on = lit.has(id);
            const s = sub[id];
            const isModel = id === "cloud" || id === "local";
            return (
              <g key={id} opacity={on ? 1 : 0.35}>
                <rect
                  x={n.x - n.w / 2}
                  y={n.y - n.h / 2}
                  width={n.w}
                  height={n.h}
                  rx={3}
                  fill={on && isModel ? "#1d1512" : "var(--color-night)"}
                  stroke={on ? (isModel || id === "router" ? "var(--color-accent)" : "var(--color-night-ink)") : "var(--color-night-line)"}
                  strokeWidth={on ? 1.5 : 1}
                />
                <text x={n.x} y={s ? n.y - 3 : n.y + 4.5} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-night-ink)">
                  {label(id)}
                </text>
                {s && (
                  <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize={9.5} fill="var(--color-night-mute)" style={{ fontFamily: "var(--font-mono)" }}>
                    {s}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <figcaption className="mono text-xs text-night-mute">{copy.simulation}</figcaption>
      </figure>
    </div>
  );
}
