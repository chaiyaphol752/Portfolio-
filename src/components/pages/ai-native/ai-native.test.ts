import { describe, expect, it } from "vitest";
import { actorIds, aiNativeContent, collaboration } from "@/content/ai-native";
import { locales } from "@/i18n/config";

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("AI-native content", () => {
  it("defines exactly nine stages with matching shape in every locale", () => {
    for (const locale of locales) {
      const { stages } = aiNativeContent[locale];
      expect(stages).toHaveLength(9);
      stages.forEach((stage, i) => {
        expect(stage.artifacts.length).toBe(aiNativeContent.en.stages[i]?.artifacts.length);
        expect(stage.gate.length).toBeGreaterThan(10);
      });
    }
  });

  it("lists the eight-step chain and eleven practices in every locale", () => {
    for (const locale of locales) {
      expect(aiNativeContent[locale].chain.steps).toHaveLength(8);
      expect(aiNativeContent[locale].practices.items).toHaveLength(11);
    }
  });

  it("has a valid collaboration matrix with a human participant at every stage", () => {
    for (const actor of actorIds) {
      expect(collaboration[actor]).toHaveLength(9);
      expect(collaboration[actor].every((v) => v === 0 || v === 1 || v === 2)).toBe(true);
    }
    expect(collaboration.human.every((v) => v > 0)).toBe(true);
  });

  it("has no empty strings and no gendered Thai self-reference", () => {
    for (const locale of locales) expect(strings(aiNativeContent[locale]).every((s) => s.trim().length > 0)).toBe(true);
    expect(strings(aiNativeContent.th).join(" ")).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
});
