export const criteria = ["privacy", "offline", "capability", "cost", "latency"] as const;
export type Criterion = (typeof criteria)[number];
export type Route = "cloud" | "local" | "split";

export interface RouteDecision {
  route: Route;
  /** Criteria that actually decided the route, in priority order. */
  decidedBy: Criterion[];
}

/**
 * Rule set behind the hybrid routing simulation. Privacy and offline operation are hard
 * constraints; capability prefers cloud models; cost and latency prefer local ones.
 * When private data meets a task that needs a frontier model, the work is split: local
 * models handle the private context and only a redacted request goes to the cloud.
 */
export function decideRoute(active: ReadonlySet<Criterion>): RouteDecision {
  const hard = criteria.filter((c) => (c === "privacy" || c === "offline") && active.has(c));
  if (hard.length && active.has("capability")) {
    // Offline means the cloud is unreachable, so splitting is not possible.
    if (active.has("offline")) return { route: "local", decidedBy: ["offline"] };
    return { route: "split", decidedBy: ["privacy", "capability"] };
  }
  if (hard.length) return { route: "local", decidedBy: hard };
  if (active.has("capability")) return { route: "cloud", decidedBy: ["capability"] };
  const local = criteria.filter((c) => (c === "cost" || c === "latency") && active.has(c));
  if (local.length) return { route: "local", decidedBy: local };
  return { route: "cloud", decidedBy: [] };
}

/** Which diagram nodes are on the active path for a route. */
export function pathFor(route: Route): Set<"app" | "router" | "cloud" | "local" | "tools" | "validation" | "result"> {
  const base = ["app", "router", "tools", "validation", "result"] as const;
  if (route === "cloud") return new Set([...base, "cloud"]);
  if (route === "local") return new Set([...base, "local"]);
  return new Set([...base, "cloud", "local"]);
}
