import type { PreviewVariant } from "./data";

/**
 * Decorative, CSS-only mock-ups of each concept's interface (desktop + phone).
 * Purely illustrative, so everything inside is aria-hidden and the figure carries the caption.
 */

const bar = (w: string, h = "0.4rem", cls = "bg-ink/15") => (
  <span className={`block shrink-0 rounded-full ${cls}`} style={{ width: w, height: h }} />
);

function Screen({ variant, compact }: { variant: PreviewVariant; compact: boolean }) {
  switch (variant) {
    case "table":
      return (
        <div className="flex h-full">
          {!compact && (
            <div className="flex w-[22%] flex-col gap-2 border-r border-ink/15 bg-paper-2 p-3">
              {bar("60%", "0.5rem", "bg-ink")}
              {bar("80%")}
              {bar("70%", "0.4rem", "bg-accent/70")}
              {bar("75%")}
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2 p-3">
            {bar("40%", "0.6rem", "bg-ink")}
            {(compact ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4, 5]).map((i) => (
              <div key={i} className="flex items-center gap-2 border-t border-ink/10 pt-2">
                <span className={`size-2 shrink-0 rounded-full ${i % 3 === 0 ? "bg-accent" : i % 3 === 1 ? "bg-signal" : "bg-ink-3"}`} />
                {bar(compact ? "55%" : `${38 + ((i * 13) % 30)}%`)}
                {!compact && <span className="ml-auto">{bar("2.2rem", "0.9rem", "bg-paper-3")}</span>}
              </div>
            ))}
          </div>
        </div>
      );
    case "site":
      return (
        <div className={`flex h-full gap-3 p-4 ${compact ? "flex-col" : ""}`}>
          <div className="flex flex-1 flex-col justify-center gap-2">
            {bar("85%", compact ? "0.7rem" : "1.1rem", "bg-ink")}
            {bar("60%", compact ? "0.7rem" : "1.1rem", "bg-ink")}
            <span className="my-1" />
            {bar("90%")}
            {bar("70%")}
            <span className="mt-2 block h-5 w-20 rounded-full bg-accent" />
          </div>
          <div className={`relative overflow-hidden rounded-t-full bg-paper-3 ${compact ? "h-[38%]" : "w-[42%]"}`}>
            <span className="absolute left-1/2 top-[38%] size-[38%] -translate-x-1/2 rounded-full bg-accent-soft" />
            <span className="absolute inset-x-[22%] bottom-0 h-[30%] rounded-t-full bg-ink/70" />
          </div>
        </div>
      );
    case "chart": {
      const heights = [38, 52, 44, 66, 58, 80, 62, 90, 72, 84, 60, 96];
      return (
        <div className="flex h-full flex-col gap-3 p-3">
          <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
            {[0, 1, compact ? null : 2].map((i) =>
              i === null ? null : (
                <div key={i} className="rounded border border-ink/15 p-2">
                  {bar("50%")}
                  <span className="mt-2 block">{bar("70%", "0.8rem", i === 1 ? "bg-accent" : "bg-ink")}</span>
                </div>
              ),
            )}
          </div>
          <div className="flex flex-1 items-end gap-1 border-b border-ink/30 pb-0.5">
            {(compact ? heights.slice(0, 8) : heights).map((h, i) => (
              <span key={i} className={`flex-1 rounded-t-sm ${i === 7 ? "bg-accent" : "bg-ink/70"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      );
    }
    case "shop":
      return (
        <div className="flex h-full flex-col gap-3 p-3">
          <div className="flex items-center justify-between">
            {bar("28%", "0.7rem", "bg-ink")}
            {bar("1.4rem", "0.7rem", "bg-accent")}
          </div>
          <div className={`grid flex-1 gap-2 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
            {(compact ? [0, 1, 2, 3] : [0, 1, 2, 3]).map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <span className="relative block flex-1 overflow-hidden rounded bg-paper-3">
                  <span className={`absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full ${i % 2 ? "bg-accent-soft" : "bg-ink/20"}`} />
                </span>
                {bar("70%")}
                {bar("35%", "0.4rem", "bg-ink")}
              </div>
            ))}
          </div>
        </div>
      );
    case "flow": {
      const steps = compact ? 5 : 7;
      return (
        <div className={`flex h-full items-center justify-center gap-0 p-4 ${compact ? "flex-col" : ""}`}>
          {Array.from({ length: steps }).map((_, i) => (
            <div key={i} className={`flex items-center ${compact ? "flex-col" : ""}`}>
              {i > 0 && <span className={compact ? "h-3 w-px bg-ink/30" : "h-px w-4 bg-ink/30 sm:w-7"} />}
              <span
                className={`block ${i === Math.floor(steps / 2) + 1 ? "size-5 rotate-45 bg-accent" : i % 2 ? "size-5 rounded-full border-2 border-ink bg-paper" : "size-5 rounded-full bg-ink"}`}
              />
            </div>
          ))}
        </div>
      );
    }
    case "calendar":
      return (
        <div className="flex h-full flex-col gap-2 p-3">
          {bar("35%", "0.6rem", "bg-ink")}
          <div className="grid flex-1 grid-cols-7 gap-1">
            {Array.from({ length: compact ? 21 : 35 }).map((_, i) => (
              <span
                key={i}
                className={`rounded-sm ${i % 9 === 4 ? "bg-accent" : i % 4 === 0 ? "bg-ink/70" : i % 3 === 0 ? "bg-accent-soft" : "bg-paper-3"}`}
              />
            ))}
          </div>
        </div>
      );
    case "code":
      return (
        <div className="night flex h-full flex-col justify-center gap-2 p-4">
          {[
            ["30%", 0, "bg-accent"],
            ["55%", 1, "bg-night-ink/60"],
            ["42%", 1, "bg-signal"],
            ["65%", 2, "bg-night-ink/60"],
            ["38%", 2, "bg-night-mute"],
            ["48%", 1, "bg-signal"],
            ["20%", 0, "bg-accent"],
          ]
            .slice(0, compact ? 6 : 7)
            .map(([w, indent, cls], i) => (
              <span key={i} style={{ marginLeft: `${Number(indent) * 0.9}rem` }}>
                {bar(String(w), "0.4rem", String(cls))}
              </span>
            ))}
        </div>
      );
    case "portfolio":
      return (
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className={`h-1 flex-1 ${i < 5 ? "bg-ink" : "bg-paper-3"}`} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {bar("88%", compact ? "0.8rem" : "1.4rem", "bg-ink")}
            {bar("62%", compact ? "0.8rem" : "1.4rem", "bg-accent")}
          </div>
          <div className="flex items-center gap-2">
            <span className="block h-5 w-16 rounded-full bg-ink" />
            <span className="block h-5 w-16 rounded-full border border-ink" />
          </div>
        </div>
      );
  }
}

export function ProjectPreview({ name, variant, label, note }: { name: string; variant: PreviewVariant; label: string; note: string }) {
  const host = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.example`;
  return (
    <figure>
      <div className="relative pb-6 pr-2" aria-hidden>
        <div className="overflow-hidden rounded-md border border-ink bg-paper">
          <div className="flex items-center gap-1.5 border-b border-ink/30 bg-paper-2 px-3 py-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 rounded-full bg-ink/25" />
            ))}
            <span className="mono ml-2 truncate rounded bg-paper px-2 py-0.5 text-[0.62rem] text-ink-3">{host}</span>
          </div>
          <div className="aspect-[16/10]">
            <Screen variant={variant} compact={false} />
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-[24%] rounded-xl border border-ink bg-paper p-[3px] shadow-[0_8px_24px_-8px_rgb(16_17_20/0.35)]">
          <div className="aspect-[9/17] overflow-hidden rounded-[0.6rem] bg-paper">
            <Screen variant={variant} compact />
          </div>
        </div>
      </div>
      <figcaption className="eyebrow mt-2">
        {label} · {note}
      </figcaption>
    </figure>
  );
}
