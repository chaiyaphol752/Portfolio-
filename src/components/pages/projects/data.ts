import { profile } from "@/config/profile";

/** Project categories used for filtering (not services). */
export const categoryIds = ["web", "app", "automation", "ai", "cloud"] as const;
export type CategoryId = (typeof categoryIds)[number];

export const projectIds = [
  "wat-charoen-dham",
  "android-app",
  "this-portfolio",
  "hetzner-neon",
  "rag-workflow",
  "agent-workflow",
  "automation-prototype",
  "local-ai-concept",
] as const;
export type ProjectId = (typeof projectIds)[number];

export type PreviewVariant = "circuit" | "before-after" | "table" | "shop" | "chat" | "calendar" | "pipeline" | "search" | "agents" | "site" | "phone";

/**
 * Honest status for each project:
 * live        = really deployed and used
 * prototype   = working but not production software
 * experiment  = built to explore a technology or idea
 * learning    = built primarily to learn
 * concept     = design/idea demonstration, never deployed
 * architecture = system design demonstration
 */
export type ProjectKind = "live" | "prototype" | "experiment" | "learning" | "concept" | "architecture";

/** Each project gets its own composition so the page reads as an editorial sequence, not a grid. */
export type Layout = "flagship" | "split" | "offset-left" | "offset-right" | "frame" | "schematic";

export interface ProjectMeta {
  id: ProjectId;
  /** Proper names are not translated. */
  name: string;
  kind: ProjectKind;
  categories: readonly CategoryId[];
  stack: readonly string[];
  preview: PreviewVariant;
  layout: Layout;
  /** Only links that really exist are listed. */
  links: readonly { kind: "live" | "source"; url: string }[];
}

export const projectsMeta: readonly ProjectMeta[] = [
  {
    id: "wat-charoen-dham",
    name: "Wat Charoen Dham e.V.",
    kind: "live",
    categories: ["web"],
    stack: ["Next.js", "TypeScript", "i18n (DE / EN / TH)", "Git", "Vercel"],
    preview: "site",
    layout: "flagship",
    links: [{ kind: "live", url: "https://wat-charoen-dham.de" }],
  },
  {
    id: "android-app",
    name: "Android App Prototype",
    kind: "prototype",
    categories: ["app"],
    stack: ["Android", "Google Play Console", "Closed testing", "AI-assisted development"],
    preview: "phone",
    layout: "split",
    links: [],
  },
  {
    id: "this-portfolio",
    name: "This Portfolio",
    kind: "live",
    categories: ["web", "ai"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Python", "Zod", "Resend", "Vercel", "Vitest"],
    preview: "circuit",
    layout: "offset-left",
    links: [
      { kind: "source", url: profile.sourceRepo },
      { kind: "live", url: profile.siteUrl },
    ],
  },
  {
    id: "hetzner-neon",
    name: "Cloud Experiment · Hetzner & Neon",
    kind: "experiment",
    categories: ["cloud", "automation"],
    stack: ["Hetzner", "Neon (Postgres)", "Environment variables", "Deployment", "Cost evaluation"],
    preview: "pipeline",
    layout: "offset-right",
    links: [],
  },
  {
    id: "rag-workflow",
    name: "Experimental RAG Workflow",
    kind: "experiment",
    categories: ["ai"],
    stack: ["Next.js", "OpenAI API", "Embeddings", "PostgreSQL", "Zod"],
    preview: "chat",
    layout: "frame",
    links: [],
  },
  {
    id: "agent-workflow",
    name: "Agent Workflow Experiment",
    kind: "experiment",
    categories: ["ai", "automation"],
    stack: ["Claude Code", "Subagents", "GitHub Actions", "Vitest", "Vercel"],
    preview: "agents",
    layout: "schematic",
    links: [],
  },
  {
    id: "automation-prototype",
    name: "Invoice Automation Prototype",
    kind: "prototype",
    categories: ["automation"],
    stack: ["Python", "pydantic", "REST APIs", "ChatGPT API", "Scheduling"],
    preview: "table",
    layout: "split",
    links: [],
  },
  {
    id: "local-ai-concept",
    name: "Local AI Concept",
    kind: "concept",
    categories: ["ai"],
    stack: ["Python", "Local LLM endpoint", "Embeddings", "Vector search", "Next.js"],
    preview: "search",
    layout: "frame",
    links: [],
  },
];
