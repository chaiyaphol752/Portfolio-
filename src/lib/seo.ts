import type { Metadata } from "next";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { profile } from "@/config/profile";

interface Input {
  locale: Locale;
  /** URL segment after the locale ("" for home). */
  slug: string;
  title: string;
  description: string;
}

/** Builds title, canonical, hreflang alternates and social cards for one page. */
export function buildMetadata({ locale, slug, title, description }: Input): Metadata {
  const url = localizedPath(locale, slug);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, localizedPath(l, slug)])),
        "x-default": localizedPath("en", slug),
      },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: `${profile.name} — Portfolio`,
      locale: localeMeta[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].og),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
