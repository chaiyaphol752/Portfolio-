import type { Metadata } from "next";
import { aboutContent } from "@/content/about";
import { common } from "@/content/common";
import { buildMetadata } from "@/lib/seo";
import { resolveLocale } from "@/lib/locale";
import { CtaBand } from "@/components/ui/CtaBand";
import { AboutIntro } from "@/components/pages/about/AboutIntro";
import { LayerStack } from "@/components/pages/about/LayerStack";
import { Background } from "@/components/pages/about/Background";
import { AiToolbox } from "@/components/pages/about/AiToolbox";
import { WorkingTogether } from "@/components/pages/about/WorkingTogether";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = aboutContent[locale].meta;
  return buildMetadata({ locale, slug: "about", title, description });
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const c = aboutContent[locale];
  return (
    <>
      <AboutIntro locale={locale} />
      <LayerStack locale={locale} />
      <Background locale={locale} />
      <AiToolbox locale={locale} />
      <WorkingTogether locale={locale} />
      <CtaBand locale={locale} title={c.closing.title} body={c.closing.body} label={common[locale].cta.tellMe} />
    </>
  );
}
