import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import circuit from "./ai-circuit.json";

describe("Python-generated AI circuit", () => {
  const ids = new Set(circuit.nodes.map((n) => n.id));

  it("was produced by the Python generator", () => {
    expect(circuit.meta.generator).toBe("scripts/generate_ai_circuit.py");
    expect(circuit.meta.nodeCount).toBe(circuit.nodes.length);
    expect(circuit.meta.edgeCount).toBe(circuit.edges.length);
  });
  it("only connects existing nodes", () => {
    for (const e of circuit.edges) {
      expect(ids.has(e.source), e.id).toBe(true);
      expect(ids.has(e.target), e.id).toBe(true);
      expect(e.d.startsWith("M")).toBe(true);
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
  it("covers the key ecosystem nodes", () => {
    for (const id of ["chatgpt", "claude", "local-ai", "python", "orchestrator", "router", "github", "vercel"]) expect(ids.has(id), id).toBe(true);
  });
  it("ships a matching static SVG", () => {
    const svg = readFileSync(path.resolve(import.meta.dirname, "../../public/generated/ai-circuit.svg"), "utf8");
    expect(svg).toContain(circuit.meta.topologyHash);
  });
});
