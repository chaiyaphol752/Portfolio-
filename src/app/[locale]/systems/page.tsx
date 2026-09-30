import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { systemsContent } from "@/content/systems";
import { buildMetadata } from "@/lib/seo";
import { profile } from "@/config/profile";
import { fetchPublicRepos } from "@/lib/github/repos";
import { PageHero } from "@/components/ui/PageHero";
import { PageFooterNav } from "@/components/ui/PageFooterNav";
import { ContactForm } from "@/components/pages/systems/ContactForm";
import { ArchitectureDiagram } from "@/components/pages/systems/ArchitectureDiagram";
import { HealthPanel } from "@/components/pages/systems/HealthPanel";
import { GithubRepos } from "@/components/pages/systems/GithubRepos";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, slug: "systems", ...systemsContent[locale].meta });
}

export default async function SystemsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = systemsContent[locale];
  const repos = await fetchPublicRepos(profile.githubUsername);

  return (
    <>
      <PageHero number={8} eyebrow={t.hero.eyebrow} title={t.hero.title} lede={t.hero.lede} complexityLabel={t.hero.complexity} />

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-[calc(var(--header-h)+1rem)] border-t border-ink">
        <div className="container-page section grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="eyebrow mb-5">{t.contact.eyebrow}</p>
              <h2 id="contact-title" className="h1">{t.contact.title}</h2>
              <p className="lede mt-6">{t.contact.body}</p>
              <ul className="mt-8 space-y-2.5 border-t border-line pt-6">
                {t.contact.facts.map((fact) => (
                  <li key={fact} className="flex items-baseline gap-3 text-sm text-ink-2">
                    <span aria-hidden className="mono text-accent-ink">+</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ContactForm t={t.contact} locale={locale} fallbackEmail={profile.email} />
          </div>
        </div>
      </section>

      <section className="night" aria-labelledby="architecture-title">
        <div className="on-night container-page section">
          <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-5">{t.architecture.eyebrow}</p>
              <h2 id="architecture-title" className="h1">{t.architecture.title}</h2>
            </div>
            <p className="max-w-[44ch] text-night-mute lg:col-span-5">{t.architecture.lede}</p>
          </div>
          <ArchitectureDiagram t={t.architecture} />
        </div>
      </section>

      <section aria-labelledby="health-title" className="border-b border-line">
        <div className="container-page section grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-5">{t.health.eyebrow}</p>
            <h2 id="health-title" className="h2 break-words">{t.health.title}</h2>
            <p className="body-copy mt-5">{t.health.body}</p>
          </div>
          <div className="lg:col-span-8">
            <HealthPanel t={t.health} locale={locale} />
          </div>
        </div>
      </section>

      <section aria-labelledby="github-title">
        <div className="container-page section grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-5">{t.github.eyebrow}</p>
            <h2 id="github-title" className="h2">{t.github.title}</h2>
            <p className="body-copy mt-5">{t.github.lede}</p>
          </div>
          <div className="lg:col-span-8">
            <GithubRepos t={t.github} locale={locale} result={repos} profileUrl={profile.links.github} />
          </div>
        </div>
      </section>

      <PageFooterNav locale={locale} current="systems" />
    </>
  );
}
