export const pageIds = [
  "home",
  "projects",
  "capabilities",
  "ai-native",
  "case-studies",
  "lab",
  "systems",
  "command-center",
  "about",
  "contact",
] as const;

export type PageId = (typeof pageIds)[number];

export interface PageDef {
  id: PageId;
  /** URL segment after the locale; empty for the home page. */
  slug: string;
  /** Shown directly in the desktop header; the rest live in the menu and palette. */
  primary: boolean;
}

const primaryIds: readonly PageId[] = ["projects", "capabilities", "ai-native", "lab", "about"];

export const pages: readonly PageDef[] = pageIds.map((id) => ({
  id,
  slug: id === "home" ? "" : id,
  primary: primaryIds.includes(id),
}));

export function getPageBySlug(slug: string): PageDef | undefined {
  return pages.find((p) => p.slug === slug);
}
