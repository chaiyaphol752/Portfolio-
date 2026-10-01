import raw from "@/generated/ai-circuit.json";

/*
 * Typed access to the architecture written by scripts/generate_ai_circuit.py.
 * The semantic graph (stages, nodes, connections, agents, workflows) feeds every
 * presentation; only the desktop board reads `layouts.desktop`.
 */

export type StageId = "intent" | "orchestrator" | "plan-route" | "agents" | "models" | "tools" | "data" | "control" | "delivery";
export type NodeType = "input" | "core" | "model" | "agent" | "tool" | "data" | "control" | "delivery";
export type ConnectionKind = "flow" | "model" | "agent-bus" | "automation" | "data" | "control" | "delivery";
export type Verb = "delegates" | "routes" | "calls" | "reads-writes" | "validates" | "approves" | "deploys" | "triggers" | "automates" | "selects-model";
export type NodeStatus = "live" | "capability";
export type WorkflowId = "development" | "automation" | "ai-research" | "local-ai" | "website-lead";
export type LayerId = "input" | "orchestration" | "models" | "agents" | "tools" | "data" | "control";

export interface ArchNode {
  id: string;
  label: string;
  sub: string;
  type: NodeType;
  stage: StageId;
  description: string;
  /** 1 = primary (always prominent), 2 = standard, 3 = detail. */
  mobilePriority: 1 | 2 | 3;
  status: NodeStatus;
  uses: string[];
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  verb: Verb;
  kind: ConnectionKind;
}

export interface AgentSpec {
  role: string;
  inputs: string;
  outputs: string;
  tools: string[];
  models: string[];
  /** The node that checks this agent's work. */
  validation: string;
}

/** A node id, or several node ids that run in parallel. */
export type WorkflowStep = string | string[];
/** Legacy step diagrams also use free-form step ids. */
export type FlowStep = string | string[];
export type FlowId = "development" | "production" | "lead-form" | "scheduled" | "ai-business";

export interface Workflow {
  id: WorkflowId;
  label: string;
  summary: string;
  steps: WorkflowStep[];
}

export interface DesktopLayout {
  viewBox: number[];
  layers: { id: LayerId; label: string; y0: number; y1: number }[];
  labelX: number;
  modelBox: { id: "models"; label: string; x0: number; x1: number; y0: number; y1: number };
  positions: Record<string, { x: number; y: number; w: number; h: number; band: LayerId; designator: string }>;
  traces: { id: string; connection: string; kind: ConnectionKind; d: string; length: number }[];
  buses: { id: string; d: string }[];
  taps: { id: string; node: string; d: string }[];
  routes: Record<string, { tool: string; connection: string; d: string }[]>;
}

export interface Circuit {
  meta: {
    generator: string;
    description: string;
    topologyHash: string;
    nodeCount: number;
    edgeCount: number;
    connectionCount: number;
    agentCount: number;
    stageCount: number;
    workflowCount: number;
    groupCount: number;
    traceLength: number;
  };
  viewBox: number[];
  verbs: Verb[];
  stages: { id: StageId; label: string; summary: string; nodeIds: string[] }[];
  nodes: ArchNode[];
  connections: Connection[];
  agents: Record<string, AgentSpec>;
  tools: string[];
  models: string[];
  focus: Record<string, string[]>;
  workflows: Workflow[];
  flows: Record<FlowId, FlowStep[]>;
  layouts: { desktop: DesktopLayout };
}

/** The artifact written by scripts/generate_ai_circuit.py. Never edited by hand. */
export const circuit = raw as unknown as Circuit;
export const desktop = circuit.layouts.desktop;

export const nodeById = new Map(circuit.nodes.map((n) => [n.id, n]));
export const isNode = (id: string) => nodeById.has(id);
export const isAgent = (id: string) => id in circuit.agents;
export const workflowIds = circuit.workflows.map((w) => w.id);

/** Node ids of a workflow in order, parallel steps flattened, each with its 1-based step number. */
export function workflowSteps(id: WorkflowId, data: Circuit = circuit): { id: string; step: number; parallel: boolean }[] {
  const wf = data.workflows.find((w) => w.id === id);
  if (!wf) return [];
  return wf.steps.flatMap((s, i): { id: string; step: number; parallel: boolean }[] =>
    Array.isArray(s) ? s.map((n) => ({ id: n, step: i + 1, parallel: true })) : [{ id: s, step: i + 1, parallel: false }],
  );
}

/** Nodes and connections in a workflow: consecutive steps (including parallel members) are linked. */
export function workflowGraph(id: WorkflowId, data: Circuit = circuit): { nodes: Set<string>; connections: Set<string>; stepOf: Map<string, number> } {
  const wf = data.workflows.find((w) => w.id === id);
  const nodes = new Set<string>();
  const connections = new Set<string>();
  const stepOf = new Map<string, number>();
  if (!wf) return { nodes, connections, stepOf };
  const groups = wf.steps.map((s) => (Array.isArray(s) ? s : [s]));
  groups.forEach((g, i) =>
    g.forEach((n) => {
      nodes.add(n);
      if (!stepOf.has(n)) stepOf.set(n, i + 1);
    }),
  );
  const pairs = new Set<string>();
  for (let i = 0; i < groups.length - 1; i++) for (const a of groups[i]!) for (const b of groups[i + 1]!) pairs.add(`${a}>${b}`).add(`${b}>${a}`);
  for (const c of data.connections) if (pairs.has(c.id)) connections.add(c.id);
  return { nodes, connections, stepOf };
}

