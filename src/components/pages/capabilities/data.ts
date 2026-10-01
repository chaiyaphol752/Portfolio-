/**
 * Capability network: what can be connected to build a system.
 * There are deliberately no proficiency levels anywhere in this model.
 *
 * Exported shape (also used by other pages):
 *   capabilityNodes: { id, label, domain, related: CapabilityId[] }[]
 *   domains: DomainId[] in display order; domainFamily maps each domain to "web" | "python" | "ai" | "local".
 * Labels are internationally used technical terms; locales may override some via content.
 */

export const domainIds = ["interface", "server", "delivery", "python", "local", "models", "autonomy", "ai-engineering"] as const;
export type DomainId = (typeof domainIds)[number];

export type Family = "web" | "python" | "ai" | "local";

export const domainFamily: Record<DomainId, Family> = {
  interface: "web",
  server: "web",
  delivery: "web",
  python: "python",
  local: "local",
  models: "ai",
  autonomy: "ai",
  "ai-engineering": "ai",
};

export const familyIds = ["web", "python", "ai", "local"] as const satisfies readonly Family[];

const defs = {
  interface: [
    ["html", "HTML"],
    ["css", "CSS"],
    ["javascript", "JavaScript"],
    ["typescript", "TypeScript"],
    ["react", "React"],
    ["nextjs", "Next.js"],
    ["responsive-ui", "Responsive UI"],
    ["accessibility", "Accessibility"],
    ["ui-architecture", "UI architecture"],
  ],
  server: [
    ["api-integration", "API integration"],
    ["nodejs", "Node.js"],
    ["backend", "Backend"],
    ["serverless", "Serverless"],
    ["postgresql", "PostgreSQL"],
    ["database-design", "Database design"],
    ["validation", "Validation"],
    ["auth", "Authentication concepts"],
  ],
  delivery: [
    ["git", "Git"],
    ["github", "GitHub"],
    ["testing", "Testing"],
    ["deployment", "Deployment"],
    ["vercel", "Vercel"],
    ["performance", "Performance"],
  ],
  python: [
    ["python", "Python"],
    ["py-ai", "AI integration"],
    ["py-automation", "Automation"],
    ["py-scripts", "Scripts"],
    ["py-data", "Data transformation"],
    ["py-files", "File processing"],
    ["py-api-clients", "API clients"],
    ["py-tools", "Tool orchestration"],
    ["py-local-ai", "Local AI workflows"],
    ["py-agent-utils", "Agent utilities"],
    ["py-devtools", "Developer tooling"],
    ["py-backend-utils", "Backend utilities"],
  ],
  local: [
    ["local-models", "Local models"],
    ["self-hosted", "Self-hosted inference"],
    ["local-endpoints", "Local endpoints"],
    ["runtimes", "Ollama · LM Studio · llama.cpp"],
    ["embeddings", "Embeddings"],
    ["rag", "RAG"],
    ["privacy", "Privacy-conscious AI"],
    ["offline", "Offline-capable workflows"],
    ["hybrid-routing", "Cloud / local routing"],
  ],
  models: [
    ["chatgpt", "ChatGPT"],
    ["openai", "OpenAI ecosystem"],
    ["claude", "Claude"],
    ["claude-code", "Claude Code"],
    ["ai-api", "AI + API"],
    ["ai-web", "AI + Web"],
    ["ai-python", "AI + Python"],
  ],
  autonomy: [
    ["autonomous-ai", "Autonomous AI"],
    ["agentic", "Agentic workflows"],
    ["multi-agent", "Multi-agent systems"],
    ["subagents", "Subagents"],
    ["orchestration", "Agent orchestration"],
    ["tool-calling", "Tool & function calling"],
    ["routing", "Tool & model routing"],
    ["context", "Context engineering"],
    ["prompting", "Structured prompting"],
  ],
  "ai-engineering": [
    ["ai-assisted", "AI-assisted engineering"],
    ["ai-research", "AI research workflows"],
    ["code-analysis", "Code analysis"],
    ["ai-debugging", "AI debugging"],
    ["ai-testing", "AI testing"],
    ["ai-refactoring", "AI refactoring"],
    ["ai-docs", "AI documentation"],
    ["human-review", "Human-in-the-loop verification"],
  ],
} as const satisfies Record<DomainId, readonly (readonly [string, string])[]>;

export type CapabilityId = (typeof defs)[DomainId][number][0];

