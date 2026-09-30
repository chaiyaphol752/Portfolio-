export const pageIds = [
  "home",
  "about",
  "skills",
  "projects",
  "case-studies",
  "ai-native",
  "lab",
  "systems",
  "command-center",
] as const;

export type PageId = (typeof pageIds)[number];

export interface PageDef {
  id: PageId;
  /** 1-based number shown in the navigation progress rail. */
  number: number;
  /** URL segment after the locale; empty for the home page. */
  slug: string;
}

export const pages: readonly PageDef[] = pageIds.map((id, index) => ({
  id,
  number: index + 1,
  slug: id === "home" ? "" : id,
}));

export function getPageBySlug(slug: string): PageDef | undefined {
  return pages.find((p) => p.slug === slug);
}

export const formatPageNumber = (n: number) => String(n).padStart(2, "0");
