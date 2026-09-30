"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { appendPath, childEntries, jsonType } from "@/lib/lab/json";
import { interpolate } from "@/lib/interpolate";

const PAGE_SIZE = 100;

export interface TreeLabels {
  items: string;
  properties: string;
  showMore: string;
  copyPath: string;
}

interface NodeProps {
  name: string | number | null;
  value: unknown;
  path: string;
  depth: number;
  openDepth: number;
  labels: TreeLabels;
  onSelect: (path: string) => void;
}

function Scalar({ value }: { value: unknown }) {
  const type = jsonType(value);
  if (type === "string") return <span className="break-all text-accent-ink">{JSON.stringify(value)}</span>;
  if (type === "number") return <span className="text-ink">{String(value)}</span>;
  return <span className="italic text-ink-3">{String(value)}</span>;
}

function TreeNode({ name, value, path, depth, openDepth, labels, onSelect }: NodeProps) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const type = jsonType(value);
  const isContainer = type === "object" || type === "array";
  const label = name === null ? "$" : typeof name === "number" ? String(name) : name;
  const entries = isContainer ? childEntries(value) : [];

  if (!isContainer) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onSelect(path)}
          title={`${labels.copyPath}: ${path}`}
          className="mono flex w-full items-baseline gap-2 rounded px-1.5 py-1 text-left text-[0.8rem] hover:bg-paper-3"
        >
          <span className="shrink-0 text-ink-2">{label}:</span>
          <Scalar value={value} />
        </button>
      </li>
    );
  }

  const summary = interpolate(type === "array" ? labels.items : labels.properties, { n: entries.length });
  return (
    <li>
      <details open={depth < openDepth} className="group">
        <summary className="mono flex cursor-pointer list-none items-center gap-1 rounded px-1.5 py-1 text-[0.8rem] hover:bg-paper-3 [&::-webkit-details-marker]:hidden">
          <ChevronRight className="size-3.5 shrink-0 transition-transform group-open:rotate-90" aria-hidden />
          <span className="text-ink-2">{label}</span>
          <span className="text-ink-3">{type === "array" ? "[ ]" : "{ }"}</span>
          <span className="ml-auto pl-3 text-[0.7rem] text-ink-3">{summary}</span>
        </summary>
        <ul className="ml-2.5 border-l border-line pl-2">
          {entries.slice(0, visible).map(([key, child]) => (
            <TreeNode
              key={String(key)}
              name={key}
              value={child}
              path={appendPath(path, key)}
              depth={depth + 1}
              openDepth={openDepth}
              labels={labels}
              onSelect={onSelect}
            />
          ))}
          {entries.length > visible && (
            <li>
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="mono px-1.5 py-1 text-[0.72rem] uppercase tracking-wider text-accent-ink underline underline-offset-4"
              >
                {interpolate(labels.showMore, { n: entries.length - visible })}
              </button>
            </li>
          )}
        </ul>
      </details>
    </li>
  );
}

/** Collapsible JSON tree; selecting a value reports its JSONPath-style accessor. */
export function JsonTree({ value, openDepth, labels, onSelect }: { value: unknown; openDepth: number; labels: TreeLabels; onSelect: (path: string) => void }) {
  return (
    <ul role="tree" aria-label="JSON">
      <TreeNode name={null} value={value} path="$" depth={0} openDepth={openDepth} labels={labels} onSelect={onSelect} />
    </ul>
  );
}
