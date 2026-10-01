"use client";

import { RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import type { CommandCenterContent } from "@/content/command-center";
import { useHealth, type HealthState } from "./HealthProvider";
import { Panel, Rows } from "./Panel";

type C = CommandCenterContent;

function useValue(values: C["values"]) {
  return (raw: string | null | undefined) => (raw ? (values[raw] ?? raw) : "—");
}

function Pending({ state, copy }: { state: HealthState; copy: C["status"] }) {
  if (state.kind === "loading") return <p className="mono text-[0.8rem] text-night-mute">{copy.loading}</p>;
  if (state.kind === "error") return <p className="text-[0.84rem] text-err">{copy.error}</p>;
  return null;
}

/** Overall status from /api/health, including the measured round trip of this very request. */
export function StatusPanel({ copy, values, sourceLabel, className }: { copy: C["status"]; values: C["values"]; sourceLabel: string; className?: string }) {
  const { state, refresh } = useHealth();
  const v = useValue(values);
  const action = (
    <button
      type="button"
      onClick={refresh}
      className="mono -my-3 inline-flex min-h-11 items-center gap-1.5 text-[0.75rem] uppercase tracking-wider text-night-mute transition-colors hover:text-night-ink sm:min-h-0 sm:text-[0.68rem]"
    >
      <RefreshCw className={clsx("size-3", state.kind === "loading" && "motion-safe:animate-spin")} aria-hidden />
      {copy.retry}
    </button>
  );
  return (
    <Panel id="status" title={copy.title} source="live" sourceLabel={sourceLabel} className={className} action={action}>
      <div aria-live="polite" className="flex flex-1 flex-col">
        <p className="mono text-[0.72rem] text-night-mute">{copy.endpoint}</p>
        {state.kind !== "ready" ? (
          <div className="mt-4">
            <Pending state={state} copy={copy} />
          </div>
        ) : (
          <>
            <p className="mt-4 flex items-center gap-3">
              <span aria-hidden className={clsx("size-2.5 rounded-full", state.data.status === "ok" ? "bg-ok" : "bg-accent")} />
              <span className="text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-none tracking-tight">{copy.status[state.data.status]}</span>
            </p>
            <div className="mt-5">
              <Rows
                rows={[
                  [copy.fields.environment, v(state.data.runtime.environment)],
                  [copy.fields.region, v(state.data.runtime.region)],
                  [copy.fields.runtime, `Node ${state.data.runtime.node}`],
                  [copy.fields.database, v(state.data.checks.database)],
                  [copy.fields.email, v(state.data.checks.email ?? "not-configured")],
                  [copy.measured, `${state.latencyMs} ms`],
                ]}
              />
            </div>
          </>
        )}
        <a
          href="/api/health"
          target="_blank"
          rel="noopener noreferrer"
          className="mono mt-auto self-start pt-4 text-[0.72rem] text-night-mute underline decoration-night-line underline-offset-4 hover:text-night-ink"
        >
          {copy.raw} ↗<span className="sr-only"> {copy.newTab}</span>
        </a>
      </div>
    </Panel>
  );
}

export function EmailPanel({
  copy,
  statusCopy,
  values,
  destination,
  sourceLabel,
  group,
}: {
  copy: C["panels"]["email"];
  statusCopy: C["status"];
  values: C["values"];
  destination: string;
  sourceLabel: string;
  group?: string;
}) {
  const { state } = useHealth();
  const v = useValue(values);
  const email = state.kind === "ready" ? (state.data.checks.email ?? "not-configured") : null;
  return (
    <Panel id="email" title={copy.title} source="live" sourceLabel={sourceLabel} group={group}>
      <div aria-live="polite">
        {email === null ? (
          <Pending state={state} copy={statusCopy} />
        ) : (
          <>
            <p className="mb-4 flex items-start gap-2.5 text-[0.84rem] leading-relaxed text-night-mute">
              <span aria-hidden className={clsx("mt-1.5 size-2 shrink-0 rounded-full", email === "not-configured" ? "bg-err" : "bg-ok")} />
              {copy.explain[email] ?? v(email)}
            </p>
            <Rows
              rows={[
                [copy.provider, "Resend"],
                [copy.state, v(email)],
                [copy.destination, destination],
                [copy.replyTo, copy.replyToValue],
              ]}
            />
          </>
        )}
      </div>
    </Panel>
  );
}

export function RepositoryPanel({
  copy,
  repoUrl,
  repoLabel,
  sourceLabel,
  group,
}: {
  copy: C["panels"]["repository"];
  repoUrl: string;
  repoLabel: string;
  sourceLabel: string;
  group?: string;
}) {
  const { state } = useHealth();
  const commit = state.kind === "ready" ? (state.data.deployment.commit ?? "—") : state.kind === "loading" ? copy.pending : "—";
  return (
    <Panel id="repository" title={copy.title} source="live" sourceLabel={sourceLabel} group={group}>
      <Rows
        rows={[
          [
            copy.repo,
            <a key="repo" href={repoUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-night-line underline-offset-4 hover:decoration-night-ink">
              {repoLabel} ↗<span className="sr-only"> {copy.newTab}</span>
            </a>,
          ],
          [copy.branch, "main"],
          [copy.commit, commit],
        ]}
      />
    </Panel>
  );
}

export function DeploymentPanel({
  copy,
  values,
  sourceLabel,
  group,
}: {
  copy: C["panels"]["deployment"];
  values: C["values"];
  sourceLabel: string;
  group?: string;
}) {
  const { state } = useHealth();
  const v = useValue(values);
  const ready = state.kind === "ready" ? state.data : null;
  return (
    <Panel id="deployment" title={copy.title} source="live" sourceLabel={sourceLabel} group={group}>
      <Rows
        rows={[
          [copy.platform, "Vercel"],
          [copy.environment, ready ? v(ready.runtime.environment) : "…"],
          [copy.region, ready ? v(ready.runtime.region) : "…"],
          [copy.runtime, ready ? `Node ${ready.runtime.node}` : "…"],
        ]}
      />
      <p className="mono mt-4 text-[0.7rem] leading-relaxed text-night-mute">
        <span className="text-night-ink">{copy.headers}:</span> {copy.headersValue}
      </p>
    </Panel>
  );
}

/** Delivery channels reported by the server; rendered inside the (static) Backend panel. */
export function ChannelList({ label, none }: { label: string; none: string }) {
  const { state } = useHealth();
  const channels = state.kind === "ready" ? (state.data.checks.contactChannels ?? []) : null;
  return (
    <div className="mt-4" aria-live="polite">
      <p className="mono mb-2 text-[0.68rem] uppercase tracking-wider text-night-mute">{label}</p>
      {channels === null ? (
        <p className="mono text-[0.78rem] text-night-mute">…</p>
      ) : channels.length === 0 ? (
        <p className="mono text-[0.78rem] text-err">{none}</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {channels.map((c) => (
            <li key={c} className="mono inline-flex items-center gap-1.5 rounded-sm border border-night-line px-2 py-1 text-[0.72rem]">
              <span aria-hidden className="size-1.5 rounded-full bg-ok" />
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
