import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { homeContent } from "@/content/home";

/** Four strengths as large editorial rows, then a dense two-column toolbox index. */
export function Services({ locale }: { locale: Locale }) {
  const c = homeContent[locale].services;

  return (
    <section id="services" className="border-t border-line" aria-labelledby="services-title">
      <div className="container-page section">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">{c.eyebrow}</p>
            <h2 id="services-title" className="h1 max-w-[16ch]">{c.title}</h2>
          </div>
          <p className="body-copy lg:col-span-4 lg:col-start-9">{c.lede}</p>
        </div>

        <ul className="mt-[clamp(2.5rem,5vw,4rem)] border-t border-ink">
          {c.lead.map((s) => (
            <li key={s.id} id={`service-${s.id}`} className="grid gap-5 border-b border-ink py-6 sm:gap-6 sm:py-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <h3 className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-[1.15] tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-3 max-w-[42ch] text-ink-2">{s.outcome}</p>
              </div>
              <div className="lg:col-span-4">
                <p className="eyebrow mb-3">{c.youGet}</p>
                <ul className="space-y-1.5 text-[0.9rem]">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-ink-3" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-start lg:col-span-3 lg:justify-end">
                <Link href={localizedPath(locale, s.href)} className="link-cta">
                  <span className="link-underline">{s.cta}</span>
                  <ArrowRight className="arrow size-4" aria-hidden />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(2.5rem,5vw,4rem)]">
          <h3 className="eyebrow mb-6">{c.more.title}</h3>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {[{ ...c.more.engineering, cta: undefined as string | undefined }, c.more.ai].map((group) => (
              <div key={group.title}>
                <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
                  <p className="h3">{group.title}</p>
                  {group.cta && (
                    <Link href={localizedPath(locale, "contact")} className="link-cta -my-3 text-sm">
                      <span className="link-underline">{group.cta}</span>
                      <ArrowUpRight className="arrow size-4" aria-hidden />
                    </Link>
                  )}
                </div>
                <dl>
                  {group.items.map((item) => (
                    <div key={item.title} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6">
                      <dt className="font-medium">{item.title}</dt>
                      <dd className="text-[0.95rem] text-ink-2">{item.note}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
