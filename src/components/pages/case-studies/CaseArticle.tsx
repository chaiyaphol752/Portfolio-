import { caseStepIds, type CaseContent, type CaseStudiesContent } from "@/content/case-studies";
import { Diagram } from "./Diagram";

interface Props {
  study: CaseContent;
  labels: CaseStudiesContent["labels"];
}

/** Elements marked as technical detail collapse when the reader picks the client overview. */
const detail = "group-data-[reading=overview]/doc:hidden";

export function CaseArticle({ study, labels }: Props) {
  const titleId = `${study.id}-title`;
  return (
    <article id={study.id} aria-labelledby={titleId} className="scroll-mt-[calc(var(--header-h)+4.5rem)] lg:scroll-mt-[calc(var(--header-h)+2rem)]">
      <header>
        <p className="mono flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] uppercase tracking-wider text-ink-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink px-3 py-1">
            <span aria-hidden className={"size-1.5 rounded-full " + (study.kind === "demo" ? "bg-signal" : "bg-accent")} />
            {labels.kind[study.kind]}
          </span>
          <span>
            {labels.service}: {study.service}
          </span>
        </p>
        <h2 id={titleId} className="h1 mt-7 max-w-[18ch]">{study.title}</h2>
        <p className="lede mt-5 max-w-[56ch]">{study.tagline}</p>
        <dl className="mt-9 grid border-y border-ink sm:grid-cols-3">
          {study.facts.map((f) => (
            <div key={f.label} className="border-b border-line py-4 sm:border-b-0 sm:border-r sm:pr-5">
              <dt className="eyebrow">{f.label}</dt>
              <dd className="mt-1.5 text-sm">{f.value}</dd>
            </div>
          ))}
          <div className="py-4 sm:pl-5">
            <dt className="eyebrow">{labels.stack}</dt>
            <dd className="mono mt-1.5 text-[0.78rem] leading-relaxed text-ink-2">{study.stack.join(" · ")}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-ink-3">{labels.kindNote[study.kind]}</p>
      </header>

      <div className="mt-12">
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
              className="grid scroll-mt-[calc(var(--header-h)+4.5rem)] gap-x-8 gap-y-3 border-t border-line py-9 md:grid-cols-[11rem_minmax(0,1fr)] lg:scroll-mt-[calc(var(--header-h)+2rem)]"
            >
              <div>
                <p className="mono text-xs text-accent-ink">§{i + 1}</p>
                <h3 id={headingId} className="mt-1 text-[1.05rem] font-semibold tracking-tight">{labels.steps[stepId]}</h3>
              </div>
              <div className="min-w-0">
                <p className="sr-only">{labels.forClients}:</p>
                <p className="max-w-[46ch] text-[clamp(1.15rem,1.7vw,1.4rem)] font-medium leading-snug tracking-tight text-pretty">{section.client}</p>
                <div className={`mt-6 ${detail}`}>
                  <p className="eyebrow mb-2">{labels.technical}</p>
                  <p className="body-copy">{section.body}</p>
                  {section.points.length > 0 && (
                    <ul className="mt-4 max-w-[62ch] space-y-2.5">
                      {section.points.map((point) => (
                        <li key={point} className="flex gap-3 text-ink-2">
                          <span aria-hidden className="mt-[0.8em] h-px w-3 shrink-0 bg-accent" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {diagram && (
                    <div className="mt-9">
                      <Diagram
                        diagram={diagram}
                        label={labels.diagram}
                        id={`${study.id}-${stepId}-diagram`}
                        tone={diagram.kind === "tree" ? "paper" : "night"}
                        columns={diagram.kind === "flow" && diagram.nodes.length === 4 ? 4 : 3}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
