import type { Locale } from "@/i18n/config";
import { localeMeta, locales } from "@/i18n/config";
import { aboutContent } from "@/content/about";
import { common } from "@/content/common";
import { mailtoHref, profile } from "@/config/profile";
import { interpolate } from "@/lib/interpolate";
import { ExternalLink } from "@/components/ui/ExternalLink";

/** Letter-like opening column with a quiet fact sheet beside it. */
export function AboutIntro({ locale }: { locale: Locale }) {
  const c = aboutContent[locale];
  const t = common[locale];
  const facts: { label: string; value: React.ReactNode }[] = [
    { label: c.facts.based, value: profile.location[locale] },
    { label: c.facts.focus, value: c.facts.focusValue },
    { label: c.facts.languages, value: locales.map((l) => localeMeta[l].name).join(" · ") },
    { label: c.facts.education, value: c.background.education.degree },
    { label: c.facts.availability, value: t.availability[profile.availability] },
    {
      label: c.facts.contact,
      value: (
        <span className="flex flex-col">
          {/* min-h-11 keeps each link a comfortable 44px tap target on phones. */}
          <a href={mailtoHref} className="mono inline-flex min-h-11 items-center self-start break-all text-[0.85rem] underline decoration-line underline-offset-4 hover:decoration-ink lg:min-h-8">{profile.contact.email}</a>
          <a href={profile.contact.phone.href} className="mono tabular inline-flex min-h-11 items-center self-start text-[0.85rem] underline decoration-line underline-offset-4 hover:decoration-ink lg:min-h-8">{profile.contact.phone.display}</a>
        </span>
      ),
    },
    {
      label: c.facts.code,
      value: (
        <ExternalLink href={profile.links.github} hint={t.externalLink} className="inline-flex min-h-11 items-center break-all underline decoration-line underline-offset-4 hover:decoration-ink lg:min-h-8">
          github.com/{profile.githubUsername}
        </ExternalLink>
      ),
    },
  ];

  return (
    <section className="container-page pb-[clamp(3.5rem,7vw,6rem)] pt-[clamp(2.5rem,6vw,5.5rem)]" aria-labelledby="about-title">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-6 xl:col-start-2">
          <p className="eyebrow rise mb-8">{c.hero.eyebrow}</p>
          <p className="display-serif rise text-[clamp(1.5rem,2.6vw,2.1rem)] text-ink-2" style={{ "--d": 1 } as React.CSSProperties}>
            {interpolate(c.hero.greeting, { name: profile.name })}
          </p>
          <h1 id="about-title" className="h1 rise mt-4 max-w-[17ch]" style={{ "--d": 1 } as React.CSSProperties}>
            {c.hero.title}
          </h1>
          <p className="lede rise mt-8 max-w-[48ch]" style={{ "--d": 2 } as React.CSSProperties}>
            {c.hero.lede}
          </p>
        </div>
        <aside className="rise lg:col-span-4 lg:col-start-9 xl:col-span-3 xl:col-start-10" style={{ "--d": 3 } as React.CSSProperties} aria-label={c.facts.title}>
          <div className="border-t border-ink pt-4 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <p className="eyebrow mb-2">{c.facts.title}</p>
            <dl>
              {facts.map((f) => (
                <div key={f.label} className="grid grid-cols-1 gap-1 border-b border-line py-3 text-[0.92rem] sm:grid-cols-[7.5rem_1fr] sm:gap-4 lg:grid-cols-1 lg:gap-1">
                  <dt className="text-ink-3">{f.label}</dt>
                  <dd className="min-w-0">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
