import { caseStepIds, type CaseContent, type CaseStudiesContent } from "@/content/case-studies";
import { Diagram } from "./Diagram";

interface Props {
  study: CaseContent;
  labels: CaseStudiesContent["labels"];
}

export function CaseArticle({ study, labels }: Props) {
  const titleId = `${study.id}-title`;
  return (
    <article id={study.id} aria-labelledby={titleId}>
      <header className="border-t-2 border-ink pt-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-ink-2">
            <span aria-hidden className={"size-2 rounded-full " + (study.kind === "demo" ? "bg-signal" : "bg-accent")} />
            {labels.kind[study.kind]}
          </p>
          <p className="eyebrow">{labels.kindNote[study.kind]}</p>
        </div>
        <h2 id={titleId} className="h1 mt-7 max-w-[20ch]">{study.title}</h2>
        <p className="lede mt-5">{study.tagline}</p>
        <dl className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-[1fr_2fr]">
          <div>
            <dt className="eyebrow">{labels.status}</dt>
            <dd className="mt-1.5 text-sm text-ink-2">{study.status}</dd>
          </div>
          <div>
            <dt className="eyebrow">{labels.stack}</dt>
            <dd className="mono mt-1.5 text-sm text-ink-2">{study.stack.join(" · ")}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-12 divide-y divide-line border-y border-line">
        {caseStepIds.map((stepId, i) => {
          const section = study.sections[stepId];
          const diagram = study.diagrams[stepId];
          const headingId = `${study.id}-${stepId}-heading`;
          return (
            <section
              key={stepId}
              id={`${study.id}-${stepId}`}
              data-case-step
              data-case={study.id}
              data-step={stepId}
              aria-labelledby={`${headingId} ${titleId}`}
              className="grid gap-4 py-10 md:grid-cols-12 md:gap-x-8"
            >
              <div className="md:col-span-3">
                <p className="eyebrow tabular">{String(i + 1).padStart(2, "0")}</p>
                <h3 id={headingId} className="h3 mt-1">{labels.steps[stepId]}</h3>
              </div>
              <div className="min-w-0 md:col-span-9">
                <p className="body-copy">{section.body}</p>
                {section.points.length > 0 && (
                  <ul className="mt-5 max-w-[62ch] space-y-3">
                    {section.points.map((point) => (
                      <li key={point} className="flex gap-3 text-ink-2">
                        <span aria-hidden className="mt-[0.85em] h-px w-3 shrink-0 bg-ink-3" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {diagram && (
                  <div className="mt-10">
                    <Diagram diagram={diagram} label={labels.diagram} id={`${study.id}-${stepId}-diagram`} />
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
