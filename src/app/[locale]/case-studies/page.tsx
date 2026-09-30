import type { Metadata } from "next";
import { caseStudiesContent } from "@/content/case-studies";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { CaseStudiesView } from "@/components/pages/case-studies/CaseStudiesView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, slug: "case-studies", ...caseStudiesContent[locale].meta });
}

export default async function CaseStudiesPage({ params }: Props) {
  return <CaseStudiesView locale={await resolveLocale(params)} />;
}
