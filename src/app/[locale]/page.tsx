import type { Metadata } from "next";
import { homeContent } from "@/content/home";
import { buildMetadata } from "@/lib/seo";
import { resolveLocale } from "@/lib/locale";
import { profile } from "@/config/profile";
import { common } from "@/content/common";
import { CtaBand } from "@/components/ui/CtaBand";
import { HomeHero } from "@/components/pages/home/HomeHero";
import { Services } from "@/components/pages/home/Services";
import { AiTeaser } from "@/components/pages/home/AiTeaser";
import { Process } from "@/components/pages/home/Process";
import { WorkTeaser } from "@/components/pages/home/WorkTeaser";
import { OperatorEntry } from "@/components/pages/home/OperatorEntry";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = homeContent[locale].meta;
  // The home page uses the full positioning line instead of the "%s — Name" template.
  return { ...buildMetadata({ locale, slug: "", title, description }), title: { absolute: `${profile.name} — ${title}` } };
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const c = homeContent[locale];
  return (
    <>
      <HomeHero locale={locale} />
      <Services locale={locale} />
      <AiTeaser locale={locale} />
      <OperatorEntry locale={locale} />
      <Process locale={locale} />
      <WorkTeaser locale={locale} />
      <CtaBand locale={locale} title={c.closing.title} body={c.closing.body} label={common[locale].cta.startProject} />
    </>
  );
}
