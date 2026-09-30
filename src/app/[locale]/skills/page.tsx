import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { skillsContent } from "@/content/skills";
import { common } from "@/content/common";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageFooterNav } from "@/components/ui/PageFooterNav";
import { CapabilityMap } from "@/components/pages/skills/CapabilityMap";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = skillsContent[locale].meta;
  return buildMetadata({ locale, slug: "skills", title, description });
}

export default async function SkillsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = skillsContent[locale];
  return (
    <>
      <PageHero
        number={3}
        eyebrow={t.hero.eyebrow}
        complexityLabel={t.hero.complexity}
        title={
          <>
            {t.hero.titlePlain} <span className="display-serif text-accent-ink">{t.hero.titleAccent}</span>
          </>
        }
        lede={t.hero.lede}
      />

      <section className="container-page pb-[clamp(4rem,8vw,7rem)]" aria-labelledby="map-title">
        <div className="mb-10 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-3">{t.map.eyebrow}</p>
            <h2 id="map-title" className="h2">{t.map.title}</h2>
          </div>
          <p className="body-copy lg:col-span-5 lg:col-start-8">{t.map.body}</p>
        </div>
        <CapabilityMap content={t} />
      </section>

      <section className="border-t border-ink" aria-labelledby="principles-title">
        <div className="container-page section grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-3">{t.principles.eyebrow}</p>
            <h2 id="principles-title" className="h2">{t.principles.title}</h2>
          </div>
          <ol className="lg:col-span-8">
            {t.principles.items.map((item, i) => (
              <li key={item.title} className="grid gap-2 border-t border-line py-6 first:border-t-0 first:pt-0 sm:grid-cols-[4rem_1fr_1.4fr] sm:gap-6">
                <span className="mono tabular text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{item.title}</h3>
                <p className="body-copy">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand locale={locale} label={common[locale].cta.discussProject} />
      <PageFooterNav locale={locale} current="skills" />
    </>
  );
}
