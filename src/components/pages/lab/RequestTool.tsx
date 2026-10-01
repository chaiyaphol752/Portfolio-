"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { AlertTriangle, CheckCircle2, Plus, Send, X } from "lucide-react";
import { clsx } from "clsx";
import type { LabContent } from "@/content/lab";
import { interpolate } from "@/lib/interpolate";
import {
  analyzeRequest,
  formatBytes,
  httpMethods,
  methodAllowsBody,
  resolveUrl,
  toCurl,
  toFetch,
  toPython,
  urlParts,
  type HttpMethod,
  type KeyValue,
  type RequestSpec,
} from "@/lib/lab/request";
import { CopyButton } from "./CopyButton";

const btn =
  "mono inline-flex h-9 items-center gap-2 rounded-full border border-ink px-3.5 text-[0.72rem] uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit";
const field =
  "mono w-full min-w-0 border-b border-line bg-transparent px-1 py-2 text-[0.82rem] focus:border-ink focus:outline-none";

type Section = "params" | "headers" | "body";
type SnippetFormat = "curl" | "fetch" | "python";
const MAX_PREVIEW = 4000;
const noopSubscribe = () => () => {};

type Response =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "done"; status: number; statusText: string; ms: number; bytes: number; type: string; body: string }
  | { state: "error"; reason: "network" | "timeout" };

const presets: Record<"health" | "post", RequestSpec> = {
  health: { method: "GET", url: "/api/health", params: [], headers: [{ key: "Accept", value: "application/json", enabled: true }], body: "" },
  post: {
    method: "POST",
    url: "https://api.example.com/v1/projects",
    params: [{ key: "dry_run", value: "true", enabled: true }],
    headers: [
      { key: "Content-Type", value: "application/json", enabled: true },
      { key: "Authorization", value: "Bearer <token>", enabled: true },
    ],
    body: `{\n  "name": "Website redesign",\n  "locales": ["en", "de", "th"],\n  "deadline": null\n}`,
  },
};

