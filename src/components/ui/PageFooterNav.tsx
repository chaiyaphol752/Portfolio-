import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatPageNumber, pages, type PageId } from "@/config/pages";
import { localizedPath } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { common } from "@/content/common";

/** Previous / next page links, rendered at the end of every page. */
export function PageFooterNav({ locale, current }: { locale: Locale; current: PageId }) {
  const t = common[locale];
  const index = pages.findIndex((p) => p.id === current);
  const prev = pages[index - 1];
  const next = pages[index + 1];
  return (
    <nav aria-label="Page" className="container-page grid gap-px border-t border-line py-8 sm:grid-cols-2">
      {prev ? (
        <Link href={localizedPath(locale, prev.slug)} className="group flex items-center gap-4 py-4">
          <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" aria-hidden />
          <span>
            <span className="eyebrow block">{t.cta.previous} · {formatPageNumber(prev.number)}</span>
            <span className="h3">{t.nav[prev.id]}</span>
          </span>
        </Link>
      ) : <span />}
      {next && (
        <Link href={localizedPath(locale, next.slug)} className="group flex items-center justify-end gap-4 py-4 text-right">
          <span>
            <span className="eyebrow block">{t.cta.next} · {formatPageNumber(next.number)}</span>
            <span className="h3">{t.nav[next.id]}</span>
          </span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
