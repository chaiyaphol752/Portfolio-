import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { common } from "@/content/common";
import { homeContent } from "@/content/home";
import { profile } from "@/config/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { BuildMark } from "./BuildMark";

// German compounds ("Webentwicklung") are long; a slightly smaller fluid size prevents overflow at 360px.
const headlineSize: Record<Locale, string> = {
  en: "",
  de: "text-[clamp(2.2rem,7.4vw,8rem)]",
  th: "text-[clamp(2.6rem,8vw,8.5rem)]",
};

export function HomeHero({ locale }: { locale: Locale }) {
  const c = homeContent[locale];
  const t = common[locale];
  const links = [
    { label: "GitHub", url: profile.links.github },
    ...(profile.links.linkedin ? [{ label: "LinkedIn", url: profile.links.linkedin }] : []),
    ...profile.links.freelance,
  ];

  return (
    <section className="container-page pb-[clamp(3rem,6vw,6rem)] pt-[clamp(2rem,5vw,4.5rem)]" aria-labelledby="home-title">
      <div className="rise flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-4">
        <p className="eyebrow">
          <span className="tabular text-ink">01</span> — {c.hero.eyebrow}
        </p>
        <p className="mono flex items-center gap-2 text-xs text-ink-2">
          <span aria-hidden className={"size-2 rounded-full " + (profile.availability === "open" ? "bg-signal" : profile.availability === "limited" ? "bg-accent" : "bg-ink-3")} />
          {t.footer.availability[profile.availability]}
        </p>
      </div>

      <h1
        id="home-title"
        className={`display rise mt-[clamp(2.5rem,7vw,6rem)] break-words ${headlineSize[locale]}`}
        style={{ "--d": 1 } as React.CSSProperties}
      >
        <span className="block">{c.hero.lineA}</span>
        <span className="block">
          <span className="display-serif pr-[0.18em] text-accent-ink" aria-hidden>×</span>
          <span className="display-serif text-[1.1em] leading-[0.85]">{c.hero.lineB}</span>
        </span>
        <span className="display-serif block text-[1.1em] leading-[0.95]">{c.hero.lineC}</span>
      </h1>

      <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="rise lg:col-span-6" style={{ "--d": 2 } as React.CSSProperties}>
          <p className="lede">{c.hero.value}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={localizedPath(locale, "projects")}>{t.cta.viewWork}</ButtonLink>
            <ButtonLink href={`${localizedPath(locale, "systems")}#contact`} variant="ghost">{t.hireMe}</ButtonLink>
          </div>
          <ul className="mono mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-wider text-ink-2">
            {links.map((l) => (
              <li key={l.url}>
                <ExternalLink href={l.url} hint={t.externalLink} className="link-underline">{l.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>
        <figure className="rise lg:col-span-5 lg:col-start-8" style={{ "--d": 3 } as React.CSSProperties}>
          <BuildMark alt={c.visual.alt} nodes={c.visual.nodes} />
          <figcaption className="eyebrow mt-4 max-w-[34ch]">{c.visual.caption}</figcaption>
        </figure>
      </div>

      <div className="mt-[clamp(3rem,7vw,6rem)]">
        <h2 className="sr-only">{c.capabilitiesLabel}</h2>
        <ul className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
          {c.capabilities.map((item) => (
            <li key={item} className="flex items-center gap-3 border-b border-line py-4 pr-4">
              <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
              <span className="text-[0.95rem] text-ink-2">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
