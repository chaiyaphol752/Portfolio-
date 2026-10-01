import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import type { SystemsContent } from "@/content/systems";

/** Dimension line, as on a technical drawing: end ticks, hairline, centered label. */
export function Dimension({ label, className }: { label: string; className?: string }) {
  return (
    <div className={clsx("relative flex h-6 items-center justify-center", className)} aria-hidden>
      <span className="absolute inset-x-0 top-1/2 h-px bg-ink-3" />
      <span className="absolute left-0 top-1/2 h-3 w-px -translate-y-1/2 bg-ink-3" />
      <span className="absolute right-0 top-1/2 h-3 w-px -translate-y-1/2 bg-ink-3" />
      <span className="mono relative bg-paper px-2 text-[0.66rem] uppercase tracking-[0.14em] text-ink-2">{label}</span>
    </div>
  );
}

/** Lettered callout bubble. */
export function Mark({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "mono grid size-7 shrink-0 place-items-center rounded-full border text-[0.72rem] font-medium",
        accent ? "border-accent-ink bg-accent text-white" : "border-ink bg-paper text-ink",
      )}
    >
      {children}
    </span>
  );
}

type Stage = SystemsContent["request"]["stages"][number];

function StageBox({ stage, accent }: { stage: Stage; accent?: boolean }) {
  return (
    <div className={clsx("h-full border bg-paper p-4", accent ? "border-accent-ink" : "border-ink")}>
      <div className="flex items-center gap-2.5">
        <Mark accent={accent}>{stage.mark}</Mark>
        <span className="mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-3">{stage.tag}</span>
      </div>
      <h3 className="mt-3 text-[0.98rem] font-semibold leading-snug tracking-tight">{stage.title}</h3>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-2">{stage.body}</p>
      <p className="mono mt-3 break-all border-t border-dashed border-line pt-2 text-[0.66rem] text-ink-3">{stage.file}</p>
    </div>
  );
}

/** Request path: stages A–F, client/server dimensions, response return line and delivery fan-out. */
export function RequestPath({ t }: { t: SystemsContent["request"] }) {
  const deliveryIndex = t.stages.findIndex((s) => s.mark === "E");
  return (
    <figure aria-labelledby="request-title">
      <p className="sr-only">{t.summary}</p>

      {/* Desktop drawing */}
      <div aria-hidden className="hidden lg:block">
        <div className="grid grid-cols-6 gap-6">
          <Dimension label={t.client} className="col-span-1" />
          <Dimension label={t.server} className="col-span-5" />
        </div>
        <div className="mt-3 flex items-center gap-2 text-ink-3">
          <span className="mono text-[0.66rem] uppercase tracking-[0.14em]">← {t.stages.at(-1)?.title}</span>
          <span className="h-px flex-1 border-t border-dashed border-ink-3" />
        </div>
        <ol className="mt-3 grid grid-cols-6 gap-6">
          {t.stages.map((stage, i) => (
            <li key={stage.mark} className="relative">
              <StageBox stage={stage} accent={i === deliveryIndex} />
              {i < t.stages.length - 1 && (
                <ArrowRight className="absolute -right-[1.15rem] top-9 size-4 text-ink" />
              )}
            </li>
          ))}
        </ol>

        {/* Fan-out from the delivery service (column 5 centre = 75%) to three channels. */}
        <div className="relative h-14">
          <span className="absolute left-[75%] top-0 h-7 w-px -translate-x-[0.5px] bg-accent-ink" />
          <span className="absolute left-[16.66%] right-[16.66%] top-7 h-px bg-accent-ink" />
          {[16.66, 50, 83.33].map((x) => (
            <span key={x} className="absolute top-7 h-7 w-px bg-accent-ink" style={{ left: `${x}%` }} />
          ))}
        </div>
      </div>

      {/* Mobile / tablet: vertical rail */}
      <ol className="relative space-y-4 lg:hidden">
        <span aria-hidden className="absolute bottom-6 left-[0.85rem] top-6 w-px bg-ink" />
        {t.stages.map((stage, i) => (
          <li key={stage.mark} className="relative pl-10">
            <span aria-hidden className={clsx("absolute left-[0.6rem] top-6 size-2 rounded-full", i === deliveryIndex ? "bg-accent" : "bg-ink")} />
            <StageBox stage={stage} accent={i === deliveryIndex} />
          </li>
        ))}
      </ol>

      <div className="mt-8 lg:mt-0">
        <p className="mono mb-3 text-[0.66rem] uppercase tracking-[0.14em] text-ink-2 lg:sr-only">{t.channelsLabel}</p>
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {t.channels.map((c, i) => (
            <li key={c.title} className={clsx("border bg-paper p-4", i === 0 ? "border-accent-ink" : "border-dashed border-ink-3")}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[0.98rem] font-semibold tracking-tight">{c.title}</h3>
                <span className={clsx("mono text-[0.66rem] uppercase tracking-[0.14em]", i === 0 ? "text-accent-ink" : "text-ink-3")}>{c.role}</span>
              </div>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-2">{c.body}</p>
              <p className="mono mt-3 break-all border-t border-dashed border-line pt-2 text-[0.66rem] text-ink-3">{c.file}</p>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

export function Pipeline({ t }: { t: SystemsContent["pipeline"] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {t.nodes.map((node, i) => (
        <li key={node.mark} className="relative">
          <StageBox stage={node} accent={i === 0} />
          {i < t.nodes.length - 1 && <ArrowRight aria-hidden className="absolute -right-[1.5rem] top-9 hidden size-4 text-ink lg:block" />}
        </li>
      ))}
    </ol>
  );
}

interface TitleBlockProps {
  t: SystemsContent["titleBlock"];
  revision: string;
  routes: string;
  drawnOn: string;
}

/** Engineering title block. Values are real: commit, route count and build date. */
export function TitleBlock({ t, revision, routes, drawnOn }: TitleBlockProps) {
  const cells: [string, string, string?][] = [
    [t.project, t.projectValue, "sm:col-span-2"],
    [t.drawing, t.drawingValue, "sm:col-span-2"],
    [t.revision, revision],
    [t.scale, t.scaleValue],
    [t.routes, routes, "sm:col-span-2"],
    [t.built, `${drawnOn} · ${t.builtValue}`, "sm:col-span-2"],
  ];
  return (
    <dl className="grid grid-cols-1 border-l border-t border-ink bg-paper sm:grid-cols-4">
      {cells.map(([label, value, span]) => (
        <div key={label} className={clsx("border-b border-r border-ink px-3 py-2", span)}>
          <dt className="mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-3">{label}</dt>
          <dd className="mono mt-0.5 break-words text-[0.8rem] text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
