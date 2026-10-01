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

describe("AI-native content matches the generated architecture", () => {
  it("development agents and pipeline come from flows.development", async () => {
    const { splitDevelopmentFlow } = await import("./AgentSystem");
    const { pipelineIds } = await import("@/content/ai-native");
    const { branch, pipeline, lead } = splitDevelopmentFlow();
    expect([...branch].sort()).toEqual([...agentIds].sort());
    expect(pipeline).toEqual([...pipelineIds]);
    expect(lead[0]).toBe("dev-orchestrator");
  });
  it("reading key points at real components and covers every layer role", async () => {
    const { circuit } = await import("@/components/circuit/circuit-data");
    const ids = new Set(circuit.nodes.map((n) => n.id));
    for (const locale of ["en", "de", "th"] as const) {
      const key = aiNativeContent[locale].key.items;
      for (const item of key) expect(ids.has(item.id), item.id).toBe(true);
      expect(key.map((k) => k.id)).toEqual(expect.arrayContaining(["orchestrator", "n8n", "python", "approval", "github"]));
    }
  });
  it("labels n8n as an architecture capability, not a live instance", () => {
    for (const locale of ["en", "de", "th"] as const) {
      expect(aiNativeContent[locale].automation.badge).toMatch(/n8n/);
      expect(aiNativeContent[locale].automation.honesty).toMatch(/n8n/);
    }
  });
});
