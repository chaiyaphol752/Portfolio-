import { caseStepIds, caseStudiesContent } from "@/content/case-studies";
import type { Locale } from "@/i18n/config";
import { CtaBand } from "@/components/ui/CtaBand";
import { CaseIndex } from "./CaseIndex";
import { CaseArticle } from "./CaseArticle";

/**
 * Long-form documentation layout: a document index up top, then a sticky rail
 * (case switcher, chapters, reading mode) beside the articles.
 */
export function CaseStudiesView({ locale }: { locale: Locale }) {
  const c = caseStudiesContent[locale];
  return (
    <>
      <header className="container-page pb-[clamp(3rem,6vw,5rem)] pt-[clamp(3rem,7vw,6rem)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">{c.hero.eyebrow}</p>
            <h1 className="h1">
              {c.hero.title} <span className="display-serif">{c.hero.titleEmph}</span>
            </h1>
            <p className="lede mt-6">{c.hero.lede}</p>
          </div>
          <nav aria-label={c.labels.documents} className="lg:col-span-5">
            <p className="eyebrow mb-3">{c.labels.documents}</p>
            <ol className="border-t border-ink">
              {c.cases.map((s) => (
                <li key={s.id} className="border-b border-line">
                  <a href={`#${s.id}`} className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-4">
                    <span className="font-medium leading-snug group-hover:text-accent-ink">{s.title}</span>
                    <span className="mono row-span-2 text-xs text-ink-3 transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                    <span className="mono flex items-center gap-2 text-[0.7rem] uppercase tracking-wider text-ink-3">
                      <span aria-hidden className={"size-1.5 rounded-full " + (s.kind === "demo" ? "bg-signal" : "bg-accent")} />
                      {c.labels.kind[s.kind]} · {s.service}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>

      <div
        id="case-docs"
        data-reading="full"
        className="group/doc container-page border-t border-ink pb-[clamp(4rem,8vw,7rem)] lg:grid lg:grid-cols-12 lg:gap-x-12"
      >
        <aside className="lg:col-span-3">
          <CaseIndex
            labels={c.labels}
            cases={c.cases.map((s) => ({ id: s.id, title: s.title, kind: s.kind }))}
            steps={caseStepIds.map((id) => ({ id, label: c.labels.steps[id] }))}
          />
        </aside>
        <div className="min-w-0 space-y-[clamp(5rem,10vw,8rem)] pt-10 lg:col-span-9 lg:pt-14">
          {c.cases.map((study) => (
            <CaseArticle key={study.id} study={study} labels={c.labels} />
          ))}
        </div>
      </div>

      <CtaBand locale={locale} label={c.cta.label} title={c.cta.title} body={c.cta.body} />
    </>
  );
}
