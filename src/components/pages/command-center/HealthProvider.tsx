"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** Shape of /api/health. Every field is optional-tolerant: an older deployment may lack some checks. */
export interface HealthPayload {
  status: "ok" | "degraded";
  runtime: { node: string; region: string; environment: string };
  deployment: { commit: string | null };
  checks: {
    database: string;
    email?: string;
    emailProvider?: string | null;
    contactWebhook?: string;
    contactChannels?: string[];
  };
}

export type HealthState = { kind: "loading" } | { kind: "error" } | { kind: "ready"; data: HealthPayload; latencyMs: number };

interface Value {
  state: HealthState;
  refresh: () => void;
}

const HealthContext = createContext<Value | null>(null);

/**
 * Fetches the real /api/health once for the whole console so every live panel
 * (status, email, repository, deployment, terminal `status`) shows the same snapshot.
 */
export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HealthState>({ kind: "loading" });

  // A 503 still carries a JSON body describing the degraded state, so response.ok is not required.
  const request = useCallback(async (signal?: AbortSignal): Promise<HealthState | null> => {
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

  const value = useMemo<Value>(
    () => ({
      state,
      refresh: () => {
        setState({ kind: "loading" });
        void request().then((next) => next && setState(next));
      },
    }),
    [state, request],
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth(): Value {
  const value = useContext(HealthContext);
  if (!value) throw new Error("useHealth must be used inside <HealthProvider>");
  return value;
}
