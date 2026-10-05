import { describe, expect, it } from "vitest";
import { complete, commandNames, execute, findPage, MAX_HISTORY_LINES, MAX_INPUT_LENGTH, parseInput, resolveCommand, sectionNames, type HealthSnapshot } from "./engine";
import { buildTerminalContext } from "./context";
import { commandCenterContent } from "@/content/command-center";
import { locales } from "@/i18n/config";
import { pages } from "@/config/pages";
import { profile } from "@/config/profile";

const ctx = buildTerminalContext("en");

const health: HealthSnapshot = {
  status: "ok",
  runtime: { environment: "production", region: "iad1" },
  deployment: { commit: "abc1234" },
  checks: { database: "not-configured", email: "configured-test-sender", contactChannels: ["email"] },
};

describe("parseInput", () => {
  it("lowercases the command and splits arguments", () => {
    expect(parseInput("  OPEN   Lab ")).toEqual({ name: "open", args: ["Lab"] });
    expect(parseInput("")).toEqual({ name: "", args: [] });
  });
  it("truncates overlong input", () => {
    expect(parseInput("a".repeat(500)).name.length).toBe(MAX_INPUT_LENGTH);
  });
});

describe("aliases", () => {
  it("maps legacy and short names to canonical commands", () => {
    expect(resolveCommand("skills")).toBe("capabilities");
    expect(resolveCommand("local")).toBe("local-ai");
    expect(resolveCommand("health")).toBe("status");
    expect(resolveCommand("constructor")).toBeUndefined();
    expect(resolveCommand("__proto__")).toBeUndefined();
  });
  it("answers skills with the capabilities output", () => {
    expect(execute("skills", ctx).lines).toEqual(execute("capabilities", ctx).lines);
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
    for (const name of sectionNames) {
      const { lines, effect } = execute(name, ctx);
      expect(lines.length, name).toBeGreaterThan(0);
      expect(effect).toBeUndefined();
    }
  });
  it("covers the new positioning", () => {
    const text = (cmd: string) => JSON.stringify(execute(cmd, ctx).lines);
    expect(text("ai")).toMatch(/ChatGPT/);
    expect(text("ai")).toMatch(/Claude Code/);
    expect(text("capabilities")).toMatch(/Python/);
    expect(text("services")).toMatch(/redesign/i);
    expect(text("stack")).toMatch(/Resend/);
  });
  it("prints email and phone as trusted links", () => {
    const rows = execute("contact", ctx).lines;
    expect(rows.some((l) => l.href === `mailto:${profile.contact.email}`)).toBe(true);
    expect(rows.some((l) => l.href === profile.contact.phone.href)).toBe(true);
    expect(execute("email", ctx).lines[0]?.text).toBe(profile.contact.email);
  });
  it("never turns user input into a link", () => {
    for (const input of ["open javascript:alert(1)", "javascript:alert(1)", "<a href=x>"]) {
      expect(execute(input, ctx).lines.every((l) => l.href === undefined)).toBe(true);
    }
  });
  it("reports unknown commands as plain text errors", () => {
    const { lines } = execute("rm -rf /", ctx);
    expect(lines[0]?.kind).toBe("error");
    expect(lines[0]?.text).toContain("rm");
    expect(execute("<script>alert(1)</script>", ctx).lines[0]?.kind).toBe("error");
  });
  it("clears the screen via an effect", () => {
    expect(execute("clear", ctx).effect).toEqual({ type: "clear" });
  });
  it("opens pages by id, slug, alias or label — not by number", () => {
    expect(execute("open lab", ctx).effect).toEqual({ type: "navigate", slug: "lab" });
    expect(execute("open home", ctx).effect).toEqual({ type: "navigate", slug: "" });
    expect(execute("open skills", ctx).effect).toEqual({ type: "navigate", slug: "capabilities" });
    expect(execute("open contact", ctx).effect).toEqual({ type: "navigate", slug: "contact" });
    expect(execute("open Projects", ctx).effect).toEqual({ type: "navigate", slug: "projects" });
    expect(execute("open 4", ctx).effect).toBeUndefined();
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

describe("history", () => {
  it("says when nothing was entered", () => {
    expect(execute("history", ctx).lines[0]?.kind).toBe("muted");
  });
  it("numbers recent commands and caps the list", () => {
    const many = Array.from({ length: MAX_HISTORY_LINES + 5 }, (_, i) => `cmd${i}`);
    const lines = execute("history", ctx, { history: many }).lines;
    expect(lines).toHaveLength(MAX_HISTORY_LINES);
    expect(lines[0]).toMatchObject({ label: "6", text: "cmd5" });
  });
});

describe("status", () => {
  it("asks to wait while health is loading", () => {
    expect(execute("status", ctx, { health: null }).lines[0]?.kind).toBe("muted");
  });
  it("prints real health fields with localized values", () => {
    const lines = execute("status", ctx, { health }).lines;
    const text = JSON.stringify(lines);
    expect(lines[1]?.kind).toBe("success");
    expect(text).toContain("abc1234");
    expect(text).toContain("iad1");
    expect(text).toContain("Configured (test sender)");
    expect(text).toContain("Not configured");
  });
  it("marks a degraded system as an error line", () => {
    expect(execute("status", ctx, { health: { ...health, status: "degraded" } }).lines[1]?.kind).toBe("error");
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
    expect(complete("py", ctx)).toBe("python ");
  });
  it("extends ambiguous prefixes to the common part", () => {
    expect(complete("c", ctx)).toBe("c");
    expect(complete("con", ctx)).toBe("contact ");
    expect(complete("ca", ctx)).toBe("capabilities ");
  });
  it("completes page and language arguments", () => {
    expect(complete("open ab", ctx)).toBe("open about");
    expect(complete("open ca", ctx)).toBe("open ca");
    expect(complete("open cas", ctx)).toBe("open case-studies");
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
      expect(c.pages).toHaveLength(pages.length);
      expect(Object.keys(c.messages.descriptions).sort()).toEqual([...commandNames].sort());
      for (const name of commandNames) expect(c.messages.descriptions[name]).toBeTruthy();
    }
  });
  it("keeps Thai copy free of gendered self-reference", () => {
    expect(JSON.stringify(commandCenterContent.th)).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
  it("never shows page numbers or complexity labels", () => {
    for (const locale of locales) expect(JSON.stringify(commandCenterContent[locale])).not.toMatch(/complexity|Komplexität|\b\d\/9\b/i);
  });
  it("has the same architecture nodes in every locale", () => {
    const ids = (l: "en" | "de" | "th") => commandCenterContent[l].architecture.nodes.map((n) => n.id);
    expect(ids("de")).toEqual(ids("en"));
    expect(ids("th")).toEqual(ids("en"));
  });
});
