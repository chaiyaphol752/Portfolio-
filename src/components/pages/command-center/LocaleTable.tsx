import { locales, localeMeta } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { pages } from "@/config/pages";
import type { CommandCenterContent } from "@/content/command-center";

/** Overview of the three supported locales; wrapped so narrow screens scroll inside the table box only. */
export function LocaleTable({ copy }: { copy: CommandCenterContent["overview"] }) {
  const cols = copy.cols;
  return (
    <div className="overflow-x-auto border-y border-ink" tabIndex={0} role="region" aria-label={copy.caption}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="sr-only">{copy.caption}</caption>
        <thead>
          <tr className="border-b border-line">
            {[cols.language, cols.prefix, cols.html, cols.pages, cols.sample].map((c) => (
              <th key={c} scope="col" className="eyebrow py-3 pr-6 font-normal">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {locales.map((l) => (
            <tr key={l} className="border-b border-line last:border-b-0">
              <th scope="row" className="py-4 pr-6 font-medium" lang={localeMeta[l].htmlLang}>
                {localeMeta[l].name} <span className="mono ml-1 text-xs text-ink-3">{localeMeta[l].label}</span>
              </th>
              <td className="mono py-4 pr-6 text-[0.8rem]">/{l}</td>
              <td className="mono py-4 pr-6 text-[0.8rem]">{localeMeta[l].htmlLang}</td>
              <td className="mono tabular py-4 pr-6 text-[0.8rem]">{pages.length}</td>
              <td className="mono py-4 pr-6 text-[0.8rem]">{localizedPath(l, "command-center")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
