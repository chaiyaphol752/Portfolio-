export const pageIds = [
  "home",
  "projects",
  "capabilities",
  "ai-native",
  "case-studies",
  "lab",
  "systems",
  "command-center",
  "operator",
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
  /** Hidden from navigation, menus, palette and sitemap (kept reachable by URL only). */
  listed: boolean;
}

const primaryIds: readonly PageId[] = ["projects", "capabilities", "ai-native", "lab", "about"];
/** Easter-egg pages that stay reachable but are not part of the recruiter-facing navigation. */
const unlistedIds: readonly PageId[] = ["operator"];

export const pages: readonly PageDef[] = pageIds.map((id) => ({
  id,
  slug: id === "home" ? "" : id,
  primary: primaryIds.includes(id),
  listed: !unlistedIds.includes(id),
}));

export function getPageBySlug(slug: string): PageDef | undefined {
  return pages.find((p) => p.slug === slug);
}
