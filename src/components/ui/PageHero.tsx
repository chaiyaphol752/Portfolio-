import { ComplexityMeter } from "./ComplexityMeter";
import { formatPageNumber } from "@/config/pages";

interface Props {
  number: number;
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  complexityLabel: string;
  aside?: React.ReactNode;
}

/** Shared hero for pages 02–09 so every page opens with the same editorial structure. */
export function PageHero({ number, eyebrow, title, lede, complexityLabel, aside }: Props) {
  return (
    <header className="container-page pt-[clamp(3rem,7vw,6.5rem)] pb-[clamp(3rem,6vw,5.5rem)]">
      <div className="rise flex flex-wrap items-center justify-between gap-4 border-b border-ink pb-4">
        <p className="eyebrow">
          <span className="text-ink tabular">{formatPageNumber(number)}</span> — {eyebrow}
        </p>
        <ComplexityMeter level={number} label={complexityLabel} />
      </div>
      <div className="mt-[clamp(2rem,5vw,4.5rem)] grid gap-10 lg:grid-cols-12 lg:items-end">
        <h1 className="h1 rise lg:col-span-8" style={{ "--d": 1 } as React.CSSProperties}>
          {title}
        </h1>
        <div className="rise lg:col-span-4" style={{ "--d": 2 } as React.CSSProperties}>
          <p className="lede">{lede}</p>
          {aside}
        </div>
      </div>
    </header>
  );
}
