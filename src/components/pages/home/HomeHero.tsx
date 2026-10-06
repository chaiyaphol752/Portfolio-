import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { common } from "@/content/common";
import { homeContent } from "@/content/home";
import { profile } from "@/config/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Availability } from "@/components/ui/Availability";

/**
 * Identity-first hero: status line, professional identity, one concise supporting
 * statement, a clear action hierarchy and quiet supporting metadata. The slogan
 * stays as a small editorial aside instead of dominating the first screen.
 */
export function HomeHero({ locale }: { locale: Locale }) {
  const c = homeContent[locale].hero;
  const t = common[locale];

  return (
    <section
      className="hero-wash container-page pb-[clamp(2.75rem,5vw,4.5rem)] pt-[clamp(1.5rem,3vw,2.75rem)]"
      aria-labelledby="home-title"
    >
      <div className="rise flex flex-wrap items-start justify-between gap-x-8 gap-y-3 border-b border-ink pb-4 text-sm">
        <Availability t={t} services />
        <p className="mono text-xs uppercase tracking-[0.12em] text-ink-3">
          {profile.name} · {profile.location[locale]}
        </p>
      </div>

      <div className="mt-[clamp(2rem,4vw,3.25rem)] grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="mono rise text-xs uppercase tracking-[0.14em] text-ink-3" style={{ "--d": 1 } as React.CSSProperties}>
            {c.role}
          </p>
          <h1 id="home-title" className="hero-title rise mt-4 max-w-[17ch]" style={{ "--d": 1 } as React.CSSProperties}>
            <span className="block">{c.titleA}</span>
            <span className="block text-ink-2">{c.titleB}</span>
          </h1>
          <p className="lede rise mt-6 max-w-[55ch]" style={{ "--d": 2 } as React.CSSProperties}>
            {c.lede}
          </p>

          <div className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ "--d": 3 } as React.CSSProperties}>
            <ButtonLink href={localizedPath(locale, "projects")}>{t.cta.viewWork}</ButtonLink>
            <ButtonLink href={localizedPath(locale, "contact")} variant="ghost">
              {t.cta.contact}
            </ButtonLink>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link-cta">
              <span className="link-underline">{t.cta.github}</span>
              <ArrowUpRight className="arrow size-4" aria-hidden />
              <span className="sr-only"> ({t.externalLink})</span>
            </a>
          </div>

          <p className="display-serif rise mt-7 text-[0.95rem] text-ink-3" style={{ "--d": 4 } as React.CSSProperties}>
            {c.titleAccent}
          </p>
        </div>

        <div className="rise lg:col-span-5" style={{ "--d": 3 } as React.CSSProperties}>
          <div className="lg:pt-[3.25rem]">
            <p className="eyebrow mb-4">{c.outcomesLabel}</p>
            <ul className="grid grid-cols-2 gap-x-6">
              {c.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-3 border-b border-line py-2.5 text-[0.9rem]">
                  <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
                  <span className="hyphens-auto">{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
