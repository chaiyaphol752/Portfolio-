import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { commandCenterContent } from "@/content/command-center";
import { CommandCenterPage } from "@/components/pages/command-center/CommandCenterPage";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, slug: "command-center", ...commandCenterContent[locale].meta });
}

export default async function Page({ params }: Props) {
  const locale = await resolveLocale(params);
  return <CommandCenterPage locale={locale} />;
}
