import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { PageId } from "@/config/pages";
import { localizedPath } from "@/i18n/routing";
import { common } from "@/content/common";
import { homeContent } from "@/content/home";

const proofPages: PageId[] = ["projects", "case-studies", "lab", "systems"];

/** Links into the proof-of-work pages, described by their real navigation hints. */
export function WorkTeaser({ locale }: { locale: Locale }) {
  const c = homeContent[locale].work;
  const t = common[locale];
  return (
    <section className="border-t border-line" aria-labelledby="work-title">
      <div className="container-page section grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-5">{c.eyebrow}</p>
          <h2 id="work-title" className="h2 max-w-[14ch]">{c.title}</h2>
          <p className="body-copy mt-5">{c.body}</p>
        </div>
        <ul className="border-t border-ink lg:col-span-8">
          {proofPages.map((id) => (
            <li key={id} className="border-b border-line">
              <Link href={localizedPath(locale, id)} className="group grid items-baseline gap-1 py-5 sm:grid-cols-[1fr_auto] sm:gap-6 sm:py-6">
                <span className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent-ink">
                  {t.nav[id]}
                </span>
                <span className="flex items-center gap-3 text-sm text-ink-2">
                  {t.navHint[id]}
                  <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
