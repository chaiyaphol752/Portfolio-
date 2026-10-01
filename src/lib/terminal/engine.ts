import type { Locale } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";

/**
 * Pure command interpreter for the portfolio terminal.
 * It never evaluates input, spawns processes or touches the network: it maps a
 * small set of known command names to pre-written, localized output.
 */

export const commandNames = [
  "help",
  "about",
  "services",
  "capabilities",
  "projects",
  "stack",
  "ai",
  "agents",
  "local-ai",
  "python",
  "architecture",
  "status",
  "contact",
  "email",
  "open",
  "lang",
  "history",
  "clear",
] as const;
export type CommandName = (typeof commandNames)[number];

/** Alternative spellings that resolve to a canonical command. */
export const commandAliases: Readonly<Record<string, CommandName>> = {
  skills: "capabilities",
  local: "local-ai",
  localai: "local-ai",
  agent: "agents",
  phone: "contact",
  mail: "email",
  health: "status",
  cls: "clear",
};

/** Commands whose output is fully pre-built in the context. */
export const sectionNames = ["about", "services", "capabilities", "projects", "stack", "ai", "agents", "local-ai", "python", "architecture", "contact", "email"] as const;
export type SectionName = (typeof sectionNames)[number];

export const MAX_INPUT_LENGTH = 120;
export const MAX_HISTORY_LINES = 20;

export type LineKind = "heading" | "text" | "muted" | "row" | "error" | "success";

export interface OutputLine {
  kind: LineKind;
  text: string;
  /** Left column for `row` lines. */
  label?: string;
  /** Only ever set from trusted configuration (mailto:, tel:, site paths), never from user input. */
  href?: string;
}

export interface PageRef {
  id: string;
  slug: string;
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
  historyEmpty: string;
  statusTitle: string;
  statusPending: string;
  descriptions: Record<CommandName, string>;
}

export type StatusLabel = "status" | "environment" | "region" | "commit" | "database" | "email" | "channels";

export interface TerminalContext {
  locale: Locale;
  messages: TerminalMessages;
  /** Pre-built output for the informational commands. */
  sections: Record<SectionName, OutputLine[]>;
  pages: PageRef[];
  locales: LocaleRef[];
  /** Localized labels for the `status` command rows. */
  statusLabels: Record<StatusLabel, string>;
  /** Localized display values for raw health values such as "not-configured". */
  statusValues: Record<string, string>;
}

/** The subset of /api/health the terminal prints. Supplied by the page once fetched. */
export interface HealthSnapshot {
  status: string;
  runtime: { environment: string; region: string };
  deployment: { commit: string | null };
  checks: { database: string; email?: string; contactChannels?: string[] };
}

export interface RuntimeState {
  /** Previously entered commands, oldest first. */
  history?: readonly string[];
  health?: HealthSnapshot | null;
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

/** Canonical command for a typed name, following aliases. */
export function resolveCommand(name: string): CommandName | undefined {
  if (isCommand(name)) return name;
  return Object.hasOwn(commandAliases, name) ? commandAliases[name] : undefined;
}

/** Resolves "lab", "case-studies", "home", "skills" or a localized label to a page. */
export function findPage(query: string, pages: PageRef[]): PageRef | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  const slug = q === "home" ? "" : q === "skills" ? "capabilities" : q;
  return pages.find((p) => p.id === q || p.slug === slug || p.label.toLowerCase() === q);
}

function helpLines(ctx: TerminalContext): OutputLine[] {
  const { messages, locales } = ctx;
  const usage: Partial<Record<CommandName, string>> = {
    open: `open <${messages.openArg}>`,
    lang: `lang <${locales.map((l) => l.code).join("|")}>`,
  };
  return [
    { kind: "heading", text: messages.helpTitle },
    ...commandNames.map((name): OutputLine => ({ kind: "row", label: usage[name] ?? name, text: messages.descriptions[name] })),
    { kind: "muted", text: messages.helpHint },
  ];
}

function statusLines(ctx: TerminalContext, health: HealthSnapshot | null | undefined): OutputLine[] {
  const { messages, statusLabels: l } = ctx;
  if (!health) return [{ kind: "muted", text: messages.statusPending }];
  const v = (value: string) => ctx.statusValues[value] ?? value;
  const channels = health.checks.contactChannels ?? [];
  return [
    { kind: "heading", text: messages.statusTitle },
    { kind: health.status === "ok" ? "success" : "error", text: `${l.status}: ${v(health.status)}` },
    { kind: "row", label: l.environment, text: v(health.runtime.environment) },
    { kind: "row", label: l.region, text: v(health.runtime.region) },
    { kind: "row", label: l.commit, text: health.deployment.commit ?? "—" },
    { kind: "row", label: l.database, text: v(health.checks.database) },
    { kind: "row", label: l.email, text: v(health.checks.email ?? "not-configured") },
    { kind: "row", label: l.channels, text: channels.length ? channels.join(" · ") : "—" },
  ];
}

export function execute(raw: string, ctx: TerminalContext, state: RuntimeState = {}): ExecutionResult {
  const { name: typed, args } = parseInput(raw);
  const { messages } = ctx;
  if (!typed) return { lines: [] };
  const name = resolveCommand(typed);
  if (!name) return { lines: [{ kind: "error", text: interpolate(messages.unknown, { command: typed }) }] };

  switch (name) {
    case "help":
      return { lines: helpLines(ctx) };
    case "clear":
      return { lines: [], effect: { type: "clear" } };
    case "status":
      return { lines: statusLines(ctx, state.health) };
    case "history": {
      const all = state.history ?? [];
      const recent = all.slice(-MAX_HISTORY_LINES);
      if (!recent.length) return { lines: [{ kind: "muted", text: messages.historyEmpty }] };
      const offset = all.length - recent.length;
      return { lines: recent.map((cmd, i): OutputLine => ({ kind: "row", label: String(offset + i + 1), text: cmd })) };
    }
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
    default:
      return { lines: ctx.sections[name] };
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

  const command = resolveCommand(tokens[0]!.toLowerCase());
  const partial = endsWithSpace ? "" : (tokens[1] ?? "").toLowerCase();
  if (tokens.length > 2 || (tokens.length === 2 && endsWithSpace)) return input;
  const options = command === "open" ? ctx.pages.map((p) => p.slug || "home") : command === "lang" ? ctx.locales.map((l) => l.code as string) : [];
  const matches = options.filter((o) => o.startsWith(partial));
  if (matches.length === 0) return input;
  return `${tokens[0]} ${matches.length === 1 ? matches[0] : commonPrefix(matches)}`;
}
