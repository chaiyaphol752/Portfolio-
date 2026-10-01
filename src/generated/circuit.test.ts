import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import circuit from "./ai-circuit.json";

describe("Python-generated orchestration architecture", () => {
  const ids = new Set(circuit.nodes.map((n) => n.id));
  const tools = new Set(circuit.tools);
  const models = new Set(circuit.models);

  it("was produced by the Python generator", () => {
    expect(circuit.meta.generator).toBe("scripts/generate_ai_circuit.py");
    expect(circuit.meta.nodeCount).toBe(circuit.nodes.length);
    expect(circuit.meta.edgeCount).toBe(circuit.edges.length);
    expect(circuit.meta.agentCount).toBe(12);
    expect(Object.keys(circuit.agents)).toHaveLength(12);
  });

  it("only connects existing nodes", () => {
    for (const e of circuit.edges) {
      expect(ids.has(e.source) || e.source === "tool-bus", e.id).toBe(true);
      expect(ids.has(e.target), e.id).toBe(true);
      expect(e.d.startsWith("M")).toBe(true);
    }
    for (const t of circuit.taps) expect(ids.has(t.node), t.id).toBe(true);
  });

  it("wires agents only to tools and models they declare", () => {
    for (const [agent, spec] of Object.entries(circuit.agents)) {
      expect(ids.has(agent)).toBe(true);
      for (const t of spec.tools) expect(tools.has(t), `${agent}:${t}`).toBe(true);
      for (const m of spec.models) expect(models.has(m), `${agent}:${m}`).toBe(true);
      expect(ids.has(spec.checkpoint)).toBe(true);
      expect(spec.routes.map((r) => r.tool)).toEqual(spec.tools);
    }
  });

  it("never wires a model directly to a tool or agent", () => {
    for (const e of circuit.edges) {
      if (models.has(e.target) || models.has(e.source)) expect([e.source, e.target]).toContain("model-router");
    }
  });

  it("has a focus set for every node that includes the node itself", () => {
    for (const id of ids) {
      const set = (circuit.focus as Record<string, string[]>)[id];
      expect(set, id).toBeDefined();
      expect(set).toContain(id);
      for (const f of set ?? []) expect(ids.has(f), `${id} -> ${f}`).toBe(true);
    }
  });

  it("covers the orchestration hierarchy and ecosystem", () => {
    for (const id of ["goal", "orchestrator", "planner", "agent-router", "model-router", "chatgpt", "claude", "local-ai", "n8n", "python", "validation", "approval", "github", "vercel", "production", "email"])
      expect(ids.has(id), id).toBe(true);
  });

  it("describes every flow with steps", () => {
    for (const key of ["development", "production", "lead-form", "scheduled", "ai-business"]) {
      expect((circuit.flows as Record<string, unknown[]>)[key]?.length, key).toBeGreaterThan(3);
    }
  });

  it("ships a matching static SVG", () => {
    const svg = readFileSync(path.resolve(import.meta.dirname, "../../public/generated/ai-circuit.svg"), "utf8");
    expect(svg).toContain(circuit.meta.topologyHash);
  });
});
