export interface Searchable {
  id: string;
  categories: readonly string[];
  /** Pre-normalised text the query is matched against. */
  haystack: string;
}

export interface Filters {
  query: string;
  category: string | "all";
}

/** NFC + lowercase keeps Thai and German text intact (no accent stripping). */
export function normalize(text: string): string {
  return text.normalize("NFC").toLowerCase().trim();
}

/** Every whitespace-separated token must appear somewhere in the haystack. */
export function matchesQuery(haystack: string, query: string): boolean {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

export function filterItems<T extends Searchable>(items: readonly T[], { query, category }: Filters): T[] {
  return items.filter((item) => (category === "all" || item.categories.includes(category)) && matchesQuery(item.haystack, query));
}

/** Result counts per category for the current search text, so filters can show what is left. */
export function countByCategory(items: readonly Searchable[], query: string, categories: readonly string[]): Record<string, number> {
  const matching = items.filter((item) => matchesQuery(item.haystack, query));
  const counts: Record<string, number> = { all: matching.length };
  for (const category of categories) counts[category] = matching.filter((item) => item.categories.includes(category)).length;
  return counts;
}

export function buildHaystack(parts: readonly (string | undefined)[]): string {
  return normalize(parts.filter(Boolean).join(" "));
}