export function RequestTool({ t }: { t: LabContent["request"] }) {
  const uid = useId();
  const [spec, setSpec] = useState<RequestSpec>(presets.health);
  const [section, setSection] = useState<Section>("headers");
  const [format, setFormat] = useState<SnippetFormat>("curl");
  const [response, setResponse] = useState<Response>({ state: "idle" });
  // The page origin is only known in the browser; relative URLs resolve against it.
  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => undefined);
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const resolved = useMemo(() => resolveUrl(spec, origin ?? "https://example.com"), [spec, origin]);
  const warnings = useMemo(() => analyzeRequest(spec, origin), [spec, origin]);
  const snippet = useMemo(
    () => (format === "curl" ? toCurl(spec, origin) : format === "fetch" ? toFetch(spec, origin) : toPython(spec, origin)),
    [format, spec, origin],
  );

  const update = (patch: Partial<RequestSpec>) => setSpec((s) => ({ ...s, ...patch }));
  const updateRows = (kind: "params" | "headers", index: number, patch: Partial<KeyValue>) =>
    setSpec((s) => ({ ...s, [kind]: s[kind].map((row, i) => (i === index ? { ...row, ...patch } : row)) }));
  const addRow = (kind: "params" | "headers") => setSpec((s) => ({ ...s, [kind]: [...s[kind], { key: "", value: "", enabled: true }] }));
  const removeRow = (kind: "params" | "headers", index: number) => setSpec((s) => ({ ...s, [kind]: s[kind].filter((_, i) => i !== index) }));

  const send = async () => {
    if (!resolved.ok) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort("timeout"), 10_000);
    setResponse({ state: "sending" });
    const headers = new Headers();
    for (const h of spec.headers) {
      if (!h.enabled || !h.key.trim()) continue;
      try {
        headers.append(h.key.trim(), h.value);
      } catch {
        // Invalid header names are already reported in the checks list.
      }
    }
    const started = performance.now();
    try {
      const res = await fetch(resolved.url, {
        method: spec.method,
        headers,
        body: methodAllowsBody(spec.method) && spec.body.trim() ? spec.body : undefined,
        signal: controller.signal,
        cache: "no-store",
      });
      const text = await res.text();
      const ms = Math.round(performance.now() - started);
      let body = text;
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // Not JSON: show as text.
      }
      setResponse({
        state: "done",
        status: res.status,
        statusText: res.statusText,
        ms,
        bytes: new TextEncoder().encode(text).length,
        type: res.headers.get("content-type") ?? "—",
        body,
      });
    } catch {
      setResponse({ state: "error", reason: controller.signal.aborted ? "timeout" : "network" });
    } finally {
      clearTimeout(timer);
    }
  };

  const sectionIds: Section[] = ["params", "headers", "body"];
  const counts = {
    params: spec.params.filter((p) => p.enabled && p.key).length,
    headers: spec.headers.filter((h) => h.enabled && h.key).length,
    body: spec.body.trim() ? 1 : 0,
  };

  return (
    <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* ---------------- request pane ---------------- */}
      <div className="flex min-w-0 flex-col border-b border-ink lg:border-b-0 lg:border-r">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <span className="eyebrow mr-auto">{t.presets.label}</span>
          <button type="button" className={btn} onClick={() => { setSpec(presets.health); setResponse({ state: "idle" }); }}>{t.presets.health}</button>
          <button type="button" className={btn} onClick={() => { setSpec(presets.post); setSection("body"); setResponse({ state: "idle" }); }}>{t.presets.post}</button>
        </div>

        <div className="flex items-end gap-3 border-b border-line p-3">
          <div className="shrink-0">
            <label htmlFor={`${uid}-method`} className="eyebrow block">{t.method}</label>
            <select
              id={`${uid}-method`}
              value={spec.method}
              onChange={(e) => update({ method: e.target.value as HttpMethod })}
              className="mono mt-1 h-10 border-b border-ink bg-transparent pr-2 text-[0.85rem] font-semibold focus:outline-none"
            >
              {httpMethods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="min-w-0 flex-1">
            <label htmlFor={`${uid}-url`} className="eyebrow block">{t.url}</label>
            <input
              id={`${uid}-url`}
              value={spec.url}
              onChange={(e) => update({ url: e.target.value })}
              placeholder={t.urlPlaceholder}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-invalid={!resolved.ok}
              className="mono mt-1 h-10 w-full min-w-0 border-b border-ink bg-transparent text-[0.85rem] focus:outline-none"
            />
          </div>
        </div>

        <div role="tablist" aria-label={t.sectionsLabel} className="flex border-b border-line">
          {sectionIds.map((id) => {
            const selected = id === section;
            return (
              <button
                key={id}
                role="tab"
                type="button"
                id={`${uid}-sec-${id}`}
                aria-selected={selected}
                aria-controls={`${uid}-secpanel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setSection(id)}
                onKeyDown={(e) => {
                  const i = sectionIds.indexOf(id);
                  const next = e.key === "ArrowRight" ? sectionIds[(i + 1) % 3] : e.key === "ArrowLeft" ? sectionIds[(i + 2) % 3] : undefined;
                  if (!next) return;
                  e.preventDefault();
                  setSection(next);
                  document.getElementById(`${uid}-sec-${next}`)?.focus();
                }}
                className={clsx(
                  "mono relative flex-1 px-3 py-2.5 text-[0.72rem] uppercase tracking-wider transition-colors",
                  selected ? "bg-paper-2 text-ink" : "text-ink-3 hover:text-ink",
                )}
              >
                {t.sections[id]} <span className="tabular text-ink-3">{counts[id]}</span>
                <span aria-hidden className={clsx("absolute inset-x-0 bottom-0 h-0.5", selected ? "bg-accent" : "bg-transparent")} />
              </button>
            );
          })}
        </div>

        <div id={`${uid}-secpanel`} role="tabpanel" aria-labelledby={`${uid}-sec-${section}`} className="min-h-56 flex-1 p-3">
          {section === "body" ? (
            <div className="flex h-full flex-col">
              <label htmlFor={`${uid}-body`} className="sr-only">{t.sections.body}</label>
              <textarea
                id={`${uid}-body`}
                value={spec.body}
                onChange={(e) => update({ body: e.target.value })}
                spellCheck={false}
                rows={9}
                aria-describedby={`${uid}-bodyhint`}
                className="on-night night mono min-h-48 w-full flex-1 resize-y rounded-sm p-3 text-[0.8rem] leading-relaxed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <p id={`${uid}-bodyhint`} className="mt-2 text-xs text-ink-3">{t.bodyHint}</p>
            </div>
          ) : (
            <KeyValueEditor
              rows={spec[section]}
              t={t}
              idPrefix={`${uid}-${section}`}
              onChange={(i, patch) => updateRows(section, i, patch)}
              onAdd={() => addRow(section)}
              onRemove={(i) => removeRow(section, i)}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line p-3">
          <button type="button" onClick={send} disabled={!resolved.ok || response.state === "sending"} className="btn btn-primary !min-h-10 !py-0 text-[0.85rem]">
            <Send className="size-4" aria-hidden />
            {response.state === "sending" ? t.sending : t.send}
          </button>
          <p className="min-w-[12rem] flex-1 text-xs text-ink-3">{t.sendNote}</p>
        </div>
      </div>

      {/* ---------------- inspection pane ---------------- */}
      <div className="flex min-w-0 flex-col bg-paper-2">
        <section aria-labelledby={`${uid}-resolved`} className="border-b border-line p-4">
          <h2 id={`${uid}-resolved`} className="eyebrow">{t.resolved}</h2>
          {resolved.ok ? (
            <>
              <p className="mono mt-2 break-all text-[0.82rem]">
                <span className="font-semibold text-accent-ink">{spec.method}</span> {resolved.url.toString()}
              </p>
              <dl className="mt-3 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 text-[0.78rem]">
                {(() => {
                  const parts = urlParts(resolved.url);
                  return (
                    <>
                      <dt className="text-ink-3">{t.parts.protocol}</dt>
                      <dd className="mono">{parts.protocol}</dd>
                      <dt className="text-ink-3">{t.parts.host}</dt>
                      <dd className="mono break-all">{parts.host}</dd>
                      <dt className="text-ink-3">{t.parts.path}</dt>
                      <dd className="mono break-all">{parts.path}</dd>
                      <dt className="text-ink-3">{t.parts.query}</dt>
                      <dd className="mono break-all">{parts.query.length ? parts.query.map(([k, v]) => `${k}=${v}`).join(" · ") : "—"}</dd>
                    </>
                  );
                })()}
              </dl>
            </>
          ) : (
            <p role="alert" className="mt-2 flex items-center gap-2 text-sm text-accent-ink">
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
              {t.urlErrors[resolved.error]}
            </p>
          )}
        </section>

        <section aria-labelledby={`${uid}-checks`} className="border-b border-line p-4">
          <h2 id={`${uid}-checks`} className="eyebrow">{t.warningsTitle}</h2>
          {warnings.length === 0 ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-signal">
              <CheckCircle2 className="size-4" aria-hidden />
              {t.noWarnings}
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {warnings.map((w) => (
                <li key={w} className="flex gap-2 text-sm text-ink-2">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden />
                  {t.warnings[w]}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby={`${uid}-code`} className="border-b border-line p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={`${uid}-code`} className="eyebrow mr-auto">{t.snippets}</h2>
            <fieldset className="flex items-center gap-1">
              <legend className="sr-only">{t.snippets}</legend>
              {(["curl", "fetch", "python"] as const).map((f) => (
                <label key={f} className="cursor-pointer">
                  <input type="radio" name={`${uid}-format`} className="peer sr-only" checked={format === f} onChange={() => setFormat(f)} />
                  <span className="mono block rounded-full border border-transparent px-2.5 py-1.5 text-[0.7rem] text-ink-2 peer-checked:border-ink peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                    {t.formats[f]}
                  </span>
                </label>
              ))}
            </fieldset>
            <CopyButton text={snippet} label={t.copy} copiedLabel={t.copied} />
          </div>
          <pre tabIndex={0} aria-label={`${t.snippets}: ${t.formats[format]}`} className="on-night night mono mt-3 max-h-64 overflow-auto rounded-sm p-3 text-[0.76rem] leading-relaxed">
            {snippet}
          </pre>
        </section>

        <section aria-labelledby={`${uid}-response`} aria-live="polite" className="flex-1 p-4">
          <h2 id={`${uid}-response`} className="eyebrow">{t.response}</h2>
          {response.state === "idle" && <p className="mt-2 text-sm text-ink-3">{t.emptyResponse}</p>}
          {response.state === "sending" && <p className="mono mt-2 text-sm text-ink-2">{t.sending}</p>}
          {response.state === "error" && (
            <p role="alert" className="mt-2 flex gap-2 text-sm text-accent-ink">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {response.reason === "timeout" ? t.timeout : t.networkError}
            </p>
          )}
          {response.state === "done" && (
            <>
              <dl className="mt-3 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
                {(
                  [
                    [t.status, `${response.status} ${response.statusText}`.trim(), response.status < 400],
                    [t.time, `${response.ms} ms`, true],
                    [t.size, formatBytes(response.bytes), true],
                    [t.type, response.type.split(";")[0] ?? "—", true],
                  ] as const
                ).map(([label, value, ok]) => (
                  <div key={label} className="min-w-0 bg-paper-2 px-3 py-2">
                    <dt className="eyebrow">{label}</dt>
                    <dd className={clsx("mono tabular truncate text-[0.9rem]", !ok && "text-accent-ink")}>{value}</dd>
                  </div>
                ))}
              </dl>
              <pre tabIndex={0} aria-label={t.response} className="mono mt-3 max-h-72 overflow-auto rounded-sm border border-line bg-paper p-3 text-[0.76rem] leading-relaxed">
                {response.body.slice(0, MAX_PREVIEW) || "—"}
              </pre>
              {response.body.length > MAX_PREVIEW && <p className="mt-2 text-xs text-ink-3">{interpolate(t.truncated, { n: MAX_PREVIEW })}</p>}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

interface EditorProps {
  rows: KeyValue[];
  t: LabContent["request"];
  idPrefix: string;
  onChange: (index: number, patch: Partial<KeyValue>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

function KeyValueEditor({ rows, t, idPrefix, onChange, onAdd, onRemove }: EditorProps) {
  return (
    <div>
      {rows.length > 0 && (
        <ul className="space-y-1">
          {rows.map((row, i) => (
            <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1.3fr)_auto] items-center gap-2">
              <Checkbox
                box="sm"
                checked={row.enabled}
                onChange={(e) => onChange(i, { enabled: e.target.checked })}
                aria-label={`${t.enabled} ${i + 1}`}
                className="-mx-2"
              />
              <input
                value={row.key}
                onChange={(e) => onChange(i, { key: e.target.value })}
                aria-label={`${t.key} ${i + 1}`}
                placeholder={t.key}
                spellCheck={false}
                id={`${idPrefix}-k${i}`}
                className={clsx(field, !row.enabled && "text-ink-3 line-through")}
              />
              <input
                value={row.value}
                onChange={(e) => onChange(i, { value: e.target.value })}
                aria-label={`${t.value} ${i + 1}`}
                placeholder={t.value}
                spellCheck={false}
                className={clsx(field, !row.enabled && "text-ink-3")}
              />
              <button type="button" onClick={() => onRemove(i)} aria-label={`${t.remove} ${i + 1}`} className="grid size-8 place-items-center rounded-full text-ink-3 hover:bg-paper-3 hover:text-ink">
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={onAdd} className={clsx(btn, "mt-3")}>
        <Plus className="size-3.5" aria-hidden />
        {t.add}
      </button>
    </div>
  );
}
