import type { Locale } from "@/i18n/config";
import { aboutContent } from "@/content/about";

/** Education and languages: simple facts, no invented certificates. */
export function Background({ locale }: { locale: Locale }) {
  const c = aboutContent[locale].background;
  return (
    <section className="border-t border-line bg-paper-2/60" aria-labelledby="background-title">
      <div className="container-page section">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-5">{c.eyebrow}</p>
            <h2 id="background-title" className="h2">{c.title}</h2>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="eyebrow border-b border-ink pb-3">{c.education.title}</h3>
            <p className="mt-5 text-[1.15rem] font-medium tracking-tight">{c.education.degree}</p>
            <p className="mt-1 text-ink-2">{c.education.school}</p>
            <p className="mt-4 max-w-[52ch] text-sm text-ink-3">{c.education.note}</p>
          </div>
          <div>
            <h3 className="eyebrow border-b border-ink pb-3">{c.languages.title}</h3>
            <dl>
              {c.languages.items.map((l) => (
                <div key={l.language} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[minmax(0,9rem)_1fr] sm:gap-6">
                  <dt className="font-medium">{l.language}</dt>
                  <dd className="text-[0.95rem] text-ink-2">{l.level}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
