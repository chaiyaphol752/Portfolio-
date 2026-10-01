"use client";

import { useId, useRef, useState } from "react";
import { clsx } from "clsx";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { agentIds, pipelineIds, type AgentId, type AiNativeContent, type PipelineId } from "@/content/ai-native";
import { circuit } from "@/components/circuit/circuit-data";
import { circuitCopy, stepLabel } from "@/components/circuit/labels";

/** Splits the generated development flow into: lead steps, the parallel agent branch, and the delivery pipeline. */
export function splitDevelopmentFlow(steps = circuit.flows.development) {
  const branchIndex = steps.findIndex((s) => Array.isArray(s));
  const lead = steps.slice(0, branchIndex) as string[];
  const branch = ((steps[branchIndex] ?? []) as string[]).map((s) => s.replace(/-agent$/, "")) as AgentId[];
  const pipeline = steps.slice(branchIndex + 1) as PipelineId[];
  return { lead, branch, pipeline };
}

const { lead, branch, pipeline } = splitDevelopmentFlow();
// Content keys must match the generated flow; tests enforce it, this keeps types honest at runtime.
const agents = branch.filter((id): id is AgentId => (agentIds as readonly string[]).includes(id));
const pipelineSteps = pipeline.filter((id): id is PipelineId => (pipelineIds as readonly string[]).includes(id));

export function AgentSystem({ copy, locale }: { copy: AiNativeContent["agents"]; locale: Locale }) {
  const [selected, setSelected] = useState<AgentId>(agents[0] ?? "frontend");
  const tabRefs = useRef<Map<AgentId, HTMLButtonElement>>(new Map());
  const baseId = useId();
  const agent = copy.items[selected];
  const labels = circuitCopy[locale];

  const onKey = (e: React.KeyboardEvent, index: number) => {
    const last = agents.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const id = agents[next];
    if (!id) return;
    setSelected(id);
    tabRefs.current.get(id)?.focus();
  };

  return (
    <div className="flex flex-col gap-px overflow-hidden rounded-md border border-night-line bg-night-line">
      <div className="grid gap-4 bg-night-2 p-5 sm:p-7 lg:grid-cols-12 lg:items-center">
        <ol className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 lg:col-span-6">
          {lead.map((id, i) => (
            <li key={id} className="flex items-center gap-3">
              <span className={clsx("rounded-md border px-3 py-2 text-sm font-medium", i === 0 ? "border-accent" : "border-night-line")}>{stepLabel(labels, id)}</span>
              {i < lead.length - 1 && <ArrowRight className="hidden size-4 text-night-mute sm:block" aria-hidden />}
            </li>
          ))}
        </ol>
        <p className="max-w-[60ch] text-sm text-night-mute lg:col-span-6">{copy.orchestratorBody}</p>
      </div>

      <div className="bg-night p-3 sm:p-4">
        <p id={`${baseId}-label`} className="sr-only">{copy.selectLabel}</p>
        <div role="tablist" aria-labelledby={`${baseId}-label`} className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {agents.map((id, i) => {
            const on = id === selected;
            return (
              <button
                key={id}
                ref={(el) => {
                  if (el) tabRefs.current.set(id, el);
                }}
                role="tab"
                id={`${baseId}-tab-${id}`}
                aria-selected={on}
                aria-controls={`${baseId}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setSelected(id)}
                onKeyDown={(e) => onKey(e, i)}
                className={clsx(
                  "relative flex min-h-20 flex-col items-start justify-between gap-2 rounded-md border px-3 py-3 text-left transition-colors",
                  on ? "border-accent bg-night-3" : "border-night-line hover:border-night-mute",
                )}
              >
                <span className="mono text-[0.65rem] uppercase tracking-wider text-night-mute">{copy.items[id].focus}</span>
                <span className="text-sm font-medium leading-tight text-night-ink">{copy.items[id].name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${selected}`} className="grid gap-px bg-night-line sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-night-2 p-5 sm:p-6">
          <p className="eyebrow mb-3">{copy.responsibilities}</p>
          <ul className="space-y-1.5 text-sm">
            {agent.responsibilities.map((r) => (
              <li key={r} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 bg-accent" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-night-2 p-5 sm:p-6">
          <p className="eyebrow mb-3">{copy.inputs}</p>
          <p className="text-sm">{agent.inputs}</p>
        </div>
        <div className="bg-night-2 p-5 sm:p-6">
          <p className="eyebrow mb-3">{copy.outputs}</p>
          <p className="text-sm">{agent.outputs}</p>
        </div>
        <div className="bg-night-2 p-5 sm:p-6">
          <p className="eyebrow mb-3">{copy.gate}</p>
          <p className="flex items-start gap-2 text-sm text-ok">
            <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
            {agent.gate}
          </p>
        </div>
      </div>

      <div className="bg-night p-5 sm:p-7">
        <p className="eyebrow mb-4">{copy.pipelineLabel}</p>
        <ol className="flex flex-col gap-2 lg:flex-row lg:items-start lg:gap-0">
          {pipelineSteps.map((id, i) => (
            <li key={id} className="flex flex-col gap-2 lg:flex-1 lg:flex-row lg:gap-0">
              <div className="flex flex-col gap-1 lg:pr-3">
                <span className={clsx("mono text-sm font-medium", id === "production" ? "text-ok" : "text-night-ink")}>{copy.pipeline[id].label}</span>
                <span className="text-xs text-night-mute">{copy.pipeline[id].detail}</span>
              </div>
              {i < pipelineSteps.length - 1 && (
                <span aria-hidden className="text-night-mute lg:ml-auto lg:pr-3 lg:pt-0.5">
                  <ArrowDown className="size-3.5 lg:hidden" />
                  <ArrowRight className="hidden size-3.5 lg:block" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
