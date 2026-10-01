"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CornerDownLeft } from "lucide-react";
import { localizedPath, switchLocalePath } from "@/i18n/routing";
import { rememberLocale } from "@/i18n/remember";
import { complete, execute, type OutputLine, type TerminalContext } from "@/lib/terminal/engine";
import { useHealth } from "./HealthProvider";

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

const QUICK_COMMANDS = ["help", "services", "ai", "agents", "python", "status", "contact"] as const;

const lineClass: Record<OutputLine["kind"], string> = {
  heading: "mono mt-1 text-xs uppercase tracking-[0.14em] text-accent",
  text: "text-night-ink",
  muted: "text-night-mute",
  row: "",
  error: "text-err",
  success: "text-ok",
};

function Line({ line }: { line: OutputLine }) {
  if (line.kind === "row") {
    // href only ever comes from the trusted terminal context (mailto:, tel:, site paths, repo URL).
    const external = line.href?.startsWith("http");
    return (
      <p className="grid gap-x-4 sm:grid-cols-[11rem_1fr]">
        <span className="text-night-mute break-words">{line.label}</span>
        {line.href ? (
          <a
            href={line.href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="break-words text-night-ink underline decoration-night-line underline-offset-4 hover:decoration-night-ink"
          >
            {line.text}
          </a>
        ) : (
          <span className="text-night-ink break-words">{line.text}</span>
        )}
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
  const { state: health } = useHealth();
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
    const { lines, effect } = execute(command, ctx, {
      history: history.current,
      health: health.kind === "ready" ? health.data : null,
    });
    history.current.push(command);
    cursor.current = -1;
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
    <section aria-label={copy.label} className="on-night flex min-w-0 flex-col bg-night">
      <div className="flex items-center justify-between border-b border-night-line px-4 py-3">
        <p className="mono text-xs text-night-mute">portfolio — {ctx.locale}</p>
        <p className="mono rounded-sm border border-night-line px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-night-mute">{copy.badge}</p>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={copy.logLabel}
        tabIndex={0}
        onClick={() => window.getSelection()?.toString() === "" && inputRef.current?.focus()}
        className="mono h-[16rem] space-y-4 overflow-y-auto px-4 py-4 text-[0.8rem] leading-relaxed sm:h-[24rem] lg:h-[25rem]"
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
        <div className="flex items-center gap-3 px-4 py-2 sm:py-3">
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
            className="mono min-h-11 min-w-0 flex-1 bg-transparent text-base text-night-ink placeholder:text-night-mute focus:outline-none sm:min-h-0 sm:text-[0.9rem]"
          />
          <button
            type="submit"
            className="mono inline-flex h-11 shrink-0 items-center gap-2 rounded-sm border border-night-line px-3.5 text-xs text-night-ink transition-colors hover:border-night-ink sm:h-9"
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
              className="mono inline-flex min-h-11 items-center rounded-sm border border-night-line px-3.5 text-[0.8rem] text-night-mute transition-colors hover:border-night-ink hover:text-night-ink sm:min-h-0 sm:px-2.5 sm:py-1 sm:text-xs"
            >
              {name}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
