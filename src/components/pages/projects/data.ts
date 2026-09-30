import { profile } from "@/config/profile";

export const categoryIds = [
  "saas",
  "business-website",
  "dashboard",
  "e-commerce",
  "ai-workflow",
  "internal-tool",
  "landing-page",
  "developer-tool",
] as const;
export type CategoryId = (typeof categoryIds)[number];

export const projectIds = [
  "relay-desk",
  "fern-clay",
  "gridwatch",
  "tideline",
  "brief-loop",
  "rota",
  "schema-lens",
  "this-portfolio",
] as const;
export type ProjectId = (typeof projectIds)[number];

export type PreviewVariant = "table" | "site" | "chart" | "shop" | "flow" | "calendar" | "code" | "portfolio";

/** "concept" = self-initiated concept project; "demo" = a technical demonstration that really exists. */
export type ProjectKind = "concept" | "demo";

export interface ProjectMeta {
  id: ProjectId;
  /** Proper names are not translated. */
  name: string;
  kind: ProjectKind;
  categories: readonly CategoryId[];
  stack: readonly string[];
  preview: PreviewVariant;
  /** Only defined links are rendered. Concept projects have none. */
  links: readonly { kind: "source"; url: string }[];
}

export const projectsMeta: readonly ProjectMeta[] = [
  {
    id: "relay-desk",
    name: "Relay Desk",
    kind: "concept",
    categories: ["saas"],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Zod", "Server Actions"],
    preview: "table",
    links: [],
  },
  {
    id: "fern-clay",
    name: "Fern & Clay",
    kind: "concept",
    categories: ["business-website"],
    stack: ["Next.js", "Tailwind CSS", "i18n routing", "Route Handlers"],
    preview: "site",
    links: [],
  },
  {
    id: "gridwatch",
    name: "Gridwatch",
    kind: "concept",
    categories: ["dashboard"],
    stack: ["React", "TypeScript", "SVG charts", "Node.js", "PostgreSQL"],
    preview: "chart",
    links: [],
  },
  {
    id: "tideline",
    name: "Tideline",
    kind: "concept",
    categories: ["e-commerce"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Server Actions"],
    preview: "shop",
    links: [],
  },
  {
    id: "brief-loop",
    name: "Brief Loop",
    kind: "concept",
    categories: ["ai-workflow"],
    stack: ["Claude Code", "TypeScript", "GitHub Actions", "Vitest", "Git"],
    preview: "flow",
    links: [],
  },
  {
    id: "rota",
    name: "Rota",
    kind: "concept",
    categories: ["internal-tool"],
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Zod"],
    preview: "calendar",
    links: [],
  },
  {
    id: "schema-lens",
    name: "Schema Lens",
    kind: "concept",
    categories: ["developer-tool"],
    stack: ["TypeScript", "Node.js", "Zod", "Vitest", "React"],
    preview: "code",
    links: [],
  },
  {
    id: "this-portfolio",
    name: "AI-Native Portfolio",
    kind: "demo",
    categories: ["landing-page", "ai-workflow"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Zod", "PostgreSQL (Neon)", "Vercel", "Vitest"],
    preview: "portfolio",
    links: [{ kind: "source", url: profile.sourceRepo }],
  },
];
