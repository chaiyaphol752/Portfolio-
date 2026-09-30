import { describe, expect, it } from "vitest";
import { complete, commandNames, execute, findPage, MAX_INPUT_LENGTH, parseInput } from "./engine";
import { buildTerminalContext } from "./context";
import { commandCenterContent } from "@/content/command-center";
import { locales } from "@/i18n/config";

const ctx = buildTerminalContext("en");

describe("parseInput", () => {
  it("lowercases the command and splits arguments", () => {
    expect(parseInput("  OPEN   Lab ")).toEqual({ name: "open", args: ["Lab"] });
    expect(parseInput("")).toEqual({ name: "", args: [] });
  });
  it("truncates overlong input", () => {
    expect(parseInput("a".repeat(500)).name.length).toBe(MAX_INPUT_LENGTH);
  });
});

describe("execute", () => {
  it("ignores empty input", () => {
    expect(execute("   ", ctx)).toEqual({ lines: [] });
  });
  it("lists every command in help", () => {
    const labels = execute("help", ctx).lines.filter((l) => l.kind === "row").map((l) => l.label ?? "");
    for (const name of commandNames) expect(labels.some((l) => l.startsWith(name))).toBe(true);
  });
  it("answers each informational command with content", () => {
    for (const name of ["about", "skills", "projects", "stack", "ai", "architecture", "contact"]) {
      const { lines, effect } = execute(name, ctx);
      expect(lines.length).toBeGreaterThan(1);
      expect(effect).toBeUndefined();
    }
  });
  it("reports unknown commands without echoing markup as anything but text", () => {
    const { lines } = execute("rm -rf /", ctx);
    expect(lines[0]?.kind).toBe("error");
    expect(lines[0]?.text).toContain("rm");
    expect(execute("<script>alert(1)</script>", ctx).lines[0]?.kind).toBe("error");
  });
  it("clears the screen via an effect", () => {
    expect(execute("clear", ctx).effect).toEqual({ type: "clear" });
  });
  it("opens pages by id, slug, number or label", () => {
    expect(execute("open lab", ctx).effect).toEqual({ type: "navigate", slug: "lab" });
    expect(execute("open 4", ctx).effect).toEqual({ type: "navigate", slug: "projects" });
    expect(execute("open home", ctx).effect).toEqual({ type: "navigate", slug: "" });
    expect(execute("open case-studies", ctx).effect).toEqual({ type: "navigate", slug: "case-studies" });
    expect(execute("open Journey", ctx).effect).toEqual({ type: "navigate", slug: "about" });
  });
  it("explains open usage and unknown pages", () => {
    expect(execute("open", ctx).lines[0]?.text).toContain("Usage");
    const bad = execute("open nowhere", ctx);
    expect(bad.lines[0]?.kind).toBe("error");
    expect(bad.effect).toBeUndefined();
  });
  it("switches language only to supported other locales", () => {
    expect(execute("lang de", ctx).effect).toEqual({ type: "locale", locale: "de" });
    expect(execute("lang th", ctx).effect).toEqual({ type: "locale", locale: "th" });
    expect(execute("lang en", ctx).effect).toBeUndefined();
    expect(execute("lang fr", ctx).lines[0]?.kind).toBe("error");
    expect(execute("lang", ctx).lines[0]?.kind).toBe("text");
  });
});

describe("findPage", () => {
  it("returns undefined for empty or unknown queries", () => {
    expect(findPage("", ctx.pages)).toBeUndefined();
    expect(findPage("99", ctx.pages)).toBeUndefined();
  });
});

describe("complete", () => {
  it("completes unique command prefixes", () => {
    expect(complete("hel", ctx)).toBe("help ");
    expect(complete("arch", ctx)).toBe("architecture ");
  });
  it("extends ambiguous prefixes to the common part", () => {
    expect(complete("c", ctx)).toBe("c");
    expect(complete("co", ctx)).toBe("contact ");
  });
  it("completes page and language arguments", () => {
    expect(complete("open ab", ctx)).toBe("open about");
    expect(complete("open ca", ctx)).toBe("open case-studies");
    expect(complete("lang t", ctx)).toBe("lang th");
  });
  it("leaves unknown input alone so Tab can still move focus", () => {
    expect(complete("zzz", ctx)).toBe("zzz");
    expect(complete("", ctx)).toBe("");
  });
});

describe("localization", () => {
  it("builds a complete context for every locale", () => {
    for (const locale of locales) {
      const c = buildTerminalContext(locale);
      expect(c.pages).toHaveLength(9);
      expect(Object.keys(c.messages.descriptions).sort()).toEqual([...commandNames].sort());
      for (const name of commandNames) expect(c.messages.descriptions[name]).toBeTruthy();
    }
  });
  it("keeps Thai copy free of gendered self-reference", () => {
    expect(JSON.stringify(commandCenterContent.th)).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
  it("has the same architecture nodes in every locale", () => {
    const ids = (l: "en" | "de" | "th") => commandCenterContent[l].architecture.nodes.map((n) => n.id);
    expect(ids("de")).toEqual(ids("en"));
    expect(ids("th")).toEqual(ids("en"));
  });
});
