"use client";

import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { OperatorContent } from "@/content/operator";
import s from "./inspector.module.css";

export type SurfaceId = "architecture" | "python" | "terminal" | "pipeline" | "agents" | "prototype";

// Inspector bodies load on first open, so the scroll experience ships no extra JS up front.
const InspectorContent = lazy(() => import("./InspectorContent"));

const OpenContext = createContext<(surface: SurfaceId, opener: HTMLElement) => void>(() => {});

interface ProviderProps {
  locale: Locale;
  t: OperatorContent;
  children: React.ReactNode;
}

/** One art-directed focus mode for every interactive screen, built on native <dialog>. */
export function InspectorProvider({ locale, t, children }: ProviderProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [surface, setSurface] = useState<SurfaceId | null>(null);

  const open = useCallback((id: SurfaceId, opener: HTMLElement) => {
    openerRef.current = opener;
    setSurface(id);
  }, []);

  useEffect(() => {
    if (surface && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [surface]);

  const close = () => dialogRef.current?.close();

  return (
    <OpenContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        className={s.dialog}
        aria-labelledby="operator-inspector-title"
        onClose={() => {
          setSurface(null);
          openerRef.current?.focus();
        }}
        onClick={(e) => e.target === dialogRef.current && close()}
      >
        {surface && (
          <div className={s.panel}>
            <span className={s.signal} aria-hidden />
            <header className={s.head}>
              <div>
                <p className={s.kicker}>{t.inspect.kickers[surface]}</p>
                <h2 id="operator-inspector-title" className={s.title}>{t.inspect.names[surface]}</h2>
              </div>
              <button type="button" onClick={close} className={s.close}>
                <X className="size-4" aria-hidden />
                <span>{t.inspect.close}</span>
              </button>
            </header>
            <div className={s.body}>
              <Suspense fallback={<p className={s.loading} aria-hidden>…</p>}>
                <InspectorContent surface={surface} locale={locale} t={t} onNavigate={close} />
              </Suspense>
            </div>
            <p className={s.hint} aria-hidden>{t.inspect.hint}</p>
          </div>
        )}
      </dialog>
    </OpenContext.Provider>
  );
}

/** Makes a screen in the environment openable: a real button with a quiet "inspect" cue. */
export function ScreenTrigger({ surface, label, cue, children, className }: { surface: SurfaceId; label: string; cue: string; children: React.ReactNode; className?: string }) {
  const open = useContext(OpenContext);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={label}
      onClick={(e) => open(surface, e.currentTarget)}
      className={`${s.trigger} ${className ?? ""}`}
    >
      {children}
      <span className={s.cue} aria-hidden>
        <span className={s.cueDot} />
        {cue}
      </span>
    </button>
  );
}