/** Undirected "used together to build something" relationships. */
export const capabilityEdges: readonly (readonly [CapabilityId, CapabilityId])[] = [
  // Interface
  ["html", "css"], ["html", "accessibility"], ["css", "responsive-ui"], ["javascript", "typescript"],
  ["typescript", "react"], ["react", "nextjs"], ["react", "ui-architecture"], ["nextjs", "ui-architecture"],
  ["responsive-ui", "performance"], ["accessibility", "ui-architecture"], ["typescript", "validation"],
  // Server and data
  ["nextjs", "serverless"], ["nextjs", "backend"], ["nodejs", "backend"], ["javascript", "nodejs"],
  ["backend", "api-integration"], ["backend", "validation"], ["backend", "auth"], ["backend", "postgresql"],
  ["postgresql", "database-design"], ["serverless", "vercel"], ["api-integration", "validation"],
  // Delivery
  ["git", "github"], ["github", "vercel"], ["vercel", "deployment"], ["testing", "deployment"],
  ["nextjs", "performance"], ["typescript", "testing"], ["github", "testing"],
  // Python as connective infrastructure
  ["python", "py-ai"], ["python", "py-automation"], ["python", "py-scripts"], ["python", "py-data"],
  ["python", "py-files"], ["python", "py-api-clients"], ["python", "py-tools"], ["python", "py-local-ai"],
  ["python", "py-agent-utils"], ["python", "py-devtools"], ["python", "py-backend-utils"],
  ["py-api-clients", "api-integration"], ["py-backend-utils", "backend"], ["py-data", "postgresql"],
  ["py-devtools", "github"], ["py-devtools", "testing"], ["py-automation", "deployment"],
  ["py-local-ai", "local-models"], ["py-local-ai", "embeddings"], ["py-ai", "ai-python"],
  ["py-tools", "tool-calling"], ["py-agent-utils", "agentic"], ["py-files", "embeddings"],
  ["py-scripts", "py-automation"], ["py-data", "py-files"],
  // Models
  ["chatgpt", "openai"], ["claude", "claude-code"], ["chatgpt", "ai-research"], ["chatgpt", "prompting"],
  ["chatgpt", "ai-api"], ["chatgpt", "human-review"], ["claude", "ai-api"], ["claude", "context"],
  ["claude-code", "code-analysis"], ["claude-code", "subagents"], ["claude-code", "ai-refactoring"],
  ["claude-code", "ai-debugging"], ["claude-code", "ai-testing"], ["claude-code", "git"],
  ["claude-code", "ai-assisted"], ["openai", "tool-calling"], ["ai-api", "api-integration"],
  ["ai-web", "nextjs"], ["ai-web", "ai-api"], ["ai-python", "python"], ["ai-python", "ai-api"],
  // Autonomy
  ["autonomous-ai", "orchestration"], ["autonomous-ai", "human-review"], ["agentic", "orchestration"],
  ["multi-agent", "subagents"], ["multi-agent", "orchestration"], ["orchestration", "routing"],
  ["orchestration", "tool-calling"], ["routing", "hybrid-routing"], ["context", "prompting"],
  ["context", "rag"], ["tool-calling", "api-integration"], ["agentic", "tool-calling"],
  // AI-assisted engineering
  ["ai-assisted", "human-review"], ["ai-research", "code-analysis"], ["ai-debugging", "testing"],
  ["ai-testing", "testing"], ["ai-refactoring", "typescript"], ["ai-docs", "github"],
  ["human-review", "testing"], ["ai-assisted", "prompting"], ["code-analysis", "ai-docs"],
  // Local AI
  ["local-models", "self-hosted"], ["self-hosted", "local-endpoints"], ["local-models", "runtimes"],
  ["embeddings", "rag"], ["rag", "local-models"], ["privacy", "local-models"], ["privacy", "rag"],
  ["offline", "local-models"], ["hybrid-routing", "local-models"], ["hybrid-routing", "chatgpt"],
  ["hybrid-routing", "claude"], ["local-endpoints", "api-integration"],
];

export interface CapabilityNode {
  id: CapabilityId;
  label: string;
  domain: DomainId;
  family: Family;
  related: CapabilityId[];
}

export const domains: readonly DomainId[] = domainIds;

export const capabilityNodes: readonly CapabilityNode[] = domainIds.flatMap((domain) =>
  defs[domain].map(([id, label]) => ({
    id: id as CapabilityId,
    label,
    domain,
    family: domainFamily[domain],
    related: relatedOf(id as CapabilityId),
  })),
);

export const capabilityIds = capabilityNodes.map((n) => n.id);

export function nodesIn(domain: DomainId): CapabilityNode[] {
  return capabilityNodes.filter((n) => n.domain === domain);
}

export function getNode(id: CapabilityId): CapabilityNode {
  const node = capabilityNodes.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown capability ${id}`);
  return node;
}

function relatedOf(id: CapabilityId): CapabilityId[] {
  const out: CapabilityId[] = [];
  for (const [a, b] of capabilityEdges) {
    if (a === id && !out.includes(b)) out.push(b);
    else if (b === id && !out.includes(a)) out.push(a);
  }
  return out;
}

/** Nodes with a written "what this lets me build" note; others fall back to their domain description. */
export const featuredIds = [
  "python",
  "chatgpt",
  "claude",
  "claude-code",
  "nextjs",
  "react",
  "backend",
  "postgresql",
  "api-integration",
  "vercel",
  "autonomous-ai",
  "orchestration",
  "multi-agent",
  "tool-calling",
  "local-models",
  "rag",
  "hybrid-routing",
  "human-review",
  "py-automation",
  "py-local-ai",
] as const satisfies readonly CapabilityId[];
export type FeaturedId = (typeof featuredIds)[number];

export function isFeatured(id: CapabilityId): id is FeaturedId {
  return (featuredIds as readonly string[]).includes(id);
}

/** Sanity check used by tests: every edge references known nodes and none is a self-loop. */
export function invalidEdges(edges: readonly (readonly [string, string])[] = capabilityEdges): string[] {
  const known = new Set<string>(capabilityIds);
  return edges.filter(([a, b]) => a === b || !known.has(a) || !known.has(b)).map(([a, b]) => `${a}-${b}`);
}

/** Example builds expressed as paths through the network. */
export const chainIds = ["redesign", "ai-feature", "private-search", "automation"] as const;
export type ChainId = (typeof chainIds)[number];
export const chains: Record<ChainId, readonly CapabilityId[]> = {
  redesign: ["ui-architecture", "responsive-ui", "accessibility", "nextjs", "performance", "vercel"],
  "ai-feature": ["nextjs", "backend", "validation", "ai-api", "chatgpt", "human-review"],
  "private-search": ["py-files", "embeddings", "rag", "local-models", "local-endpoints", "nextjs"],
  automation: ["py-scripts", "py-api-clients", "tool-calling", "claude", "testing", "deployment"],
};
