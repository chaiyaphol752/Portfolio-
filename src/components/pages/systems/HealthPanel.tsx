"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { SystemsContent } from "@/content/systems";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";
import { fetchHealth, type HealthResult } from "./healthSchema";

export function HealthPanel({ t, locale }: { t: SystemsContent["health"]; locale: Locale }) {
  const [result, setResult] = useState<HealthResult>({ phase: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal).then((r) => {
      if (!controller.signal.aborted) setResult(r);
    });
    return () => controller.abort();
  }, []);

  const refresh = () => {
    setResult({ phase: "loading" });
    fetchHealth(new AbortController().signal).then(setResult);
  };

  const word = (value: string | null) => (value === null ? t.values.none : (t.values[value] ?? value));
  const tag = locale === "th" ? "th-TH-u-ca-gregory" : locale;

  return (
    <div className="border border-ink">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink bg-paper-2 px-4 py-3">
        <p className="mono text-[0.8rem]">
          <span className="rounded bg-ink px-1.5 py-0.5 text-paper">GET</span> /api/health
          {result.phase === "done" && <span className="ml-3 text-ink-3">{interpolate(t.httpStatus, { status: result.http })}</span>}
        </p>
        <button
          type="button"
          onClick={refresh}
          disabled={result.phase === "loading"}
          className="mono inline-flex h-9 items-center gap-2 rounded-full border border-ink px-3.5 text-[0.72rem] uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
        >
          <RefreshCw className={"size-3.5 " + (result.phase === "loading" ? "animate-spin motion-reduce:animate-none" : "")} aria-hidden />
          {t.refresh}
        </button>
      </div>

      <div role="status" aria-live="polite" aria-busy={result.phase === "loading"} className="min-h-[15rem]">
        {result.phase === "loading" && <p className="mono p-5 text-sm text-ink-3">{t.loading}</p>}
        {result.phase === "error" && <p className="p-5 text-sm text-accent-ink">{t.error}</p>}
        {result.phase === "done" && (
          <dl className="grid sm:grid-cols-2">
            {(
              [
                [t.fields.status, word(result.data.status), true],
                [t.fields.service, result.data.service, false],
                [t.fields.time, new Date(result.data.time).toLocaleString(tag, { dateStyle: "medium", timeStyle: "medium" }), false],
                [t.fields.node, result.data.runtime.node, false],
                [t.fields.region, word(result.data.runtime.region), false],
                [t.fields.environment, result.data.runtime.environment, false],
                [t.fields.commit, word(result.data.deployment.commit), false],
                [t.fields.database, word(result.data.checks.database), false],
                [t.fields.webhook, word(result.data.checks.contactWebhook), false],
              ] as const
            ).map(([label, value, strong]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line px-4 py-3 sm:odd:border-r">
                <dt className="eyebrow shrink-0">{label}</dt>
                <dd className={"mono min-w-0 break-words text-right text-[0.82rem] " + (strong ? (result.data.status === "ok" ? "text-signal" : "text-accent-ink") : "")}>
                  {strong && <span aria-hidden className={"mr-2 inline-block size-2 rounded-full " + (result.data.status === "ok" ? "bg-signal" : "bg-accent")} />}
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
