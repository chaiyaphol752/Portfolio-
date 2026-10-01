import { profile } from "@/config/profile";
import type { PageId } from "@/config/pages";
import type { OperatorContent } from "@/content/operator";
import { interpolate } from "@/lib/interpolate";

/**
 * The Operator console: a fixed table of commands evaluated entirely in the browser.
 * Input is never executed, evaluated, fetched or rendered as HTML; unknown input only
 * produces a "not found" line. The only side effect a command can request is navigation
 * to a known page.
 */
export const operatorCommands = ["help", "whoami", "stack", "web", "ai", "agents", "python", "n8n", "security", "projects", "systems", "contact", "operator", "clear"] as const;
export type OperatorCommand = (typeof operatorCommands)[number];

export interface TerminalResult {
  lines: string[];
  navigate?: PageId;
  clear?: boolean;
}

const MAX_INPUT = 60;

const lists: Partial<Record<OperatorCommand, string[]>> = {
  stack: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS", "Python", "Zod", "Resend", "Vercel"],
  web: ["HTML · CSS · TypeScript", "React · Next.js", "Accessibility", "Responsive UI", "Performance", "APIs · Server Actions"],
  ai: ["ChatGPT / OpenAI", "Claude / Claude Code", "Local AI", "Agent orchestration", "Human verification"],
  agents: ["research", "frontend", "backend", "python", "ai-integration", "automation", "testing", "review", "deployment"],
  python: ["AI APIs", "n8n", "agent tools", "data processing", "local AI", "automation", "backend utilities"],
  n8n: ["triggers · webhooks · schedules", "API and email workflows", "data movement", "calls Python and AI workflows"],
  security: ["Content-Security-Policy", "server-side validation (Zod)", "honeypot · duplicate suppression", "rate limiting", "safe email delivery (Resend, server-only)", "security headers · HTTPS"],
};

const pageFor: Partial<Record<OperatorCommand, { page: PageId; label: string }>> = {
  projects: { page: "projects", label: "/projects" },
  systems: { page: "systems", label: "/systems" },
  contact: { page: "contact", label: "/contact" },
};

export function normalizeInput(raw: string): string {
  return raw.slice(0, MAX_INPUT).trim().toLowerCase().replace(/\s+/g, " ");
}

export function runOperatorCommand(raw: string, t: OperatorContent["terminal"]): TerminalResult {
  const input = normalizeInput(raw);
  if (!input) return { lines: [] };
  const name = input.split(" ")[0] as OperatorCommand;
  if (!(operatorCommands as readonly string[]).includes(name)) {
    // Echo at most a short, plain-text token of what was typed.
    return { lines: [interpolate(t.unknown, { cmd: name.slice(0, 24) })] };
  }

  switch (name) {
    case "help":
      return { lines: operatorCommands.map((c) => `${c.padEnd(10)}${t.help[c]}`) };
    case "whoami":
      return { lines: [t.whoami] };
    case "clear":
      return { lines: [], clear: true };
    case "operator":
      return { lines: [t.here] };
    case "n8n":
      return { lines: [...(lists.n8n ?? []), t.n8nNote] };
    case "security":
      return { lines: [...(lists.security ?? []), t.securityNote] };
    case "contact": {
      const target = pageFor.contact!;
      return { lines: [profile.contact.email, profile.contact.phone.display, interpolate(t.opening, { page: target.label })], navigate: target.page };
    }
    case "projects":
    case "systems": {
      const target = pageFor[name]!;
      return { lines: [interpolate(t.opening, { page: target.label })], navigate: target.page };
    }
    default:
      return { lines: lists[name] ?? [] };
  }
}
