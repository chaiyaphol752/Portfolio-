import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { labContent } from "@/content/lab";
import { buildMetadata } from "@/lib/seo";
import { CtaBand } from "@/components/ui/CtaBand";
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
      {/* Compact app-style header: the tools are the page, not the intro. */}
      <div className="grid-paper border-b border-line">
        <div className="container-page pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(2rem,4vw,3.5rem)]">
          <div className="flex flex-col gap-6 border-b border-ink pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">{t.hero.eyebrow}</p>
              <h1 className="h1">{t.hero.title}</h1>
            </div>
            <p className="max-w-[46ch] text-ink-2 md:text-right">{t.hero.lede}</p>
          </div>
          <div className="mt-8">
            <LabWorkbench t={t} />
          </div>
        </div>
      </div>

      <section aria-labelledby="principles-title" className="container-page py-[clamp(3rem,6vw,5rem)]">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="eyebrow mb-3">{t.principles.eyebrow}</p>
            <h2 id="principles-title" className="text-[1.5rem] font-medium leading-tight tracking-tight">{t.principles.title}</h2>
          </div>
          <dl className="grid gap-px border-y border-line bg-line sm:grid-cols-3 lg:col-span-9">
            {t.principles.items.map((item) => (
              <div key={item.title} className="bg-paper py-5 sm:px-5">
                <dt className="mono text-[0.78rem] font-semibold uppercase tracking-wider">{item.title}</dt>
                <dd className="mt-2 text-sm text-ink-2">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand locale={locale} label={t.cta.label} />
    </>
  );
}
