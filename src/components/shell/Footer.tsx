import Link from "next/link";
import { formatPageNumber, pages } from "@/config/pages";
import { localizedPath } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { common } from "@/content/common";
import { profile } from "@/config/profile";
import { ExternalLink } from "@/components/ui/ExternalLink";

export function Footer({ locale }: { locale: Locale }) {
  const t = common[locale];
  const year = new Date().getFullYear();
  const social = [
    { label: "GitHub", url: profile.links.github },
    ...(profile.links.linkedin ? [{ label: "LinkedIn", url: profile.links.linkedin }] : []),
    ...profile.links.freelance,
  ];
  return (
    <footer className="border-t border-ink bg-paper">
      <div className="container-page grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="display-serif text-4xl leading-tight sm:text-5xl">{profile.name}</p>
          <p className="mt-5 max-w-[40ch] text-ink-2">{t.footer.tagline}</p>
          <p className="mono mt-6 flex items-center gap-2 text-xs text-ink-2">
            <span aria-hidden className={"size-2 rounded-full " + (profile.availability === "open" ? "bg-signal" : profile.availability === "limited" ? "bg-accent" : "bg-ink-3")} />
            {t.footer.availability[profile.availability]} · {profile.location[locale]}
          </p>
        </div>
        <nav aria-label={t.footer.explore} className="lg:col-span-4">
          <p className="eyebrow mb-4">{t.footer.explore}</p>
          <ol className="grid grid-cols-2 gap-x-6 gap-y-2">
            {pages.map((p) => (
              <li key={p.id}>
                <Link href={localizedPath(locale, p.slug)} className="group flex gap-3 text-sm">
                  <span className="mono tabular text-ink-3">{formatPageNumber(p.number)}</span>
                  <span className="link-underline">{t.nav[p.id]}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="lg:col-span-3">
          <p className="eyebrow mb-4">{t.footer.elsewhere}</p>
          <ul className="space-y-2 text-sm">
            {social.map((s) => (
              <li key={s.url}>
                <ExternalLink href={s.url} hint={t.externalLink} className="link-underline">{s.label}</ExternalLink>
              </li>
            ))}
            <li>
              <ExternalLink href={profile.sourceRepo} hint={t.externalLink} className="link-underline">{t.footer.source}</ExternalLink>
            </li>
            {profile.email && (
              <li><a href={`mailto:${profile.email}`} className="link-underline">{profile.email}</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="container-page flex flex-wrap items-center justify-between gap-2 border-t border-line py-5">
        <p className="mono text-xs text-ink-3">© {year} {profile.name}. {t.footer.rights}</p>
        <p className="mono text-xs text-ink-3">{t.footer.builtWith}</p>
      </div>
    </footer>
  );
}
