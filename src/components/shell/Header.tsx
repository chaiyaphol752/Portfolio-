"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { formatPageNumber, getPageBySlug, pages } from "@/config/pages";
import { localizedPath, parsePathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import type { CommonContent } from "@/content/common";
import { interpolate } from "@/lib/interpolate";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IndexMenu } from "./IndexMenu";
import { openCommandPalette } from "./CommandPalette";

interface Props {
  locale: Locale;
  t: CommonContent;
  brandName: string;
  monogram: string;
}

export function Header({ locale, t, brandName, monogram }: Props) {
  const pathname = usePathname();
  const slug = parsePathname(pathname).slug;
  const currentId = getPageBySlug(slug.split("/")[0] ?? "")?.id ?? "home";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href={localizedPath(locale)} className="flex items-center gap-3" aria-label={`${brandName} — ${t.brandLabel}`}>
          <span aria-hidden className="relative grid size-9 place-items-center rounded-full bg-ink font-display text-lg italic text-paper">
            {monogram}
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-accent" />
          </span>
          <span className="hidden text-[0.95rem] font-semibold tracking-tight xs:block">{brandName}</span>
        </Link>

        <nav aria-label={t.progressLabel} className="hidden lg:block">
          <ol className="flex items-center gap-1">
            {pages.map((p) => {
              const active = p.id === currentId;
              return (
                <li key={p.id}>
                  <Link
                    href={localizedPath(locale, p.slug)}
                    aria-current={active ? "page" : undefined}
                    aria-label={`${formatPageNumber(p.number)} ${t.nav[p.id]}`}
                    title={`${formatPageNumber(p.number)} · ${t.nav[p.id]}`}
                    className={
                      "mono tabular relative flex h-9 w-9 items-center justify-center text-[0.72rem] transition-colors " +
                      (active ? "text-ink" : "text-ink-3 hover:text-ink")
                    }
                  >
                    {formatPageNumber(p.number)}
                    <span
                      aria-hidden
                      className={"absolute inset-x-2 bottom-1 h-px transition-colors " + (active ? "bg-accent" : "bg-transparent")}
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
          <p className="sr-only" aria-live="polite">
            {interpolate(t.pageProgress, { n: pages.find((p) => p.id === currentId)?.number ?? 1, total: pages.length })}
          </p>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
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
            href={`${localizedPath(locale, "systems")}#contact`}
            className="btn btn-primary !min-h-10 !px-4 !py-0 text-[0.85rem] max-sm:hidden"
          >
            {t.hireMe}
          </Link>
        </div>
      </div>
    </header>
  );
}
