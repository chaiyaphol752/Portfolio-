import type { AiNativeContent } from "@/content/ai-native";

/** Five buildable AI systems: description on the left, a compact architecture chain on the right. */
export function SystemsCatalog({ copy }: { copy: AiNativeContent["catalog"] }) {
  return (
    <ul className="border-t border-ink">
      {copy.items.map((item) => (
        <li key={item.title} className="grid gap-6 border-b border-line py-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-10">
          <div className="lg:col-span-5">
            <p className="mono mb-3 inline-block rounded-full border border-line px-2.5 py-0.5 text-xs uppercase tracking-wider text-ink-3">{copy.badge}</p>
            <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-tight tracking-tight">{item.title}</h3>
            <p className="mt-3 max-w-[48ch] text-ink-2">{item.body}</p>
          </div>
          <ol aria-label={item.title} className="flex flex-wrap items-center gap-y-3 lg:col-span-7">
            {item.flow.map((step, i) => (
              <li key={step} className="flex items-center">
                <span className={"mono rounded-md border px-3 py-2 text-xs " + (i === 0 ? "border-ink bg-ink text-paper" : i === item.flow.length - 1 ? "border-accent text-accent-ink" : "border-ink/25 bg-paper")}>
                  {step}
                </span>
                {i < item.flow.length - 1 && <span aria-hidden className="h-px w-4 bg-ink/40 sm:w-6" />}
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ul>
  );
}
