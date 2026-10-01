import raw from "@/generated/ai-circuit.json";

export type LayerId = "input" | "orchestration" | "models" | "agents" | "tools" | "data" | "control";
export type NodeKind = "input" | "core" | "model" | "agent" | "tool" | "data" | "control" | "delivery";
export type EdgeKind = "flow" | "model" | "agent-bus" | "automation" | "data" | "control" | "delivery";
export type NodeStatus = "live" | "capability";

export interface CircuitNode {
  id: string;
  label: string;
  sub: string;
  layer: LayerId;
  kind: NodeKind;
  status: NodeStatus;
  designator: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CircuitEdge {
  id: string;
  /** A node id, or "tool-bus" for the results path that leaves the shared tool bus. */
  source: string;
  target: string;
  kind: EdgeKind;
  d: string;
  length: number;
}

export interface AgentSpec {
  tools: string[];
  models: string[];
  checkpoint: string;
  routes: { tool: string; d: string }[];
}

/** A step id, or a list of parallel step ids. */
export type FlowStep = string | string[];
export type FlowId = "development" | "production" | "lead-form" | "scheduled" | "ai-business";

export interface Circuit {
  meta: {
    generator: string;
    description: string;
    topologyHash: string;
    nodeCount: number;
    edgeCount: number;
    agentCount: number;
    groupCount: number;
    traceLength: number;
    layout: string;
  };
  viewBox: number[];
  node: { width: number; height: number };
  layers: { id: LayerId; label: string; y0: number; y1: number }[];
  labelX: number;
  modelBox: { id: "models"; label: string; x0: number; x1: number; y0: number; y1: number };
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  buses: { id: string; label: string; d: string }[];
  taps: { id: string; node: string; d: string }[];
  agents: Record<string, AgentSpec>;
  tools: string[];
  models: string[];
  focus: Record<string, string[]>;
  flows: Record<FlowId, FlowStep[]>;
}

/** The artifact written by scripts/generate_ai_circuit.py. Never edited by hand. */
export const circuit = raw as unknown as Circuit;

export const nodeById = new Map(circuit.nodes.map((n) => [n.id, n]));
export const isNode = (id: string) => nodeById.has(id);
export const isAgent = (id: string) => id in circuit.agents;

export interface Highlight {
  nodes: Set<string>;
  edges: Set<string>;
  taps: Set<string>;
  buses: Set<string>;
  /** Exact agent -> tool paths drawn on top: an agent's declared tools, or every agent using a selected tool. */
  routes: { id: string; d: string }[];
}

/**
 * What lights up for a selection: the generated focus set, every trace whose ends are both
 * inside it, the bus segments it touches and — for agents and tools — the precise agent-to-tool
 * routes. The renderer dims everything else.
 */
export function highlightFor(id: string | null, data: Circuit = circuit): Highlight | null {
  if (!id || !data.focus[id]) return null;
  const nodes = new Set(data.focus[id]);
  const agentsIn = Object.keys(data.agents).filter((a) => nodes.has(a));
  const toolsIn = data.tools.filter((t) => nodes.has(t));
  const modelsIn = data.models.filter((m) => nodes.has(m));
  // The results path leaves the tool bus, so the bus counts as "in focus" when tools are involved.
  const toolBusActive = toolsIn.length > 0 && (agentsIn.length > 0 || nodes.has("validation"));
  const has = (end: string) => (end === "tool-bus" ? toolBusActive : nodes.has(end));

  const edges = new Set(data.edges.filter((e) => has(e.source) && has(e.target)).map((e) => e.id));
  const taps = new Set(data.taps.filter((t) => nodes.has(t.node) && toolBusActive).map((t) => t.id));
  const buses = new Set<string>();
  if (nodes.has("agent-router") && agentsIn.length) buses.add("agent-bus");
  if (toolBusActive) buses.add("tool-bus");
  if (nodes.has("model-router") && modelsIn.length) buses.add("model-bus");

  let routes: Highlight["routes"] = [];
  if (isAgent(id)) {
    routes = (data.agents[id]?.routes ?? []).map((r) => ({ id: `${id}>${r.tool}`, d: r.d }));
  } else if (data.tools.includes(id)) {
    routes = agentsIn.flatMap((a) => (data.agents[a]?.routes ?? []).filter((r) => r.tool === id).map((r) => ({ id: `${a}>${r.tool}`, d: r.d })));
  }
  return { nodes, edges, taps, buses, routes };
}

/** Components related to `id` (its focus set without itself), in board reading order. */
export function relatedTo(id: string, data: Circuit = circuit): CircuitNode[] {
  const ids = new Set(data.focus[id] ?? []);
  ids.delete(id);
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

/** Nodes in reading order, used for the selector and tab order. */
export const nodesInReadingOrder = [...circuit.nodes].sort((a, b) => a.y - b.y || a.x - b.x);

/** Lets other parts of the page (flow diagrams, the reading key) select a node on the board. */
export const CIRCUIT_SELECT_EVENT = "circuit:select";
export function selectOnCircuit(id: string) {
  window.dispatchEvent(new CustomEvent<string>(CIRCUIT_SELECT_EVENT, { detail: id }));
}
