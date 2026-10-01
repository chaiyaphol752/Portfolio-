import { describe, expect, it } from "vitest";
import { circuit, highlightFor, nearestNode, nodesInReadingOrder, relatedTo } from "./circuit-data";
import { circuitCopy, stepLabel } from "./labels";

const locales = ["en", "de", "th"] as const;

describe("orchestration highlight logic", () => {
  it("returns nothing for no selection or unknown ids", () => {
    expect(highlightFor(null)).toBeNull();
    expect(highlightFor("nope")).toBeNull();
  });

  it("Orchestrator lights planner, agent router, every agent and validation", () => {
    const h = highlightFor("orchestrator")!;
    for (const id of ["planner", "agent-router", "validation", ...Object.keys(circuit.agents)]) expect(h.nodes.has(id), id).toBe(true);
    expect(h.edges.has("orchestrator--planner")).toBe(true);
    expect(h.edges.has("planner--agent-router")).toBe(true);
    expect(h.buses.has("agent-bus")).toBe(true);
  });

  it("n8n lights its automation paths, not the model layer", () => {
    const h = highlightFor("n8n")!;
    expect(h.edges.has("triggers--n8n")).toBe(true);
    expect(h.edges.has("n8n--orchestrator")).toBe(true);
    for (const m of circuit.models) expect(h.nodes.has(m), m).toBe(false);
  });

  it("ChatGPT lights the model router and only agents that may route to it", () => {
    const h = highlightFor("chatgpt")!;
    expect(h.edges.has("model-router--chatgpt")).toBe(true);
    expect(h.buses.has("model-bus")).toBe(true);
    for (const [agent, spec] of Object.entries(circuit.agents)) expect(h.nodes.has(agent), agent).toBe(spec.models.includes("chatgpt"));
  });

  it("Local AI lights the private workflow", () => {
    const h = highlightFor("local-ai")!;
    for (const id of ["local-agent", "python", "file-data", "embeddings"]) expect(h.nodes.has(id), id).toBe(true);
    expect(h.nodes.has("chatgpt")).toBe(false);
  });

  it("an agent draws exactly the routes to its declared tools", () => {
    for (const [agent, spec] of Object.entries(circuit.agents)) {
      const h = highlightFor(agent)!;
      expect(h.routes.map((r) => r.id.split(">")[1]).sort()).toEqual([...spec.tools].sort());
      for (const t of circuit.tools) expect(h.nodes.has(t), `${agent}:${t}`).toBe(spec.tools.includes(t));
    }
  });

  it("Python draws every agent's route into Python", () => {
    const users = Object.entries(circuit.agents).filter(([, s]) => s.tools.includes("python")).map(([a]) => a);
    expect(highlightFor("python")!.routes.map((r) => r.id.split(">")[0]).sort()).toEqual(users.sort());
  });

  it("only lights traces whose ends are both in focus", () => {
    for (const n of circuit.nodes) {
      const h = highlightFor(n.id)!;
      for (const id of h.edges) {
        const e = circuit.edges.find((x) => x.id === id)!;
        for (const end of [e.source, e.target]) if (end !== "tool-bus") expect(h.nodes.has(end), `${n.id}:${id}`).toBe(true);
      }
    }
  });

  it("lists related components without the selection itself", () => {
    const ids = relatedTo("n8n").map((n) => n.id);
    expect(ids).toContain("orchestrator");
    expect(ids).not.toContain("n8n");
  });

  it("moves keyboard focus geometrically", () => {
    expect(nearestNode("goal", "down")).toBe("orchestrator");
    expect(nearestNode("orchestrator", "down")).toBe("planner");
    expect(nearestNode("orchestrator", "left")).toBe("state");
  });

  it("orders nodes top-to-bottom", () => {
    expect(nodesInReadingOrder[0]?.layer).toBe("input");
    expect(nodesInReadingOrder.at(-1)?.layer).toBe("control");
  });
});

describe("orchestration labels", () => {
  it("covers every node, agent and flow step in every locale", () => {
    for (const locale of locales) {
      const copy = circuitCopy[locale];
      for (const n of circuit.nodes) expect(copy.nodes[n.id]?.role, `${locale}:${n.id}`).toBeTruthy();
      for (const a of Object.keys(circuit.agents)) expect(copy.agents[a]?.responsibility, `${locale}:${a}`).toBeTruthy();
      for (const flow of Object.values(circuit.flows))
        for (const step of flow.flat()) expect(copy.nodes[step] ?? copy.steps[step], `${locale}:${step}`).toBeTruthy();
      expect(stepLabel(copy, "n8n")).toBe("n8n");
    }
  });
  it("spells Orchestrator correctly and labels n8n honestly", () => {
    for (const locale of locales) {
      expect(circuitCopy[locale].nodes.orchestrator?.label).toBe("Orchestrator");
      expect(circuitCopy[locale].status.n8n).toMatch(/n8n/);
    }
    expect(JSON.stringify(circuitCopy)).not.toMatch(/orchast/i);
  });
  it("keeps Thai pronoun-free", () => {
    expect(JSON.stringify(circuitCopy.th)).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
});
