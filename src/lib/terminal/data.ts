/**
 * Language-neutral facts used by the terminal and console panels (technology names).
 * Localized labels and sentences live in src/content/command-center.ts.
 * Kept local so this page builds independently of the Capabilities and Projects pages.
 */
export const capabilityGroups = [
  { id: "web", items: ["HTML", "CSS", "TypeScript", "React", "Next.js", "Tailwind CSS", "Responsive UI", "Accessibility"] },
  { id: "backend", items: ["Node.js", "APIs", "Serverless", "PostgreSQL", "Zod validation", "Auth concepts"] },
  { id: "python", items: ["Automation", "API clients", "Data transformation", "File processing", "Agent utilities", "Code generation"] },
  { id: "ai", items: ["ChatGPT", "OpenAI ecosystem", "Claude", "Claude Code", "Tool calling", "Context engineering", "Multi-agent workflows"] },
  { id: "local", items: ["Local models", "Self-hosted inference", "Embeddings", "RAG concepts", "Cloud/local routing"] },
  { id: "delivery", items: ["Git", "GitHub", "Testing", "Vercel", "Performance"] },
] as const;

export type CapabilityGroupId = (typeof capabilityGroups)[number]["id"];

/** The real stack of this repository. */
export const stackRows = [
  { id: "framework", value: "Next.js (App Router) · React · TypeScript (strict)" },
  { id: "styling", value: "Tailwind CSS v4 · CSS tokens" },
  { id: "validation", value: "Zod" },
  { id: "email", value: "Resend (server-side)" },
  { id: "data", value: "PostgreSQL via Neon (optional) · webhook (optional)" },
  { id: "python", value: "Python 3 · scripts/generate_ai_circuit.py" },
  { id: "tooling", value: "ESLint · Vitest · Playwright" },
  { id: "hosting", value: "Vercel" },
] as const;

export type StackRowId = (typeof stackRows)[number]["id"];

/** Model families named on the AI panels. Capabilities, not a usage log. */
export const aiStack = ["ChatGPT", "OpenAI API", "Claude", "Claude Code", "Local models"] as const;

/** Bounded autonomous loop, in order. Localized descriptions are keyed by these ids. */
export const loopSteps = ["goal", "plan", "route", "act", "validate", "review", "result"] as const;
export type LoopStep = (typeof loopSteps)[number];

/** Agent roles in the multi-agent development setup. */
export const agentRoles = ["orchestrator", "design", "frontend", "backend", "research", "test", "review"] as const;
export type AgentRole = (typeof agentRoles)[number];
