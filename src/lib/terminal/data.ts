/**
 * Language-neutral facts used by the terminal (technology names, step order).
 * Localized labels and sentences live in src/content/command-center.ts.
 * Kept local so this page builds independently of the Skills and Projects pages.
 */
export const skillGroups = [
  { id: "frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Accessibility"] },
  { id: "backend", items: ["Node.js", "APIs", "Serverless", "Databases", "Validation"] },
  { id: "ai", items: ["Claude Code", "Agent workflows", "Structured prompting", "Code analysis", "Rapid prototyping"] },
  { id: "engineering", items: ["Git", "GitHub", "Testing", "Deployment", "Performance", "Architecture"] },
] as const;

export type SkillGroupId = (typeof skillGroups)[number]["id"];

export const stackRows = [
  { id: "framework", value: "Next.js (App Router) · React · TypeScript (strict)" },
  { id: "styling", value: "Tailwind CSS" },
  { id: "validation", value: "Zod" },
  { id: "data", value: "PostgreSQL via Neon (optional) · webhook (optional)" },
  { id: "tooling", value: "ESLint · Vitest" },
  { id: "hosting", value: "Vercel" },
] as const;

export type StackRowId = (typeof stackRows)[number]["id"];
