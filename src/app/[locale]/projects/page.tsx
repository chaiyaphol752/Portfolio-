import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { projectsContent } from "@/content/projects";
import { common } from "@/content/common";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageFooterNav } from "@/components/ui/PageFooterNav";
import { ProjectsExplorer } from "@/components/pages/projects/ProjectsExplorer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = projectsContent[locale].meta;
  return buildMetadata({ locale, slug: "projects", title, description });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = projectsContent[locale];
  return (
    <>
      <PageHero
        number={4}
        eyebrow={t.hero.eyebrow}
        complexityLabel={t.hero.complexity}
        title={
          <>
            {t.hero.titlePlain} <span className="display-serif text-accent-ink">{t.hero.titleAccent}</span>
          </>
        }
        lede={t.hero.lede}
      />

      <section className="container-page pb-[clamp(4rem,8vw,7rem)]" aria-labelledby="explorer-title">
        <div className="mb-10 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-3">{t.ui.eyebrow}</p>
            <h2 id="explorer-title" className="h2">{t.ui.title}</h2>
          </div>
          <p className="body-copy lg:col-span-5 lg:col-start-8">{t.ui.body}</p>
        </div>
        <ProjectsExplorer content={t} locale={locale} externalHint={common[locale].externalLink} />
      </section>

      <section className="border-t border-ink" aria-labelledby="disclaimer-title">
        <div className="container-page grid gap-6 py-12 lg:grid-cols-12">
          <h2 id="disclaimer-title" className="eyebrow lg:col-span-4">{t.disclaimer.title}</h2>
          <p className="body-copy lg:col-span-6">{t.disclaimer.body}</p>
        </div>
      </section>

      <CtaBand locale={locale} label={common[locale].cta.startConversation} />
      <PageFooterNav locale={locale} current="projects" />
    </>
  );
}
