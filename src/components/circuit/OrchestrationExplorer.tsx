"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";
import { CIRCUIT_SELECT_EVENT, circuit, nodeById, workflowSteps, type WorkflowId } from "./circuit-data";
import { circuitCopy } from "./labels";
import { ArchitectureBoard } from "./CircuitBoard";
import { SystemTrace } from "./SystemTrace";

/**
 * One architecture, two presentations. The full layered board renders at ≥1280px; below
 * that the same data is told as a vertical stage trace. Both are server-rendered and
 * switched with CSS; selection and the active workflow are shared.
 */
export function OrchestrationExplorer({ locale }: { locale: Locale }) {
  const copy = circuitCopy[locale];
  const [selected, setSelected] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const select = (id: string | null) => {
    setSelected(id);
    if (id) setWorkflow(null);
  };
  const follow = (id: WorkflowId | null) => {
    setWorkflow(id);
    setSelected(null);
  };

  // The reading key and the flow diagrams elsewhere on the page can select a component here.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!nodeById.has(id)) return;
      setSelected(id);
      setWorkflow(null);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rootRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    window.addEventListener(CIRCUIT_SELECT_EVENT, onSelect);
    return () => window.removeEventListener(CIRCUIT_SELECT_EVENT, onSelect);
  }, []);

  const steps = workflow ? circuit.workflows.find((w) => w.id === workflow)?.steps ?? [] : [];
  const label = (id: string) => copy.nodes[id]?.label ?? id;

  return (
    <div ref={rootRef} className="scroll-mt-24">
      <div className="mb-6 rounded-md border border-night-line bg-night-2/60 p-4 sm:p-5">
        <p id="workflow-label" className="eyebrow mb-3">{copy.ui.workflowLabel}</p>
        <div role="group" aria-labelledby="workflow-label" className="flex flex-wrap gap-2">
          {[null, ...circuit.workflows.map((w) => w.id)].map((id) => {
            const active = workflow === id;
            return (
              <button
                key={id ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => follow(id)}
                className={clsx(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
                  active ? "border-2 border-accent bg-night font-medium text-night-ink" : "border-night-line text-night-ink/85 hover:border-night-mute",
                )}
              >
                {active && <span aria-hidden className="size-1.5 rounded-full bg-accent" />}
                {id ? copy.workflows[id].label : copy.ui.workflowNone}
              </button>
            );
          })}
        </div>

        {workflow && (
          <div className="mt-4 border-t border-night-line pt-4">
            <p className="mono inline-flex rounded-full border border-accent/60 px-2.5 py-1 text-xs uppercase tracking-wider text-accent">{copy.ui.workflowBadge}</p>
            <p className="mt-3 max-w-[60ch] text-[0.95rem] text-night-ink/90">{copy.workflows[workflow].summary}</p>
            <p className="eyebrow mb-2 mt-4">{copy.ui.workflowSteps}</p>
            <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="mono grid size-6 place-items-center rounded-full bg-accent text-xs font-bold text-white" aria-hidden>
                    {i + 1}
                  </span>
                  <span>
                    {Array.isArray(s) ? (
                      <>
                        {s.map(label).join(" · ")} <span className="text-night-mute">({copy.ui.parallel})</span>
                      </>
                    ) : (
                      label(s)
                    )}
                  </span>
                  {i < steps.length - 1 && <span aria-hidden className="px-1 text-night-mute">→</span>}
                </li>
              ))}
            </ol>
            <p className="sr-only" aria-live="polite">
              {interpolate(copy.ui.workflowLive, { label: copy.workflows[workflow].label, count: workflowSteps(workflow).length })}
            </p>
          </div>
        )}
      </div>

      <div className="hidden xl:block">
        <ArchitectureBoard copy={copy} selected={selected} workflow={workflow} onSelect={select} />
      </div>
      <div className="xl:hidden">
        <SystemTrace copy={copy} selected={selected} workflow={workflow} onSelect={select} />
      </div>
    </div>
  );
}
