"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CornerDownLeft } from "lucide-react";
import { localizedPath, switchLocalePath } from "@/i18n/routing";
import { rememberLocale } from "@/i18n/remember";
import { complete, execute, type OutputLine, type TerminalContext } from "@/lib/terminal/engine";

interface Copy {
  label: string;
  logLabel: string;
  badge: string;
  prompt: string;
  placeholder: string;
  submit: string;
  quick: string;
  intro: string;
}

interface Entry {
  id: number;
  command?: string;
  lines: OutputLine[];
}

const QUICK_COMMANDS = ["help", "about", "skills", "projects", "stack", "ai", "architecture", "contact"] as const;

const lineClass: Record<OutputLine["kind"], string> = {
  heading: "mono mt-1 text-xs uppercase tracking-[0.14em] text-accent",
  text: "text-night-ink",
  muted: "text-night-mute",
  row: "",
  error: "text-[#ff8f73]",
  success: "text-[#4fd18b]",
};

function Line({ line }: { line: OutputLine }) {
  if (line.kind === "row") {
    return (
      <p className="grid gap-x-4 sm:grid-cols-[11rem_1fr]">
        <span className="text-night-mute break-words">{line.label}</span>
        <span className="text-night-ink break-words">{line.text}</span>
      </p>
    );
  }
  return <p className={lineClass[line.kind] + " break-words"}>{line.text}</p>;
}

/**
 * Read-only terminal UI. All behaviour comes from the pure engine in src/lib/terminal:
 * input is only ever matched against a fixed command list and rendered as plain text.
 */
export function Terminal({ ctx, copy }: { ctx: TerminalContext; copy: Copy }) {
  const router = useRouter();
  const pathname = usePathname();
  const inputId = useId();
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, lines: [{ kind: "muted", text: copy.intro }] }]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries]);

  const run = (raw: string) => {
    const command = raw.trim();
    if (!command) return;
    history.current.push(command);
    cursor.current = -1;
    const { lines, effect } = execute(command, ctx);
    if (effect?.type === "clear") {
      setEntries([]);
    } else {
      setEntries((prev) => [...prev, { id: nextId.current++, command, lines }]);
    }
    if (effect?.type === "navigate") router.push(localizedPath(ctx.locale, effect.slug));
    if (effect?.type === "locale") {
      rememberLocale(effect.locale);
      router.push(switchLocalePath(pathname, effect.locale));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const h = history.current;
    if (e.key === "ArrowUp" && h.length) {
      e.preventDefault();
      cursor.current = cursor.current === -1 ? h.length - 1 : Math.max(0, cursor.current - 1);
      setValue(h[cursor.current] ?? "");
    } else if (e.key === "ArrowDown" && cursor.current !== -1) {
      e.preventDefault();
      cursor.current = cursor.current + 1;
      if (cursor.current >= h.length) {
        cursor.current = -1;
        setValue("");
      } else setValue(h[cursor.current] ?? "");
    } else if (e.key === "Tab" && !e.shiftKey) {
      // Only capture Tab when it actually completes something, so keyboard users are never trapped.
      const completed = complete(value, ctx);
      if (completed !== value) {
        e.preventDefault();
        setValue(completed);
      }
    }
  };

  return (
    <section aria-label={copy.label} className="on-night night overflow-hidden rounded-lg border border-night-line bg-night-2">
      <div className="flex items-center justify-between border-b border-night-line px-4 py-3">
        <p className="mono text-xs text-night-mute">portfolio — {ctx.locale}</p>
        <p className="mono rounded-full border border-night-line px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-night-mute">{copy.badge}</p>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={copy.logLabel}
        tabIndex={0}
        onClick={() => window.getSelection()?.toString() === "" && inputRef.current?.focus()}
        className="mono h-[22rem] space-y-4 overflow-y-auto px-4 py-4 text-[0.82rem] leading-relaxed sm:h-[26rem]"
      >
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-1">
            {entry.command !== undefined && (
              <p className="break-all">
                <span className="text-night-mute">{copy.prompt}</span> <span className="text-night-ink">{entry.command}</span>
              </p>
            )}
            {entry.lines.map((line, i) => (
              <Line key={i} line={line} />
            ))}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue("");
        }}
        className="border-t border-night-line"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <label htmlFor={inputId} className="mono hidden shrink-0 text-[0.82rem] text-night-mute sm:block">
            {copy.prompt}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            onChange={(e) => {
              cursor.current = -1;
              setValue(e.target.value);
            }}
            onKeyDown={onKeyDown}
            maxLength={120}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            aria-label={`${copy.label}: ${copy.placeholder}`}
            placeholder={copy.placeholder}
            className="mono min-w-0 flex-1 bg-transparent text-[0.9rem] text-night-ink placeholder:text-night-mute focus:outline-none"
          />
          <button
            type="submit"
            className="mono inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-night-line px-3.5 text-xs text-night-ink transition-colors hover:border-night-ink"
          >
            {copy.submit}
            <CornerDownLeft className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-night-line px-4 py-3">
          <span className="eyebrow mr-1">{copy.quick}</span>
          {QUICK_COMMANDS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => run(name)}
              className="mono rounded-full border border-night-line px-3 py-1 text-xs text-night-mute transition-colors hover:border-night-ink hover:text-night-ink"
            >
              {name}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
