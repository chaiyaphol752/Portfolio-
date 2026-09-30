"use client";

import { useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { LabContent } from "@/content/lab";
import { formatJson, jsonStats, minifyJson, parseJson, sortKeys, type IndentOption } from "@/lib/lab/json";
import { interpolate } from "@/lib/interpolate";
import { CopyButton } from "./CopyButton";
import { JsonTree } from "./JsonTree";

const INDENTS: IndentOption[] = [2, 4, "tab"];
const btn = "mono inline-flex h-9 items-center rounded-full border border-ink px-3.5 text-[0.72rem] uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit";

export function JsonTool({ t }: { t: LabContent["json"] }) {
  const [text, setText] = useState(t.sample);
  const [indent, setIndent] = useState<IndentOption>(2);
  const [openDepth, setOpenDepth] = useState(2);
  const [epoch, setEpoch] = useState(0);
  const [pathNote, setPathNote] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const result = useMemo(() => parseJson(text), [text]);
  const stats = useMemo(() => (result.ok ? jsonStats(result.value, text) : null), [result, text]);
  const isEmpty = text.trim() === "";

  const errorExcerpt = useMemo(() => {
    if (result.ok || result.error.code === "empty") return null;
    const line = text.split("\n")[result.error.line - 1] ?? "";
    const start = Math.max(0, result.error.column - 1 - 30);
    return { line: line.slice(start, start + 70), caret: result.error.column - 1 - start };
  }, [result, text]);

  const rewrite = (fn: (value: unknown) => string) => {
    if (result.ok) setText(fn(result.value));
  };

  const goToError = () => {
    if (result.ok) return;
    const el = areaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(result.error.position, Math.min(text.length, result.error.position + 1));
  };

  const copyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setPathNote(`${t.pathCopied}: ${path}`);
    } catch {
      setPathNote(path);
    }
  };

  const statusId = "json-status";
  const errorMessage = !result.ok ? t.errors[result.error.code].replace("{char}", JSON.stringify(result.error.char ?? "")) : "";

  return (
    <div className="grid lg:grid-cols-2">
      <div className="flex min-w-0 flex-col border-b border-ink lg:border-b-0 lg:border-r">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <label htmlFor="json-input" className="eyebrow mr-auto">{t.input}</label>
          <button type="button" className={btn} onClick={() => setText(t.sample)}>{t.load}</button>
          <button type="button" className={btn} onClick={() => setText("")} disabled={isEmpty}>{t.clear}</button>
        </div>
        <textarea
          id="json-input"
          ref={areaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-invalid={!result.ok && !isEmpty}
          aria-describedby={statusId}
          className="on-night night mono min-h-72 w-full flex-1 resize-y p-4 text-[0.82rem] leading-relaxed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent lg:min-h-[26rem]"
        />
        <div className="flex flex-wrap items-center gap-2 border-t border-line p-3">
          <button type="button" className={btn} onClick={() => rewrite((v) => formatJson(v, indent))} disabled={!result.ok}>{t.prettify}</button>
          <button type="button" className={btn} onClick={() => rewrite(minifyJson)} disabled={!result.ok}>{t.minify}</button>
          <button type="button" className={btn} onClick={() => rewrite((v) => formatJson(sortKeys(v), indent))} disabled={!result.ok}>{t.sort}</button>
          <fieldset className="ml-auto flex items-center gap-1">
            <legend className="sr-only">{t.indent}</legend>
            {INDENTS.map((option) => (
              <label key={String(option)} className="cursor-pointer">
                <input type="radio" name="json-indent" className="peer sr-only" checked={indent === option} onChange={() => setIndent(option)} />
                <span className="mono block rounded-full border border-transparent px-2.5 py-1.5 text-[0.7rem] text-ink-2 peer-checked:border-ink peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                  {t.indentOptions[String(option) as keyof typeof t.indentOptions]}
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-3">
          <p id={statusId} role="status" className="mono flex items-center gap-2 text-[0.75rem] uppercase tracking-wider">
            {isEmpty ? (
              <span className="text-ink-3">{t.output}</span>
            ) : result.ok ? (
              <>
                <CheckCircle2 className="size-4 text-signal" aria-hidden />
                <span className="text-signal">{t.valid}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="size-4 text-accent-ink" aria-hidden />
                <span className="text-accent-ink">{t.invalid}</span>
              </>
            )}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <CopyButton text={text} label={t.copy} copiedLabel={t.copied} disabled={isEmpty} />
          </div>
        </div>

        <div className="min-h-72 flex-1 bg-paper-2 p-4 lg:max-h-[30rem] lg:overflow-y-auto">
          {isEmpty && <p className="text-sm text-ink-3">{t.empty}</p>}

          {!result.ok && !isEmpty && (
            <div role="alert">
              <p className="h3">{errorMessage}</p>
              <p className="mono mt-2 text-[0.78rem] text-ink-2">{interpolate(t.errorAt, { line: result.error.line, column: result.error.column })}</p>
              {errorExcerpt && (
                <pre className="on-night night mono mt-4 overflow-x-auto rounded p-3 text-[0.78rem] leading-snug" aria-hidden>
                  {errorExcerpt.line}
                  {"\n"}
                  {" ".repeat(Math.max(0, errorExcerpt.caret))}
                  <span className="text-accent">▲</span>
                </pre>
              )}
              <button type="button" className={`${btn} mt-4`} onClick={goToError}>
                {interpolate(t.errorAt, { line: result.error.line, column: result.error.column })}
              </button>
            </div>
          )}

          {result.ok && stats && (
            <div>
              <dl className="grid grid-cols-4 gap-px border border-line bg-line">
                {(
                  [
                    [t.stats.bytes, stats.bytes],
                    [t.stats.nodes, stats.nodes],
                    [t.stats.keys, stats.keys],
                    [t.stats.depth, stats.depth],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="bg-paper-2 px-3 py-2">
                    <dt className="eyebrow">{label}</dt>
                    <dd className="mono tabular text-lg">{value.toLocaleString()}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <h3 className="eyebrow mr-auto">{t.structure}</h3>
                <button type="button" className="mono text-[0.72rem] uppercase tracking-wider underline underline-offset-4" onClick={() => { setOpenDepth(Infinity); setEpoch((e) => e + 1); }}>{t.expandAll}</button>
                <button type="button" className="mono text-[0.72rem] uppercase tracking-wider underline underline-offset-4" onClick={() => { setOpenDepth(1); setEpoch((e) => e + 1); }}>{t.collapseAll}</button>
              </div>
              <p className="mb-2 mt-1 text-xs text-ink-3">{t.structureHint}</p>
              <JsonTree
                key={epoch}
                value={result.value}
                openDepth={openDepth}
                labels={{ items: t.items, properties: t.properties, showMore: t.showMore, copyPath: t.copyPath }}
                onSelect={copyPath}
              />
              <p role="status" className="mono mt-3 min-h-5 break-all text-[0.75rem] text-accent-ink">{pathNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
