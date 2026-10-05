import { describe, expect, it } from "vitest";
import { buildHaystack, countByCategory, filterItems, matchesQuery, normalize } from "./filter";
import { categoryIds, projectIds, projectsMeta } from "./data";

const items = [
  { id: "a", categories: ["saas"], haystack: buildHaystack(["Relay Desk", "Ticketing", "PostgreSQL"]) },
  { id: "b", categories: ["dashboard", "saas"], haystack: buildHaystack(["Gridwatch", "Charts", "Node.js"]) },
  { id: "c", categories: ["landing-page"], haystack: buildHaystack(["Portfolio", "Übersicht", "โปรเจกต์"]) },
];

describe("project filtering", () => {
  it("returns everything for an empty query and 'all'", () => {
    expect(filterItems(items, { query: "", category: "all" })).toHaveLength(3);
  });
  it("filters by category, including multi-category items", () => {
    expect(filterItems(items, { query: "", category: "saas" }).map((i) => i.id)).toEqual(["a", "b"]);
  });
  it("requires every search token to match, case-insensitively", () => {
    expect(matchesQuery(items[0]!.haystack, "relay POSTGRES")).toBe(true);
    expect(matchesQuery(items[0]!.haystack, "relay charts")).toBe(false);
  });
  it("combines search and category", () => {
    expect(filterItems(items, { query: "charts", category: "saas" }).map((i) => i.id)).toEqual(["b"]);
    expect(filterItems(items, { query: "charts", category: "landing-page" })).toEqual([]);
  });
  it("keeps Thai and German characters searchable", () => {
    expect(filterItems(items, { query: "übersicht", category: "all" })).toHaveLength(1);
    expect(filterItems(items, { query: "โปรเจกต์", category: "all" })).toHaveLength(1);
    expect(normalize("  ÜBER ")).toBe("über");
  });
  it("counts results per category for the current query", () => {
    expect(countByCategory(items, "", ["saas", "dashboard", "landing-page"])).toEqual({ all: 3, saas: 2, dashboard: 1, "landing-page": 1 });
    expect(countByCategory(items, "gridwatch", ["saas", "dashboard"])).toEqual({ all: 1, saas: 1, dashboard: 1 });
  });
});

describe("project data", () => {
  it("defines every project id once and covers every category", () => {
    expect(projectsMeta.map((p) => p.id).sort()).toEqual([...projectIds].sort());
    for (const c of categoryIds) expect(projectsMeta.some((p) => p.categories.includes(c))).toBe(true);
  });
  it("labels exactly the two deployed projects as live", () => {
    expect(projectsMeta.filter((p) => p.kind === "live").map((p) => p.id).sort()).toEqual(["this-portfolio", "wat-charoen-dham"]);
  });
});
