"use client";

import { useId, useRef, useState } from "react";
import { clsx } from "clsx";
import { ArrowRight, Check } from "lucide-react";
import { agentIds, pipelineIds, type AgentId, type AiNativeContent } from "@/content/ai-native";

export function AgentSystem({ copy }: { copy: AiNativeContent["agents"] }) {
  const [selected, setSelected] = useState<AgentId>("frontend");
  const tabRefs = useRef<Map<AgentId, HTMLButtonElement>>(new Map());
  const baseId = useId();
  const agent = copy.items[selected];

  const onKey = (e: React.KeyboardEvent, index: number) => {
    const last = agentIds.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const id = agentIds[next];
    if (!id) return;
    setSelected(id);
    tabRefs.current.get(id)?.focus();
  };

  return (
    <div className="flex flex-col gap-px overflow-hidden rounded-md border border-night-line bg-night-line">
      <div className="grid gap-4 bg-night-2 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:p-7">
        <p className="flex items-center gap-3">
          <span aria-hidden className="size-2.5 rounded-full bg-accent" />
          <span className="text-xl font-medium tracking-tight">{copy.orchestrator}</span>
        </p>
        <p className="max-w-[60ch] text-sm text-night-mute">{copy.orchestratorBody}</p>
      </div>

      <div className="bg-night p-3 sm:p-4">
        <p id={`${baseId}-label`} className="sr-only">{copy.selectLabel}</p>
        <div role="tablist" aria-labelledby={`${baseId}-label`} className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {agentIds.map((id, i) => {
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
                <span aria-hidden className={clsx("absolute -top-3 left-1/2 hidden h-3 w-px lg:block", on ? "bg-accent" : "bg-night-line")} />
                <span className="mono text-[0.65rem] uppercase tracking-wider text-night-mute">{copy.items[id].focus}</span>
                <span className="text-sm font-medium leading-tight text-night-ink">{copy.items[id].name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${selected}`}
        className="grid gap-px bg-night-line sm:grid-cols-2 lg:grid-cols-4"
      >
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
        <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
          {pipelineIds.map((id, i) => (
            <li key={id} className="flex items-start gap-3 lg:flex-col lg:gap-2 lg:pr-4">
              <span className="flex items-center gap-2">
                <span className={clsx("mono text-sm font-medium", id === "production" ? "text-ok" : "text-night-ink")}>{copy.pipeline[id].label}</span>
                {i < pipelineIds.length - 1 && <ArrowRight className="hidden size-3.5 text-night-mute lg:block" aria-hidden />}
              </span>
              <span className="text-xs text-night-mute">{copy.pipeline[id].detail}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
