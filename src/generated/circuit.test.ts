import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import circuit from "./ai-circuit.json";

const ids = new Set(circuit.nodes.map((n) => n.id));
const agents = circuit.agents as Record<string, { role: string; inputs: string; outputs: string; tools: string[]; models: string[]; validation: string }>;
const STAGE_ORDER = ["intent", "orchestrator", "plan-route", "agents", "models", "tools", "data", "control", "delivery"];

describe("Python-generated orchestration architecture", () => {
  it("was produced by the Python generator with consistent counts", () => {
    expect(circuit.meta.generator).toBe("scripts/generate_ai_circuit.py");
    expect(circuit.meta.nodeCount).toBe(circuit.nodes.length);
    expect(circuit.meta.connectionCount).toBe(circuit.connections.length);
    expect(circuit.meta.edgeCount).toBe(circuit.layouts.desktop.traces.length);
    expect(circuit.meta.agentCount).toBe(12);
    expect(circuit.viewBox).toEqual(circuit.layouts.desktop.viewBox);
  });

  it("has the nine architecture stages in reading order, each node in exactly one", () => {
    expect(circuit.stages.map((s) => s.id)).toEqual(STAGE_ORDER);
    const placed = circuit.stages.flatMap((s) => s.nodeIds);
    expect(placed.sort()).toEqual([...ids].sort());
    for (const n of circuit.nodes) expect(STAGE_ORDER).toContain(n.stage);
  });

  it("only uses meaningful connection verbs between real nodes", () => {
    const seen = new Set<string>();
    for (const c of circuit.connections) {
      expect(ids.has(c.from), c.id).toBe(true);
      expect(ids.has(c.to), c.id).toBe(true);
      expect(circuit.verbs).toContain(c.verb);
      expect(seen.has(c.id), `duplicate ${c.id}`).toBe(false);
      seen.add(c.id);
    }
  });

  it("describes every agent completely and wires it only to declared tools", () => {
    const agentNodes = circuit.nodes.filter((n) => n.type === "agent").map((n) => n.id);
    expect(Object.keys(agents).sort()).toEqual(agentNodes.sort());
    for (const [id, a] of Object.entries(agents)) {
      expect(a.role && a.inputs && a.outputs, id).toBeTruthy();
      expect(a.tools.length, id).toBeGreaterThan(0);
      expect(a.models.length, id).toBeGreaterThan(0);
      expect(ids.has(a.validation), id).toBe(true);
      for (const t of a.tools) expect(circuit.tools).toContain(t);
      for (const m of a.models) expect(circuit.models).toContain(m);
      const calls = circuit.connections.filter((c) => c.from === id && c.verb === "calls").map((c) => c.to);
      expect(calls.sort(), id).toEqual([...a.tools].sort());
    }
  });

  it("reaches models only through the model router", () => {
    for (const c of circuit.connections.filter((x) => circuit.models.includes(x.to) && x.verb === "selects-model")) {
      expect(c.from).toBe("model-router");
    }
    for (const id of Object.keys(agents)) {
      expect(circuit.connections.some((c) => c.from === id && circuit.models.includes(c.to))).toBe(false);
    }
  });

  it("offers the five selectable workflows, every step a real node", () => {
    expect(circuit.workflows.map((w) => w.id)).toEqual(["development", "automation", "ai-research", "local-ai", "website-lead"]);
    for (const w of circuit.workflows) {
      for (const step of w.steps) for (const id of Array.isArray(step) ? step : [step]) expect(ids.has(id), `${w.id}: ${id}`).toBe(true);
    }
  });

  it("keeps n8n honest and the key nodes prominent", () => {
    const byId = new Map(circuit.nodes.map((n) => [n.id, n]));
    expect(byId.get("n8n")?.status).toBe("capability");
    expect(byId.get("n8n")?.description).toMatch(/not the AI brain/);
    for (const id of ["orchestrator", "n8n", "python", "chatgpt", "claude", "local-ai"]) expect(byId.get(id)?.mobilePriority, id).toBe(1);
    expect(byId.get("orchestrator")?.uses).toEqual(expect.arrayContaining(["Context passing", "Retries", "Checkpoints", "Aggregating results"]));
  });

  it("lays out every node on the desktop board and draws only real connections", () => {
    const lay = circuit.layouts.desktop;
    expect(Object.keys(lay.positions).sort()).toEqual([...ids].sort());
    const connectionIds = new Set(circuit.connections.map((c) => c.id));
    for (const t of lay.traces) expect(connectionIds.has(t.connection), t.id).toBe(true);
    for (const [agent, routes] of Object.entries(lay.routes)) expect(routes.map((r) => r.tool).sort()).toEqual([...agents[agent]!.tools].sort());
    for (const tap of lay.taps) expect(ids.has(tap.node)).toBe(true);
  });

  it("has a focus set for every node that includes the node itself", () => {
    const focus = circuit.focus as Record<string, string[]>;
    for (const id of ids) {
      expect(focus[id], id).toContain(id);
      for (const f of focus[id] ?? []) expect(ids.has(f)).toBe(true);
    }
  });

  it("ships a matching static SVG", () => {
    const svg = readFileSync(path.resolve(import.meta.dirname, "../../public/generated/ai-circuit.svg"), "utf8");
    expect(svg).toContain(circuit.meta.topologyHash);
  });
});
