import { describe, expect, it } from "vitest";
import { homeContent } from "@/content/home";
import { aboutContent } from "@/content/about";

const THAI_PRONOUNS = /ผม|ฉัน|ดิฉัน|ครับ|ค่ะ/;

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
  it("lists four visual nodes and six capabilities", () => {
    for (const l of ["en", "de", "th"] as const) {
      expect(homeContent[l].visual.nodes).toHaveLength(4);
      expect(homeContent[l].capabilities).toHaveLength(6);
    }
  });
});
