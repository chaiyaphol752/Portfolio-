import { z } from "zod";

/** Shape of GET /api/health; validated on the client so a malformed response can't crash the panel. */
export const healthSchema = z.object({
  status: z.string(),
  service: z.string(),
  time: z.string(),
  runtime: z.object({ node: z.string(), region: z.string(), environment: z.string() }),
  deployment: z.object({ commit: z.string().nullable() }),
  checks: z.object({ database: z.string(), contactWebhook: z.string() }),
});

export type Health = z.infer<typeof healthSchema>;

export type HealthResult =
  | { phase: "loading" }
  | { phase: "error" }
  | { phase: "done"; http: number; data: Health };

export async function fetchHealth(signal: AbortSignal): Promise<HealthResult> {
  try {
    const response = await fetch("/api/health", { cache: "no-store", signal });
    const parsed = healthSchema.safeParse(await response.json());
    return parsed.success ? { phase: "done", http: response.status, data: parsed.data } : { phase: "error" };
  } catch {
    return { phase: "error" };
  }
}
