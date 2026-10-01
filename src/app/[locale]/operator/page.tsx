import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { operatorContent } from "@/content/operator";
import { OperatorExperience } from "@/components/pages/operator/OperatorExperience";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = operatorContent[locale].meta;
  return buildMetadata({ locale, slug: "operator", title, description });
}

export default async function OperatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  return <OperatorExperience locale={locale} />;
}
