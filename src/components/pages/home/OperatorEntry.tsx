import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { operatorContent } from "@/content/operator";
import { OperatorFigure } from "@/components/pages/operator/OperatorFigure";
import s from "./OperatorEntry.module.css";

/** A portal into Operator: the visor's line of light runs out of the image into the invitation. */
export function OperatorEntry({ locale }: { locale: Locale }) {
  const t = operatorContent[locale].entry;
  const href = localizedPath(locale, "operator");
  return (
    <section className={s.entry} aria-labelledby="operator-entry-title">
      <div className={s.inner}>
        <div className={s.visual} aria-hidden>
          <OperatorFigure uid="entry" className={s.figure} />
          <span className={s.beam} />
        </div>
        <div className={s.copy}>
          <p className={s.eyebrow}>
            <span className={s.dot} aria-hidden />
            {t.eyebrow}
          </p>
          <h2 id="operator-entry-title" className={s.title}>{t.title}</h2>
          <p className={s.body}>{t.body}</p>
          <Link href={href} className={s.link}>
            {t.cta}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
