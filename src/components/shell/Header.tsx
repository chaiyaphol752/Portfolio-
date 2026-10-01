"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { clsx } from "clsx";
import { getPageBySlug, pages } from "@/config/pages";
import { localizedPath, parsePathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import type { CommonContent } from "@/content/common";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IndexMenu } from "./IndexMenu";
import { openCommandPalette } from "./CommandPalette";

interface Props {
  locale: Locale;
  t: CommonContent;
  brandName: string;
  monogram: string;
  available: boolean;
}

export function Header({ locale, t, brandName, monogram, available }: Props) {
  const pathname = usePathname();
  const slug = parsePathname(pathname).slug.split("/")[0] ?? "";
  const currentId = getPageBySlug(slug)?.id ?? "home";

  return (
    <header
      data-tone={currentId === "operator" ? "dark" : undefined}
      className="site-header sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-[2px]"
    >
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href={localizedPath(locale)} className="flex items-center gap-3" aria-label={`${brandName} — ${t.brandLabel}`}>
          <span aria-hidden className="relative grid size-8 place-items-center rounded-full bg-ink font-display text-base italic text-paper">
            {monogram}
            {available && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-paper bg-signal" />}
          </span>
          <span className="hidden leading-none xs:block">
            <span className="block text-[0.9rem] font-semibold tracking-tight">{brandName}</span>
            <span className="mono mt-1 block text-[0.62rem] uppercase tracking-[0.14em] text-ink-3">Web × AI</span>
          </span>
        </Link>

        <nav aria-label={t.primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {pages
              .filter((p) => p.primary)
              .map((p) => {
                const active = p.id === currentId;
                return (
                  <li key={p.id}>
                    <Link
                      href={localizedPath(locale, p.slug)}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "relative inline-flex h-9 items-center px-3 text-[0.88rem] transition-colors",
                        active ? "text-ink" : "text-ink-2 hover:text-ink",
                      )}
                    >
                      {t.nav[p.id]}
                      <span aria-hidden className={clsx("absolute inset-x-3 bottom-1 h-px", active ? "bg-accent" : "bg-transparent")} />
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label={t.commandPalette.hint}
            title={`${t.commandPalette.hint} (${t.commandPalette.shortcut})`}
            className="hidden size-10 items-center justify-center rounded-full border border-line hover:border-ink md:inline-flex"
          >
            <Search className="size-4" aria-hidden />
          </button>
          <LanguageSwitcher locale={locale} label={t.language} className="hidden md:block" />
          <IndexMenu locale={locale} t={t} />
          <Link
            href={localizedPath(locale, "contact")}
            aria-current={currentId === "contact" ? "page" : undefined}
            className="btn btn-primary !min-h-11 !gap-2 !px-3.5 !py-0 text-[0.82rem] sm:!min-h-10 sm:!px-4 sm:text-[0.85rem]"
          >
            {t.startProject}
          </Link>
        </div>
      </div>
    </header>
  );
}
