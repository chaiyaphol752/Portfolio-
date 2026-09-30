"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { clsx } from "clsx";

interface Props {
  text: string;
  label: string;
  copiedLabel: string;
  disabled?: boolean;
  className?: string;
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Small copy-to-clipboard button with an announced confirmation. */
export function CopyButton({ text, label, copiedLabel, disabled, className }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    if (!(await writeClipboard(text))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "mono inline-flex h-9 items-center gap-2 rounded-full border border-current px-3.5 text-[0.72rem] uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit",
        className,
      )}
    >
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {copied ? copiedLabel : label}
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
