import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { pages } from "@/config/pages";
import { localizedPath } from "@/i18n/routing";
import { profile } from "@/config/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((p) =>
    locales.map((locale) => ({
      url: `${profile.siteUrl}${localizedPath(locale, p.slug)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: p.id === "home" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${profile.siteUrl}${localizedPath(l, p.slug)}`])) },
    })),
  );
}
