import Link from "next/link";
import { pages } from "@/config/pages";
import { localizedPath } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { common } from "@/content/common";
import { profile } from "@/config/profile";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Availability } from "@/components/ui/Availability";
import { ContactActions } from "@/components/ui/ContactActions";

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
          <Availability t={t} services className="text-sm" />
          <p className="mt-6 max-w-[34ch] text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-tight tracking-tight">{t.footer.tagline}</p>
          <ContactActions t={t} className="mt-8" />
        </div>
        <nav aria-label={t.footer.explore} className="lg:col-span-4">
          <p className="eyebrow mb-4">{t.footer.explore}</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {pages.filter((p) => p.listed).map((p) => (
              <li key={p.id}>
                <Link href={localizedPath(locale, p.slug)} className="link-underline">{t.nav[p.id]}</Link>
              </li>
            ))}
          </ul>
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
          </ul>
          <p className="display-serif mt-10 text-3xl">{profile.name}</p>
        </div>
      </div>
      <div className="container-page flex flex-wrap items-center justify-between gap-2 border-t border-line py-5">
        <p className="mono text-xs text-ink-3">© {year} {profile.name}. {t.footer.rights}</p>
        <p className="mono text-xs text-ink-3">{t.footer.builtWith}</p>
      </div>
    </footer>
  );
}
