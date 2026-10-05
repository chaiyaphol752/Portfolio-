import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { projectsContent } from "@/content/projects";
import { common } from "@/content/common";
import { CtaBand } from "@/components/ui/CtaBand";
import { projectsMeta } from "@/components/pages/projects/data";
import { buildHaystack } from "@/components/pages/projects/filter";
import { ProjectShowcase } from "@/components/pages/projects/ProjectShowcase";
import { ProjectsBrowser, type IndexItem } from "@/components/pages/projects/ProjectsBrowser";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = projectsContent[locale].meta;
  return buildMetadata({ locale, slug: "projects", title, description });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = projectsContent[locale];
  const c = common[locale];

  const items: IndexItem[] = projectsMeta.map((p) => {
    const copy = t.projects[p.id];
    const serviceLabel = p.categories.map((cat) => t.categories[cat]).join(" · ");
    return {
      id: p.id,
      name: p.name,
      kindLabel: t.kind[p.kind],
      highlight: p.kind === "live",
      serviceLabel,
      categories: p.categories,
      haystack: buildHaystack([p.name, copy.tagline, copy.problem, copy.solution, ...copy.decisions, ...p.stack, serviceLabel, t.kind[p.kind]]),
    };
  });
  const sections = Object.fromEntries(projectsMeta.map((p) => [p.id, <ProjectShowcase key={p.id} project={p} t={t} common={c} locale={locale} />]));

  return (
    <>
      <header className="container-page pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(3rem,7vw,6.5rem)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 className="display rise text-[clamp(2.6rem,7vw,6.75rem)]! lg:col-span-9">
            <span className="block">{t.hero.title}</span>
            <span className="display-serif block text-accent-ink">{t.hero.titleAccent}</span>
          </h1>
          <div className="rise lg:col-span-3" style={{ "--d": 1 } as React.CSSProperties}>
            <p className="eyebrow mb-4">{t.hero.eyebrow} · {projectsMeta.length}</p>
            <p className="text-[0.95rem] leading-relaxed text-ink-2">{t.hero.lede}</p>
          </div>
        </div>
      </header>

      <ProjectsBrowser items={items} sections={sections} t={t} />

      <section aria-labelledby="labels-title" className="border-t border-ink">
        <div className="container-page grid gap-6 py-12 lg:grid-cols-12">
          <h2 id="labels-title" className="eyebrow lg:col-span-4">{t.disclaimer.title}</h2>
          <p className="body-copy lg:col-span-7">{t.disclaimer.body}</p>
        </div>
      </section>

      <CtaBand locale={locale} title={t.cta.title} body={t.cta.body} label={c.cta.startProject} />    </>
  );
}
