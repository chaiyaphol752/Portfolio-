import { describe, expect, it } from "vitest";
import { categoryIds, projectIds, projectsMeta } from "./data";
import { projectsContent } from "@/content/projects";

describe("projects data", () => {
  it("lists every project once, with known categories", () => {
    expect(projectsMeta.map((p) => p.id)).toEqual([...projectIds]);
    for (const p of projectsMeta) for (const c of p.categories) expect(categoryIds).toContain(c);
  });
  it("covers every service category", () => {
    for (const c of categoryIds) expect(projectsMeta.some((p) => p.categories.includes(c)), c).toBe(true);
  });
  it("labels honestly: only the two live projects have links", () => {
    const live = projectsMeta.filter((p) => p.kind === "live");
    expect(live.map((p) => p.id).sort()).toEqual(["this-portfolio", "wat-charoen-dham"]);
    for (const p of projectsMeta.filter((p) => p.kind !== "live")) expect(p.links).toEqual([]);
    for (const p of live) expect(p.links.length).toBeGreaterThan(0);
  });
  it("has full copy for every project in every locale", () => {
    for (const locale of ["en", "de", "th"] as const) {
      for (const id of projectIds) {
        const copy = projectsContent[locale].projects[id];
        expect(copy.tagline && copy.problem && copy.solution, `${locale}:${id}`).toBeTruthy();
        expect(copy.decisions).toHaveLength(3);
      }
    }
  });
  it("keeps Thai copy pronoun-free", () => {
    expect(JSON.stringify(projectsContent.th)).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
});
