import { isLocale, locales, type Locale } from "./config";

/** Builds a localized pathname: localizedPath("de", "about") -> "/de/about". */
export function localizedPath(locale: Locale, slug = ""): string {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/** Splits "/de/about" into the locale and the remaining slug. */
export function parsePathname(pathname: string): { locale: Locale | null; slug: string } {
  const segments = pathname.split("/").filter(Boolean);
  const [first, ...rest] = segments;
  if (isLocale(first)) return { locale: first, slug: rest.join("/") };
  return { locale: null, slug: segments.join("/") };
}

/** Same page, different language. Falls back to the target home when no locale is present. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const { slug } = parsePathname(pathname);
  return localizedPath(target, slug);
}

export function alternatesFor(slug: string): Record<string, string> {
  return Object.fromEntries(locales.map((l) => [l, localizedPath(l, slug)]));
}
