import type { Metadata } from "next";
import { aboutContent } from "@/content/about";
import { common } from "@/content/common";
import { buildMetadata } from "@/lib/seo";
import { resolveLocale } from "@/lib/locale";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageFooterNav } from "@/components/ui/PageFooterNav";
import { Story } from "@/components/pages/about/Story";
import { Layers } from "@/components/pages/about/Layers";
import { Principles } from "@/components/pages/about/Principles";
import { Workflow } from "@/components/pages/about/Workflow";
import { Mindset } from "@/components/pages/about/Mindset";
import { AiRole } from "@/components/pages/about/AiRole";
import { Balance } from "@/components/pages/about/Balance";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = aboutContent[locale].meta;
  return buildMetadata({ locale, slug: "about", title, description });
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const c = aboutContent[locale];
  const t = common[locale];
  return (
    <>
      <PageHero
        number={2}
        eyebrow={c.hero.eyebrow}
        title={<>{c.hero.titleA} <span className="display-serif text-accent-ink">{c.hero.titleAccent}</span></>}
        lede={c.hero.lede}
        complexityLabel={c.hero.complexity}
      />
      <Story c={c.story} />
      <Layers c={c.layers} />
      <Principles c={c.principles} />
      <Workflow c={c.workflow} />
      <Mindset c={c.mindset} />
      <AiRole c={c.ai} />
      <Balance c={c.balance} />
      <CtaBand locale={locale} label={t.cta.discussProject} />
      <PageFooterNav locale={locale} current="about" />
    </>
  );
}
