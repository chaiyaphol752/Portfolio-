"use client";

import Link from "next/link";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { getPageBySlug, pages } from "@/config/pages";
import { localizedPath, parsePathname } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import type { CommonContent } from "@/content/common";
import { mailtoHref, profile } from "@/config/profile";
import { LanguageSwitcher } from "./LanguageSwitcher";

/** Full-screen navigation with direct contact actions. Native <dialog> handles focus trapping and Esc. */
export function IndexMenu({ locale, t }: { locale: Locale; t: CommonContent }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const currentId = getPageBySlug(parsePathname(pathname).slug.split("/")[0] ?? "")?.id ?? "home";
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="mono inline-flex h-11 items-center gap-2 rounded-full border border-line px-3 text-[0.72rem] uppercase tracking-wider hover:border-ink sm:h-10 sm:px-4"
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
        <div className="container-page flex min-h-full flex-col pb-8">
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

          <div className="grid flex-1 gap-10 border-t border-ink pt-6 lg:grid-cols-12">
            <ul className="lg:col-span-8 lg:columns-2 lg:gap-10">
              {pages.filter((p) => p.listed).map((p) => (
                <li key={p.id} className="break-inside-avoid border-b border-line">
                  <Link
                    href={localizedPath(locale, p.slug)}
                    onClick={close}
                    aria-current={currentId === p.id ? "page" : undefined}
                    className="group flex items-baseline justify-between gap-4 py-3 sm:py-4"
                  >
                    <span className="text-[clamp(1.6rem,4.2vw,2.4rem)] font-medium leading-tight tracking-tight transition-transform duration-300 group-hover:translate-x-1 group-aria-[current=page]:text-accent-ink">
                      {t.nav[p.id]}
                    </span>
                    <span className="hidden text-right text-sm text-ink-3 sm:block">{t.navHint[p.id]}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-8 lg:col-span-4">
              <div>
                <p className="eyebrow mb-3">{t.menu.contact}</p>
                <ul className="space-y-3">
                  <li>
                    <a href={mailtoHref} className="mono text-lg underline decoration-line underline-offset-4 hover:decoration-ink">{profile.contact.email}</a>
                  </li>
                  <li>
                    <a href={profile.contact.phone.href} className="mono tabular text-lg underline decoration-line underline-offset-4 hover:decoration-ink">{profile.contact.phone.display}</a>
                  </li>
                </ul>
              </div>
              <Link href={localizedPath(locale, "contact")} onClick={close} className="btn btn-primary self-start">
                {t.startProject}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <LanguageSwitcher locale={locale} label={t.language} />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
