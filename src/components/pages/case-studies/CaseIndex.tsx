"use client";

import { useEffect, useState } from "react";

interface Props {
  label: string;
  cases: { id: string; title: string }[];
  steps: { id: string; label: string }[];
}

/**
 * Sticky index: a case selector with the active case's steps beneath it.
 * Every entry is a plain anchor, so navigation works before (and without) hydration;
 * the observer only adds the "you are here" highlight.
 */
export function CaseIndex({ label, cases, steps }: Props) {
  const [active, setActive] = useState({ caseId: cases[0]?.id ?? "", stepId: steps[0]?.id ?? "" });

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

  return (
    <nav aria-label={label} className="mb-14 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:mb-0 lg:max-h-[calc(100dvh-var(--header-h)-4rem)] lg:overflow-y-auto">
      <p className="eyebrow mb-4">{label}</p>
      <ol className="border-t border-ink">
        {cases.map((c, i) => {
          const isActive = c.id === active.caseId;
          return (
            <li key={c.id} className="border-b border-line">
              <a href={`#${c.id}`} aria-current={isActive ? "true" : undefined} className="flex gap-3 py-3.5">
                <span className="mono tabular pt-0.5 text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <span className={isActive ? "font-medium text-ink" : "text-ink-2 hover:text-ink"}>{c.title}</span>
              </a>
              {isActive && (
                <ol className="hidden pb-4 pl-9 lg:block">
                  {steps.map((s) => {
                    const here = s.id === active.stepId;
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${c.id}-${s.id}`}
                          aria-current={here ? "location" : undefined}
                          className={
                            "flex items-center gap-2 py-1 text-sm transition-colors " +
                            (here ? "text-accent-ink" : "text-ink-3 hover:text-ink")
                          }
                        >
                          <span aria-hidden className={"h-px transition-all " + (here ? "w-4 bg-accent" : "w-2 bg-line")} />
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
  );
}
