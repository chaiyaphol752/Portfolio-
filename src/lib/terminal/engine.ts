import type { Locale } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";

/**
 * Pure command interpreter for the portfolio terminal.
 * It never evaluates input, spawns processes or touches the network: it maps a
 * small set of known command names to pre-written, localized output.
 */

export const commandNames = ["help", "about", "skills", "projects", "stack", "ai", "architecture", "contact", "open", "lang", "clear"] as const;
export type CommandName = (typeof commandNames)[number];

export const MAX_INPUT_LENGTH = 120;

export type LineKind = "heading" | "text" | "muted" | "row" | "error" | "success";

export interface OutputLine {
  kind: LineKind;
  text: string;
  /** Left column for `row` lines. */
  label?: string;
}

export interface PageRef {
  id: string;
  slug: string;
  number: number;
  label: string;
}

export interface LocaleRef {
  code: Locale;
  name: string;
}

export interface TerminalMessages {
  helpTitle: string;
  helpHint: string;
  unknown: string;
  openArg: string;
  openUsage: string;
  openUnknown: string;
  opening: string;
  langUsage: string;
  langUnknown: string;
  langCurrent: string;
  langSwitching: string;
  descriptions: Record<CommandName, string>;
}

export interface TerminalContext {
  locale: Locale;
  messages: TerminalMessages;
  /** Pre-built output for the informational commands. */
  sections: Record<"about" | "skills" | "projects" | "stack" | "ai" | "architecture" | "contact", OutputLine[]>;
  pages: PageRef[];
  locales: LocaleRef[];
}

export type Effect = { type: "clear" } | { type: "navigate"; slug: string } | { type: "locale"; locale: Locale };

export interface ExecutionResult {
  lines: OutputLine[];
  effect?: Effect;
}

export function parseInput(raw: string): { name: string; args: string[] } {
  const parts = raw.slice(0, MAX_INPUT_LENGTH).trim().split(/\s+/).filter(Boolean);
  const [name = "", ...args] = parts;
  return { name: name.toLowerCase(), args };
}

const isCommand = (name: string): name is CommandName => (commandNames as readonly string[]).includes(name);

/** Resolves "4", "04", "lab", "case-studies" or a localized label to a page. */
export function findPage(query: string, pages: PageRef[]): PageRef | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  const asNumber = /^\d+$/.test(q) ? Number.parseInt(q, 10) : null;
  return pages.find((p) => p.id === q || p.slug === q || p.number === asNumber || p.label.toLowerCase() === q);
}

function helpLines(ctx: TerminalContext): OutputLine[] {
  const { messages, locales } = ctx;
  const usage: Record<CommandName, string> = {
    help: "help",
    about: "about",
    skills: "skills",
    projects: "projects",
    stack: "stack",
    ai: "ai",
    architecture: "architecture",
    contact: "contact",
    open: `open <${messages.openArg}>`,
    lang: `lang <${locales.map((l) => l.code).join("|")}>`,
    clear: "clear",
  };
  return [
    { kind: "heading", text: messages.helpTitle },
    ...commandNames.map((name): OutputLine => ({ kind: "row", label: usage[name], text: messages.descriptions[name] })),
    { kind: "muted", text: messages.helpHint },
  ];
}

export function execute(raw: string, ctx: TerminalContext): ExecutionResult {
  const { name, args } = parseInput(raw);
  const { messages } = ctx;
  if (!name) return { lines: [] };
  if (!isCommand(name)) return { lines: [{ kind: "error", text: interpolate(messages.unknown, { command: name }) }] };

  switch (name) {
    case "help":
      return { lines: helpLines(ctx) };
    case "clear":
      return { lines: [], effect: { type: "clear" } };
    case "about":
    case "skills":
    case "projects":
    case "stack":
    case "ai":
    case "architecture":
    case "contact":
      return { lines: ctx.sections[name] };
    case "open": {
      const list = ctx.pages.map((p) => p.slug || "home").join(", ");
      if (args.length === 0) return { lines: [{ kind: "text", text: interpolate(messages.openUsage, { pages: list }) }] };
      const page = findPage(args.join(" "), ctx.pages);
      if (!page) return { lines: [{ kind: "error", text: interpolate(messages.openUnknown, { name: args.join(" "), pages: list }) }] };
      return {
        lines: [{ kind: "success", text: interpolate(messages.opening, { page: page.label }) }],
        effect: { type: "navigate", slug: page.slug },
      };
    }
    case "lang": {
      const codes = ctx.locales.map((l) => l.code).join(", ");
      const target = ctx.locales.find((l) => l.code === args[0]?.toLowerCase());
      if (args.length === 0) return { lines: [{ kind: "text", text: interpolate(messages.langUsage, { current: ctx.locale, codes }) }] };
      if (!target) return { lines: [{ kind: "error", text: interpolate(messages.langUnknown, { name: args[0] ?? "", codes }) }] };
      if (target.code === ctx.locale) return { lines: [{ kind: "muted", text: interpolate(messages.langCurrent, { language: target.name }) }] };
      return {
        lines: [{ kind: "success", text: interpolate(messages.langSwitching, { language: target.name }) }],
        effect: { type: "locale", locale: target.code },
      };
    }
  }
}

function commonPrefix(values: string[]): string {
  const [first = "", ...rest] = values;
  let prefix = first;
  for (const v of rest) while (!v.startsWith(prefix)) prefix = prefix.slice(0, -1);
  return prefix;
}

/** Tab completion for command names, page names (`open`) and language codes (`lang`). */
export function complete(input: string, ctx: TerminalContext): string {
  const trimmedStart = input.replace(/^\s+/, "");
  const endsWithSpace = /\s$/.test(trimmedStart);
  const tokens = trimmedStart.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return input;

  if (tokens.length === 1 && !endsWithSpace) {
    const matches = commandNames.filter((c) => c.startsWith(tokens[0]!.toLowerCase()));
    if (matches.length === 0) return input;
    return matches.length === 1 ? `${matches[0]} ` : commonPrefix([...matches]);
  }

  const command = tokens[0]!.toLowerCase();
  const partial = endsWithSpace ? "" : (tokens[1] ?? "").toLowerCase();
  if (tokens.length > 2 || (tokens.length === 2 && endsWithSpace)) return input;
  const options = command === "open" ? ctx.pages.map((p) => p.slug || "home") : command === "lang" ? ctx.locales.map((l) => l.code as string) : [];
  const matches = options.filter((o) => o.startsWith(partial));
  if (matches.length === 0) return input;
  return `${command} ${matches.length === 1 ? matches[0] : commonPrefix(matches)}`;
}
