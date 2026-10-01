"use client";

import { Fragment } from "react";
import { clsx } from "clsx";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";
import { isNode, selectOnCircuit, type FlowStep } from "@/components/circuit/circuit-data";
import { circuitCopy, stepLabel } from "@/components/circuit/labels";

interface Props {
  steps: FlowStep[];
  locale: Locale;
  /** Shown above a group of parallel steps. */
  parallelLabel: string;
  dark?: boolean;
  /** Optional one-line detail under a step, keyed by step id. */
  details?: Partial<Record<string, string>>;
  /** Step ids to emphasise, e.g. n8n in automation flows. */
  emphasis?: string[];
}

/**
 * Renders a generated flow (ids from scripts/generate_ai_circuit.py) as a step diagram:
 * horizontal on wide screens, vertical on phones. Steps that exist on the architecture board
 * are buttons that select them there.
 */
export function FlowDiagram({ steps, locale, parallelLabel, dark = true, details, emphasis = [] }: Props) {
  const copy = circuitCopy[locale];

  const step = (id: string, inGroup = false) => {
    const text = stepLabel(copy, id);
    const strong = emphasis.includes(id);
    const base = clsx(
      "block w-full rounded-md border px-3 py-2 text-left text-sm leading-tight",
      dark ? "border-night-line bg-night-2 text-night-ink" : "border-line bg-paper text-ink",
      strong && "border-accent",
      inGroup && "py-1.5 text-[0.82rem]",
    );
    const detail = details?.[id];
    const body = (
      <>
        <span className="font-medium">{text}</span>
        {detail && <span className={clsx("mono mt-1 block text-[0.68rem] leading-snug", dark ? "text-night-mute" : "text-ink-3")}>{detail}</span>}
      </>
    );
    return isNode(id) ? (
      <button
        type="button"
        onClick={() => selectOnCircuit(id)}
        aria-label={interpolate(copy.ui.showOnBoard, { label: text })}
        className={clsx(base, "transition-colors", dark ? "hover:border-night-ink" : "hover:border-ink")}
      >
        {body}
      </button>
    ) : (
      <span className={base}>{body}</span>
    );
  };

  return (
    <ol className="flex flex-col items-stretch gap-1.5 lg:flex-row lg:flex-wrap lg:items-center lg:gap-y-3">
      {steps.map((s, i) => (
        <Fragment key={Array.isArray(s) ? s.join("+") : s}>
          <li className={clsx("lg:min-w-[7.5rem] lg:max-w-[11rem] lg:flex-1", Array.isArray(s) && "lg:max-w-[13rem]")}>
            {Array.isArray(s) ? (
              <div className={clsx("rounded-md border border-dashed p-2", dark ? "border-night-line" : "border-line")}>
                <p className={clsx("mono mb-1.5 px-1 text-[0.62rem] uppercase tracking-wider", dark ? "text-night-mute" : "text-ink-3")}>{parallelLabel}</p>
                <ul className="flex flex-col gap-1">
                  {s.map((id) => (
                    <li key={id}>{step(id, true)}</li>
                  ))}
                </ul>
              </div>
            ) : (
              step(s)
            )}
          </li>
          {i < steps.length - 1 && (
            <li aria-hidden className={clsx("flex justify-center lg:block", dark ? "text-night-mute" : "text-ink-3")}>
              <ArrowDown className="size-4 lg:hidden" />
              <ArrowRight className="hidden size-4 lg:block" />
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
