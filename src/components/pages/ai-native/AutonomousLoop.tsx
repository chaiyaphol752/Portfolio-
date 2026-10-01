import { clsx } from "clsx";
import { CornerLeftUp } from "lucide-react";
import { loopStageIds, type AiNativeContent, type LoopStageId } from "@/content/ai-native";

type Copy = AiNativeContent["autonomy"];

const tag: Partial<Record<LoopStageId, "human" | "checkpoint">> = {
  goal: "human",
  orchestrator: "checkpoint",
  validation: "checkpoint",
  review: "checkpoint",
  approval: "human",
};

// Stages inside the bounded retry loop: orchestrator → review.
const loopStart = loopStageIds.indexOf("orchestrator");
const loopEnd = loopStageIds.indexOf("review");

function Stage({ id, copy }: { id: LoopStageId; copy: Copy }) {
  const t = tag[id];
  return (
    <li className="relative grid grid-cols-[1.5rem_1fr] gap-4 pb-5 last:pb-0">
      <span aria-hidden className="absolute left-[11px] top-5 bottom-0 w-px bg-ink/20 [li:last-child>&]:hidden" />
      <span
        aria-hidden
        className={clsx(
          "relative mt-1.5 size-[23px] rounded-full border-2",
          t === "human" ? "border-ink bg-ink" : t === "checkpoint" ? "border-accent bg-paper" : "border-ink/40 bg-paper",
        )}
      />
      <div>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-lg font-medium tracking-tight">{copy.stages[id].label}</span>
          {t && <span className={clsx("mono text-[0.65rem] uppercase tracking-wider", t === "human" ? "text-ink" : "text-accent-ink")}>{copy.tags[t]}</span>}
        </p>
        <p className="text-sm text-ink-2">{copy.stages[id].detail}</p>
      </div>
    </li>
  );
}

/** Goal → … → Result as a vertical rail, with the bounded retry loop drawn as a bracket. */
export function AutonomousLoop({ copy }: { copy: Copy }) {
  const before = loopStageIds.slice(0, loopStart);
  const inside = loopStageIds.slice(loopStart, loopEnd + 1);
  const after = loopStageIds.slice(loopEnd + 1);
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ol aria-label={copy.title}>
          {before.map((id) => <Stage key={id} id={id} copy={copy} />)}
          <li className="relative pb-5">
            <ol className="relative mr-12 rounded-md border border-dashed border-accent/70 bg-accent-soft/40 py-4 pl-3 pr-4">
              {inside.map((id) => <Stage key={id} id={id} copy={copy} />)}
            </ol>
            <div aria-hidden className="absolute -right-0 top-6 bottom-11 w-9 rounded-r-md border-y-2 border-r-2 border-accent" />
            <p className="mono absolute right-0 top-1/2 flex w-9 -translate-y-1/2 justify-center text-accent-ink">
              <CornerLeftUp className="size-4" aria-hidden />
            </p>
            <p className="mono mt-2 text-[0.7rem] uppercase tracking-wider text-accent-ink">{copy.loopLabel}</p>
          </li>
          {after.map((id) => <Stage key={id} id={id} copy={copy} />)}
        </ol>
      </div>

      <div className="lg:col-span-5">
        <h3 className="eyebrow mb-4">{copy.guardrailsTitle}</h3>
        <dl className="border-t border-ink">
          {copy.guardrails.map((g) => (
            <div key={g.title} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="font-medium">{g.title}</dt>
              <dd className="text-sm text-ink-2">{g.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
