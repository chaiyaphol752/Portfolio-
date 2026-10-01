"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import type { CaseStudiesContent } from "@/content/case-studies";

interface Props {
  labels: CaseStudiesContent["labels"];
  cases: { id: string; title: string; kind: "demo" | "concept" }[];
  steps: { id: string; label: string }[];
}

type Mode = "full" | "overview";

/**
 * Sticky rail: case switcher, the active case's chapters, and a reading-mode toggle.
 * Every entry is a plain anchor, so navigation works without JavaScript; the observer
 * only adds the "you are here" state. On small screens the rail becomes a sticky bar.
 */
export function CaseIndex({ labels, cases, steps }: Props) {
  const [active, setActive] = useState({ caseId: cases[0]?.id ?? "", stepId: steps[0]?.id ?? "" });
  const [mode, setMode] = useState<Mode>("full");

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-case-step]");
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!hit) return;
        const el = hit.target as HTMLElement;
        setActive({ caseId: el.dataset.case ?? "", stepId: el.dataset.step ?? "" });
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  // The documents container is server-rendered; the mode is a data attribute CSS reads.
  useEffect(() => {
    document.getElementById("case-docs")?.setAttribute("data-reading", mode);
  }, [mode]);

  const toggle = (
    <fieldset className="flex items-center gap-1 rounded-full border border-line p-0.5">
      <legend className="sr-only">{labels.reading.label}</legend>
      {(["full", "overview"] as const).map((m) => (
        <label key={m} className="cursor-pointer">
          <input type="radio" name="reading-mode" className="peer sr-only" checked={mode === m} onChange={() => setMode(m)} />
          <span className="mono block whitespace-nowrap rounded-full px-3 py-1.5 text-[0.68rem] uppercase tracking-wider text-ink-2 peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
            {labels.reading[m]}
          </span>
        </label>
      ))}
    </fieldset>
  );

  return (
    <>
      {/* Small screens: sticky bar with the case switcher and reading mode. */}
      <div className="sticky top-[var(--header-h)] z-20 -mx-[var(--gutter)] border-b border-line bg-paper/95 px-[var(--gutter)] py-3 backdrop-blur-[2px] lg:hidden">
        <nav aria-label={labels.switcher} className="-mx-1 overflow-x-auto px-1">
          <ul className="flex gap-2">
            {cases.map((c) => (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#${c.id}`}
                  aria-current={c.id === active.caseId ? "true" : undefined}
                  className={clsx(
                    "block max-w-[15rem] truncate rounded-full border px-3 py-1.5 text-sm",
                    c.id === active.caseId ? "border-ink bg-ink text-paper" : "border-line text-ink-2",
                  )}
                >
                  {c.title.split(":")[0]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-3">{toggle}</div>
      </div>

      {/* Wide screens: sticky rail. */}
      <div className="hidden lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:block lg:max-h-[calc(100dvh-var(--header-h)-3rem)] lg:overflow-y-auto lg:pt-14">
        <nav aria-label={labels.switcher}>
          <p className="eyebrow mb-3">{labels.switcher}</p>
          <ol className="border-t border-ink">
            {cases.map((c) => {
              const isActive = c.id === active.caseId;
              return (
                <li key={c.id} className="border-b border-line">
                  <a href={`#${c.id}`} aria-current={isActive ? "true" : undefined} className="flex gap-3 py-3">
                    <span aria-hidden className={clsx("mt-2 size-1.5 shrink-0 rounded-full", c.kind === "demo" ? "bg-signal" : "bg-accent")} />
                    <span className={clsx("text-sm leading-snug", isActive ? "font-medium text-ink" : "text-ink-2 hover:text-ink")}>{c.title}</span>
                  </a>
                  {isActive && (
                    <ol aria-label={labels.chapters} className="pb-4 pl-4">
                      {steps.map((s, i) => {
                        const here = s.id === active.stepId;
                        return (
                          <li key={s.id}>
                            <a
                              href={`#${c.id}-${s.id}`}
                              aria-current={here ? "location" : undefined}
                              className={clsx("flex items-baseline gap-2 py-1 text-[0.82rem] transition-colors", here ? "text-accent-ink" : "text-ink-3 hover:text-ink")}
                            >
                              <span className="mono w-5 text-[0.68rem]">§{i + 1}</span>
                              {s.label}
                            </a>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="mt-8">
          <p className="eyebrow mb-2">{labels.reading.label}</p>
          {toggle}
        </div>
      </div>
    </>
  );
}
