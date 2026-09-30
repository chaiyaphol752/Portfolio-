"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { common } from "@/content/common";
import { parsePathname, localizedPath } from "@/i18n/routing";
import { defaultLocale } from "@/i18n/config";

export default function NotFound() {
  const locale = parsePathname(usePathname()).locale ?? defaultLocale;
  const t = common[locale].notFound;
  return (
    <section className="container-page section">
      <p className="eyebrow mb-6">404</p>
      <h1 className="h1 max-w-[16ch]">{t.title}</h1>
      <p className="lede mt-6">{t.body}</p>
      <div className="mt-10">
        <ButtonLink href={localizedPath(locale)}>{t.cta}</ButtonLink>
      </div>
    </section>
  );
}
