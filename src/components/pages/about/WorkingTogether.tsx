import type { Locale } from "@/i18n/config";
import { aboutContent } from "@/content/about";

export function WorkingTogether({ locale }: { locale: Locale }) {
  const c = aboutContent[locale].working;
  return (
    <section className="border-t border-line" aria-labelledby="working-title">
      <div className="container-page section grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-5">{c.eyebrow}</p>
          <h2 id="working-title" className="h2">{c.title}</h2>
        </div>
        <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {c.items.map((item) => (
            <div key={item.title} className="border-t border-ink py-6">
              <dt className="h3">{item.title}</dt>
              <dd className="mt-2 text-ink-2">{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
