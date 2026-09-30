import { caseStepIds, caseStudiesContent } from "@/content/case-studies";
import type { Locale } from "@/i18n/config";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageFooterNav } from "@/components/ui/PageFooterNav";
import { CaseIndex } from "./CaseIndex";
import { CaseArticle } from "./CaseArticle";

export function CaseStudiesView({ locale }: { locale: Locale }) {
  const c = caseStudiesContent[locale];
  return (
    <>
      <PageHero
        number={5}
        eyebrow={c.hero.eyebrow}
        title={
          <>
            {c.hero.titleLead} <span className="display-serif">{c.hero.titleEmph}</span>
          </>
        }
        lede={c.hero.lede}
        complexityLabel={c.hero.complexityLabel}
      />
      <div className="container-page pb-[clamp(4rem,8vw,7rem)] lg:grid lg:grid-cols-12 lg:gap-x-12">
        <aside className="lg:col-span-3">
          <CaseIndex
            label={c.labels.index}
            cases={c.cases.map((s) => ({ id: s.id, title: s.title }))}
            steps={caseStepIds.map((id) => ({ id, label: c.labels.steps[id] }))}
          />
        </aside>
        <div className="min-w-0 space-y-[clamp(5rem,10vw,9rem)] lg:col-span-9">
          {c.cases.map((study) => (
            <CaseArticle key={study.id} study={study} labels={c.labels} />
          ))}
        </div>
      </div>
      <CtaBand locale={locale} label={c.cta.label} title={c.cta.title} />
      <PageFooterNav locale={locale} current="case-studies" />
    </>
  );
}
