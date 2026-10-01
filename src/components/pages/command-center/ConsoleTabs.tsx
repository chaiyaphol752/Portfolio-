"use client";

import { useRef, useState } from "react";
import { clsx } from "clsx";
import styles from "./console.module.css";

interface Props {
  label: string;
  groups: readonly { id: string; label: string }[];
  children: React.ReactNode;
}

/**
 * Below the lg breakpoint the console shows one panel group at a time (selected with tabs);
 * from lg up every panel is visible and the tabs are hidden. Filtering is pure CSS on
 * `data-active` / `data-group`, so the panels themselves stay Server Components.
 */
export function ConsoleTabs({ label, groups, children }: Props) {
  const [active, setActive] = useState(groups[0]?.id ?? "");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + groups.length) % groups.length;
    setActive(groups[next]!.id);
    refs.current[next]?.focus();
  };

  return (
    <div data-active={active} data-console className={styles.tabs}>
      <noscript>
        <style>{"[data-console] [data-group]{display:flex!important}[data-console] [role=tablist]{display:none!important}"}</style>
      </noscript>
      <div role="tablist" aria-label={label} className="mb-4 flex gap-1 border-b border-night-line lg:hidden">
        {groups.map((g, i) => (
          <button
            key={g.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`console-tab-${g.id}`}
            aria-selected={active === g.id}
            aria-controls="console-panels"
            tabIndex={active === g.id ? 0 : -1}
            onClick={() => setActive(g.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={clsx(
              "mono -mb-px border-b-2 px-3 py-2.5 text-[0.72rem] uppercase tracking-wider transition-colors",
              active === g.id ? "border-accent text-night-ink" : "border-transparent text-night-mute hover:text-night-ink",
            )}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div id="console-panels" role="tabpanel" aria-labelledby={`console-tab-${active}`} className={styles.grid}>
        {children}
      </div>
    </div>
  );
}
