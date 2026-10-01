import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { contactContent } from "@/content/contact";
import { ContactView } from "@/components/pages/contact/ContactView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata({ locale, slug: "contact", ...contactContent[locale].meta });
}

export default async function ContactPage({ params }: Props) {
  const locale = await resolveLocale(params);
  return <ContactView locale={locale} />;
}
