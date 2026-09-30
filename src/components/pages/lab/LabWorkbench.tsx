"use client";

import { useId, useRef, useState } from "react";
import type { LabContent } from "@/content/lab";
import { JsonTool } from "./JsonTool";
import { ResponsiveTool } from "./ResponsiveTool";
import { TokenTool } from "./TokenTool";

const TOOL_IDS = ["json", "responsive", "tokens"] as const;
type ToolId = (typeof TOOL_IDS)[number];

/** Accessible tab set (roving tabindex, arrow/Home/End keys). Only the active tool is mounted. */
export function LabWorkbench({ t }: { t: LabContent }) {
  const [active, setActive] = useState<ToolId>("json");
  const uid = useId();
  const tabRefs = useRef<Record<ToolId, HTMLButtonElement | null>>({ json: null, responsive: null, tokens: null });

  const move = (e: React.KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % TOOL_IDS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TOOL_IDS.length) % TOOL_IDS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TOOL_IDS.length - 1;
    else return;
    e.preventDefault();
    const id = TOOL_IDS[next] as ToolId;
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section aria-label={t.workbench.label} className="container-page pb-[clamp(4rem,8vw,7rem)]">
      <div role="tablist" aria-label={t.workbench.label} className="grid border-t border-ink sm:grid-cols-3">
        {TOOL_IDS.map((id, index) => {
          const selected = id === active;
          return (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[id] = el;
              }}
              role="tab"
              type="button"
              id={`${uid}-tab-${id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={(e) => move(e, index)}
              className={
                "group relative flex items-baseline gap-4 border-b border-line px-1 py-4 text-left transition-colors sm:flex-col sm:gap-2 sm:border-b-0 sm:border-r sm:px-5 sm:py-6 sm:last:border-r-0 " +
                (selected ? "bg-paper-2" : "hover:bg-paper-2/60")
              }
            >
              <span className={"mono tabular text-xs " + (selected ? "text-accent-ink" : "text-ink-3")}>0{index + 1}</span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold tracking-tight sm:text-xl">{t.workbench.tabs[id].label}</span>
                <span className="mt-1 hidden text-sm text-ink-3 sm:block">{t.workbench.tabs[id].blurb}</span>
              </span>
              <span aria-hidden className={"absolute inset-x-0 top-0 h-[3px] " + (selected ? "bg-accent" : "bg-transparent")} />
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel-${active}`}
        aria-labelledby={`${uid}-tab-${active}`}
        tabIndex={0}
        className="border border-ink"
      >
        {active === "json" && <JsonTool t={t.json} />}
        {active === "responsive" && <ResponsiveTool t={t.responsive} />}
        {active === "tokens" && <TokenTool t={t.tokens} />}
      </div>
      <p className="mono mt-4 text-xs text-ink-3">{t.workbench.privacy}</p>
    </section>
  );
}
