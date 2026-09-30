import { describe, expect, it } from "vitest";
import { caseStepIds, caseStudiesContent } from "@/content/case-studies";
import { locales } from "@/i18n/config";

/** Replaces every string with "s" so two locales can be compared by structure alone. */
function shape(value: unknown): unknown {
  if (typeof value === "string") return "s";
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, shape(v)]));
  }
  return value;
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("case studies content", () => {
  it("has the same structure in every locale", () => {
    const reference = shape(caseStudiesContent.en);
    for (const locale of locales) expect(shape(caseStudiesContent[locale])).toEqual(reference);
  });

  it("covers every step of the narrative for every case", () => {
    for (const locale of locales) {
      for (const study of caseStudiesContent[locale].cases) {
        for (const step of caseStepIds) {
          const { body, points } = study.sections[step];
          // A short lead-in is fine when bullet points carry the substance.
          expect(body.trim().length).toBeGreaterThan(points.length > 0 ? 3 : 40);
        }
      }
    }
  });

  it("keeps case ids unique and includes a demo and at least one concept", () => {
    const cases = caseStudiesContent.en.cases;
    expect(new Set(cases.map((c) => c.id)).size).toBe(cases.length);
    expect(cases.length).toBeGreaterThanOrEqual(2);
    expect(cases.some((c) => c.kind === "demo")).toBe(true);
    expect(cases.some((c) => c.kind === "concept")).toBe(true);
  });

  it("has no empty strings", () => {
    for (const locale of locales) {
      const { cases, ...rest } = caseStudiesContent[locale];
      expect(strings({ cases, ...rest }).every((s) => s.trim().length > 0)).toBe(true);
    }
  });

  it("uses no gendered Thai self-reference", () => {
    expect(strings(caseStudiesContent.th).join(" ")).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
});
