import { profile } from "@/config/profile";

/** Service categories, matching what can be ordered on the contact form. */
export const categoryIds = ["new-website", "redesign", "features", "webapp", "ai-integration", "automation", "local-ai", "multi-agent"] as const;
export type CategoryId = (typeof categoryIds)[number];

export const projectIds = [
  "this-portfolio",
  "fern-clay",
  "relay-desk",
  "tideline",
  "ask-the-docs",
  "rota",
  "ledger-run",
  "quiet-archive",
  "brief-loop",
] as const;
export type ProjectId = (typeof projectIds)[number];

export type PreviewVariant = "circuit" | "before-after" | "table" | "shop" | "chat" | "calendar" | "pipeline" | "search" | "agents";

/**
 * concept = self-initiated concept project (synthetic data, never client work)
 * demo = technical demonstration that really exists
 * architecture = architecture demonstration of a system design
 */
export type ProjectKind = "concept" | "demo" | "architecture";

/** Each project gets its own composition so the page reads as an editorial sequence, not a grid. */
export type Layout = "flagship" | "split" | "offset-left" | "offset-right" | "frame" | "schematic";

/** Which contextual CTA fits the project. */
export type CtaKind = "startProject" | "discussRedesign" | "addFeature" | "buildWithAi";

export interface ProjectMeta {
  id: ProjectId;
  /** Proper names are not translated. */
  name: string;
  kind: ProjectKind;
  categories: readonly CategoryId[];
  stack: readonly string[];
  preview: PreviewVariant;
  layout: Layout;
  cta: CtaKind;
  /** Only defined links are rendered. Concept projects have none. */
  links: readonly { kind: "source"; url: string }[];
}

export const projectsMeta: readonly ProjectMeta[] = [
  {
    id: "this-portfolio",
    name: "AI-Native Portfolio",
    kind: "demo",
    categories: ["new-website", "ai-integration"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Python", "Zod", "Resend", "Vercel", "Vitest"],
    preview: "circuit",
    layout: "flagship",
    cta: "startProject",
    links: [{ kind: "source", url: profile.sourceRepo }],
  },
  {
    id: "fern-clay",
    name: "Fern & Clay",
    kind: "concept",
    categories: ["redesign"],
    stack: ["Next.js", "Tailwind CSS", "i18n routing", "Image optimisation"],
    preview: "before-after",
    layout: "split",
    cta: "discussRedesign",
    links: [],
  },
  {
    id: "relay-desk",
    name: "Relay Desk",
    kind: "concept",
    categories: ["features", "ai-integration"],
    stack: ["Next.js", "PostgreSQL", "Zod", "Claude API", "Server Actions"],
    preview: "table",
    layout: "offset-left",
    cta: "addFeature",
    links: [],
  },
  {
    id: "tideline",
    name: "Tideline",
    kind: "concept",
    categories: ["new-website"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Server Actions"],
    preview: "shop",
    layout: "offset-right",
    cta: "startProject",
    links: [],
  },
  {
    id: "ask-the-docs",
    name: "Ask the Docs",
    kind: "concept",
    categories: ["ai-integration"],
    stack: ["Next.js", "OpenAI API", "Embeddings", "PostgreSQL", "Zod"],
    preview: "chat",
    layout: "frame",
    cta: "buildWithAi",
    links: [],
  },
  {
    id: "rota",
    name: "Rota",
    kind: "concept",
    categories: ["webapp"],
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Vitest"],
    preview: "calendar",
    layout: "offset-left",
    cta: "startProject",
    links: [],
  },
  {
    id: "ledger-run",
    name: "Ledger Run",
    kind: "concept",
    categories: ["automation"],
    stack: ["Python", "pydantic", "REST APIs", "ChatGPT API", "Cron"],
    preview: "pipeline",
    layout: "split",
    cta: "buildWithAi",
    links: [],
  },
  {
    id: "quiet-archive",
    name: "Quiet Archive",
    kind: "architecture",
    categories: ["local-ai"],
    stack: ["Python", "Local LLM endpoint", "Embeddings", "Vector search", "Next.js"],
    preview: "search",
    layout: "frame",
    cta: "buildWithAi",
    links: [],
  },
  {
    id: "brief-loop",
    name: "Brief Loop",
    kind: "architecture",
    categories: ["multi-agent", "automation"],
    stack: ["Claude Code", "Subagents", "GitHub Actions", "Vitest", "Vercel"],
    preview: "agents",
    layout: "schematic",
    cta: "buildWithAi",
    links: [],
  },
];
