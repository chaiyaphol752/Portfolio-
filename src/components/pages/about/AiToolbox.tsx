import type { Locale } from "@/i18n/config";
import { aboutContent } from "@/content/about";

/** Where AI helps versus what stays an engineering responsibility. */
export function AiToolbox({ locale }: { locale: Locale }) {
  const c = aboutContent[locale].ai;
  return (
    <section className="container-page section" aria-labelledby="ai-toolbox-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5">{c.eyebrow}</p>
          <h2 id="ai-toolbox-title" className="h2 max-w-[16ch]">{c.title}</h2>
          <p className="body-copy mt-6">{c.body}</p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
          <div>
            <h3 className="eyebrow border-b border-ink pb-3">{c.helpsTitle}</h3>
            <ul>
              {c.helps.map((h) => (
                <li key={h} className="border-b border-line py-3 text-[0.95rem]">{h}</li>
              ))}
            </ul>
          </div>
          <div className="night on-night self-start rounded-md p-6">
            <h3 className="eyebrow pb-3">{c.staysTitle}</h3>
            <dl>
              {c.stays.map((s) => (
                <div key={s.title} className="border-t border-night-line py-4">
                  <dt className="font-medium text-night-ink">{s.title}</dt>
                  <dd className="mt-1 text-sm text-night-mute">{s.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
