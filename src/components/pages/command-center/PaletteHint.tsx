"use client";

import { Command } from "lucide-react";
import { openCommandPalette } from "@/components/shell/CommandPalette";

interface Props {
  eyebrow: string;
  title: string;
  body: string;
  button: string;
  keys: string;
  /** Localized name of the Control key (e.g. "Strg" in German). */
  ctrl?: string;
}

/** Promotes the global Ctrl/Cmd + K palette; the palette itself lives in the site shell. */
export function PaletteHint({ eyebrow, title, body, button, keys, ctrl = "Ctrl" }: Props) {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-night-line p-6 sm:p-8">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h3 className="h2">{title}</h3>
        <p className="mt-4 max-w-[46ch] text-night-mute">{body}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="button" onClick={openCommandPalette} className="btn btn-on-night">
          <Command className="size-4" aria-hidden />
          {button}
        </button>
        <p className="flex items-center gap-2 text-night-mute">
          <span className="sr-only">{keys}: </span>
          <kbd className="mono rounded border border-night-line bg-night-3 px-2 py-1 text-xs text-night-ink">{ctrl}</kbd>
          <span aria-hidden>/</span>
          <kbd className="mono rounded border border-night-line bg-night-3 px-2 py-1 text-xs text-night-ink">⌘</kbd>
          <span aria-hidden>+</span>
          <kbd className="mono rounded border border-night-line bg-night-3 px-2 py-1 text-xs text-night-ink">K</kbd>
        </p>
      </div>
    </div>
  );
}
