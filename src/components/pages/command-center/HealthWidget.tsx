"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

interface HealthPayload {
  status: "ok" | "degraded";
  runtime: { node: string; region: string; environment: string };
  deployment: { commit: string | null };
  checks: { database: string; contactWebhook: string };
}

type State = { kind: "loading" } | { kind: "error" } | { kind: "ready"; data: HealthPayload; latencyMs: number };

interface Copy {
  eyebrow: string;
  title: string;
  endpoint: string;
  loading: string;
  error: string;
  retry: string;
  raw: string;
  status: { ok: string; degraded: string };
  fields: Record<"status" | "environment" | "region" | "commit" | "database" | "webhook" | "latency" | "node", string>;
  values: Record<string, string>;
}

/** Fetches the real /api/health endpoint in the browser and shows what it returns. */
export function HealthWidget({ copy, rawHref }: { copy: Copy; rawHref: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  /** One round trip; 503 still carries a JSON body describing the degraded state, so response.ok is not checked. */
  const request = useCallback(async (signal?: AbortSignal): Promise<State | null> => {
    const started = performance.now();
    try {
      const response = await fetch("/api/health", { cache: "no-store", signal });
      const data = (await response.json()) as HealthPayload;
      return { kind: "ready", data, latencyMs: Math.round(performance.now() - started) };
    } catch {
      return signal?.aborted ? null : { kind: "error" };
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void request(controller.signal).then((next) => next && setState(next));
    return () => controller.abort();
  }, [request]);

  const label = (v: string) => copy.values[v] ?? v;
  const rows =
    state.kind === "ready"
      ? ([
          [copy.fields.environment, label(state.data.runtime.environment)],
          [copy.fields.region, label(state.data.runtime.region)],
          [copy.fields.node, state.data.runtime.node],
          [copy.fields.commit, state.data.deployment.commit ?? "—"],
          [copy.fields.database, label(state.data.checks.database)],
          [copy.fields.webhook, label(state.data.checks.contactWebhook)],
          [copy.fields.latency, `${state.latencyMs} ms`],
        ] as const)
      : [];

  return (
    <section aria-labelledby="health-title" className="flex h-full flex-col rounded-lg border border-night-line bg-night-2 p-6">
      <p className="eyebrow mb-3">{copy.eyebrow}</p>
      <h3 id="health-title" className="h3">{copy.title}</h3>
      <p className="mono mt-1 text-xs text-night-mute">{copy.endpoint}</p>

      <div className="mt-6 min-h-[17rem]" aria-live="polite">
        {state.kind === "loading" && <p className="mono text-sm text-night-mute">{copy.loading}</p>}
        {state.kind === "error" && <p className="text-sm text-[#ff8f73]">{copy.error}</p>}
        {state.kind === "ready" && (
          <>
            <p className="mb-4 flex items-center gap-2 text-sm">
              <span aria-hidden className={"size-2.5 rounded-full " + (state.data.status === "ok" ? "bg-[#4fd18b]" : "bg-accent")} />
              <span className="sr-only">{copy.fields.status}: </span>
              {copy.status[state.data.status]}
            </p>
            <dl className="divide-y divide-night-line border-y border-night-line text-sm">
              {rows.map(([term, detail]) => (
                <div key={term} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-night-mute">{term}</dt>
                  <dd className="mono break-all text-right text-[0.8rem]">{detail}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setState({ kind: "loading" });
            void request().then((next) => next && setState(next));
          }}
          className="mono inline-flex items-center gap-2 text-xs text-night-mute transition-colors hover:text-night-ink"
        >
          <RefreshCw className="size-3.5" aria-hidden />
          {copy.retry}
        </button>
        <a href={rawHref} target="_blank" rel="noopener noreferrer" className="mono link-underline text-xs text-night-mute hover:text-night-ink">
          {copy.raw}
          <span className="sr-only"> (new tab)</span>
        </a>
      </div>
    </section>
  );
}
