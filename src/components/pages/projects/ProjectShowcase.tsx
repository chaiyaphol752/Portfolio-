import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import type { ProjectsContent } from "@/content/projects";
import type { CommonContent } from "@/content/common";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { ProjectMeta } from "./data";
import { ProjectPreview } from "./ProjectPreview";

interface Props {
  project: ProjectMeta;
  t: ProjectsContent;
  common: CommonContent;
  locale: Locale;
}

function Labels({ project, t, dark }: { project: ProjectMeta; t: ProjectsContent; dark?: boolean }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span
        className={clsx(
          "mono rounded-sm px-2 py-1 text-[0.66rem] uppercase tracking-wider",
          project.kind === "demo" ? "bg-accent-ink text-white" : dark ? "border border-night-line text-night-ink" : "border border-ink text-ink",
        )}
      >
        {t.kind[project.kind]}
      </span>
      <span className={clsx("mono text-[0.7rem] uppercase tracking-wider", dark ? "text-night-mute" : "text-ink-3")}>
        {project.categories.map((c) => t.categories[c]).join(" · ")}
      </span>
    </p>
  );
}

function Facts({ project, t, dark, cols = false }: { project: ProjectMeta; t: ProjectsContent; dark?: boolean; cols?: boolean }) {
  const copy = t.projects[project.id];
  const mute = dark ? "text-night-mute" : "text-ink-2";
  return (
    <div className={clsx("grid gap-8", cols && "md:grid-cols-3")}>
      <div>
        <h3 className="eyebrow mb-2">{t.detail.problem}</h3>
        <p className={clsx("text-[0.95rem] leading-relaxed", mute)}>{copy.problem}</p>
      </div>
      <div>
        <h3 className="eyebrow mb-2">{t.detail.solution}</h3>
        <p className={clsx("text-[0.95rem] leading-relaxed", mute)}>{copy.solution}</p>
      </div>
      <div>
        <h3 className="eyebrow mb-3">{t.detail.decisions}</h3>
        <ol className="space-y-3">
          {copy.decisions.map((d, i) => (
            <li key={i} className={clsx("grid grid-cols-[1.5rem_1fr] gap-2 text-[0.9rem] leading-relaxed", mute)}>
              <span aria-hidden className={clsx("mono pt-0.5 text-xs", dark ? "text-accent" : "text-accent-ink")}>{String.fromCharCode(97 + i)}.</span>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Stack({ project, t, dark }: { project: ProjectMeta; t: ProjectsContent; dark?: boolean }) {
  return (
    <div>
      <h3 className="eyebrow mb-2">{t.detail.stack}</h3>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {project.stack.map((s) => (
          <li key={s} className={clsx("mono text-[0.78rem]", dark ? "text-night-ink" : "text-ink")}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

function Actions({ project, t, common, locale, dark }: Props & { dark?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonLink href={localizedPath(locale, "contact")} variant={dark ? "primary" : "ghost"}>
        {common.cta[project.cta]}
      </ButtonLink>
      {project.links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx("btn", dark ? "btn-ghost" : "btn-ghost border-transparent")}
        >
          {t.detail.source}
          <ArrowUpRight className="size-4" aria-hidden />
          <span className="sr-only"> ({common.externalLink})</span>
        </a>
      ))}
    </div>
  );
}

function Title({ project, t, size = "h1", dark }: { project: ProjectMeta; t: ProjectsContent; size?: "h1" | "h2"; dark?: boolean }) {
  return (
    <>
      <h2 id={`project-${project.id}-title`} className={clsx(size, "mt-5")}>{project.name}</h2>
      <p className={clsx("mt-4 max-w-[46ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-snug", dark ? "text-night-ink" : "text-ink-2")}>{t.projects[project.id].tagline}</p>
    </>
  );
}

/** One project, rendered in the composition its `layout` asks for. */
export function ProjectShowcase(props: Props) {
  const { project, t } = props;
  const caption = project.preview === "circuit" ? t.detail.circuitNote : t.detail.previewNote;
  const preview = (phone = true) => <ProjectPreview name={project.name} variant={project.preview} caption={caption} labels={t.detail} phone={phone} />;
  const labelledBy = `project-${project.id}-title`;

  switch (project.layout) {
    case "flagship":
      return (
        <article aria-labelledby={labelledBy} className="night on-night">
          <div className="container-page section">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Labels project={project} t={t} dark />
                <Title project={project} t={t} dark />
              </div>
              <div className="lg:col-span-5">
                <Actions {...props} dark />
              </div>
            </div>
            <div className="mt-12 grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-8">{preview(false)}</div>
              <div className="space-y-8 lg:col-span-4">
                <Facts project={project} t={t} dark />
                <Stack project={project} t={t} dark />
              </div>
            </div>
          </div>
        </article>
      );

    case "split":
      return (
        <article aria-labelledby={labelledBy} className="border-t border-ink bg-paper-2">
          <div className="grid lg:grid-cols-2">
            <div className="container-page section lg:max-w-none lg:pr-12">
              <Labels project={project} t={t} />
              <Title project={project} t={t} size="h2" />
              <div className="mt-10 space-y-8">
                <Facts project={project} t={t} />
                <Stack project={project} t={t} />
                <Actions {...props} />
              </div>
            </div>
            <div className="grid-paper flex items-center border-t border-ink px-[var(--gutter)] py-12 lg:border-l lg:border-t-0 lg:px-12">
              <div className="w-full lg:sticky lg:top-[calc(var(--header-h)+2rem)]">{preview(project.preview !== "before-after")}</div>
            </div>
          </div>
        </article>
      );

    case "offset-left":
    case "offset-right": {
      const left = project.layout === "offset-left";
      return (
        <article aria-labelledby={labelledBy} className="border-t border-ink">
          <div className="container-page section grid gap-12 lg:grid-cols-12">
            <div className={clsx("lg:col-span-7", left ? "lg:order-1" : "lg:order-2")}>{preview()}</div>
            <div className={clsx("lg:col-span-5", left ? "lg:order-2 lg:pt-24" : "lg:order-1")}>
              <Labels project={project} t={t} />
              <Title project={project} t={t} size="h2" />
              <div className="mt-10 space-y-8">
                <Facts project={project} t={t} />
                <Stack project={project} t={t} />
                <Actions {...props} />
              </div>
            </div>
          </div>
        </article>
      );
    }

    case "frame":
      return (
        <article aria-labelledby={labelledBy} className="border-t border-ink">
          <div className="container-page section">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Labels project={project} t={t} />
                <Title project={project} t={t} size="h2" />
              </div>
              <div className="lg:col-span-5 lg:justify-self-end">
                <Actions {...props} />
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-5xl">{preview()}</div>
            <div className="mt-14 border-t border-line pt-10">
              <Facts project={project} t={t} cols />
              <div className="mt-8">
                <Stack project={project} t={t} />
              </div>
            </div>
          </div>
        </article>
      );

    case "schematic":
      return (
        <article aria-labelledby={labelledBy} className="grid-paper border-t border-ink">
          <div className="container-page section grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Labels project={project} t={t} />
              <Title project={project} t={t} size="h2" />
              <div className="mt-10 space-y-8">
                <Facts project={project} t={t} />
                <Stack project={project} t={t} />
                <Actions {...props} />
              </div>
            </div>
            <div className="lg:col-span-7 lg:pt-10">{preview(false)}</div>
          </div>
        </article>
      );
  }
}
