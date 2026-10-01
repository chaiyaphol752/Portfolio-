import { locales, localeMeta, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { pages } from "@/config/pages";
import { mailtoHref, profile } from "@/config/profile";
import { common } from "@/content/common";
import { commandCenterContent } from "@/content/command-center";
import { agentRoles, capabilityGroups, stackRows } from "./data";
import type { OutputLine, TerminalContext } from "./engine";

/** Assembles the serializable, localized context the client terminal runs against. */
export function buildTerminalContext(locale: Locale): TerminalContext {
  const content = commandCenterContent[locale];
  const t = content.terminal;
  const c = common[locale];

  const row = (label: string, text: string, href?: string): OutputLine => ({ kind: "row", label, text, ...(href ? { href } : {}) });
  const heading = (text: string): OutputLine => ({ kind: "heading", text });
  const muted = (text: string): OutputLine => ({ kind: "muted", text });
  const text = (value: string): OutputLine => ({ kind: "text", text: value });

  const contactPath = localizedPath(locale, "contact");
  const emailRow = row(t.labels.email, profile.contact.email, mailtoHref);
  const phoneRow = row(t.labels.phone, profile.contact.phone.display, profile.contact.phone.href);

  return {
    locale,
    messages: { ...t.messages },
    pages: pages.map((p) => ({ id: p.id, slug: p.slug, label: c.nav[p.id] })),
    locales: locales.map((code) => ({ code, name: localeMeta[code].name })),
    statusLabels: content.statusLabels,
    statusValues: content.values,
    sections: {
      about: [
        heading(t.about.heading),
        text(t.about.text),
        row(t.labels.name, profile.name),
        row(t.labels.location, profile.location[locale]),
        row(t.labels.availability, c.availability[profile.availability]),
        row(t.labels.github, profile.links.github, profile.links.github),
      ],
      services: [heading(t.services.heading), ...t.services.items.map((s) => row("·", s)), muted(t.services.hint)],
      capabilities: [
        heading(t.capabilities.heading),
        ...capabilityGroups.map((g) => row(t.capabilities.groups[g.id], g.items.join(" · "))),
        muted(t.capabilities.hint),
      ],
      projects: [heading(t.projects.heading), text(t.projects.text), muted(t.projects.hint)],
      stack: [heading(t.stack.heading), ...stackRows.map((r) => row(t.stack.rows[r.id], r.value)), row(t.labels.source, profile.sourceRepo, profile.sourceRepo)],
      ai: [heading(t.ai.heading), text(t.ai.text), ...content.panels.ai.roles.map((r) => row(r.name, r.role)), muted(t.ai.hint)],
      agents: [heading(t.agents.heading), text(t.agents.text), ...agentRoles.map((r) => row(r, t.agents.roles[r]))],
      "local-ai": [heading(t.localAi.heading), text(t.localAi.text), ...content.panels.localAi.items.map((i) => row("·", i)), muted(t.localAi.hint)],
      python: [heading(t.python.heading), text(t.python.text), row("→", content.panels.python.uses.join(" · "))],
      architecture: [
        heading(t.architecture.heading),
        ...content.architecture.nodes.map((n) => row(n.label, n.path)),
        muted(t.architecture.hint),
      ],
      contact: [heading(t.contact.heading), text(t.contact.text), row(t.labels.form, contactPath, contactPath), emailRow, phoneRow, muted(t.contact.hint)],
      email: [emailRow],
    },
  };
}
