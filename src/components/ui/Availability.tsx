import { clsx } from "clsx";
import { profile } from "@/config/profile";
import type { CommonContent } from "@/content/common";

/** Employment availability, driven by profile.availability. */
export function Availability({ t, services = false, className, dark }: { t: CommonContent; services?: boolean; className?: string; dark?: boolean }) {
  const state = profile.availability;
  return (
    <p className={clsx("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="relative flex size-2">
          {state === "open" && <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-40 motion-reduce:hidden" />}
          <span className={clsx("relative inline-flex size-2 rounded-full", state === "open" ? "bg-signal" : state === "limited" ? "bg-accent" : "bg-ink-3")} />
        </span>
        <span className="font-medium">{t.availability[state]}</span>
      </span>
      {services && <span className={dark ? "text-night-mute" : "text-ink-3"}>{t.availability.services}</span>}
    </p>
  );
}
