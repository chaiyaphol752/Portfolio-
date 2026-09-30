import { ButtonLink } from "./ButtonLink";
import { localizedPath } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { common } from "@/content/common";

/** Closing call to action used at the end of pages. `label` lets a page choose a contextual CTA. */
export function CtaBand({ locale, label, title }: { locale: Locale; label?: string; title?: string }) {
  const t = common[locale];
  return (
    <section className="night" aria-labelledby="cta-title">
      <div className="container-page section grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-6">{t.band.eyebrow}</p>
          <h2 id="cta-title" className="h1">{title ?? t.band.title}</h2>
        </div>
        <div className="lg:col-span-4">
          <p className="mb-8 max-w-[40ch] text-night-mute">{t.band.body}</p>
          <ButtonLink href={`${localizedPath(locale, "systems")}#contact`}>{label ?? t.cta.tellMe}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
