"use client";

import { useMemo, useState } from "react";
import type { LabContent } from "@/content/lab";
import {
  contrastRatio,
  generateScale,
  parseHex,
  readableOn,
  tokensToText,
  wcagLevel,
  type TokenFormat,
  type WcagLevel,
} from "@/lib/lab/color";
import { CopyButton } from "./CopyButton";

const WHITE = { r: 255, g: 255, b: 255 };
const INK = { r: 16, g: 17, b: 20 };
const FORMATS: TokenFormat[] = ["css", "tailwind", "json"];

function Ratio({ ratio, t }: { ratio: number; t: LabContent["tokens"] }) {
  const level: WcagLevel = wcagLevel(ratio);
  return (
    <span className="flex flex-col items-end leading-tight sm:flex-row sm:items-baseline sm:gap-2">
      <span className="mono tabular text-[0.8rem]">{ratio.toFixed(2)}</span>
      <span className={"mono text-[0.65rem] uppercase tracking-wider " + (level === "fail" ? "text-accent-ink" : "text-signal")}>{t.levels[level]}</span>
    </span>
  );
}

export function TokenTool({ t }: { t: LabContent["tokens"] }) {
  const [draft, setDraft] = useState("#f2411a");
  const [name, setName] = useState("brand");
  const [format, setFormat] = useState<TokenFormat>("css");

  const rgb = parseHex(draft);
  const valid = rgb !== null;
  // Keep showing the last valid scale while the user is mid-typing an invalid value.
  const [lastValid, setLastValid] = useState("#f2411a");
  const effective = valid ? (draft.startsWith("#") ? draft : `#${draft}`) : lastValid;
  const scale = useMemo(() => generateScale(effective), [effective]);
  const exported = useMemo(() => tokensToText(name, scale, format), [name, scale, format]);

  const update = (value: string) => {
    setDraft(value);
    if (parseHex(value)) setLastValid(value.startsWith("#") ? value : `#${value}`);
  };

  const pickerValue = parseHex(effective) ? (effective.length === 4 ? `#${[...effective.slice(1)].map((c) => c + c).join("")}` : effective) : "#f2411a";

  return (
    <div className="grid lg:grid-cols-12">
      <div className="border-b border-line p-4 lg:col-span-4 lg:border-b-0 lg:border-r lg:border-ink lg:p-6">
        <p className="eyebrow mb-3">{t.base}</p>
        <div className="flex items-stretch gap-3">
          <input
            type="color"
            aria-label={t.base}
            value={pickerValue}
            onChange={(e) => update(e.target.value)}
            className="h-12 w-14 shrink-0 cursor-pointer rounded border border-ink bg-transparent p-0.5"
          />
          <div className="min-w-0 flex-1">
            <label htmlFor="hex-input" className="sr-only">{t.baseInput}</label>
            <input
              id="hex-input"
              value={draft}
              onChange={(e) => update(e.target.value)}
              spellCheck={false}
              maxLength={7}
              aria-invalid={!valid}
              aria-describedby={valid ? undefined : "hex-error"}
              className="mono h-12 w-full rounded border border-ink bg-transparent px-3 uppercase"
            />
          </div>
        </div>
        <p id="hex-error" role="alert" className="mt-2 min-h-5 text-sm text-accent-ink">{valid ? "" : t.invalid}</p>

        <label htmlFor="token-name" className="eyebrow mb-2 mt-6 block">{t.name}</label>
        <input id="token-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={32} spellCheck={false} className="mono h-11 w-full rounded border border-ink bg-transparent px-3" />

        <fieldset className="mt-6">
          <legend className="eyebrow mb-2">{t.format}</legend>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <label key={f} className="cursor-pointer">
                <input type="radio" name="token-format" className="peer sr-only" checked={format === f} onChange={() => setFormat(f)} />
                <span className="mono block rounded-full border border-ink px-3 py-1.5 text-[0.72rem] uppercase tracking-wider peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                  {t.formats[f]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="on-night night mt-6 rounded">
          <div className="flex items-center justify-between border-b border-night-line px-3 py-2">
            <span className="eyebrow">{t.export}</span>
            <CopyButton text={exported} label={t.copy} copiedLabel={t.copied} className="!h-8 text-night-ink hover:!bg-night-ink hover:!text-night" />
          </div>
          <pre tabIndex={0} aria-label={t.export} className="mono max-h-64 overflow-auto p-3 text-[0.75rem] leading-relaxed">{exported}</pre>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="flex h-24 sm:h-32" aria-hidden>
          {scale.map((stop) => {
            const stopRgb = parseHex(stop.hex);
            return (
              <div key={stop.step} className="flex flex-1 items-end p-1.5" style={{ background: stop.hex, color: stopRgb ? readableOn(stopRgb) : undefined }}>
                <span className="mono hidden text-[0.65rem] sm:block">{stop.step}</span>
              </div>
            );
          })}
        </div>
        <table className="w-full border-collapse text-left">
          <caption className="eyebrow p-4 text-left">{t.scale}</caption>
          <thead>
            <tr className="border-y border-line text-ink-3">
              <th scope="col" className="eyebrow px-4 py-2 font-normal">{t.step}</th>
              <th scope="col" className="eyebrow px-2 py-2 text-right font-normal">{t.contrastOnWhite}</th>
              <th scope="col" className="eyebrow px-4 py-2 text-right font-normal">{t.contrastOnInk}</th>
            </tr>
          </thead>
          <tbody>
            {scale.map((stop) => {
              const c = parseHex(stop.hex);
              if (!c) return null;
              return (
                <tr key={stop.step} className="border-b border-line">
                  <th scope="row" className="px-4 py-2 font-normal">
                    <span className="flex items-center gap-3">
                      <span aria-hidden className="size-7 shrink-0 rounded-sm border border-black/10" style={{ background: stop.hex }} />
                      <span className="mono tabular w-8 text-[0.8rem]">{stop.step}</span>
                      <span className="mono text-[0.78rem] uppercase text-ink-2">{stop.hex}</span>
                      {stop.isBase && <span className="mono rounded-full bg-accent-soft px-2 py-0.5 text-[0.62rem] uppercase tracking-wider text-accent-ink">{t.baseTag}</span>}
                    </span>
                  </th>
                  <td className="px-2 py-2 text-right"><Ratio ratio={contrastRatio(c, WHITE)} t={t} /></td>
                  <td className="px-4 py-2 text-right"><Ratio ratio={contrastRatio(c, INK)} t={t} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="p-4 text-xs text-ink-3">{t.legend}</p>
      </div>
    </div>
  );
}
