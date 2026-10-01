/* eslint-disable @next/next/no-img-element -- a static, pre-generated SVG needs no image optimisation */
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { common } from "@/content/common";
import { homeContent } from "@/content/home";
import { interpolate } from "@/lib/interpolate";
import { ButtonLink } from "@/components/ui/ButtonLink";
import circuit from "@/generated/ai-circuit.json";

/** Teaser for the AI systems page, showing the Python-generated circuit as a static image. */
export function AiTeaser({ locale }: { locale: Locale }) {
  const c = homeContent[locale].ai;
  const t = common[locale];
  const [, , w, h] = circuit.viewBox;

  return (
    <section className="night on-night" aria-labelledby="ai-teaser-title">
      <div className="container-page section grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-5">{c.eyebrow}</p>
          <h2 id="ai-teaser-title" className="h2">{c.title}</h2>
          <p className="mt-6 text-night-mute">{c.body}</p>
          <p className="mono mt-6 border-l border-accent pl-4 text-xs leading-relaxed text-night-mute">
            {interpolate(c.generated, { nodes: circuit.meta.nodeCount, edges: circuit.meta.edgeCount })}
            <br />
            <span className="text-night-ink">{circuit.meta.generator}</span>
          </p>
          <div className="mt-8">
            <ButtonLink href={localizedPath(locale, "ai-native")}>{t.cta.exploreAi}</ButtonLink>
          </div>
        </div>
        <figure className="lg:col-span-8">
          <div className="overflow-hidden rounded-md border border-night-line">
            <img src="/generated/ai-circuit.svg" alt={c.imageAlt} width={w} height={h} loading="lazy" decoding="async" className="block h-auto w-full" />
          </div>
        </figure>
      </div>
    </section>
  );
}
