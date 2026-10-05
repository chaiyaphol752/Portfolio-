import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { projectsContent } from "@/content/projects";
import { homeContent } from "@/content/home";
import { common } from "@/content/common";
import { projectsMeta, type ProjectId } from "@/components/pages/projects/data";

/** The two strongest projects, shown directly on the home page for fast recruiter scanning. */
export function FeaturedProjects({ locale }: { locale: Locale }) {
  const t = projectsContent[locale];
  const h = homeContent[locale].featured;
  const c = common[locale];
  const featured = (["wat-charoen-dham", "android-app"] as const).map((id) => projectsMeta.find((p) => p.id === id)!);
  const live = featured.find((p) => p.kind === "live");
  const href = (id: ProjectId) => `${localizedPath(locale, "projects")}#project-${id}`;

  return (
    <section className="border-t border-line bg-paper-2/60" aria-labelledby="featured-title">
      <div className="container-page section">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-5">{h.eyebrow}</p>
            <h2 id="featured-title" className="h2">{h.title}</h2>
          </div>
          <p className="body-copy lg:col-span-5 lg:col-start-8">
            {live ? t.projects[live.id].tagline : ""}
          </p>
        </div>

        <ul className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {featured.map((p) => (
            <li key={p.id} className="group relative bg-paper p-6 sm:p-8">
              <span
                className={
                  "mono inline-flex rounded-sm px-2 py-1 text-[0.66rem] uppercase tracking-wider " +
                  (p.kind === "live" ? "bg-accent text-paper" : "border border-ink text-ink")
                }
              >
                {t.kind[p.kind]}
              </span>
              <h3 className="mt-4 text-[1.4rem] font-medium leading-tight tracking-tight">{p.name}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{t.projects[p.id].tagline}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link href={href(p.id)} className="group/link inline-flex min-h-11 items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-paper">
                  {c.cta.viewWork}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                {p.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="group/link inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent-ink">
                    <span className="link-underline">{t.detail[l.kind]}</span>
                    <ArrowUpRight className="size-4" aria-hidden />
                    <span className="sr-only"> ({c.externalLink})</span>
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
