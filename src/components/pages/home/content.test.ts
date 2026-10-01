import { describe, expect, it } from "vitest";
import { homeContent } from "@/content/home";
import { aboutContent } from "@/content/about";

const THAI_PRONOUNS = /ผม|ฉัน|ดิฉัน|ครับ|ค่ะ/;
const NUMBERING = /\b0\d\s*\/\s*0?9\b|complexity|komplexität|ความซับซ้อน/i;

describe("home and about content", () => {
  it("has the same shape in every locale", () => {
    const shape = (v: unknown): unknown =>
      Array.isArray(v) ? v.map(shape) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)])) : typeof v;
    for (const content of [homeContent, aboutContent]) {
      expect(shape(content.de)).toEqual(shape(content.en));
      expect(shape(content.th)).toEqual(shape(content.en));
    }
  });
  it("keeps Thai copy free of gendered self-reference", () => {
    expect(JSON.stringify(homeContent.th)).not.toMatch(THAI_PRONOUNS);
    expect(JSON.stringify(aboutContent.th)).not.toMatch(THAI_PRONOUNS);
  });
  it("covers every requested service on the home page", () => {
    for (const l of ["en", "de", "th"] as const) {
      const s = homeContent[l].services;
      expect(s.lead).toHaveLength(4);
      expect(s.more.engineering.items.length + s.more.ai.items.length).toBe(10);
      expect(homeContent[l].hero.outcomes).toHaveLength(8);
    }
  });
  it("names the AI ecosystem explicitly", () => {
    for (const l of ["en", "de", "th"] as const) {
      const text = JSON.stringify(homeContent[l]) + JSON.stringify(aboutContent[l]);
      for (const term of ["ChatGPT", "Claude", "Python"]) expect(text).toContain(term);
    }
  });
  it("no longer exposes page numbering or complexity levels", () => {
    for (const l of ["en", "de", "th"] as const) {
      expect(JSON.stringify(homeContent[l])).not.toMatch(NUMBERING);
      expect(JSON.stringify(aboutContent[l])).not.toMatch(NUMBERING);
    }
  });
});
