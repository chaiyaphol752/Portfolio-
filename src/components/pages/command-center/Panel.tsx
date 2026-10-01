import { clsx } from "clsx";

export type PanelSource = "live" | "build" | "concept";

interface Props {
  id: string;
  title: string;
  /** Where the panel's data comes from; drawn as a small marker so live, measured and conceptual data never blur. */
  source: PanelSource;
  sourceLabel: string;
  /** Mobile tab group the panel belongs to; ignored from the lg breakpoint up. */
  group?: string;
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const marker: Record<PanelSource, string> = {
  live: "bg-ok",
  build: "bg-night-ink",
  concept: "border border-night-mute bg-transparent",
};

/** One instrument in the console grid. Pure presentation, renders on the server. */
export function Panel({ id, title, source, sourceLabel, group, className, children, action }: Props) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      data-group={group}
      className={clsx("flex min-w-0 flex-col bg-night-2 p-5", className)}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <h2 id={`${id}-title`} className="mono text-[0.72rem] uppercase tracking-[0.14em] text-night-ink">
          {title}
        </h2>
        <span className="flex shrink-0 items-center gap-2">
          {action}
          <span className={clsx("size-1.5 rounded-full", marker[source])} title={sourceLabel} aria-hidden />
          <span className="sr-only">{sourceLabel}</span>
        </span>
      </header>
      {children}
    </section>
  );
}

/** Label/value rows used by most panels. */
export function Rows({ rows }: { rows: readonly (readonly [string, React.ReactNode])[] }) {
  return (
    <dl className="divide-y divide-night-line border-y border-night-line text-[0.82rem]">
      {rows.map(([term, detail]) => (
        <div key={term} className="flex items-baseline justify-between gap-4 py-2">
          <dt className="shrink-0 text-night-mute">{term}</dt>
          <dd className="mono min-w-0 break-words text-right text-[0.78rem] text-night-ink">{detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[0.84rem] leading-relaxed text-night-mute">{children}</p>;
}

export function Chips({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="mono rounded-sm border border-night-line px-2 py-1 text-[0.72rem] text-night-ink">
          {item}
        </li>
      ))}
    </ul>
  );
}
