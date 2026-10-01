import { describe, expect, it } from "vitest";
import { aiNativeContent, agentIds } from "@/content/ai-native";

describe("AI-native copy", () => {
  it("keeps Thai pronoun-free", () => {
    expect(JSON.stringify(aiNativeContent.th)).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
  it("names ChatGPT, Claude Code, Local AI and Python in every locale", () => {
    for (const locale of ["en", "de", "th"] as const) {
      const text = JSON.stringify(aiNativeContent[locale]);
      for (const term of ["ChatGPT", "Claude Code", "Local AI", "Python"]) expect(text, `${locale}:${term}`).toContain(term);
    }
  });
  it("labels every catalog system as a concept", () => {
    for (const locale of ["en", "de", "th"] as const) expect(aiNativeContent[locale].catalog.badge).toBeTruthy();
  });
  it("describes every agent with a verification gate", () => {
    for (const id of agentIds) expect(aiNativeContent.en.agents.items[id].gate).toBeTruthy();
  });
});
