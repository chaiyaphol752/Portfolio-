"use client";

import { Command } from "lucide-react";
import { openCommandPalette } from "@/components/shell/CommandPalette";

/** Opens the global Ctrl/⌘ + K palette that lives in the site shell. */
export function PaletteButton({ label, keysLabel, ctrl }: { label: string; keysLabel: string; ctrl: string }) {
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      className="group inline-flex items-center gap-3 rounded-sm border border-night-line bg-night-2 px-3 py-2 text-[0.82rem] transition-colors hover:border-night-ink"
    >
      <Command className="size-4 text-night-mute group-hover:text-night-ink" aria-hidden />
      <span>{label}</span>
      <span className="flex items-center gap-1" aria-label={`${keysLabel}: ${ctrl} + K`}>
        <kbd className="mono rounded-sm border border-night-line bg-night-3 px-1.5 py-0.5 text-[0.68rem]">{ctrl}</kbd>
        <kbd className="mono rounded-sm border border-night-line bg-night-3 px-1.5 py-0.5 text-[0.68rem]">K</kbd>
      </span>
    </button>
  );
}
