import { describe, expect, it } from "vitest";
import { skillEdges, skillGroups, skillIds, groupOf } from "./data";
import { connectorPath, invalidEdges, relatedTo } from "./graph";

describe("skill graph", () => {
  it("has no invalid or duplicate edges", () => {
    expect(invalidEdges()).toEqual([]);
    const keys = skillEdges.map(([a, b]) => [a, b].sort().join("|"));
    expect(new Set(keys).size).toBe(keys.length);
  });
  it("connects every skill to at least one other", () => {
    for (const id of skillIds) expect(relatedTo(id).length).toBeGreaterThan(0);
  });
  it("is symmetric", () => {
    expect(relatedTo("react")).toContain("nextjs");
    expect(relatedTo("nextjs")).toContain("react");
  });
  it("covers every listed skill exactly once", () => {
    const all = Object.values(skillGroups).flat();
    expect(new Set(all).size).toBe(all.length);
    expect(groupOf("testing")).toBe("engineering");
  });
  it("builds a curve for cross-column and same-column pairs", () => {
    expect(connectorPath({ x: 0, y: 0 }, { x: 200, y: 100 })).toMatch(/^M 0 0 C 100 0, 100 100, 200 100$/);
    expect(connectorPath({ x: 50, y: 0 }, { x: 50, y: 120 })).toContain("C");
  });
});
