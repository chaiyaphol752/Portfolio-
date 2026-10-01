import { capabilityEdges, getNode, type CapabilityId } from "./data";

export type Point = { x: number; y: number };

/** Orthogonal trace with chamfered corners, like copper on a board. */
export function tracePath(a: Point, b: Point, chamfer = 6): string {
  const pts: Point[] =
    Math.abs(a.x - b.x) < 8
      ? (() => {
          const x = Math.min(a.x, b.x) - 14;
          return [a, { x, y: a.y }, { x, y: b.y }, b];
        })()
      : (() => {
          const mid = Math.round((a.x + b.x) / 2);
          return [a, { x: mid, y: a.y }, { x: mid, y: b.y }, b];
        })();
  return chamferedPath(pts, chamfer);
}

export function chamferedPath(points: readonly Point[], chamfer = 6): string {
  const [first, ...rest] = points;
  if (!first) return "";
  const r = (n: number) => Math.round(n * 10) / 10;
  const d = [`M ${r(first.x)} ${r(first.y)}`];
  for (let i = 0; i < rest.length - 1; i++) {
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    const p2 = points[i + 2]!;
    const lenIn = Math.abs(p1.x - p0.x) + Math.abs(p1.y - p0.y);
    const lenOut = Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
    const c = Math.min(chamfer, lenIn / 2, lenOut / 2);
    const ux = Math.sign(p1.x - p0.x), uy = Math.sign(p1.y - p0.y);
    const vx = Math.sign(p2.x - p1.x), vy = Math.sign(p2.y - p1.y);
    d.push(`L ${r(p1.x - ux * c)} ${r(p1.y - uy * c)}`, `L ${r(p1.x + vx * c)} ${r(p1.y + vy * c)}`);
  }
  const last = points[points.length - 1]!;
  d.push(`L ${r(last.x)} ${r(last.y)}`);
  return d.join(" ");
}

/** Edges that stay faintly visible at all times: everything touching the Python domain. */
export const hubEdges = capabilityEdges.filter(([a, b]) => getNode(a).domain === "python" || getNode(b).domain === "python");

export function relatedSet(id: CapabilityId): Set<CapabilityId> {
  return new Set([id, ...getNode(id).related]);
}
