import { ButtonLink } from "./ButtonLink";
import { ContactActions } from "./ContactActions";
import { localizedPath } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { common } from "@/content/common";

/** Closing call to action. Pages pass their own contextual `label` and `title`. */
export function CtaBand({ locale, label, title, body }: { locale: Locale; label?: string; title?: string; body?: string }) {
  const t = common[locale];
  return (
    <section className="night" aria-labelledby="cta-title">
      <div className="container-page section grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6">{t.band.eyebrow}</p>
          <h2 id="cta-title" className="h1">{title ?? t.band.title}</h2>
        </div>
        <div className="lg:col-span-5">
          <p className="mb-8 max-w-[46ch] text-night-mute">{body ?? t.band.body}</p>
          <ButtonLink href={localizedPath(locale, "contact")}>{label ?? t.cta.startProject}</ButtonLink>
          <ContactActions t={t} dark className="mt-6" />
        </div>
      </div>
    </section>
  );
}
