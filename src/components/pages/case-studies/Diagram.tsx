import { ArrowDown, ArrowRight, ChevronRight } from "lucide-react";
import type { DiagramContent, DiagramNode, TreeNode } from "@/content/case-studies";

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
    <figure aria-labelledby={titleId} className={`${c.frame} @container -mx-[var(--gutter)] px-[var(--gutter)] py-8 sm:mx-0 sm:rounded-sm sm:p-8 lg:p-10`}>
      <figcaption className="mb-8 max-w-[60ch]">
        <span className="eyebrow">{label}</span>
        <span id={titleId} className={`h3 mt-1 block ${c.text}`}>{diagram.title}</span>
        <span className={`mt-1 block text-sm ${c.muted}`}>{diagram.caption}</span>
      </figcaption>
      {diagram.kind === "flow" && <Flow nodes={diagram.nodes} tone={tone} columns={columns} />}
      {diagram.kind === "layers" && <Layers nodes={diagram.nodes} tone={tone} />}
      {diagram.kind === "branch" && <Branch before={diagram.before} branches={diagram.branches} after={diagram.after} tone={tone} />}
      {diagram.kind === "tree" && (
        <div className="overflow-x-auto pb-2" tabIndex={0} role="group" aria-labelledby={titleId}>
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
          <p className={`mt-2 hyphens-auto break-words font-medium ${c.text}`}>{node.label}</p>
          <p className={`mt-1 hyphens-auto break-words text-sm ${c.muted}`}>{node.detail}</p>
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

/** Horizontal connector between two boxes in the wide branch layout. */
function Link({ tone, arrow = true, side = "right" }: { tone: DiagramTone; arrow?: boolean; side?: "right" | "left" }) {
  const c = tones[tone];
  return (
    <span aria-hidden className={`absolute top-1/2 flex w-[1.125rem] -translate-y-1/2 items-center ${side === "right" ? "left-full" : "right-full"} ${c.muted}`}>
      <span className={`h-px flex-1 ${c.rule}`} />
      {arrow && <ChevronRight className="-ml-2 size-3.5 shrink-0" />}
    </span>
  );
}

function BranchBox({ node, tone, emphasis }: { node: DiagramNode; tone: DiagramTone; emphasis?: boolean }) {
  const c = tones[tone];
  return (
    <div className={`border px-4 py-3 ${c.box} ${emphasis ? "border-l-2 border-l-accent" : ""}`}>
      <p className={`hyphens-auto break-words text-sm font-medium ${c.text}`}>{node.label}</p>
      <p className={`mt-0.5 hyphens-auto break-words text-xs leading-snug ${c.muted}`}>{node.detail}</p>
    </div>
  );
}

/**
 * Sequence → parallel branches → sequence. On wide screens the branches sit in one
 * column joined by bus lines (like the circuit on the AI page); below that it becomes
 * a vertical list with the parallel group indented.
 */
function Branch({ before, branches, after, tone }: { before: DiagramNode[]; branches: DiagramNode[]; after: DiagramNode[]; tone: DiagramTone }) {
  const c = tones[tone];
  const columns = `repeat(${before.length}, minmax(0, 1fr)) minmax(0, 1.2fr) repeat(${after.length}, minmax(0, 1fr))`;
  return (
    <>
      {/* Container query: the article column is narrow even on laptops, so go horizontal only when the figure is wide. */}
      <ol className="hidden items-center gap-x-9 @4xl:grid" style={{ gridTemplateColumns: columns }}>
        {before.map((node, i) => (
          <li key={node.label} className="relative">
            <BranchBox node={node} tone={tone} />
            {i < before.length - 1 ? (
              <span aria-hidden className={`absolute left-full top-1/2 flex w-9 -translate-y-1/2 items-center ${c.muted}`}>
                <span className={`h-px flex-1 ${c.rule}`} />
                <ChevronRight className="-ml-2 size-3.5 shrink-0" />
              </span>
            ) : (
              <Link tone={tone} arrow={false} />
            )}
          </li>
        ))}
        <li>
          <ul className="flex flex-col gap-3">
            {branches.map((node, i) => (
              <li key={node.label} className="relative">
                {/* Bus segments: each item draws the bus from the previous item's centre to its own. */}
                {i > 0 && <span aria-hidden className={`absolute -left-[1.125rem] -top-3 h-[calc(50%+0.75rem)] w-px ${c.rule}`} />}
                {i < branches.length - 1 && <span aria-hidden className={`absolute -left-[1.125rem] top-1/2 h-1/2 w-px ${c.rule}`} />}
                {i > 0 && <span aria-hidden className={`absolute -right-[1.125rem] -top-3 h-[calc(50%+0.75rem)] w-px ${c.rule}`} />}
                {i < branches.length - 1 && <span aria-hidden className={`absolute -right-[1.125rem] top-1/2 h-1/2 w-px ${c.rule}`} />}
                <Link tone={tone} side="left" />
                <BranchBox node={node} tone={tone} emphasis />
                <Link tone={tone} arrow={false} />
              </li>
            ))}
          </ul>
        </li>
        {after.map((node, i) => (
          <li key={node.label} className="relative">
            {i === 0 && <Link tone={tone} side="left" />}
            <BranchBox node={node} tone={tone} />
            {i < after.length - 1 && (
              <span aria-hidden className={`absolute left-full top-1/2 flex w-9 -translate-y-1/2 items-center ${c.muted}`}>
                <span className={`h-px flex-1 ${c.rule}`} />
                <ChevronRight className="-ml-2 size-3.5 shrink-0" />
              </span>
            )}
          </li>
        ))}
      </ol>

      <ol className="space-y-6 @4xl:hidden">
        {before.map((node) => (
          <li key={node.label} className="relative">
            <BranchBox node={node} tone={tone} />
            <span aria-hidden className={`absolute -bottom-5 left-5 ${c.muted}`}>
              <ArrowDown className="size-4" />
            </span>
          </li>
        ))}
        <li className="relative">
          <ul className={`space-y-2 border-l-2 pl-4 ${c.line}`}>
            {branches.map((node) => (
              <li key={node.label}>
                <BranchBox node={node} tone={tone} emphasis />
              </li>
            ))}
          </ul>
          {after.length > 0 && (
            <span aria-hidden className={`absolute -bottom-5 left-5 ${c.muted}`}>
              <ArrowDown className="size-4" />
            </span>
          )}
        </li>
        {after.map((node, i) => (
          <li key={node.label} className="relative">
            <BranchBox node={node} tone={tone} />
            {i < after.length - 1 && (
              <span aria-hidden className={`absolute -bottom-5 left-5 ${c.muted}`}>
                <ArrowDown className="size-4" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
