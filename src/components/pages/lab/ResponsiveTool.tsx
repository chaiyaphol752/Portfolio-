"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import type { LabContent } from "@/content/lab";
import { interpolate } from "@/lib/interpolate";
import { DEVICE_PRESETS, MAX_WIDTH, MIN_WIDTH, activeBreakpoint, clampWidth, fitScale, parseWidth, sampleColumns } from "@/lib/lab/responsive";

const FRAME_HEIGHT = 520;

/** The layout being previewed. Uses container queries, so it reacts to the frame, not the window. */
function SampleLayout({ t }: { t: LabContent["responsive"]["sample"] }) {
  return (
    <div className="@container h-full bg-paper text-ink">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 @md:px-8">
        <span className="font-display text-xl italic">{t.brand}</span>
        <ul className="hidden gap-6 text-sm @md:flex">
          {t.nav.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <span className="flex items-center gap-2 text-sm @md:hidden">
          <Menu className="size-4" aria-hidden />
          {t.menu}
        </span>
      </div>
      <div className="grid gap-5 px-4 py-8 @md:px-8 @3xl:grid-cols-2 @3xl:items-end @3xl:py-14">
        <h4 className="text-[1.65rem] font-medium leading-[1.05] tracking-tight @md:text-4xl @3xl:text-5xl">{t.title}</h4>
        <div>
          <p className="max-w-[44ch] text-sm text-ink-2 @md:text-base">{t.body}</p>
          <span className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm text-paper">{t.cta}</span>
        </div>
      </div>
      <div className="grid gap-px border-t border-line bg-line @md:grid-cols-2 @3xl:grid-cols-3">
        {t.cards.map((card, i) => (
          <div key={card.title} className="bg-paper p-5 @3xl:p-7">
            <p className="mono text-xs text-ink-3">0{i + 1}</p>
            <p className="mt-2 font-semibold">{card.title}</p>
            <p className="mt-1 text-sm text-ink-2">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResponsiveTool({ t }: { t: LabContent["responsive"] }) {
  const [width, setWidth] = useState(768);
  const [draft, setDraft] = useState("768");
  const [available, setAvailable] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setAvailable(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = available ? fitScale(width, available) : 1;

  const apply = (next: number) => {
    const clamped = clampWidth(next);
    setWidth(clamped);
    setDraft(String(clamped));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startWidth: width };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current) apply(drag.current.startWidth + (e.clientX - drag.current.startX) / scale);
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const breakpoint = activeBreakpoint(width);

  return (
    <div>
      <div className="grid gap-6 border-b border-line p-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-2" id="preset-label">{t.viewport}</p>
          <div role="group" aria-labelledby="preset-label" className="flex flex-wrap gap-2">
            {DEVICE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={width === p.width}
                onClick={() => apply(p.width)}
                className="mono rounded-full border border-ink px-3 py-1.5 text-[0.72rem] uppercase tracking-wider transition-colors hover:bg-paper-3 aria-pressed:bg-ink aria-pressed:text-paper"
              >
                {t.presets[p.id]} · {p.width}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <label htmlFor="width-range" className="eyebrow mb-2 block">{t.viewport}</label>
          <input
            id="width-range"
            type="range"
            min={MIN_WIDTH}
            max={MAX_WIDTH}
            step={1}
            value={width}
            onChange={(e) => apply(Number(e.target.value))}
            className="w-full accent-accent"
            aria-valuetext={`${width}px`}
          />
        </div>
        <div className="lg:col-span-3">
          <label htmlFor="width-input" className="eyebrow mb-2 block">{t.widthInput}</label>
          <input
            id="width-input"
            inputMode="numeric"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              const parsed = parseWidth(e.target.value);
              if (parsed !== null) setWidth(parsed);
            }}
            onBlur={() => setDraft(String(width))}
            className="mono h-10 w-full rounded border border-ink bg-transparent px-3 tabular"
          />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px border-b border-line bg-line sm:grid-cols-4">
        {(
          [
            [t.viewport, `${width}px`],
            [t.container, breakpoint],
            [t.layout, interpolate(t.columns, { n: sampleColumns(width) })],
            [t.scale, `${Math.round(scale * 100)}%`],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="bg-paper px-4 py-3">
            <dt className="eyebrow">{label}</dt>
            <dd className="mono tabular text-lg">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="bg-paper-2 p-4 sm:p-6">
        <p className="mb-3 text-xs text-ink-3">{t.drag}</p>
        <div ref={stageRef} className="w-full">
          <div className="relative" style={{ width: width * scale, height: FRAME_HEIGHT * scale }}>
            <div
              role="img"
              aria-label={t.frameLabel}
              className="absolute left-0 top-0 origin-top-left overflow-hidden border border-ink bg-paper shadow-[6px_6px_0_0_var(--color-paper-3)]"
              style={{ width, height: FRAME_HEIGHT, transform: `scale(${scale})` }}
            >
              <SampleLayout t={t.sample} />
            </div>
            <div
              aria-hidden
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="absolute -right-3 top-0 flex h-full w-6 cursor-ew-resize touch-none items-center justify-center"
            >
              <span className="h-16 w-1.5 rounded-full bg-ink" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
