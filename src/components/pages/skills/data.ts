export const groupIds = ["frontend", "backend", "ai", "engineering"] as const;
export type GroupId = (typeof groupIds)[number];

export const skillGroups = {
  frontend: ["html", "css", "javascript", "typescript", "react", "nextjs", "tailwind", "responsive-ui", "accessibility"],
  backend: ["nodejs", "apis", "serverless", "databases", "auth", "validation", "backend-arch"],
  ai: ["claude-code", "ai-engineering", "prompting", "agents", "debugging", "research", "code-analysis", "prototyping", "automation"],
  engineering: ["git", "github", "testing", "deployment", "performance", "maintainability", "architecture"],
} as const satisfies Record<GroupId, readonly string[]>;

export type SkillId = (typeof skillGroups)[GroupId][number];

export const skillIds = groupIds.flatMap((g) => skillGroups[g]) as SkillId[];

/** Undirected relationships between capabilities. Each pair means "these are used together in practice". */
export const skillEdges: readonly (readonly [SkillId, SkillId])[] = [
  ["html", "css"],
  ["html", "accessibility"],
  ["html", "responsive-ui"],
  ["css", "tailwind"],
  ["css", "responsive-ui"],
  ["javascript", "typescript"],
  ["javascript", "nodejs"],
  ["javascript", "react"],
  ["typescript", "react"],
  ["typescript", "validation"],
  ["typescript", "testing"],
  ["react", "nextjs"],
  ["react", "accessibility"],
  ["nextjs", "tailwind"],
  ["nextjs", "serverless"],
  ["nextjs", "apis"],
  ["nextjs", "deployment"],
  ["nextjs", "performance"],
  ["tailwind", "responsive-ui"],
  ["responsive-ui", "accessibility"],
  ["responsive-ui", "performance"],
  ["nodejs", "apis"],
  ["apis", "validation"],
  ["apis", "auth"],
  ["apis", "databases"],
  ["apis", "backend-arch"],
  ["serverless", "deployment"],
  ["serverless", "databases"],
  ["databases", "validation"],
  ["databases", "backend-arch"],
  ["auth", "backend-arch"],
  ["backend-arch", "architecture"],
  ["claude-code", "ai-engineering"],
  ["claude-code", "agents"],
  ["claude-code", "debugging"],
  ["claude-code", "code-analysis"],
  ["claude-code", "prototyping"],
  ["claude-code", "git"],
  ["ai-engineering", "prompting"],
  ["ai-engineering", "testing"],
  ["prompting", "agents"],
  ["agents", "automation"],
  ["agents", "research"],
  ["agents", "testing"],
  ["research", "architecture"],
  ["code-analysis", "debugging"],
  ["code-analysis", "maintainability"],
  ["prototyping", "react"],
  ["debugging", "testing"],
  ["automation", "github"],
  ["git", "github"],
  ["github", "deployment"],
  ["testing", "maintainability"],
  ["architecture", "maintainability"],
  ["deployment", "performance"],
];

export function groupOf(id: SkillId): GroupId {
  return groupIds.find((g) => (skillGroups[g] as readonly string[]).includes(id)) as GroupId;
}
