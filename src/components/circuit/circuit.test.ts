import { describe, expect, it } from "vitest";
import { circuit, connectionsOf, highlightFor, highlightForWorkflow, nearestNode, workflowGraph, workflowSteps } from "./circuit-data";
import { circuitCopy, translationTables } from "./labels";

describe("workflow helpers", () => {
  it("flattens steps with numbers and marks parallel steps", () => {
    const steps = workflowSteps("development");
    expect(steps[0]).toEqual({ id: "goal", step: 1, parallel: false });
    expect(steps.filter((s) => s.step === 4).map((s) => s.id)).toEqual(["frontend-agent", "backend-agent", "python-agent"]);
    expect(steps.every((s) => s.step !== 4 || s.parallel)).toBe(true);
  });

  it("links consecutive steps to real connections", () => {
    const g = workflowGraph("local-ai");
    expect([...g.nodes]).toEqual(["private-docs", "python", "embeddings", "local-ai", "validation", "application"]);
    expect(g.connections.has("python>private-docs")).toBe(true);
    expect(g.connections.has("python>embeddings")).toBe(true);
    expect(g.connections.has("local-ai>embeddings")).toBe(true);
  });

  it("highlights only the selected workflow on the desktop board", () => {
    const h = highlightForWorkflow("development")!;
    expect(h.stepOf?.get("orchestrator")).toBe(2);
    expect(h.traces.has("goal>orchestrator")).toBe(true);
    expect(h.traces.has("orchestrator>planner")).toBe(true);
    expect(h.traces.has("triggers>n8n")).toBe(false);
    expect(h.nodes.has("n8n")).toBe(false);
  });

  it("highlights the automation path through n8n", () => {
    const h = highlightForWorkflow("automation")!;
    expect(h.traces.has("triggers>n8n")).toBe(true);
    expect(h.traces.has("n8n>orchestrator")).toBe(true);
    expect(h.routes.map((r) => r.id).sort()).toEqual(["automation-agent>apis", "automation-agent>python"]);
  });
});

describe("selection helpers", () => {
  it("Orchestrator lights planner, router, agents and validation", () => {
    const h = highlightFor("orchestrator")!;
    for (const id of ["planner", "agent-router", "research-agent", "deploy-agent", "validation"]) expect(h.nodes.has(id), id).toBe(true);
    expect(h.buses.has("agent-bus")).toBe(true);
  });

  it("n8n lights its automation paths", () => {
    const h = highlightFor("n8n")!;
    expect(h.traces.has("triggers>n8n")).toBe(true);
    expect(h.traces.has("n8n>orchestrator")).toBe(true);
    expect(h.nodes.has("email")).toBe(true);
  });

  it("ChatGPT lights the model router and only agents that may use it", () => {
    const h = highlightFor("chatgpt")!;
    expect(h.nodes.has("model-router")).toBe(true);
    expect(h.nodes.has("research-agent")).toBe(true);
    expect(h.nodes.has("local-agent")).toBe(false);
  });

  it("Local AI lights the private workflow", () => {
    const h = highlightFor("local-ai")!;
    for (const id of ["local-agent", "python", "embeddings", "private-docs"]) expect(h.nodes.has(id), id).toBe(true);
  });

  it("Python lights automation, data, APIs, local AI and agent tooling", () => {
    const h = highlightFor("python")!;
    for (const id of ["n8n", "apis", "file-data", "local-ai", "python-agent", "automation-agent"]) expect(h.nodes.has(id), id).toBe(true);
    expect(h.routes.every((r) => r.id.endsWith(">python"))).toBe(true);
  });

  it("an agent lights exactly its declared tool routes", () => {
    const h = highlightFor("python-agent")!;
    expect(h.routes.map((r) => r.id).sort()).toEqual(["python-agent>apis", "python-agent>file-data", "python-agent>python"]);
  });

  it("lists connections with direction and verb", () => {
    const out = connectionsOf("n8n").filter((c) => c.direction === "out").map((c) => `${c.connection.verb}:${c.other}`);
    expect(out).toEqual(expect.arrayContaining(["triggers:orchestrator", "automates:email", "calls:python"]));
  });

  it("moves keyboard focus to the nearest node", () => {
    expect(nearestNode("orchestrator", "down")).toBe("planner");
    expect(nearestNode("planner", "up")).toBe("orchestrator");
  });
});

describe("labels", () => {
  it("translates every node, agent, stage and workflow into German and Thai", () => {
    for (const n of circuit.nodes) {
      expect(translationTables.nodeTable[n.id]?.de, n.id).toBeDefined();
      expect(translationTables.nodeTable[n.id]?.th, n.id).toBeDefined();
    }
    for (const a of Object.keys(circuit.agents)) expect(translationTables.agentTable[a], a).toBeDefined();
    for (const s of circuit.stages) expect(translationTables.stageTable[s.id], s.id).toBeDefined();
    for (const w of circuit.workflows) expect(translationTables.workflowTable[w.id], w.id).toBeDefined();
    for (const n of circuit.nodes.filter((x) => x.uses.length)) {
      expect(translationTables.usesTable[n.id]?.de.length, n.id).toBe(n.uses.length);
      expect(translationTables.usesTable[n.id]?.th.length, n.id).toBe(n.uses.length);
    }
  });

  it("spells Orchestrator correctly and keeps Thai pronoun-free", () => {
    for (const locale of ["en", "de", "th"] as const) {
      const text = JSON.stringify(circuitCopy[locale]);
      expect(text).not.toMatch(/Orchaster|Orchastr/i);
      expect(circuitCopy[locale].nodes.orchestrator?.label).toBe("Orchestrator");
    }
    expect(JSON.stringify(circuitCopy.th)).not.toMatch(/ผม|ฉัน|ดิฉัน|ครับ|ค่ะ/);
  });

  it("labels n8n as a capability, never a live instance", () => {
    expect(circuitCopy.en.status.n8n).toMatch(/no live n8n instance/);
    expect(circuitCopy.de.status.n8n).toMatch(/keine n8n-Instanz/);
  });
});
