import { capabilityNodes, chainIds, chains, domainIds, getNode, type CapabilityId, type CapabilityNode, type ChainId, type DomainId, type Family } from "./data";

/** Tab order on small screens: the hub first. */
export const familyTabs: readonly Family[] = ["python", "web", "ai", "local"];

export const defaultCapability: CapabilityId = "python";

/** Case- and accent-insensitive comparison key ("Lokale KI" matches "lokale ki", "Ä" matches "a"). */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[·\-_/.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Nodes matching a query against the localized label, the English label and the id.
 * An empty query returns every node of `family` (or all nodes when no family is given).
 */
export function filterCapabilities(
  query: string,
  label: (id: CapabilityId) => string,
  family?: Family,
): CapabilityNode[] {
  const q = normalize(query);
  const pool = q || !family ? capabilityNodes : capabilityNodes.filter((n) => n.family === family);
  if (!q) return [...pool];
  return pool.filter((n) => [label(n.id), n.label, n.id].some((s) => normalize(s).includes(q)));
}

/** Groups ids by domain, in board order, dropping empty domains. */
export function groupByDomain(ids: readonly CapabilityId[]): { domain: DomainId; ids: CapabilityId[] }[] {
  return domainIds
    .map((domain) => ({ domain, ids: ids.filter((id) => getNode(id).domain === domain) }))
    .filter((g) => g.ids.length > 0);
}

/**
 * Example builds that pass through a capability. Python is the hub, so it also lists
 * builds that run through any node in the Python domain.
 */
export function chainsFor(id: CapabilityId): ChainId[] {
  return chainIds.filter((c) =>
    chains[c].some((step) => step === id || (id === "python" && getNode(step).domain === "python")),
  );
}
