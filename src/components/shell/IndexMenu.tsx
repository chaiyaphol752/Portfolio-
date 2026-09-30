"use client";

import Link from "next/link";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { formatPageNumber, getPageBySlug, pages } from "@/config/pages";
import { localizedPath, parsePathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import type { CommonContent } from "@/content/common";
import { LanguageSwitcher } from "./LanguageSwitcher";

/** Full-screen index of all nine pages. Uses native <dialog> for focus trapping and Esc handling. */
export function IndexMenu({ locale, t }: { locale: Locale; t: CommonContent }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const currentSlug = parsePathname(pathname).slug;
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="mono inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[0.72rem] uppercase tracking-wider hover:border-ink"
        aria-haspopup="dialog"
      >
        <Menu className="size-4" aria-hidden />
        {t.menu.open}
      </button>
      <dialog
        ref={ref}
        aria-label={t.menu.title}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-paper p-0 text-ink backdrop:bg-transparent"
        onClick={(e) => e.target === ref.current && close()}
      >
        <div className="container-page flex h-full flex-col overflow-y-auto pb-8">
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <p className="eyebrow">{t.menu.title}</p>
            <button
              type="button"
              onClick={close}
              className="mono inline-flex h-10 items-center gap-2 rounded-full border border-ink px-4 text-[0.72rem] uppercase tracking-wider"
            >
              <X className="size-4" aria-hidden />
              {t.menu.close}
            </button>
          </div>
          <ol className="mt-4 border-t border-ink">
            {pages.map((p) => {
              const active = getPageBySlug(currentSlug)?.id === p.id || (currentSlug === "" && p.id === "home");
              return (
                <li key={p.id} className="border-b border-line">
                  <Link
                    href={localizedPath(locale, p.slug)}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-baseline gap-5 py-3 sm:gap-8 sm:py-4"
                  >
                    <span className="mono tabular w-8 text-xs text-ink-3">{formatPageNumber(p.number)}</span>
                    <span className="h1 transition-transform duration-300 group-hover:translate-x-2 group-aria-[current=page]:text-accent-ink">
                      {t.nav[p.id]}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-6 pt-8">
            <p className="max-w-[36ch] text-sm text-ink-3">{t.menu.hint}</p>
            <LanguageSwitcher locale={locale} label={t.language} />
          </div>
        </div>
      </dialog>
    </>
  );
}
