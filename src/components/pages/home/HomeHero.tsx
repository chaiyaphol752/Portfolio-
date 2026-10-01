import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { common } from "@/content/common";
import { homeContent } from "@/content/home";
import { profile } from "@/config/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Availability } from "@/components/ui/Availability";

export function HomeHero({ locale }: { locale: Locale }) {
  const c = homeContent[locale].hero;
  const t = common[locale];

  return (
    <section className="container-page pb-[clamp(3rem,6vw,5.5rem)] pt-[clamp(1.75rem,4vw,3.5rem)]" aria-labelledby="home-title">
      <div className="rise flex flex-wrap items-start justify-between gap-x-8 gap-y-3 border-b border-ink pb-4 text-sm">
        <Availability t={t} services />
        <p className="mono text-xs uppercase tracking-[0.12em] text-ink-3">
          {profile.name} · {profile.location[locale]}
        </p>
      </div>

      <div className="mt-[clamp(2.25rem,6vw,5rem)] grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <p className="mono rise mb-6 text-xs uppercase tracking-[0.14em] text-accent-ink" style={{ "--d": 1 } as React.CSSProperties}>
            {c.role}
          </p>
          <h1
            id="home-title"
            className="display rise text-[clamp(2.7rem,8.6vw,8.75rem)]"
            style={{ "--d": 1 } as React.CSSProperties}
          >
            <span className="block">{c.titleA}</span>
            <span className="block text-ink-2">{c.titleB}</span>
            <span className="display-serif block text-accent-ink">{c.titleAccent}</span>
          </h1>
        </div>
      </div>

      <div className="mt-[clamp(2rem,4.5vw,4rem)] grid gap-10 lg:grid-cols-12 lg:items-end">
        <p className="lede rise max-w-[52ch] lg:col-span-6" style={{ "--d": 2 } as React.CSSProperties}>
          {c.lede}
        </p>
        <div className="rise flex flex-col gap-5 lg:col-span-5 lg:col-start-8 lg:items-end" style={{ "--d": 3 } as React.CSSProperties}>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href={localizedPath(locale, "projects")}>{t.cta.viewWork}</ButtonLink>
            <ButtonLink href={localizedPath(locale, "contact")} variant="ghost">
              {t.cta.startProject}
            </ButtonLink>
          </div>
          <Link href={localizedPath(locale, "ai-native")} className="group inline-flex items-center gap-2 text-sm font-medium">
            <span className="link-underline">{c.secondary}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mt-[clamp(3rem,6vw,5rem)] border-t border-ink pt-5">
        <p className="eyebrow mb-4">{c.outcomesLabel}</p>
        <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-4">
          {c.outcomes.map((o) => (
            <li key={o} className="flex items-center gap-3 hyphens-auto border-b border-line py-3 text-[0.95rem] font-medium">
              <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
              {o}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
