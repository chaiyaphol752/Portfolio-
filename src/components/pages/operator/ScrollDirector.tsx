"use client";

import { useEffect } from "react";

/**
 * Drives the scroll choreography with one CSS variable per scene (--p, 0..1) and a
 * data-in flag for reveal elements. Every transform lives in CSS; this only measures.
 * It also tracks the current scene (for the rail), overall progress and a pointer offset.
 * With reduced motion the scenes keep their CSS rest state; without JS nothing runs at all.
 */
export function ScrollDirector({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.dataset.js = "";
    // Reduced motion: scenes keep their composed rest state, but orientation (rail, progress) still works.
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animate) {
      root.dataset.reduced = "";
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => (el.dataset.in = ""));
    }

    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const active = new Set<HTMLElement>();
    let frame = 0;
    let current = "";
    let pointer: { x: number; y: number } | null = null;

    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const box = root.getBoundingClientRect();
      root.style.setProperty("--page", Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - vh))).toFixed(4));
      let now = current;
      for (const el of active) {
        const r = el.getBoundingClientRect();
        if (animate) {
          const travel = Math.max(1, r.height - vh);
          el.style.setProperty("--p", Math.min(1, Math.max(0, -r.top / travel)).toFixed(4));
        }
        if (r.top <= vh / 2 && r.bottom > vh / 2 && el.dataset.scene) now = el.dataset.scene;
      }
      if (now !== current) {
        current = now;
        root.querySelectorAll<HTMLElement>("[data-rail]").forEach((link) => {
          if (link.dataset.rail === now) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      }
      if (pointer) {
        // Screen light and depth lean a little toward the pointer (fine pointers only).
        root.style.setProperty("--mx", pointer.x.toFixed(3));
        root.style.setProperty("--my", pointer.y.toFixed(3));
        pointer = null;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const onPointer = (e: PointerEvent) => {
      pointer = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
      schedule();
    };
    const finePointer = animate && window.matchMedia("(pointer: fine)").matches;

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
    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      sceneObserver.disconnect();
      revealObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootId]);

  return null;
}
