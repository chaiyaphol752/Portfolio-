import { pages } from "@/config/pages";

/** Nine ticks, filled up to the current page: makes the "gets more technical" idea visible. */
export function ComplexityMeter({ level, label, dark }: { level: number; label: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3" role="img" aria-label={`${label} ${level}/${pages.length}`}>
      <span className="eyebrow">{label}</span>
      <span className="flex items-end gap-[3px]" aria-hidden>
        {pages.map((p) => (
          <span
            key={p.id}
            style={{ height: `${6 + p.number * 1.6}px` }}
            className={
              p.number <= level
                ? "w-[5px] bg-accent"
                : dark
                  ? "w-[5px] bg-night-line"
                  : "w-[5px] bg-paper-3"
            }
          />
        ))}
      </span>
      <span className="eyebrow tabular">{String(level).padStart(2, "0")}/09</span>
    </div>
  );
}