export interface Highlight {
  nodes: Set<string>;
  /** Lit desktop traces. */
  traces: Set<string>;
  taps: Set<string>;
  buses: Set<string>;
  /** Exact agent -> tool paths drawn on top. */
  routes: { id: string; d: string }[];
  /** Step numbers when a workflow is shown. */
  stepOf?: Map<string, number>;
}

function desktopHighlight(
  nodes: Set<string>,
  litConnection: (c: Connection) => boolean,
  routeFilter: (agent: string, tool: string) => boolean,
  data: Circuit,
): Omit<Highlight, "nodes" | "stepOf"> {
  const lay = data.layouts.desktop;
  const byId = new Map(data.connections.map((c) => [c.id, c]));
  const agentsIn = Object.keys(data.agents).filter((a) => nodes.has(a));
  const routes = agentsIn.flatMap((a) => (lay.routes[a] ?? []).filter((r) => nodes.has(r.tool) && routeFilter(a, r.tool)).map((r) => ({ id: `${a}>${r.tool}`, d: r.d })));
  const traces = new Set(lay.traces.filter((t) => byId.has(t.connection) && litConnection(byId.get(t.connection)!)).map((t) => t.id));
  // The results path below the tool bus counts as a route out of the bus.
  const toolBus = routes.length > 0 || traces.has("test-agent>validation");
  const taps = new Set(lay.taps.filter((t) => routes.some((r) => r.id.startsWith(`${t.node}>`) || r.id.endsWith(`>${t.node}`))).map((t) => t.id));
  const buses = new Set<string>();
  if ([...traces].some((t) => t.startsWith("agent-router>"))) buses.add("agent-bus");
  if (toolBus) buses.add("tool-bus");
  if ([...traces].some((t) => t.startsWith("model-router>") && t !== "model-router>orchestrator")) buses.add("model-bus");
  return { traces, taps, buses, routes };
}

/**
 * What lights up when a node is selected: its generated focus set, every connection whose
 * ends are both inside it, the buses it touches and — for agents and tools — the exact routes.
 */
export function highlightFor(id: string | null, data: Circuit = circuit): Highlight | null {
  if (!id || !data.focus[id]) return null;
  const nodes = new Set(data.focus[id]);
  const routeFilter = id in data.agents ? (a: string) => a === id : data.tools.includes(id) ? (_a: string, t: string) => t === id : () => false;
  return { nodes, ...desktopHighlight(nodes, (c) => nodes.has(c.from) && nodes.has(c.to), routeFilter, data) };
}

/** What lights up for a workflow: only its nodes, the links between consecutive steps and their routes. */
export function highlightForWorkflow(id: WorkflowId | null, data: Circuit = circuit): Highlight | null {
  if (!id) return null;
  const g = workflowGraph(id, data);
  if (!g.nodes.size) return null;
  return {
    nodes: g.nodes,
    stepOf: g.stepOf,
    ...desktopHighlight(g.nodes, (c) => g.connections.has(c.id), (a, t) => g.connections.has(`${a}>${t}`), data),
  };
}

/** Connections touching a node, with direction, for the detail panels. */
export function connectionsOf(id: string, data: Circuit = circuit): { connection: Connection; direction: "out" | "in"; other: string }[] {
  return data.connections
    .filter((c) => c.from === id || c.to === id)
    .map((c) => ({ connection: c, direction: c.from === id ? ("out" as const) : ("in" as const), other: c.from === id ? c.to : c.from }));
}

/** Components related to `id` (its focus set without itself), in stage order. */
export function relatedTo(id: string, data: Circuit = circuit): ArchNode[] {
  const ids = new Set(data.focus[id] ?? []);
  ids.delete(id);
  return data.nodes.filter((n) => ids.has(n.id));
}

/** Keyboard navigation on the desktop board: nearest node in a direction. */
export function nearestNode(fromId: string, direction: "up" | "down" | "left" | "right", data: Circuit = circuit): string | null {
  const pos = data.layouts.desktop.positions;
  const from = pos[fromId];
  if (!from) return null;
  let best: { id: string; score: number } | null = null;
  for (const [id, n] of Object.entries(pos)) {
    if (id === fromId) continue;
    const dx = n.x - from.x;
    const dy = n.y - from.y;
    const primary = direction === "up" ? -dy : direction === "down" ? dy : direction === "left" ? -dx : dx;
    if (primary <= 1) continue;
    const secondary = direction === "up" || direction === "down" ? Math.abs(dx) : Math.abs(dy);
    const score = primary + secondary * 2.5;
    if (!best || score < best.score) best = { id, score };
  }
  return best?.id ?? null;
}

/** Nodes in board reading order (top to bottom, left to right). */
export const nodesInReadingOrder = [...circuit.nodes].sort((a, b) => {
  const pa = desktop.positions[a.id]!;
  const pb = desktop.positions[b.id]!;
  return pa.y - pb.y || pa.x - pb.x;
});

/** Lets other parts of the page (flow diagrams, the reading key) select a node in the architecture. */
export const CIRCUIT_SELECT_EVENT = "circuit:select";
export function selectOnCircuit(id: string) {
  window.dispatchEvent(new CustomEvent<string>(CIRCUIT_SELECT_EVENT, { detail: id }));
}
