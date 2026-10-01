import { describe, expect, it } from "vitest";
import { capabilityEdges, capabilityIds, capabilityNodes, chains, domainIds, featuredIds, getNode, invalidEdges, nodesIn } from "./data";
import { chamferedPath, hubEdges, relatedSet, tracePath } from "./graph";
import { capabilitiesContent } from "@/content/capabilities";

describe("capability network data", () => {
  it("has unique ids and valid, non-duplicate edges", () => {
    expect(new Set(capabilityIds).size).toBe(capabilityIds.length);
    expect(invalidEdges()).toEqual([]);
    const keys = capabilityEdges.map(([a, b]) => [a, b].sort().join("|"));
    expect(new Set(keys).size).toBe(keys.length);
  });
  it("connects every node to something", () => {
    for (const n of capabilityNodes) expect(n.related.length, n.id).toBeGreaterThan(0);
  });
  it("is symmetric", () => {
    expect(getNode("chatgpt").related).toContain("openai");
    expect(getNode("openai").related).toContain("chatgpt");
  });
  it("makes Python the best-connected node", () => {
    const max = Math.max(...capabilityNodes.map((n) => n.related.length));
    expect(getNode("python").related.length).toBe(max);
  });
  it("covers every domain and the required ecosystem nodes", () => {
    for (const d of domainIds) expect(nodesIn(d).length).toBeGreaterThan(0);
    for (const id of ["chatgpt", "claude", "claude-code", "local-models", "rag", "python", "nextjs", "postgresql", "vercel"] as const) expect(capabilityIds).toContain(id);
  });
  it("uses only known nodes in example chains", () => {
    for (const chain of Object.values(chains)) for (const id of chain) expect(capabilityIds).toContain(id);
  });
  it("has a note for every featured node in every locale", () => {
    for (const locale of ["en", "de", "th"] as const) for (const id of featuredIds) expect(capabilitiesContent[locale].notes[id], `${locale}:${id}`).toBeTruthy();
  });
  it("keeps Thai copy pronoun-free", () => {
    expect(JSON.stringify(capabilitiesContent.th)).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
});

describe("graph helpers", () => {
  it("routes cross-column traces through a vertical channel", () => {
    expect(tracePath({ x: 0, y: 0 }, { x: 100, y: 50 }, 0)).toBe("M 0 0 L 50 0 L 50 0 L 50 50 L 50 50 L 100 50");
  });
  it("bows same-column traces out to the left", () => {
    expect(tracePath({ x: 40, y: 0 }, { x: 40, y: 80 })).toContain("L 26");
  });
  it("chamfers corners", () => {
    expect(chamferedPath([{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 20 }], 4)).toBe("M 0 0 L 16 0 L 20 4 L 20 20");
  });
  it("highlights the node and its neighbours", () => {
    const set = relatedSet("rag");
    expect(set.has("rag")).toBe(true);
    expect(set.has("embeddings")).toBe(true);
    expect(hubEdges.every(([a, b]) => getNode(a).domain === "python" || getNode(b).domain === "python")).toBe(true);
  });
});
