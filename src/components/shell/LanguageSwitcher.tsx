"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/remember";
import { switchLocalePath } from "@/i18n/routing";

interface Props {
  locale: Locale;
  label: string;
  className?: string;
}

/** Keeps the visitor on the same page when switching language and remembers the choice. */
export function LanguageSwitcher({ locale, label, className }: Props) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-px rounded-full border border-line p-0.5 text-[0.72rem] font-medium">
        {locales.map((l) => {
          const active = l === locale;
          return (
            <li key={l}>
              <Link
                href={switchLocalePath(pathname, l)}
                hrefLang={localeMeta[l].htmlLang}
                lang={localeMeta[l].htmlLang}
                aria-current={active ? "true" : undefined}
                aria-label={localeMeta[l].name}
                onClick={() => rememberLocale(l)}
                className={
                  "mono flex h-8 min-w-9 items-center justify-center rounded-full px-2 tracking-wider transition-colors " +
                  (active ? "bg-ink text-paper" : "text-ink-2 hover:text-ink")
                }
              >
                {localeMeta[l].label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
