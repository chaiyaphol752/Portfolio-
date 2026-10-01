"use client";

import { clsx } from "clsx";
import { interpolate } from "@/lib/interpolate";
import { circuit, connectionsOf, isAgent, nodeById } from "./circuit-data";
import type { CircuitCopy } from "./labels";

interface Props {
  id: string;
  copy: CircuitCopy;
  onSelect: (id: string) => void;
  /** Heading level inside the surrounding document outline. */
  headingLevel?: 3 | 4;
  headingId?: string;
}

/** Everything known about one component. Shared by the desktop inspector and the mobile/tablet panel. */
export function NodeDetail({ id, copy, onSelect, headingLevel = 3, headingId }: Props) {
  const node = nodeById.get(id);
  if (!node) return null;
  const c = copy.nodes[id];
  const label = (nid: string) => copy.nodes[nid]?.label ?? nid;
  const agent = isAgent(id) ? circuit.agents[id] : undefined;
  const agentCopy = copy.agents[id];
  const status = id === "n8n" ? copy.status.n8n : node.status === "live" ? copy.status.live : copy.status.capability;
  const Heading = headingLevel === 3 ? "h3" : "h4";

  const chip = (nid: string, accent?: boolean) => (
    <li key={nid}>
      <button
        type="button"
        onClick={() => onSelect(nid)}
        className={clsx(
          "inline-flex min-h-10 items-center rounded-full border px-3.5 text-[0.82rem] text-night-ink transition-colors hover:border-accent",
          accent ? "border-accent/60" : "border-night-line",
        )}
      >
        {label(nid)}
      </button>
    </li>
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Heading id={headingId} className="text-2xl font-medium tracking-tight">
          {c?.label ?? node.label}
        </Heading>
        <p className="mono mt-1 text-xs text-night-mute">{c?.sub ?? node.sub}</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-night-ink/90">{c?.role ?? node.description}</p>
        <p className={clsx("mono mt-3 flex items-start gap-2 text-xs leading-relaxed", node.status === "live" ? "text-ok" : "text-night-mute")}>
          <span aria-hidden className={clsx("mt-1 size-2 shrink-0 rounded-full", node.status === "live" ? "bg-ok" : "border border-night-mute")} />
          {status}
        </p>
      </div>

      {agent && agentCopy ? (
        <dl className="grid gap-4 text-[0.92rem]">
          <div>
            <dt className="eyebrow mb-1.5">{copy.inspector.responsibility}</dt>
            <dd>{agentCopy.responsibility}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1.5">{copy.inspector.inputs}</dt>
            <dd className="text-night-mute">{agentCopy.inputs}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">{copy.inspector.tools}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">{agent.tools.map((t) => chip(t, true))}</ul>
            </dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">
              {copy.inspector.models} <span className="normal-case tracking-normal">· {copy.inspector.viaRouter}</span>
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-2">{agent.models.map((m) => chip(m))}</ul>
            </dd>
          </div>
          <div>
            <dt className="eyebrow mb-1.5">{copy.inspector.output}</dt>
            <dd className="text-night-mute">{agentCopy.output}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-2">{copy.inspector.checkpoint}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">{chip(agent.validation)}</ul>
            </dd>
          </div>
        </dl>
      ) : (
        <>
          {c && c.uses.length > 0 && (
            <div>
              <p className="eyebrow mb-2">{copy.inspector.usedFor}</p>
              <ul className="flex flex-wrap gap-1.5">
                {c.uses.map((u) => (
                  <li key={u} className="rounded-md border border-night-line px-2.5 py-1 text-[0.82rem] text-night-ink/90">
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="eyebrow mb-2">{copy.inspector.connected}</p>
            <ul className="grid gap-1.5">
              {connectionsOf(id)
                .sort((a, b) => (a.direction === b.direction ? 0 : a.direction === "out" ? -1 : 1))
                .map(({ connection, direction, other }) => (
                  <li key={connection.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(other)}
                      className="flex min-h-10 w-full items-center gap-2 rounded-md border border-transparent px-2 text-left text-[0.88rem] hover:border-night-line"
                    >
                      <span aria-hidden className="mono w-4 shrink-0 text-night-mute">{direction === "out" ? "→" : "←"}</span>
                      <span>
                        {interpolate(direction === "out" ? copy.inspector.outgoing : copy.inspector.incoming, {
                          verb: copy.verbs[connection.verb],
                          node: label(other),
                        })}
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
