"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { OperatorContent } from "@/content/operator";
import s from "./hud.module.css";

export const sceneIds = ["threshold", "operator", "screens", "core", "code", "human", "loop", "signal"] as const;
/** Where a rail jump lands inside each scene (fraction of its scroll travel). */
const landing: Record<(typeof sceneIds)[number], number> = { threshold: 0, operator: 0.85, screens: 0.9, core: 0.8, code: 0.5, human: 0.6, loop: 0.5, signal: 0.9 };

interface Props {
  rootId: string;
  t: OperatorContent;
  repoUrl: string;
  externalHint: string;
}

/**
 * Heads-up layer that stays with the viewport while Operator is on screen:
 * a progress line, the scene rail and the one deliberately unexplained switch.
 */
export function Hud({ rootId, t, repoUrl, externalHint }: Props) {
  const [lights, setLights] = useState(false);
  const [flash, setFlash] = useState<"idle" | "on" | "off">("idle");
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      delete document.documentElement.dataset.operatorLights;
    },
    [],
  );

  const jump = (e: React.MouseEvent, id: (typeof sceneIds)[number]) => {
    const scene = document.getElementById(`op-${id}`);
    if (!scene) return;
    e.preventDefault();
    const top = scene.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(0, scene.offsetHeight - window.innerHeight);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + travel * landing[id], behavior: reduced ? "auto" : "smooth" });
  };

  /** The surprise: the aperture opens all the way and the room's lights come on. */
  const toggle = () => {
    const root = document.getElementById(rootId);
    if (!root || flash !== "idle") return;
    const next = !lights;
    const apply = () => {
      if (next) {
        root.dataset.lights = "";
        document.documentElement.dataset.operatorLights = "";
      } else {
        delete root.dataset.lights;
        delete document.documentElement.dataset.operatorLights;
      }
      setLights(next);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    setFlash(next ? "on" : "off");
    timers.current.push(window.setTimeout(apply, 430), window.setTimeout(() => setFlash("idle"), 1050));
  };

  return (
    <div className={s.hud}>
      <span className={s.progress} aria-hidden />

      <nav aria-label={t.rail.label} className={s.rail}>
        <ol>
          {sceneIds.map((id, i) => (
            <li key={id}>
              <a href={`#op-${id}`} data-rail={id} onClick={(e) => jump(e, id)}>
                <span className={s.railLabel}>{t.rail.items[i]}</span>
                <span className={s.railTick} aria-hidden />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <button type="button" className={s.switch} aria-pressed={lights} onClick={toggle}>
        <span className={s.switchCap} aria-hidden />
        <span className={s.switchLabel}>{lights ? t.surprise.off : t.surprise.label}</span>
      </button>

      <p className={s.toast} role="status" data-shown={lights ? "" : undefined}>
        {lights && (
          <>
            <span>{t.surprise.message}</span>
            <a href={repoUrl} target="_blank" rel="noopener noreferrer">
              {t.surprise.link}
              <ArrowUpRight className="size-3.5" aria-hidden />
              <span className="sr-only"> ({externalHint})</span>
            </a>
          </>
        )}
      </p>

      <span className={s.flash} data-flash={flash} aria-hidden />
    </div>
  );
}
