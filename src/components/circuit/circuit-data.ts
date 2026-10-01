import raw from "@/generated/ai-circuit.json";

export type CircuitGroup = "human" | "orchestration" | "model" | "agent" | "tool" | "data" | "quality" | "delivery";
export type EdgeKind = "signal" | "bus" | "data" | "agent-bus" | "side";

export interface CircuitNode {
  id: string;
  label: string;
  sub: string;
  group: CircuitGroup;
  designator: string;
  x: number;
  y: number;
}

export interface CircuitEdge {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  d: string;
  points: number[][];
  length: number;
}

export interface Circuit {
  meta: { generator: string; description: string; topologyHash: string; nodeCount: number; edgeCount: number; groupCount: number; traceLength: number };
  viewBox: number[];
  node: { width: number; height: number };
  groups: { id: CircuitGroup; label: string }[];
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  focus: Record<string, string[]>;
  focusLinks: Record<string, string[][]>;
}

/** The artifact written by scripts/generate_ai_circuit.py. Never edited by hand. */
export const circuit = raw as unknown as Circuit;

export const groupOrder: CircuitGroup[] = ["human", "orchestration", "model", "agent", "tool", "data", "quality", "delivery"];

export interface Highlight {
  nodes: Set<string>;
  edges: Set<string>;
}

/**
 * What lights up when a node is selected: its curated focus set, plus every trace whose
 * both ends are inside that set. Agent-bus taps light up when their agent is in focus,
 * so the shared trunk reads as active.
 */
export function highlightFor(id: string | null, data: Circuit = circuit): Highlight | null {
  if (!id || !data.focus[id]) return null;
  const nodes = new Set(data.focus[id]);
  const edges = new Set(data.edges.filter((e) => nodes.has(e.source) && nodes.has(e.target)).map((e) => e.id));
  return { nodes, edges };
}

/** Nodes directly wired to `id`, in board order (top-to-bottom, left-to-right). */
export function connectionsOf(id: string, data: Circuit = circuit): CircuitNode[] {
  const ids = new Set<string>();
  for (const e of data.edges) {
    if (e.source === id) ids.add(e.target);
    if (e.target === id) ids.add(e.source);
  }
  for (const [a, b] of data.focusLinks[id] ?? []) {
    if (a === id && b) ids.add(b);
    if (b === id && a) ids.add(a);
  }
  return data.nodes.filter((n) => ids.has(n.id)).sort((a, b) => a.y - b.y || a.x - b.x);
}

/** Keyboard navigation: nearest node in a direction, using board geometry. */
export function nearestNode(fromId: string, direction: "up" | "down" | "left" | "right", data: Circuit = circuit): string | null {
  const from = data.nodes.find((n) => n.id === fromId);
  if (!from) return null;
  let best: { id: string; score: number } | null = null;
  for (const n of data.nodes) {
    if (n.id === fromId) continue;
    const dx = n.x - from.x;
    const dy = n.y - from.y;
    const primary = direction === "up" ? -dy : direction === "down" ? dy : direction === "left" ? -dx : dx;
    if (primary <= 1) continue;
    const secondary = direction === "up" || direction === "down" ? Math.abs(dx) : Math.abs(dy);
    const score = primary + secondary * 2.5;
    if (!best || score < best.score) best = { id: n.id, score };
  }
  return best?.id ?? null;
}

/** Nodes in reading order, used for the mobile selector and tab order. */
export const nodesInReadingOrder = [...circuit.nodes].sort((a, b) => a.y - b.y || a.x - b.x);
