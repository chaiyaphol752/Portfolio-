import type { SystemsContent } from "@/content/systems";

const STATE_TYPE = `type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; fieldErrors }
  | { status: "rate-limited"; retryAfterSec }
  | { status: "unavailable" }
  | { status: "error" };`;

/**
 * Request flow as a semantic ordered list, so the diagram is also its own text alternative.
 * Vertical timeline on small screens, horizontal pipeline on wide ones.
 */
export function ArchitectureDiagram({ t }: { t: SystemsContent["architecture"] }) {
  return (
    <div>
      <p className="sr-only">{t.summary}</p>
      <ol className="grid xl:grid-cols-6" aria-label={t.title}>
        {t.steps.map((step, i) => (
          <li
            key={step.title}
            className="relative border-l border-night-line pb-9 pl-8 last:pb-0 xl:border-l-0 xl:border-t xl:pb-0 xl:pl-0 xl:pr-6 xl:pt-8"
          >
            <span
              aria-hidden
              className="mono absolute -left-[13px] top-0 grid size-[26px] place-items-center rounded-full border border-accent bg-night text-[0.65rem] text-accent xl:-top-[13px] xl:left-0"
            >
              {i + 1}
            </span>
            {i < t.steps.length - 1 && (
              <span aria-hidden className="absolute -right-1 top-[-5px] hidden size-2.5 rotate-45 border-r border-t border-night-mute xl:block" />
            )}
            <p className="eyebrow">{step.tag}</p>
            <h3 className="mt-2 text-xl font-medium tracking-tight">{step.title}</h3>
            <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-night-mute">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-10 border-t border-night-line pt-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h3 className="eyebrow mb-4">{t.guards.title}</h3>
          <ul className="space-y-2.5">
            {t.guards.items.map((item) => (
              <li key={item} className="flex items-baseline gap-3 text-sm">
                <span aria-hidden className="mono text-accent">+</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mono mt-8 max-w-[40ch] text-xs leading-relaxed text-night-mute">{t.sideRoute}</p>
        </div>
        <pre tabIndex={0} aria-label="ContactState" className="mono overflow-x-auto rounded bg-night-2 p-5 text-[0.78rem] leading-relaxed text-night-ink lg:col-span-7">
          {STATE_TYPE}
        </pre>
      </div>
    </div>
  );
}
