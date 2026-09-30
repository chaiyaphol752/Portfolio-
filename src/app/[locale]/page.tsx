import type { Metadata } from "next";
import { homeContent } from "@/content/home";
import { buildMetadata } from "@/lib/seo";
import { resolveLocale } from "@/lib/locale";
import { profile } from "@/config/profile";
import { HomeHero } from "@/components/pages/home/HomeHero";
import { SiteMap } from "@/components/pages/home/SiteMap";
import { PageFooterNav } from "@/components/ui/PageFooterNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = homeContent[locale].meta;
  // The home page uses the full positioning line instead of the "%s — Name" template.
  return { ...buildMetadata({ locale, slug: "", title, description }), title: { absolute: `${profile.name} — ${title}` } };
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);
  return (
    <>
      <HomeHero locale={locale} />
      <SiteMap locale={locale} />
      <PageFooterNav locale={locale} current="home" />
    </>
  );
}
