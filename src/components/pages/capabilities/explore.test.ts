import { describe, expect, it } from "vitest";
import { capabilityNodes, chains, getNode, type CapabilityId } from "./data";
import { chainsFor, defaultCapability, familyTabs, filterCapabilities, groupByDomain, normalize } from "./explore";
import { capabilitiesContent } from "@/content/capabilities";

const de = capabilitiesContent.de;
const labelDe = (id: CapabilityId) => de.labels[id] ?? getNode(id).label;
const labelEn = (id: CapabilityId) => getNode(id).label;

describe("capability explorer helpers", () => {
  it("normalizes case, accents and separators", () => {
    expect(normalize("  Lokale KI ")).toBe("lokale ki");
    expect(normalize("Überblick")).toBe("uberblick");
    expect(normalize("Next.js")).toBe("next js");
  });

  it("starts on Python, the hub, with Python as the first tab", () => {
    expect(defaultCapability).toBe("python");
    expect(familyTabs[0]).toBe("python");
  });

  it("lists a whole family when the query is empty", () => {
    const python = filterCapabilities("", labelEn, "python");
    expect(python.length).toBe(capabilityNodes.filter((n) => n.family === "python").length);
    expect(python.every((n) => n.family === "python")).toBe(true);
  });

  it("searches across all families once there is a query", () => {
    const hits = filterCapabilities("n8n", labelEn, "python").map((n) => n.id);
    expect(hits).toContain("n8n");
  });

  it("matches localized labels, English labels and ids", () => {
    expect(filterCapabilities("rag", labelDe).map((n) => n.id)).toContain("rag");
    expect(filterCapabilities("claude-code", labelDe).map((n) => n.id)).toContain("claude-code");
    const local = filterCapabilities("lokale", labelDe).map((n) => n.id);
    expect(local.length).toBeGreaterThan(0);
  });

  it("returns nothing for nonsense", () => {
    expect(filterCapabilities("zzqx", labelEn)).toEqual([]);
  });

  it("groups by domain in board order without empty groups", () => {
    const groups = groupByDomain(getNode("python").related);
    expect(groups.length).toBeGreaterThan(1);
    expect(groups.every((g) => g.ids.length > 0)).toBe(true);
    const flat = groups.flatMap((g) => g.ids);
    expect(new Set(flat)).toEqual(new Set(getNode("python").related));
  });

  it("connects Python to n8n so automation is visible from the hub", () => {
    expect(getNode("python").related).toContain("n8n");
  });

  it("finds build paths through a node, and through the Python domain for the hub", () => {
    expect(chainsFor("n8n")).toContain("automation");
    expect(chainsFor("python").length).toBeGreaterThan(0);
    for (const c of chainsFor("python")) expect(chains[c].some((s) => getNode(s).domain === "python")).toBe(true);
    expect(chainsFor("html")).toEqual([]);
  });

  it("has explorer strings in every locale", () => {
    for (const t of Object.values(capabilitiesContent)) {
      for (const f of familyTabs) expect(t.ui.tabs[f]).toBeTruthy();
      expect(t.ui.search && t.ui.clear && t.ui.paths && t.ui.results.includes("{n}") && t.ui.noResults.includes("{q}")).toBeTruthy();
    }
    expect(JSON.stringify(capabilitiesContent.th)).not.toMatch(/ผม|ฉัน|ดิฉัน|ครับ|ค่ะ/);
  });
});
