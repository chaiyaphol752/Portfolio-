import { Fragment } from "react";
import { clsx } from "clsx";
import type { CapabilitiesContent } from "@/content/capabilities";
import { chainIds, chains, getNode } from "./data";
import { padClass } from "./style";

/** Typical builds drawn as paths through the network: a static, readable schematic. */
export function Chains({ t }: { t: CapabilitiesContent }) {
  return (
    <ol className="border-t border-ink">
      {chainIds.map((id) => (
        <li key={id} className="grid gap-6 border-b border-line py-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <h3 className="h3">{t.chains.items[id].title}</h3>
            <p className="mt-2 max-w-[40ch] text-sm text-ink-2">{t.chains.items[id].outcome}</p>
          </div>
          <ol className="flex flex-col gap-0 lg:col-span-8 lg:flex-row lg:items-center" aria-label={t.chains.items[id].title}>
            {chains[id].map((nodeId, i) => {
              const node = getNode(nodeId);
              return (
                <Fragment key={nodeId}>
                  {i > 0 && <li aria-hidden className="ml-[5px] h-4 w-px bg-ink lg:ml-0 lg:h-px lg:w-auto lg:min-w-4 lg:flex-1" />}
                  <li className="flex items-center gap-2.5 lg:flex-col lg:gap-2">
                    <span aria-hidden className={clsx("size-2.5 shrink-0", padClass[node.family])} />
                    <span className="mono hyphens-auto text-[0.78rem] lg:max-w-[13ch] lg:text-center lg:leading-tight">{t.labels[nodeId] ?? node.label}</span>
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
}
