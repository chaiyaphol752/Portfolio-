"use client";

import { useId, useRef, useState } from "react";
import { Braces, MonitorSmartphone, Palette, Send } from "lucide-react";
import { clsx } from "clsx";
import type { LabContent } from "@/content/lab";
import { JsonTool } from "./JsonTool";
import { ResponsiveTool } from "./ResponsiveTool";
import { TokenTool } from "./TokenTool";
import { RequestTool } from "./RequestTool";

const TOOL_IDS = ["request", "json", "responsive", "tokens"] as const;
type ToolId = (typeof TOOL_IDS)[number];
const ICONS = { request: Send, json: Braces, responsive: MonitorSmartphone, tokens: Palette } as const;
const SLUGS = { request: "api-request", json: "json-inspector", responsive: "responsive-preview", tokens: "color-tokens" } as const;

/**
 * Application shell: tool tabs in a title bar, the active tool as the window body,
 * and a status bar. Accessible tab set (roving tabindex, arrow/Home/End keys);
 * only the active tool is mounted.
 */
export function LabWorkbench({ t }: { t: LabContent }) {
  const [active, setActive] = useState<ToolId>("request");
  const uid = useId();
  const tabRefs = useRef<Partial<Record<ToolId, HTMLButtonElement | null>>>({});
  const index = TOOL_IDS.indexOf(active);

  const move = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % TOOL_IDS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + TOOL_IDS.length) % TOOL_IDS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TOOL_IDS.length - 1;
    else return;
    e.preventDefault();
    const id = TOOL_IDS[next] as ToolId;
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section aria-label={t.workbench.label} className="overflow-hidden rounded-md border border-ink bg-paper shadow-[0_1px_0_var(--color-ink),0_24px_60px_-32px_rgb(16_17_20/0.35)]">
      {/* Title bar */}
      <div className="on-night night flex flex-col gap-0 lg:flex-row lg:items-stretch">
        <p className="mono flex shrink-0 items-center gap-2 border-b border-night-line px-4 py-3 text-[0.72rem] text-night-mute lg:border-b-0 lg:border-r">
          <span aria-hidden className="size-2 rounded-full bg-accent" />
          ~/{t.shell.path}/<span className="text-night-ink">{SLUGS[active]}</span>
        </p>
        <div role="tablist" aria-label={t.workbench.label} className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-1">
          {TOOL_IDS.map((id, i) => {
            const selected = id === active;
            const Icon = ICONS[id];
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
                title={t.workbench.tabs[id].blurb}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(id)}
                onKeyDown={(e) => move(e, i)}
                className={clsx(
                  "relative flex items-center gap-2.5 border-b border-night-line px-4 py-3 text-left text-[0.85rem] transition-colors sm:border-r lg:border-b-0",
                  selected ? "bg-paper text-ink" : "text-night-mute hover:bg-night-2 hover:text-night-ink",
                )}
              >
                <Icon className={clsx("size-4 shrink-0", selected ? "text-accent-ink" : "")} aria-hidden />
                <span className="min-w-0 hyphens-auto break-words font-medium leading-tight">{t.workbench.tabs[id].label}</span>
                <span aria-hidden className={clsx("absolute inset-x-0 top-0 h-0.5", selected ? "bg-accent" : "bg-transparent")} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool description strip */}
      <p className="border-b border-ink bg-paper-2 px-4 py-2 text-[0.8rem] text-ink-2">{t.workbench.tabs[active].blurb}</p>

      <div role="tabpanel" id={`${uid}-panel-${active}`} aria-labelledby={`${uid}-tab-${active}`} tabIndex={0}>
        {active === "request" && <RequestTool t={t.request} />}
        {active === "json" && <JsonTool t={t.json} />}
        {active === "responsive" && <ResponsiveTool t={t.responsive} />}
        {active === "tokens" && <TokenTool t={t.tokens} />}
      </div>

      {/* Status bar */}
      <div className="on-night night mono flex flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 text-[0.68rem] text-night-mute">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="size-1.5 rounded-full bg-ok" />
          {t.shell.status}
        </span>
        <span className="tabular">
          {t.shell.tool} {index + 1} {t.shell.of} {TOOL_IDS.length}
        </span>
        <span className="hidden sm:inline">{t.shell.keys}</span>
        <span className="ml-auto">{t.workbench.privacy}</span>
      </div>
    </section>
  );
}
