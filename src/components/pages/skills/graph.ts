import { skillEdges, skillIds, type SkillId } from "./data";

/** Skills directly connected to `id`, in the order they are defined. */
export function relatedTo(id: SkillId, edges: readonly (readonly [SkillId, SkillId])[] = skillEdges): SkillId[] {
  const out: SkillId[] = [];
  for (const [a, b] of edges) {
    if (a === id && !out.includes(b)) out.push(b);
    else if (b === id && !out.includes(a)) out.push(a);
  }
  return out;
}

/** Orthogonal-ish curve between two points; same-column pairs bow out to the left so they stay visible. */
export function connectorPath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  if (Math.abs(a.x - b.x) < 8) {
    const bow = Math.min(64, 24 + Math.abs(a.y - b.y) / 6);
    return `M ${a.x} ${a.y} C ${a.x - bow} ${a.y}, ${a.x - bow} ${b.y}, ${b.x} ${b.y}`;
  }
  const mid = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`;
}

/** Sanity check used by tests: every edge references known skills and none is a self-loop. */
export function invalidEdges(edges: readonly (readonly [string, string])[] = skillEdges): string[] {
  const known = new Set<string>(skillIds);
  return edges.filter(([a, b]) => a === b || !known.has(a) || !known.has(b)).map(([a, b]) => `${a}-${b}`);
}
