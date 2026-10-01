import type { AiNativeContent } from "@/content/ai-native";

type Copy = AiNativeContent["ecosystem"];

function Uses({ items, columns = false }: { items: string[]; columns?: boolean }) {
  return (
    <ul className={columns ? "grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3" : "space-y-2"}>
      {items.map((u) => (
        <li key={u} className="flex items-baseline gap-3 text-sm">
          <span aria-hidden className="mono text-[0.65rem] text-accent-ink">—</span>
          {u}
        </li>
      ))}
    </ul>
  );
}

/** ChatGPT, Claude and Local AI as three columns; Python spans the full width as the glue beneath them. */
export function Ecosystem({ copy }: { copy: Copy }) {
  const models = (["chatgpt", "claude", "local"] as const).map((id) => ({ id, ...copy.items[id] }));
  const python = copy.items.python;
  return (
    <div>
      <div className="grid border-t border-ink lg:grid-cols-3">
        {models.map((m, i) => (
          <article key={m.id} className={"flex flex-col gap-5 border-b border-line py-8 lg:border-b-0 lg:py-10 " + (i > 0 ? "lg:border-l lg:pl-8" : "lg:pr-8")}>
            <p className="eyebrow">{m.tag}</p>
            <h3 className="text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-none tracking-tight">{m.name}</h3>
            <p className="text-ink-2">{m.summary}</p>
            <Uses items={m.uses} />
            {m.id === "local" && <p className="mt-auto pt-2 text-xs text-ink-3">{copy.localNote}</p>}
          </article>
        ))}
      </div>

      <article className="grid gap-8 bg-ink px-6 py-10 text-paper sm:px-10 lg:grid-cols-12 lg:py-14">
        <div className="lg:col-span-4">
          <p className="mono text-[0.72rem] uppercase tracking-[0.12em] text-accent">{python.tag}</p>
          <h3 className="display-serif mt-4 text-[clamp(3.5rem,8vw,6.5rem)] leading-none">{python.name}</h3>
          <p className="mt-5 max-w-[34ch] text-paper/75">{python.summary}</p>
        </div>
        <div className="text-paper/90 lg:col-span-8 lg:self-end">
          <Uses items={python.uses} columns />
        </div>
      </article>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-baseline lg:gap-10">
        <p className="eyebrow shrink-0">{copy.practicesTitle}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {copy.practices.map((p) => (
            <li key={p} className="text-sm text-ink-2">{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
