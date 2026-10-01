import { describe, expect, it } from "vitest";
import { circuit, connectionsOf, highlightFor, nearestNode, nodesInReadingOrder } from "./circuit-data";
import { circuitCopy } from "./labels";

describe("circuit highlight logic", () => {
  it("returns nothing for no selection or unknown ids", () => {
    expect(highlightFor(null)).toBeNull();
    expect(highlightFor("nope")).toBeNull();
  });
  it("lights ChatGPT's curated path", () => {
    const h = highlightFor("chatgpt");
    expect([...(h?.nodes ?? [])].sort()).toEqual(["chatgpt", "orchestrator", "research", "router", "validation", "web-api"].sort());
    expect(h?.edges.has("chatgpt--router")).toBe(true);
    expect(h?.edges.has("orchestrator--chatgpt")).toBe(true);
    expect(h?.edges.has("claude--router")).toBe(false);
  });
  it("only lights traces whose ends are both in focus", () => {
    for (const n of circuit.nodes) {
      const h = highlightFor(n.id);
      for (const id of h?.edges ?? []) {
        const e = circuit.edges.find((x) => x.id === id);
        expect(h?.nodes.has(e!.source) && h?.nodes.has(e!.target)).toBe(true);
      }
    }
  });
  it("lists direct connections including focus links", () => {
    const ids = connectionsOf("python").map((n) => n.id);
    expect(ids).toEqual(expect.arrayContaining(["router", "web-api", "automation", "local-ai"]));
    expect(ids).not.toContain("python");
  });
  it("moves keyboard focus geometrically", () => {
    expect(nearestNode("intent", "down")).toBe("orchestrator");
    expect(nearestNode("orchestrator", "left")).toBe("planner");
    expect(nearestNode("production", "down")).toBeNull();
  });
  it("orders nodes top-to-bottom", () => {
    expect(nodesInReadingOrder[0]?.id).toBe("intent");
    expect(nodesInReadingOrder.at(-1)?.id).toBe("production");
  });
});

describe("circuit labels", () => {
  it("covers every generated node in every locale", () => {
    for (const locale of ["en", "de", "th"] as const) {
      for (const n of circuit.nodes) expect(circuitCopy[locale].nodes[n.id]?.role, `${locale}:${n.id}`).toBeTruthy();
    }
  });
  it("keeps Thai pronoun-free", () => {
    expect(JSON.stringify(circuitCopy.th)).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
});
