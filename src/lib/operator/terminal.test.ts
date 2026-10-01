import { describe, expect, it } from "vitest";
import { normalizeInput, operatorCommands, runOperatorCommand } from "./terminal";
import { operatorContent } from "@/content/operator";
import { profile } from "@/config/profile";

const t = operatorContent.en.terminal;

describe("operator console", () => {
  it("documents every command in every locale", () => {
    for (const locale of ["en", "de", "th"] as const) for (const c of operatorCommands) expect(operatorContent[locale].terminal.help[c]).toBeTruthy();
  });
  it("lists commands on help", () => {
    expect(runOperatorCommand("help", t).lines).toHaveLength(operatorCommands.length);
  });
  it("answers stack, ai and security with real, honest content", () => {
    expect(runOperatorCommand("stack", t).lines).toContain("Resend");
    expect(runOperatorCommand("ai", t).lines.join(" ")).toMatch(/ChatGPT.*Claude.*Local AI/);
    expect(runOperatorCommand("security", t).lines.at(-1)).toMatch(/best-effort/);
    expect(runOperatorCommand("n8n", t).lines.at(-1)).toMatch(/no live n8n/);
  });
  it("navigates only to known pages", () => {
    expect(runOperatorCommand("projects", t).navigate).toBe("projects");
    expect(runOperatorCommand("SYSTEMS", t).navigate).toBe("systems");
    const contact = runOperatorCommand("contact", t);
    expect(contact.navigate).toBe("contact");
    expect(contact.lines).toContain(profile.contact.email);
  });
  it("never executes or reflects arbitrary input", () => {
    for (const bad of ["rm -rf /", "eval(1)", "<img src=x onerror=alert(1)>", "cat /etc/passwd", "curl http://169.254.169.254"]) {
      const r = runOperatorCommand(bad, t);
      expect(r.navigate).toBeUndefined();
      expect(r.lines).toHaveLength(1);
      expect(r.lines[0]).toMatch(/not found/);
      expect(r.lines[0]!.length).toBeLessThan(80);
    }
  });
  it("normalizes and caps input", () => {
    expect(normalizeInput("  HeLp   me ")).toBe("help me");
    expect(normalizeInput("x".repeat(500))).toHaveLength(60);
    expect(runOperatorCommand("clear", t).clear).toBe(true);
  });
});
