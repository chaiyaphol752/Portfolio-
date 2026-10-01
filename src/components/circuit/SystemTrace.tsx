"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { Check, ChevronDown, X } from "lucide-react";
import { interpolate } from "@/lib/interpolate";
import { circuit, highlightFor, highlightForWorkflow, isAgent, nodeById, type StageId, type WorkflowId } from "./circuit-data";
import type { CircuitCopy } from "./labels";
import { NodeDetail } from "./NodeDetail";
import styles from "./SystemTrace.module.css";

interface Props {
  copy: CircuitCopy;
  selected: string | null;
  workflow: WorkflowId | null;
  onSelect: (id: string | null) => void;
}

const stage = (id: StageId) => circuit.stages.find((s) => s.id === id)!;
const agentIds = stage("agents").nodeIds;
const cloudModels = ["chatgpt", "claude"];
const primaryTools = ["n8n", "python"];

/**
 * Tablet and mobile presentation: the same architecture told as a vertical story, stage by
 * stage. Details open inline under the tapped component; nothing depends on hover.
 */
export function SystemTrace({ copy, selected, workflow, onSelect }: Props) {
  const highlight = useMemo(() => (selected ? highlightFor(selected) : highlightForWorkflow(workflow)), [selected, workflow]);
  const panelId = useId();
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // The agents list opens by itself when the selection or workflow involves an agent,
  // but the visitor can still close it.
  const ctxKey = `${selected}|${workflow}`;
  const forced = (selected !== null && isAgent(selected)) || (!!highlight && agentIds.some((a) => highlight.nodes.has(a)));
  const [userOpen, setUserOpen] = useState(false);
  const [override, setOverride] = useState<{ key: string; open: boolean } | null>(null);
  const agentsOpen = override?.key === ctxKey ? override.open : forced || userOpen;

  useEffect(() => {
    if (!selected || !panelRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panelRef.current.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [selected]);

  const stateOf = (id: string) => {
    const inSet = !highlight || highlight.nodes.has(id);
    return { inSet, step: highlight?.stepOf?.get(id), isSelected: selected === id };
  };

  const tile = (id: string, size: "lg" | "md" | "sm" = "md") => {
    const n = nodeById.get(id);
    if (!n) return null;
    const { inSet, step, isSelected } = stateOf(id);
    const c = copy.nodes[id];
    return (
      <li key={id} className="min-w-0">
        <button
          type="button"
          onClick={() => onSelect(isSelected ? null : id)}
          aria-pressed={isSelected}
          aria-expanded={isSelected}
          aria-controls={isSelected ? panelId : undefined}
          className={clsx(
            styles.tile,
            "relative flex w-full min-w-0 items-start gap-3 rounded-md border bg-night text-left",
            size === "lg" ? "min-h-16 px-4 py-3.5" : size === "md" ? "min-h-14 px-3.5 py-3" : "min-h-12 px-3 py-2.5",
            isSelected ? "border-2 border-accent" : n.type === "core" ? "border-accent/70" : "border-night-line hover:border-night-mute",
            !inSet && styles.dim,
          )}
        >
          {step !== undefined && (
            <span className="mono grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-white" aria-hidden>
              {step}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className={clsx("block font-medium leading-snug break-words", size === "lg" ? "text-lg" : "text-[0.95rem]")}>{c?.label ?? n.label}</span>
            <span className="mono mt-0.5 block text-xs leading-snug text-night-mute break-words">{c?.sub ?? n.sub}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2 pt-1">
            {n.status === "live" && <span aria-hidden className="size-2 rounded-full bg-ok" />}
            {isSelected && <Check className="size-4 text-accent" aria-hidden />}
          </span>
          {step !== undefined && <span className="sr-only">{interpolate(copy.ui.step, { n: step })}</span>}
        </button>
      </li>
    );
  };

  const panelFor = (ids: string[]) =>
    selected && ids.includes(selected) ? (
      <div ref={panelRef} id={panelId} role="region" aria-labelledby={headingId} className="mt-4 scroll-mt-28 rounded-md border border-night-line bg-night-2 p-4 sm:p-5">
        <div className="mb-3 flex justify-end">
          <button type="button" onClick={() => onSelect(null)} className="mono inline-flex min-h-11 items-center gap-2 rounded-full border border-night-line px-4 text-xs hover:border-night-ink">
            <X className="size-4" aria-hidden />
            {copy.ui.close}
          </button>
        </div>
        <NodeDetail id={selected} copy={copy} onSelect={(id) => onSelect(id)} headingLevel={4} headingId={headingId} />
      </div>
    ) : null;

  const stageLit = (ids: string[]) => !highlight || ids.some((id) => highlight.nodes.has(id));

  const stageBlock = (id: StageId, children: React.ReactNode, opts: { half?: boolean; extra?: React.ReactNode; afterPair?: boolean } = {}) => {
    const s = stage(id);
    const lit = stageLit(s.nodeIds);
    return (
      <li key={id} className={clsx(styles.stage, opts.half && styles.half, opts.afterPair && styles.afterPair)} data-lit={highlight ? lit : undefined} aria-labelledby={`stage-${id}`}>
        {opts.extra}
        <span aria-hidden className={styles.junction} />
        <section className={clsx("rounded-md border bg-night-2/60 p-4 sm:p-5", id === "orchestrator" ? "border-accent" : "border-night-line", highlight && !lit && "opacity-60")}>
          <h3 id={`stage-${id}`} className="eyebrow">{copy.stages[id].label}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-night-mute">{copy.stages[id].summary}</p>
          <div className="mt-4">{children}</div>
          {panelFor(s.nodeIds)}
        </section>
      </li>
    );
  };

  const orchestrator = nodeById.get("orchestrator")!;
  const orchCopy = copy.nodes.orchestrator;

  return (
    <div>
      <p className="mono mb-5 text-xs text-night-mute">{copy.ui.tapHint}</p>
      <ol className={styles.stages} aria-label={copy.ui.traceLabel}>
        {stageBlock("intent", (<>
          <ul className="grid gap-2 min-[480px]:grid-cols-2">{["client", "goal"].map((n) => tile(n, "md"))}</ul>
          <ul className="mt-2 grid gap-2 min-[480px]:grid-cols-2 md:grid-cols-3">{["form", "triggers", "application"].map((n) => tile(n, "sm"))}</ul>
        </>))}

        {stageBlock("orchestrator", (<>
          {(() => {
            const { inSet, step, isSelected } = stateOf("orchestrator");
            return (
              <button
                type="button"
                onClick={() => onSelect(isSelected ? null : "orchestrator")}
                aria-pressed={isSelected}
                aria-expanded={isSelected}
                aria-controls={isSelected ? panelId : undefined}
                className={clsx(styles.tile, "relative block w-full rounded-md border-2 bg-night p-4 text-left sm:p-5", isSelected ? "border-accent" : "border-accent/70", !inSet && styles.dim)}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-2xl font-semibold tracking-tight sm:text-3xl">{orchCopy?.label ?? orchestrator.label}</span>
                    <span className="mono mt-1 block text-xs text-night-mute">{orchCopy?.sub}</span>
                  </span>
                  {step !== undefined && (
                    <span className="mono grid size-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-white" aria-hidden>
                      {step}
                    </span>
                  )}
                  {isSelected && <Check className="size-5 shrink-0 text-accent" aria-hidden />}
                </span>
                <span className="mt-3 block text-[0.95rem] leading-relaxed text-night-ink/90">{orchCopy?.role}</span>
                <span className="mt-4 flex flex-wrap gap-1.5" aria-hidden>
                  {(orchCopy?.uses ?? []).slice(0, 6).map((u) => (
                    <span key={u} className="rounded-md border border-night-line px-2 py-1 text-xs text-night-mute">
                      {u}
                    </span>
                  ))}
                </span>
              </button>
            );
          })()}
          <ul className="mt-2 grid gap-2">{tile("state", "sm")}</ul>
        </>))}

        {stageBlock("plan-route", (<>
          <ul className="grid gap-2">{tile("planner")}</ul>
          <p aria-hidden className="mono py-1 pl-4 text-night-mute">↓</p>
          <ul className="grid gap-2 min-[480px]:grid-cols-2">{["agent-router", "model-router"].map((n) => tile(n))}</ul>
        </>))}

        {stageBlock("agents", (<>
          <details
            open={agentsOpen}
            onToggle={(e) => {
              const open = e.currentTarget.open;
              if (open !== agentsOpen) {
                setUserOpen(open);
                setOverride({ key: ctxKey, open });
              }
            }}
            className="group"
          >
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-md border border-night-line bg-night px-4 py-2.5 text-[0.95rem] font-medium hover:border-night-mute [&::-webkit-details-marker]:hidden">
              <span>{agentsOpen ? copy.ui.hideAgents : interpolate(copy.ui.showAgents, { count: agentIds.length })}</span>
              <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <ul className="mt-3 grid gap-2 min-[390px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{agentIds.map((a) => tile(a, "sm"))}</ul>
          </details>
        </>))}

        {stageBlock("models", (<>
          <p className="mono mb-2 text-xs uppercase tracking-wider text-night-mute">{copy.ui.cloud}</p>
          <ul className="grid gap-2">{cloudModels.map((m) => tile(m))}</ul>
          <p className="mono mb-2 mt-4 text-xs uppercase tracking-wider text-night-mute">{copy.ui.local}</p>
          <ul className="grid gap-2">{tile("local-ai")}</ul>
        </>), { half: true, extra: (<><span aria-hidden className={styles.fork} /><span aria-hidden className={styles.join} /></>) })}

        {stageBlock("tools", (<>
          <p className="mono mb-2 text-xs uppercase tracking-wider text-night-mute">{copy.ui.primaryTools}</p>
          <ul className="grid gap-2">{primaryTools.map((t) => tile(t, "lg"))}</ul>
          <p className="mono mb-2 mt-4 text-xs uppercase tracking-wider text-night-mute">{copy.ui.moreTools}</p>
          <ul className="grid gap-2 min-[480px]:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">{["apis", "webhooks", "file-data", "browser"].map((t) => tile(t, "sm"))}</ul>
        </>), { half: true })}

        {stageBlock("data", (<>
          <ul className="grid gap-2 min-[480px]:grid-cols-2 lg:grid-cols-4">{stage("data").nodeIds.map((n) => tile(n, "sm"))}</ul>
        </>), { afterPair: true })}

        {stageBlock("control", (<>
          <ul className="grid gap-2 min-[480px]:grid-cols-2">{["validation", "approval"].map((n) => tile(n))}</ul>
        </>))}

        {stageBlock("delivery", (<>
          <ul className="grid gap-2 min-[480px]:grid-cols-2 lg:grid-cols-4">{["github", "vercel", "production", "email"].map((n) => tile(n, "sm"))}</ul>
        </>))}
      </ol>
    </div>
  );
}
