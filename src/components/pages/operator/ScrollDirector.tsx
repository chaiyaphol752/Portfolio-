"use client";

import { useEffect } from "react";

/**
 * Drives the scroll choreography with one CSS variable per scene (--p, 0..1) and a
 * data-in flag for reveal elements. Every transform lives in CSS; this only measures.
 * With reduced motion (or without JS) nothing runs and the CSS rest state is shown.
 */
export function ScrollDirector({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.dataset.js = "";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      root.dataset.reduced = "";
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => (el.dataset.in = ""));
      return;
    }

    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const active = new Set<HTMLElement>();
    let frame = 0;

    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of active) {
        const r = el.getBoundingClientRect();
        const travel = Math.max(1, r.height - vh);
        const p = Math.min(1, Math.max(0, -r.top / travel));
        el.style.setProperty("--p", p.toFixed(4));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    // Only scenes near the viewport are measured; ambient loops run only while visible.
    const sceneObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            active.add(el);
            el.dataset.active = "";
          } else {
            active.delete(el);
            delete el.dataset.active;
          }
        }
        schedule();
      },
      { rootMargin: "20% 0px" },
    );
    scenes.forEach((el) => sceneObserver.observe(el));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "";
            revealObserver.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      sceneObserver.disconnect();
      revealObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootId]);

  return null;
}
