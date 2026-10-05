"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CornerDownLeft } from "lucide-react";
import { pages } from "@/config/pages";
import { mailtoHref, profile } from "@/config/profile";
import { localizedPath, switchLocalePath } from "@/i18n/routing";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/remember";
import type { CommonContent } from "@/content/common";
import { interpolate } from "@/lib/interpolate";

const OPEN_EVENT = "portfolio:open-palette";

/** Lets any client component (header button, terminal demo) open the palette. */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

interface Command {
  id: string;
  group: "pages" | "actions";
  label: string;
  hint?: string;
  run: () => void;
}

interface Props {
  locale: Locale;
  t: CommonContent;
  githubUrl: string;
  sourceUrl: string;
}

export function CommandPalette({ locale, t, githubUrl, sourceUrl }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const open = (url: string) => () => window.open(url, "_blank", "noopener,noreferrer");
    const pageCommands: Command[] = pages.filter((p) => p.listed).map((p) => ({
      id: `page-${p.id}`,
      group: "pages",
      label: t.nav[p.id],
      hint: t.navHint[p.id],
      run: go(localizedPath(locale, p.slug)),
    }));
    const switchCommands: Command[] = locales
      .filter((l) => l !== locale)
      .map((l) => ({
        id: `lang-${l}`,
        group: "actions",
        label: interpolate(t.commandPalette.switchTo, { language: localeMeta[l].name }),
        hint: localeMeta[l].label,
        run: () => {
          rememberLocale(l);
          router.push(switchLocalePath(pathname, l));
        },
      }));
    return [
      ...pageCommands,
      { id: "contact", group: "actions", label: t.commandPalette.contact, hint: "↵", run: go(localizedPath(locale, "contact")) },
      { id: "email", group: "actions", label: t.commandPalette.email, hint: profile.contact.email, run: () => { window.location.href = mailtoHref; } },
      { id: "phone", group: "actions", label: t.commandPalette.phone, hint: profile.contact.phone.display, run: () => { window.location.href = profile.contact.phone.href; } },
      { id: "github", group: "actions", label: t.commandPalette.github, hint: "↗", run: open(githubUrl) },
      { id: "source", group: "actions", label: t.commandPalette.source, hint: "↗", run: open(sourceUrl) },
      ...switchCommands,
    ];
  }, [locale, t, router, pathname, githubUrl, sourceUrl]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    const openDialog = () => {
      setQuery("");
      setActive(0);
      dialogRef.current?.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) dialogRef.current.close();
        else openDialog();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, openDialog);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, openDialog);
    };
  }, []);

  // Keep the keyboard-active option visible while arrowing through a long list.
  const activeId = results[active] ? `${listId}-${results[active].id}` : undefined;
  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  const run = (command: Command | undefined) => {
    if (!command) return;
    dialogRef.current?.close();
    command.run();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    }
  };

  const groups = (["pages", "actions"] as const).map((g) => ({ g, items: results.filter((c) => c.group === g) }));

  return (
    <dialog
      ref={dialogRef}
      aria-label={t.commandPalette.hint}
      className="on-night night m-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] rounded-md border border-night-line p-0 shadow-2xl"
      onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
    >
      <div className="border-b border-night-line p-4">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-label={t.commandPalette.placeholder}
          placeholder={t.commandPalette.placeholder}
          className="mono w-full bg-transparent text-[0.95rem] text-night-ink placeholder:text-night-mute focus:outline-none"
        />
      </div>
      <div id={listId} role="listbox" aria-label={t.commandPalette.hint} className="max-h-[50vh] overflow-y-auto p-2">
        {results.length === 0 && <p className="p-4 text-sm text-night-mute">{t.commandPalette.empty}</p>}
        {groups.map(({ g, items }) =>
          items.length ? (
            <div key={g} role="group" aria-label={t.commandPalette[g]}>
              <p className="eyebrow px-3 pb-1 pt-3">{t.commandPalette[g]}</p>
              {items.map((c) => {
                const isActive = results[active]?.id === c.id;
                return (
                  <div
                    key={c.id}
                    id={`${listId}-${c.id}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => setActive(results.indexOf(c))}
                    onClick={() => run(c)}
                    className={"flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5 text-sm " + (isActive ? "bg-night-3" : "")}
                  >
                    <span>{c.label}</span>
                    <span className="mono flex items-center gap-2 text-xs text-night-mute">
                      {c.hint}
                      {isActive && <CornerDownLeft className="size-3.5" aria-hidden />}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null,
        )}
      </div>
    </dialog>
  );
}
