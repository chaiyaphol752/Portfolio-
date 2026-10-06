import { clsx } from "clsx";
import type { PreviewVariant } from "./data";

/**
 * Illustrative, CSS-only mock-ups of each project's interface. Everything inside is
 * aria-hidden; the figure caption says what it is. The flagship uses the real
 * Python-generated circuit instead of a mock.
 */

const bar = (w: string, h = "0.4rem", cls = "bg-ink/15") => <span className={`block shrink-0 rounded-full ${cls}`} style={{ width: w, height: h }} />;

function Screen({ variant, compact }: { variant: PreviewVariant; compact: boolean }) {
  switch (variant) {
    case "table":
      // Helpdesk with AI-suggested categories awaiting confirmation.
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
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2 border-t border-ink/10 pt-2">
                <span className={`size-2 shrink-0 rounded-full ${i % 3 === 0 ? "bg-accent" : i % 3 === 1 ? "bg-signal" : "bg-ink-3"}`} />
                {bar(compact ? "45%" : `${34 + ((i * 13) % 26)}%`)}
                <span className="ml-auto flex items-center gap-1">
                  <span className={`mono rounded-sm border px-1 text-[0.5rem] leading-[0.9rem] ${i === 1 ? "border-accent bg-accent-soft text-accent-ink" : "border-ink/20 text-ink-3"}`}>AI</span>
                  {!compact && bar("2rem", "0.9rem", i === 1 ? "bg-ink" : "bg-paper-3")}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case "shop":
      return (
        <div className="flex h-full flex-col gap-3 p-3">
          <div className="flex items-center justify-between">
            {bar("28%", "0.7rem", "bg-ink")}
            {bar("1.4rem", "0.7rem", "bg-accent")}
          </div>
          {!compact && bar("55%", "1.1rem", "bg-ink")}
          <div className={`grid flex-1 gap-2 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <span className="relative block flex-1 overflow-hidden rounded-sm bg-paper-3">
                  <span className={`absolute inset-x-[25%] bottom-0 top-[22%] rounded-t-full ${i % 2 ? "bg-accent-soft" : "bg-ink/20"}`} />
                </span>
                {bar("70%")}
                {bar("35%", "0.4rem", "bg-ink")}
              </div>
            ))}
          </div>
        </div>
      );
    case "chat":
      // Documentation page with an assistant panel citing its sources.
      return (
        <div className="flex h-full">
          {!compact && (
            <div className="flex flex-1 flex-col gap-2 p-4">
              {bar("50%", "0.8rem", "bg-ink")}
              {bar("92%")}
              {bar("85%")}
              <span className="my-1 block rounded-sm border-l-2 border-accent bg-accent-soft/60 py-1.5 pl-2">{bar("70%", "0.35rem", "bg-ink/40")}</span>
              {bar("88%")}
              {bar("60%")}
            </div>
          )}
          <div className={clsx("flex flex-col gap-2 bg-paper-2 p-3", compact ? "w-full" : "w-[42%] border-l border-ink/20")}>
            {bar("40%", "0.5rem", "bg-ink")}
            <span className="ml-auto block w-[70%] rounded-md bg-ink p-1.5">{bar("80%", "0.35rem", "bg-paper/70")}</span>
            <span className="block w-[85%] rounded-md border border-ink/15 bg-paper p-1.5">
              {bar("90%", "0.35rem")}
              <span className="mt-1 block">{bar("60%", "0.35rem")}</span>
              <span className="mono mt-1.5 inline-block rounded-sm border border-accent px-1 text-[0.5rem] text-accent-ink">[1] [2]</span>
            </span>
            <span className="mt-auto block h-5 rounded-full border border-ink/30 bg-paper" />
          </div>
        </div>
      );
    case "calendar":
      return (
        <div className="flex h-full flex-col gap-2 p-3">
          <div className="flex items-center justify-between">
            {bar("35%", "0.6rem", "bg-ink")}
            <span className="block size-3 rounded-full bg-accent" />
          </div>
          <div className="grid flex-1 grid-cols-7 gap-1">
            {Array.from({ length: compact ? 21 : 35 }).map((_, i) => (
              <span key={i} className={`rounded-sm ${i === 11 ? "bg-accent" : i % 4 === 0 ? "bg-ink/70" : i % 3 === 0 ? "bg-accent-soft" : "bg-paper-3"}`} />
            ))}
          </div>
        </div>
      );
    case "site":
      // A modern editorial website: hero line, navigation and content rows.
      return (
        <div className="flex h-full flex-col gap-2 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            {bar("30%", "0.6rem", "bg-ink")}
            <div className="flex items-center gap-2">
              {bar("1.6rem", "0.4rem", "bg-ink/50")}
              {bar("1.6rem", "0.4rem", "bg-ink/50")}
              {bar("1.6rem", "0.4rem", "bg-accent")}
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3">
            <div className="flex flex-1 flex-col justify-center gap-1.5">
              {bar("85%", "0.7rem", "bg-ink")}
              {bar("60%", "0.7rem", "bg-ink")}
              <span className="my-0.5" />
              {bar("90%")}
              {bar("70%")}
              <span className="mt-1.5 block h-3 w-12 rounded-full bg-accent" />
            </div>
            <div className="relative hidden h-full w-[38%] overflow-hidden rounded-t-full bg-paper-3 sm:block">
              <span className="absolute left-1/2 top-[34%] size-[40%] -translate-x-1/2 rounded-full bg-accent-soft" />
              <span className="absolute inset-x-[22%] bottom-0 h-[30%] rounded-t-full bg-ink/70" />
            </div>
          </div>
          <div className={clsx("grid gap-2", compact ? "grid-cols-1" : "grid-cols-3")}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1 rounded-sm border border-ink/15 p-2">
                <span className="block size-2 rounded-full bg-accent/80" />
                {bar("80%", "0.35rem", "bg-ink/50")}
                {bar("60%", "0.35rem")}
              </div>
            ))}
          </div>
        </div>
      );
    case "phone":
      // An app screen: status bar, content cards and a bottom navigation.
      return (
        <div className="flex h-full flex-col bg-paper-2">
          <div className="flex items-center justify-between px-3 pt-2">
            <span className="mono text-[0.5rem] text-ink-3">9:41</span>
            <div className="flex items-center gap-1">
              <span className="block h-1 w-3 rounded-full bg-ink/50" />
              <span className="block size-1 rounded-full bg-ink/50" />
              <span className="block h-1 w-2.5 rounded-full bg-ink/50" />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-3">
            {bar("55%", "0.7rem", "bg-ink")}
            {bar("80%", "0.4rem")}
            <div className="my-1 grid flex-1 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2 rounded-sm border border-ink/15 bg-paper p-2">
                  <span className={clsx("block size-5 shrink-0 rounded-sm", i === 0 ? "bg-accent" : i === 1 ? "bg-signal" : "bg-ink/40")} />
                  <span className="flex flex-1 flex-col gap-1">
                    {bar(`${45 + i * 12}%`, "0.4rem", "bg-ink")}
                    {bar(`${70 - i * 10}%`, "0.3rem")}
                  </span>
                  <span className="mono text-[0.5rem] text-ink-3">›</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-around rounded-md border border-ink/15 bg-paper px-2 py-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={clsx("block h-1.5 rounded-full", i === 1 ? "w-5 bg-accent" : "w-3 bg-ink/30")} />
              ))}
            </div>
          </div>
        </div>
      );
    case "pipeline":
      // Terminal-style log of a scheduled Python run (illustrative).
      return (
        <div className="night mono flex h-full flex-col justify-center gap-1.5 p-4 text-[0.55rem] leading-tight sm:text-[0.62rem]">
          {[
            ["$", "python ledger_run.py --batch today", "text-night-ink"],
            ["→", "read invoice PDFs", "text-night-mute"],
            ["→", "rules first · model fallback", "text-night-mute"],
            ["✓", "entries validated", "text-ok"],
            ["…", "awaiting human approval", "text-accent"],
          ].map(([p, line, cls]) => (
            <p key={line} className={cls}>
              <span className="mr-2 text-night-mute">{p}</span>
              {line}
            </p>
          ))}
        </div>
      );
    case "search":
      // Local document search: query, grounded answer, retrieved passages.
      return (
        <div className="flex h-full flex-col gap-2 p-3">
          <div className="flex items-center gap-2">
            <span className="block h-5 flex-1 rounded-full border border-ink/40 bg-paper" />
            <span className="mono rounded-sm bg-signal px-1 text-[0.5rem] leading-[0.9rem] text-white">LOCAL</span>
          </div>
          <div className={clsx("grid flex-1 gap-2", compact ? "grid-cols-1" : "grid-cols-[1.2fr_1fr]")}>
            <div className="flex flex-col gap-1.5 rounded-sm border border-ink/15 p-2">
              {bar("80%", "0.45rem", "bg-ink")}
              {bar("95%")}
              {bar("90%")}
              {bar("70%")}
            </div>
            {!compact && (
              <div className="flex flex-col gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block rounded-sm border-l-2 border-signal bg-paper-2 p-1.5">
                    {bar(`${60 + i * 10}%`, "0.35rem", "bg-ink/40")}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    case "agents":
      // Parallel agent lanes converging on a human review gate.
      return (
        <div className="night flex h-full flex-col justify-center gap-2 p-4">
          {["DESIGN", "FRONTEND", "BACKEND", "TEST"].slice(0, compact ? 3 : 4).map((lane, i) => (
            <div key={lane} className="flex items-center gap-2">
              <span className="mono w-14 shrink-0 text-[0.5rem] text-night-mute">{lane}</span>
              <span className="h-px flex-1 bg-night-line" />
              <span className="block h-2 rounded-full bg-night-ink/70" style={{ width: `${18 + i * 7}%` }} />
              <span className="h-px w-4 bg-accent" />
            </div>
          ))}
          <div className="mt-1 flex items-center justify-end gap-2">
            <span className="mono text-[0.5rem] text-night-mute">CI</span>
            <span className="mono rounded-sm border border-accent px-1.5 text-[0.5rem] leading-[0.9rem] text-accent">HUMAN REVIEW</span>
          </div>
        </div>
      );
    case "before-after":
    case "circuit":
      return null;
  }
}

/** A dated layout used as the "before" state in the redesign preview. */
function DatedSite() {
  return (
    <div className="flex h-full flex-col gap-1.5 bg-[#e9e6f4] p-2">
      <div className="flex items-center gap-1 bg-[#4a4a8a] p-1">
        {bar("20%", "0.4rem", "bg-white/80")}
        <span className="ml-auto flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="block h-1 w-3 bg-white/60" />
          ))}
        </span>
      </div>
      <div className="flex flex-1 gap-1.5">
        <div className="flex w-[30%] flex-col gap-1 bg-white/60 p-1">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="block h-1 bg-[#4a4a8a]/40" />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="block h-[40%] bg-[#b9b3d6]" />
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="block h-1 bg-ink/25" style={{ width: `${95 - i * 9}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModernSite() {
  return (
    <div className="flex h-full gap-3 p-3 sm:p-4">
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        {bar("85%", "0.7rem", "bg-ink")}
        {bar("60%", "0.7rem", "bg-ink")}
        <span className="my-0.5" />
        {bar("90%")}
        {bar("70%")}
        <span className="mt-1.5 block h-3 w-12 rounded-full bg-accent" />
      </div>
      <div className="relative w-[40%] overflow-hidden rounded-t-full bg-paper-3">
        <span className="absolute left-1/2 top-[34%] size-[40%] -translate-x-1/2 rounded-full bg-accent-soft" />
        <span className="absolute inset-x-[22%] bottom-0 h-[30%] rounded-t-full bg-ink/70" />
      </div>
    </div>
  );
}

function Browser({ host, children, dark }: { host: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={clsx("overflow-hidden rounded-md border", dark ? "border-night-line bg-night" : "border-ink bg-paper")}>
      <div className={clsx("flex items-center gap-1.5 border-b px-3 py-2", dark ? "border-night-line bg-night-2" : "border-ink/30 bg-paper-2")}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={clsx("size-2 rounded-full", dark ? "bg-night-line" : "bg-ink/25")} />
        ))}
        <span className={clsx("mono ml-2 truncate rounded-sm px-2 py-0.5 text-[0.62rem]", dark ? "bg-night text-night-mute" : "bg-paper text-ink-3")}>{host}</span>
      </div>
      {children}
    </div>
  );
}

interface Props {
  name: string;
  variant: PreviewVariant;
  caption: string;
  labels: { before: string; after: string };
  /** Hide the phone frame, e.g. in narrow layouts. */
  phone?: boolean;
}

export function ProjectPreview({ name, variant, caption, labels, phone = true }: Props) {
  const host = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.example`;

  if (variant === "circuit") {
    return (
      <figure>
        <Browser host="/generated/ai-circuit.svg" dark>
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG generated by scripts/generate_ai_circuit.py */}
          <img src="/generated/ai-circuit.svg" alt="" width={1272} height={912} loading="lazy" className="block h-auto w-full" />
        </Browser>
        <figcaption className="eyebrow mt-3">{caption}</figcaption>
      </figure>
    );
  }

  if (variant === "before-after") {
    const panes = [
      { label: labels.before, screen: <DatedSite />, cls: "text-ink-3" },
      { label: labels.after, screen: <ModernSite />, cls: "text-accent-ink" },
    ];
    return (
      <figure>
        <div className="grid grid-cols-2 gap-3">
          {panes.map((p) => (
            <div key={p.label}>
              <p className={clsx("mono mb-2 text-[0.68rem] uppercase tracking-wider", p.cls)}>{p.label}</p>
              <div aria-hidden>
                <Browser host={host}>
                  <div className="aspect-[4/3]">{p.screen}</div>
                </Browser>
              </div>
            </div>
          ))}
        </div>
        <figcaption className="eyebrow mt-3">{caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure>
      <div className={clsx("relative", phone && "pb-6 pr-2")} aria-hidden>
        <Browser host={host}>
          <div className="aspect-[16/10]">
            <Screen variant={variant} compact={false} />
          </div>
        </Browser>
        {phone && (
          <div className="absolute bottom-0 right-0 w-[24%] rounded-lg border border-ink bg-paper p-[3px]">
            <div className="aspect-[9/17] overflow-hidden rounded-[0.6rem] bg-paper">
              <Screen variant={variant} compact />
            </div>
          </div>
        )}
      </div>
      <figcaption className="eyebrow mt-3">{caption}</figcaption>
    </figure>
  );
}
