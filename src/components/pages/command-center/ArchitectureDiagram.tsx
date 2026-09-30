import type { CommandCenterContent } from "@/content/command-center";

type Nodes = CommandCenterContent["architecture"]["nodes"];

/** Vertical request-path diagram built from HTML and CSS; every node maps to real files. */
export function ArchitectureDiagram({ copy }: { copy: CommandCenterContent["architecture"] }) {
  const nodes: Nodes = copy.nodes;
  return (
    <ol className="border-t border-ink">
      {nodes.map((node, i) => {
        const branches = "branches" in node ? (node as { branches: string[] }).branches : undefined;
        return (
          <li key={node.id} className="relative grid gap-x-8 gap-y-3 border-b border-line py-7 md:grid-cols-12">
            <div className="flex items-baseline gap-4 md:col-span-4">
              <span className="mono tabular text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h2 !text-[clamp(1.35rem,2.4vw,2rem)]">{node.label}</h3>
            </div>
            <div className="md:col-span-5">
              <p className="body-copy">{node.desc}</p>
              {branches && (
                <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label={copy.branchLabel}>
                  {branches.map((b) => (
                    <span key={b} className="mono rounded-full border border-ink px-3 py-1 text-xs">{b}</span>
                  ))}
                </div>
              )}
            </div>
            <p className="mono break-words text-xs text-ink-3 md:col-span-3">
              <span className="sr-only">{copy.pathLabel}: </span>
              {node.path}
            </p>
            {i < nodes.length - 1 && (
              <span aria-hidden className="absolute -bottom-2.5 left-0 z-10 grid size-5 place-items-center bg-paper text-xs text-accent-ink">↓</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
