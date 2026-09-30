import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { common } from "@/content/common";
import { homeContent } from "@/content/home";
import { formatPageNumber, pages } from "@/config/pages";

/** 01→09 as a staircase of bars: each row is a link, and the bar length shows rising technical depth. */
export function SiteMap({ locale }: { locale: Locale }) {
  const c = homeContent[locale].sitemap;
  const t = common[locale];
  return (
    <section className="border-t border-ink" aria-labelledby="sitemap-title">
      <div className="container-page section grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">{c.eyebrow}</p>
          <h2 id="sitemap-title" className="h2">{c.title}</h2>
          <p className="body-copy mt-6">{c.body}</p>
        </div>
        <div className="lg:col-span-8">
          <div className="mono mb-3 flex justify-between text-[0.7rem] uppercase tracking-wider text-ink-3" aria-hidden>
            <span>{c.simple}</span>
            <span>{c.technical}</span>
          </div>
          <ol className="border-t border-ink">
            {pages.map((p) => (
              <li key={p.id} className="border-b border-line">
                <Link
                  href={localizedPath(locale, p.slug)}
                  className="group grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 py-3.5 sm:grid-cols-[2.25rem_11rem_minmax(0,1fr)]"
                >
                  <span className="mono tabular text-xs text-ink-3">{formatPageNumber(p.number)}</span>
                  <span className="font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-1">{t.nav[p.id]}</span>
                  <span aria-hidden className="col-start-2 h-[3px] bg-paper-3 sm:col-start-3">
                    <span
                      className="block h-full bg-ink transition-colors group-hover:bg-accent"
                      style={{ width: `${(p.number / pages.length) * 100}%` }}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
