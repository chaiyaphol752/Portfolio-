import { describe, expect, it } from "vitest";
import { categoryIds, projectIds, projectsMeta } from "./data";
import { projectsContent } from "@/content/projects";
import { profile } from "@/config/profile";

describe("projects data", () => {
  it("lists every project once, with known categories", () => {
    expect(projectsMeta.map((p) => p.id)).toEqual([...projectIds]);
    for (const p of projectsMeta) for (const c of p.categories) expect(categoryIds).toContain(c);
  });
  it("covers every service category", () => {
    for (const c of categoryIds) expect(projectsMeta.some((p) => p.categories.includes(c)), c).toBe(true);
  });
  it("labels honestly: only this portfolio is a live demo, and only it has a link", () => {
    const demos = projectsMeta.filter((p) => p.kind === "demo");
    expect(demos.map((p) => p.id)).toEqual(["this-portfolio"]);
    expect(demos[0]?.links[0]?.url).toBe(profile.sourceRepo);
    for (const p of projectsMeta.filter((p) => p.kind !== "demo")) expect(p.links).toEqual([]);
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
