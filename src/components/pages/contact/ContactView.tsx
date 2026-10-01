import { Mail, Phone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { contactContent } from "@/content/contact";
import { common } from "@/content/common";
import { mailtoHref, profile } from "@/config/profile";
import { Availability } from "@/components/ui/Availability";
import { ContactActions } from "@/components/ui/ContactActions";
import { ContactForm } from "./ContactForm";

export function ContactView({ locale }: { locale: Locale }) {
  const t = contactContent[locale];
  const c = common[locale];

  return (
    <div className="relative">
      <section aria-labelledby="contact-title" className="container-page pb-[clamp(4rem,8vw,7rem)] pt-[clamp(2.5rem,6vw,5.5rem)]">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <p className="eyebrow rise mb-6">{t.hero.eyebrow}</p>
              <h1 id="contact-title" className="h1 rise max-w-[13ch]" style={{ "--d": 1 } as React.CSSProperties}>
                {t.hero.title}
              </h1>
              <p className="lede rise mt-6" style={{ "--d": 2 } as React.CSSProperties}>{t.hero.lede}</p>
              <Availability t={c} services className="rise mt-8 text-sm" />

              <div className="mt-12 border-t border-ink">
                <h2 className="eyebrow pt-4">{t.next.title}</h2>
                <dl className="mt-2">
                  {t.next.steps.map((step) => (
                    <div key={step.label} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-line py-4 text-sm max-xs:grid-cols-1 max-xs:gap-1">
                      <dt className="mono text-xs uppercase tracking-wider text-ink-3">{step.label}</dt>
                      <dd className="text-ink-2">{step.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-12">
                <h2 className="h3">{t.direct.title}</h2>
                <p className="mt-2 text-sm text-ink-2">{t.direct.body}</p>
                <ContactActions t={c} layout="stack" className="mt-5" />
                <p className="display-serif mt-8 text-2xl text-ink-2">— {profile.name}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-ink bg-paper">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink bg-paper-2 px-5 py-3 sm:px-8">
                <h2 className="mono text-xs uppercase tracking-[0.14em]">{t.form.title}</h2>
                <p className="mono text-xs text-ink-3">{profile.contact.email}</p>
              </div>
              <div className="px-5 py-8 sm:px-8 sm:py-10">
                <ContactForm t={t.form} common={c} locale={locale} />
              </div>
            </div>
            <p className="mt-4 max-w-[60ch] text-xs text-ink-3">{t.privacy}</p>
          </div>
        </div>
      </section>

      {/* Sticky on small screens only, inside the page so it never covers the footer. */}
      <nav aria-label={t.mobileBar} className="sticky bottom-0 z-30 border-t border-ink bg-paper md:hidden">
        <div className="container-page grid grid-cols-2 gap-2 py-2.5">
          <a href={mailtoHref} className="btn btn-ghost !min-h-11 justify-center !px-3 text-sm">
            <Mail className="size-4" aria-hidden />
            {c.contact.write}
          </a>
          <a href={profile.contact.phone.href} className="btn btn-primary !min-h-11 justify-center !px-3 text-sm">
            <Phone className="size-4" aria-hidden />
            {c.contact.call}
          </a>
        </div>
      </nav>
    </div>
  );
}
