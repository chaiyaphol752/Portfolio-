import type { Metadata } from "next";
import { aiNativeContent } from "@/content/ai-native";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { AiNativeView } from "@/components/pages/ai-native/AiNativeView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, slug: "ai-native", ...aiNativeContent[locale].meta });
}

export default async function AiNativePage({ params }: Props) {
  return <AiNativeView locale={await resolveLocale(params)} />;
}
