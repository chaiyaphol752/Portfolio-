import { locales, localeMeta, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { pages } from "@/config/pages";
import { profile } from "@/config/profile";
import { common } from "@/content/common";
import { commandCenterContent } from "@/content/command-center";
import { skillGroups, stackRows } from "./data";
import type { OutputLine, TerminalContext } from "./engine";

/** Assembles the serializable, localized context the client terminal runs against. */
export function buildTerminalContext(locale: Locale): TerminalContext {
  const t = commandCenterContent[locale].terminal;
  const c = common[locale];
  const arch = commandCenterContent[locale].architecture;

  const row = (label: string, text: string): OutputLine => ({ kind: "row", label, text });
  const heading = (text: string): OutputLine => ({ kind: "heading", text });

  const about: OutputLine[] = [
    heading(t.about.heading),
    { kind: "text", text: t.about.text },
    row(t.labels.name, profile.name),
    row(t.labels.location, profile.location[locale]),
    row(t.labels.availability, c.footer.availability[profile.availability]),
  ];

  const contact: OutputLine[] = [
    heading(t.contact.heading),
    { kind: "text", text: t.contact.text },
    row(t.labels.form, `${localizedPath(locale, "systems")}#contact`),
    row(t.labels.github, profile.links.github),
    ...(profile.email ? [row(t.labels.email, profile.email)] : []),
    { kind: "muted", text: t.contact.hint },
  ];

  return {
    locale,
    messages: { ...t.messages },
    pages: pages.map((p) => ({ id: p.id, slug: p.slug, number: p.number, label: c.nav[p.id] })),
    locales: locales.map((code) => ({ code, name: localeMeta[code].name })),
    sections: {
      about,
      contact,
      skills: [heading(t.skills.heading), ...skillGroups.map((g) => row(t.skills.groups[g.id], g.items.join(" · ")))],
      projects: [
        heading(t.projects.heading),
        { kind: "text", text: t.projects.text },
        row(t.projects.categories, t.projects.categoryList),
        { kind: "muted", text: t.projects.hint },
      ],
      stack: [heading(t.stack.heading), ...stackRows.map((r) => row(t.stack.rows[r.id], r.value))],
      ai: [heading(t.ai.heading), { kind: "text", text: t.ai.text }, row("→", t.ai.steps.join(" → ")), { kind: "muted", text: t.ai.hint }],
      architecture: [
        heading(t.architecture.heading),
        ...arch.nodes.map((n, i) => row(String(i + 1).padStart(2, "0"), `${n.label} — ${n.path}`)),
        { kind: "muted", text: t.architecture.hint },
      ],
    },
  };
}
