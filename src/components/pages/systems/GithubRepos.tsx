import { Star } from "lucide-react";
import type { SystemsContent } from "@/content/systems";
import type { Locale } from "@/i18n/config";
import type { RepoResult } from "@/lib/github/repos";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { common } from "@/content/common";

interface Props {
  t: SystemsContent["github"];
  locale: Locale;
  result: RepoResult;
  profileUrl: string;
}

export function GithubRepos({ t, locale, result, profileUrl }: Props) {
  const hint = common[locale].externalLink;
  const tag = locale === "th" ? "th-TH-u-ca-gregory" : locale;
  const format = new Intl.DateTimeFormat(tag, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div>
      {result.status === "error" && <p className="border-y border-line py-6 text-ink-2">{t.failed}</p>}
      {result.status === "ok" && result.repos.length === 0 && <p className="border-y border-line py-6 text-ink-2">{t.empty}</p>}
      {result.repos.length > 0 && (
        <ul className="border-t border-ink">
          {result.repos.map((repo) => (
            <li key={repo.url} className="grid gap-x-8 gap-y-2 border-b border-line py-5 sm:grid-cols-12">
              <h3 className="h3 sm:col-span-4">
                <ExternalLink href={repo.url} hint={hint} className="inline-flex min-h-11 items-center break-words underline decoration-line underline-offset-4 hover:decoration-ink sm:min-h-0">{repo.name}</ExternalLink>
              </h3>
              <p className="body-copy text-sm sm:col-span-5">{repo.description ?? t.noDescription}</p>
              <p className="mono flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.75rem] text-ink-2 sm:col-span-3 sm:justify-end">
                {repo.language && <span>{repo.language}</span>}
                <span className="inline-flex items-center gap-1" aria-label={`${repo.stars} ${t.stars}`}>
                  <Star className="size-3.5" aria-hidden />
                  {repo.stars}
                </span>
                {repo.pushedAt && (
                  <span className="text-ink-3">
                    {t.updated} <time dateTime={repo.pushedAt}>{format.format(new Date(repo.pushedAt))}</time>
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6">
        <ExternalLink href={profileUrl} hint={hint} className="inline-flex min-h-11 items-center text-sm font-medium underline decoration-line underline-offset-4 hover:decoration-ink">{t.profile}</ExternalLink>
      </p>
    </div>
  );
}
