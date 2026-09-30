import { ArrowDown, ArrowRight } from "lucide-react";
import type { DiagramContent, TreeNode } from "@/content/case-studies";

export type DiagramTone = "night" | "paper";

const tones = {
  night: {
    frame: "night on-night",
    box: "border-night-line bg-night-2",
    text: "text-night-ink",
    muted: "text-night-mute",
    accent: "text-accent",
    line: "border-night-line",
    rule: "bg-night-line",
    shade: ["bg-night-2", "bg-night-3"],
  },
  paper: {
    frame: "bg-paper-2",
    box: "border-line bg-paper",
    text: "text-ink",
    muted: "text-ink-2",
    accent: "text-accent-ink",
    line: "border-line",
    rule: "bg-paper-3",
    shade: ["bg-paper", "bg-paper-3"],
  },
} as const;

/** Static class strings per column count so Tailwind can see them at build time. */
const flowColumns = {
  3: {
    grid: "md:grid-cols-3",
    down: "md:hidden",
    right: "hidden md:block md:group-[:nth-child(3n)]:hidden",
  },
  4: {
    grid: "lg:grid-cols-4",
    down: "lg:hidden",
    right: "hidden lg:block lg:group-[:nth-child(4n)]:hidden",
  },
} as const;

const pad = (n: number) => String(n).padStart(2, "0");

interface Props {
  diagram: DiagramContent;
  label: string;
  id: string;
  tone?: DiagramTone;
  /** Columns for the "flow" kind on wide screens. */
  columns?: 3 | 4;
}

/**
 * HTML/CSS diagrams built on semantic lists, so the structure reads correctly
 * to assistive tech and stays legible at 360px without scaled-down SVG text.
 */
export function Diagram({ diagram, label, id, tone = "night", columns = 3 }: Props) {
  const c = tones[tone];
  const titleId = `${id}-title`;
  return (
    <figure aria-labelledby={titleId} className={`${c.frame} -mx-[var(--gutter)] px-[var(--gutter)] py-8 sm:mx-0 sm:rounded-sm sm:p-8 lg:p-10`}>
      <figcaption className="mb-8 max-w-[60ch]">
        <span className="eyebrow">{label}</span>
        <span id={titleId} className={`h3 mt-1 block ${c.text}`}>{diagram.title}</span>
        <span className={`mt-1 block text-sm ${c.muted}`}>{diagram.caption}</span>
      </figcaption>
      {diagram.kind === "flow" && <Flow nodes={diagram.nodes} tone={tone} columns={columns} />}
      {diagram.kind === "layers" && <Layers nodes={diagram.nodes} tone={tone} />}
      {diagram.kind === "tree" && (
        <div className="overflow-x-auto pb-2">
          <TreeView node={diagram.root} tone={tone} root />
        </div>
      )}
    </figure>
  );
}

export function Flow({ nodes, tone, columns }: { nodes: { label: string; detail: string }[]; tone: DiagramTone; columns: 3 | 4 }) {
  const c = tones[tone];
  const f = flowColumns[columns];
  return (
    <ol className={`grid gap-x-10 gap-y-9 ${f.grid}`}>
      {nodes.map((node, i) => (
        <li key={node.label} className={`group relative border p-5 ${c.box}`}>
          <span className={`eyebrow tabular ${c.accent}`}>{pad(i + 1)}</span>
          <p className={`mt-2 font-medium ${c.text}`}>{node.label}</p>
          <p className={`mt-1 text-sm ${c.muted}`}>{node.detail}</p>
          {i < nodes.length - 1 && (
            <>
              <span aria-hidden className={`absolute -bottom-[1.6rem] left-5 ${f.down} ${c.muted}`}>
                <ArrowDown className="size-4" />
              </span>
              <span aria-hidden className={`absolute -right-[1.65rem] top-1/2 -translate-y-1/2 ${f.right} ${c.muted}`}>
                <ArrowRight className="size-4" />
              </span>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

function Layers({ nodes, tone }: { nodes: { label: string; detail: string }[]; tone: DiagramTone }) {
  const c = tones[tone];
  return (
    <ol className="flex flex-col">
      {nodes.map((node, i) => (
        <li
          key={node.label}
          className={`relative grid grid-cols-[2.25rem_1fr] items-baseline gap-x-3 gap-y-1 px-4 py-4 sm:px-6 md:grid-cols-[2.5rem_13rem_1fr] md:gap-x-6 ${c.shade[i % 2]}`}
        >
          <span className={`eyebrow tabular ${c.accent}`}>{pad(i + 1)}</span>
          <span className={`font-medium ${c.text}`}>{node.label}</span>
          <span className={`col-start-2 text-sm md:col-start-3 ${c.muted}`}>{node.detail}</span>
          {i < nodes.length - 1 && (
            <span aria-hidden className="absolute -bottom-2.5 left-4 z-10 grid size-5 place-items-center rounded-full bg-accent text-white sm:left-6">
              <ArrowDown className="size-3" />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function TreeView({ node, tone, root }: { node: TreeNode; tone: DiagramTone; root?: boolean }) {
  const c = tones[tone];
  return (
    <div className="min-w-[15rem]">
      <p className={`inline-block max-w-[34ch] border px-4 py-2.5 text-sm font-medium ${c.box} ${c.text} ${root ? "border-accent" : ""}`}>{node.label}</p>
      {node.children && (
        <ul className={`ml-3 mt-3 space-y-4 border-l pl-6 ${c.line}`}>
          {node.children.map((child) => (
            <li key={child.edge} className="relative">
              <span aria-hidden className={`absolute -left-6 top-3 h-px w-5 ${c.rule}`} />
              <p className={`eyebrow mb-2 ${c.accent}`}>{child.edge}</p>
              <TreeView node={child.node} tone={tone} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
