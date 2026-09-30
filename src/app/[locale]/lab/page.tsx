import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { labContent } from "@/content/lab";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageFooterNav } from "@/components/ui/PageFooterNav";
import { LabWorkbench } from "@/components/pages/lab/LabWorkbench";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, slug: "lab", ...labContent[locale].meta });
}

export default async function LabPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = labContent[locale];
  return (
    <>
      <PageHero number={7} eyebrow={t.hero.eyebrow} title={t.hero.title} lede={t.hero.lede} complexityLabel={t.hero.complexity} />
      <LabWorkbench t={t} />
      <section className="border-t border-ink" aria-labelledby="principles-title">
        <div className="container-page section grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4">{t.principles.eyebrow}</p>
            <h2 id="principles-title" className="h2">{t.principles.title}</h2>
          </div>
          <ol className="lg:col-span-7">
            {t.principles.items.map((item, i) => (
              <li key={item.title} className="grid gap-2 border-t border-line py-6 sm:grid-cols-[5rem_1fr] first:border-t-0 first:pt-0">
                <span className="mono tabular text-xs text-ink-3">0{i + 1}</span>
                <div>
                  <h3 className="h3">{item.title}</h3>
                  <p className="body-copy mt-2">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand locale={locale} label={t.cta.label} />
      <PageFooterNav locale={locale} current="lab" />
    </>
  );
}
