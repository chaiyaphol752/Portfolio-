import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { systemsContent } from "@/content/systems";
import { buildMetadata } from "@/lib/seo";
import { profile } from "@/config/profile";
import { pages } from "@/config/pages";
import { locales } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";
import { fetchPublicRepos } from "@/lib/github/repos";
import { CtaBand } from "@/components/ui/CtaBand";
import { Pipeline, RequestPath, TitleBlock } from "@/components/pages/systems/Blueprint";
import { HealthPanel } from "@/components/pages/systems/HealthPanel";
import { GithubRepos } from "@/components/pages/systems/GithubRepos";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, slug: "systems", ...systemsContent[locale].meta });
}

/** Corner registration marks that frame a drawing sheet. */
function SheetCorners() {
  const corner = "absolute size-3 border-ink";
  return (
    <>
      <span aria-hidden className={`${corner} -left-px -top-px border-l-2 border-t-2`} />
      <span aria-hidden className={`${corner} -right-px -top-px border-r-2 border-t-2`} />
      <span aria-hidden className={`${corner} -bottom-px -left-px border-b-2 border-l-2`} />
      <span aria-hidden className={`${corner} -bottom-px -right-px border-b-2 border-r-2`} />
    </>
  );
}

export default async function SystemsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = systemsContent[locale];
  const repos = await fetchPublicRepos(profile.githubUsername);
  const revision = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
  const routes = interpolate(t.titleBlock.routesValue, { routes: pages.length * locales.length });
  const drawnOn = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="grid-paper border-b border-ink">
        <div className="container-page py-[clamp(1.5rem,4vw,3rem)]">
          <div className="relative border border-ink/40 px-[clamp(1rem,3.5vw,3rem)] py-[clamp(2rem,5vw,4rem)]">
            <SheetCorners />

            <header className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="eyebrow rise mb-6">{t.hero.eyebrow}</p>
                <h1 className="h1 rise max-w-[16ch]" style={{ "--d": 1 } as React.CSSProperties}>{t.hero.title}</h1>
                <p className="lede rise mt-6" style={{ "--d": 2 } as React.CSSProperties}>{t.hero.lede}</p>
              </div>
              <div className="rise lg:col-span-5" style={{ "--d": 3 } as React.CSSProperties}>
                <TitleBlock t={t.titleBlock} revision={revision} routes={routes} drawnOn={drawnOn} />
              </div>
            </header>

            <section aria-labelledby="request-title" className="mt-[clamp(3.5rem,7vw,6rem)]">
              <div className="mb-10 grid gap-4 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <p className="eyebrow mb-3">{t.request.eyebrow}</p>
                  <h2 id="request-title" className="h2">{t.request.title}</h2>
                </div>
                <p className="body-copy lg:col-span-5">{t.request.lede}</p>
              </div>
              <RequestPath t={t.request} />
            </section>

            <section aria-labelledby="pipeline-title" className="mt-[clamp(3.5rem,7vw,6rem)] border-t border-dashed border-ink-3 pt-[clamp(2.5rem,5vw,4rem)]">
              <div className="mb-10 grid gap-4 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                  <p className="eyebrow mb-3">{t.pipeline.eyebrow}</p>
                  <h2 id="pipeline-title" className="h2">{t.pipeline.title}</h2>
                </div>
                <p className="body-copy lg:col-span-5">{t.pipeline.lede}</p>
              </div>
              <Pipeline t={t.pipeline} />
            </section>

            <section aria-labelledby="notes-title" className="mt-[clamp(3.5rem,7vw,6rem)] grid gap-6 border-t border-dashed border-ink-3 pt-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-3">{t.security.eyebrow}</p>
                <h2 id="notes-title" className="h2">{t.security.title}</h2>
              </div>
              <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
                {t.security.items.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-line py-3 text-sm text-ink-2">
                    <span aria-hidden className="mt-[0.45rem] size-1.5 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

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

      <CtaBand locale={locale} title={t.cta.title} body={t.cta.body} label={t.cta.label} />
    </>
  );
}
