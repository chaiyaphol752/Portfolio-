import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import type { ProjectsContent } from "@/content/projects";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ExternalLink } from "@/components/ui/ExternalLink";
import type { ProjectMeta } from "./data";
import { ProjectPreview } from "./ProjectPreview";

interface Props {
  meta: ProjectMeta;
  content: ProjectsContent;
  locale: Locale;
  externalHint: string;
  /** The desktop panel shows the project name; the mobile accordion already has it in the row. */
  showTitle?: boolean;
}

export function KindBadge({ kind, label }: { kind: ProjectMeta["kind"]; label: string }) {
  return (
    <span
      className={
        "mono inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.68rem] uppercase tracking-wider " +
        (kind === "demo" ? "border-accent bg-accent text-white" : "border-ink text-ink")
      }
    >
      {label}
    </span>
  );
}

export function ProjectDetail({ meta, content, locale, externalHint, showTitle }: Props) {
  const copy = content.projects[meta.id];
  const d = content.detail;
  return (
    <article className="pb-2">
      <header>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <KindBadge kind={meta.kind} label={content.kind[meta.kind]} />
          <span className="eyebrow">{meta.categories.map((c) => content.categories[c]).join(" · ")}</span>
        </div>
        {showTitle && <h3 className="h2 mt-4">{meta.name}</h3>}
        <p className="lede mt-3">{copy.tagline}</p>
      </header>

      <div className="mt-8">
        <h4 className="sr-only">{d.preview}</h4>
        <ProjectPreview name={meta.name} variant={meta.preview} label={d.preview} note={d.previewNote} />
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <section>
          <h4 className="eyebrow mb-2 border-t border-ink pt-3">{d.problem}</h4>
          <p className="body-copy">{copy.problem}</p>
        </section>
        <section>
          <h4 className="eyebrow mb-2 border-t border-ink pt-3">{d.solution}</h4>
          <p className="body-copy">{copy.solution}</p>
        </section>
      </div>

      <section className="mt-10">
        <h4 className="eyebrow mb-3 border-t border-ink pt-3">{d.decisions}</h4>
        <ol className="space-y-4">
          {copy.decisions.map((text, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] gap-2">
              <span className="mono tabular text-xs text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
              <p className="body-copy">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h4 className="eyebrow mb-3 border-t border-ink pt-3">{d.stack}</h4>
        <ul className="mono flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {meta.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <ButtonLink href={`${localizedPath(locale, "systems")}#contact`} variant="ghost">
          {d.discuss}
        </ButtonLink>
        {meta.links.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {meta.links.map((link) => (
              <li key={link.url}>
                <ExternalLink href={link.url} hint={externalHint} className="link-underline text-sm font-medium">
                  {d.source}
                </ExternalLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
