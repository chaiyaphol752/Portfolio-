import type { Localized } from "@/i18n/config";

export const actorIds = ["human", "ai", "tools", "tests", "git", "deploy"] as const;
export type ActorId = (typeof actorIds)[number];

/**
 * Who is involved at each of the nine stages, in stage order.
 * 2 = leads the work, 1 = supports it, 0 = not involved.
 * Language-neutral, so it lives outside the localized copy.
 */
export const collaboration: Record<ActorId, readonly number[]> = {
  human: [2, 1, 2, 1, 1, 2, 1, 1, 2],
  ai: [1, 2, 1, 2, 2, 1, 2, 2, 1],
  tools: [0, 1, 0, 1, 2, 2, 2, 1, 2],
  tests: [0, 0, 1, 0, 1, 1, 2, 2, 1],
  git: [0, 0, 0, 1, 2, 2, 1, 2, 2],
  deploy: [0, 0, 0, 0, 0, 1, 1, 0, 2],
};

export interface StageContent {
  name: string;
  summary: string;
  human: string;
  ai: string;
  tools: string;
  artifacts: string[];
  gate: string;
}

export interface AiNativeContent {
  meta: { title: string; description: string };
  hero: { eyebrow: string; titleLead: string; titleEmph: string; lede: string; complexityLabel: string };
  definition: {
    eyebrow: string;
    title: string;
    body: string;
    is: { title: string; items: string[] };
    isNot: { title: string; items: string[] };
  };
  explorer: {
    eyebrow: string;
    title: string;
    intro: string;
    tablist: string;
    stage: string;
    panel: { human: string; ai: string; tools: string; artifacts: string; gate: string };
    matrix: {
      title: string;
      caption: string;
      actorHeader: string;
      scrollLabel: string;
      legend: { lead: string; support: string; none: string };
    };
    actors: Record<ActorId, string>;
  };
  stages: StageContent[];
  chain: {
    eyebrow: string;
    title: string;
    intro: string;
    diagramTitle: string;
    steps: { label: string; detail: string }[];
    footnote: string;
  };
  practices: { eyebrow: string; title: string; intro: string; items: { name: string; text: string }[] };
  clients: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  cta: { label: string; title: string };
}

const en: AiNativeContent = {
  meta: {
    title: "AI-native development",
    description:
      "What an AI-native developer actually does: AI agents speed up the workflow, while human judgment, tests and Git keep the outcome under control.",
  },
  hero: {
    eyebrow: "AI-native development",
    titleLead: "AI accelerates the workflow.",
    titleEmph: "Human judgment controls the outcome.",
    lede: "What “AI-native” means in practice: a faster loop from idea to production, with a person accountable for every decision along the way.",
    complexityLabel: "Complexity",
  },
  definition: {
    eyebrow: "The idea",
    title: "AI is the tool. The engineering stays human.",
    body: "AI agents are very good at drafting, searching, comparing and repeating. They are not accountable for the result. I use them to shorten the distance between a question and an answer, and I keep the decisions, the review and the responsibility.",
    is: {
      title: "What it is",
      items: [
        "A faster loop between idea, prototype and review",
        "AI used for research, drafts, refactors, reviews and test ideas",
        "Every change read, understood and approved by a person",
        "Tests, types and Git acting as the referee",
      ],
    },
    isNot: {
      title: "What it is not",
      items: [
        "Shipping code that nobody understands",
        "Trusting a summary over the documentation",
        "Skipping tests because the code “looks right”",
        "Pasting secrets or client data into a prompt",
      ],
    },
  },
  explorer: {
    eyebrow: "The workflow",
    title: "Nine stages, one rule: nothing moves on unverified.",
    intro: "Select a stage to see who does what, what it produces, and the gate it has to pass.",
    tablist: "Workflow stages",
    stage: "Stage",
    panel: {
      human: "Human judgment",
      ai: "AI agents",
      tools: "Engineering tools",
      artifacts: "Typical artifacts",
      gate: "Verification gate",
    },
    matrix: {
      title: "Who is involved, stage by stage",
      caption: "Even where the first row shows “supports”, every stage ends with a human gate. The matrix shows who leads the work and who assists.",
      actorHeader: "Participant",
      scrollLabel: "Collaboration matrix, scrolls horizontally on small screens",
      legend: { lead: "Leads", support: "Supports", none: "Not involved" },
    },
    actors: {
      human: "Human judgment",
      ai: "AI agents",
      tools: "Engineering tools",
      tests: "Tests",
      git: "Git",
      deploy: "Deployment",
    },
  },
  stages: [
    {
      name: "Understand",
      summary: "Turn a vague request into a problem worth solving.",
      human: "Ask the uncomfortable questions: who is this for, what does success look like, what is out of scope? Decide what actually matters.",
      ai: "Plays the skeptical colleague: restates the brief and surfaces ambiguities and edge cases that might have been skipped.",
      tools: "Notes, sketches, and existing product or analytics where they exist.",
      artifacts: ["One-page brief", "Open questions", "Success criteria"],
      gate: "The goal and its boundaries can be explained in plain language before any code exists.",
    },
    {
      name: "Research",
      summary: "Find out what is known before deciding what to build.",
      human: "Choose which sources to trust and which options are worth comparing.",
      ai: "Scans documentation, compares libraries and approaches, summarizes tradeoffs and drafts comparison tables.",
      tools: "Official docs, changelogs, package registries and source code.",
      artifacts: ["Options comparison", "Decision notes", "Links to primary sources"],
      gate: "Every claim that affects a decision is checked against primary documentation, not the summary.",
    },
    {
      name: "Plan",
      summary: "Decide the structure before writing the first component.",
      human: "Own the architecture: data model, boundaries, what to build first and what to postpone.",
      ai: "Explores alternative structures, drafts a specification and task breakdown, and points out risks.",
      tools: "Diagrams, an issue list and type definitions as early contracts.",
      artifacts: ["Specification", "Architecture sketch", "Ordered task list"],
      gate: "The plan fits on a page, and each tradeoff in it can be defended.",
    },
    {
      name: "Prototype",
      summary: "Compare options on screen instead of in theory.",
      human: "Judge the feel: does the flow make sense, is the hierarchy right, is this the simplest thing that could work?",
      ai: "Generates fast, throwaway variants of layout and interaction so options can be compared side by side.",
      tools: "Dev server, browser devtools and design tokens.",
      artifacts: ["Clickable prototype", "Chosen direction", "Rejected options, with reasons"],
      gate: "Prototype code is treated as disposable until a direction is chosen.",
    },
    {
      name: "Build",
      summary: "Turn the plan into small, typed, reviewable pieces.",
      human: "Set the conventions, write or approve every change, keep components small and boundaries clear.",
      ai: "Implements well-specified pieces, writes boilerplate and follows the patterns already in the codebase.",
      tools: "TypeScript strict mode, linter, formatter and framework conventions.",
      artifacts: ["Typed components", "Route handlers and actions", "Small, reviewable commits"],
      gate: "The type checker and linter pass, and every line that ships can be explained.",
    },
    {
      name: "Review",
      summary: "Read the change like a reviewer who did not write it.",
      human: "Check correctness, security, accessibility and naming with fresh, critical eyes.",
      ai: "A second pair of eyes: flags suspicious logic, missing cases and inconsistencies with the specification.",
      tools: "Git diff, static analysis and accessibility checks.",
      artifacts: ["Review notes", "Fix list", "Security and accessibility checklist"],
      gate: "AI findings are leads to verify, not verdicts: each one is confirmed, or dismissed with a reason.",
    },
    {
      name: "Test",
      summary: "Prove the behavior that matters, not the behavior that is easy.",
      human: "Decide what must never break and what a meaningful test looks like.",
      ai: "Drafts test cases and edge cases, finds gaps in coverage and helps reproduce bugs.",
      tools: "Vitest, type checks, the production build and browser checks.",
      artifacts: ["Unit and behavior tests", "Bug reproductions", "A green build"],
      gate: "Tests fail for the right reason before they pass, and the production build succeeds.",
    },
    {
      name: "Refactor",
      summary: "Make it simpler without changing what it does.",
      human: "Decide what is worth simplifying, and resist cleverness.",
      ai: "Proposes simplifications, extracts duplication and updates call sites mechanically.",
      tools: "Tests as a safety net, compiler errors as a to-do list, and Git history.",
      artifacts: ["Smaller modules", "Removed dead code", "Updated documentation"],
      gate: "Behavior is unchanged: tests stay green and the diff stays readable.",
    },
    {
      name: "Deploy",
      summary: "Release it, and stay accountable for what happens next.",
      human: "Approve the release and own what happens after it.",
      ai: "Reads build logs, explains failures, and drafts release notes and documentation.",
      tools: "Git, CI, Vercel preview and production deployments, and health checks.",
      artifacts: ["Preview deployment", "Production release", "Release notes", "Health check"],
      gate: "Preview verified, secrets checked, health endpoint green, and a way back known.",
    },
  ],
  chain: {
    eyebrow: "From idea to production",
    title: "Every arrow is a checkpoint.",
    intro: "An idea becomes software by passing through a sequence of artifacts. Each one is something a person can read, question and approve.",
    diagramTitle: "Idea to production",
    steps: [
      { label: "Idea", detail: "A need, stated in the client's own words." },
      { label: "Requirements", detail: "What must be true, and what is out of scope." },
      { label: "Specification", detail: "Behavior described precisely enough to test." },
      { label: "Architecture", detail: "Structure, data and boundaries, with tradeoffs written down." },
      { label: "Components", detail: "Small, typed pieces built to that structure." },
      { label: "Tests", detail: "Executable proof of the behavior that matters." },
      { label: "Review", detail: "The change read critically by a person before it merges." },
      { label: "Production", detail: "A deployed release, with health checks and a way back." },
    ],
    footnote: "A person signs off at each arrow before the next step begins.",
  },
  practices: {
    eyebrow: "Practices",
    title: "What the work looks like day to day.",
    intro: "The techniques in use, and the guardrail that comes with each.",
    items: [
      { name: "AI-assisted research", text: "Summaries and comparisons to map options quickly. Claims that matter are checked against primary documentation." },
      { name: "Agentic coding workflows", text: "Agents take well-scoped tasks in small steps. The scope is set by a person, the result is read, and commits stay reviewable." },
      { name: "Architecture exploration", text: "Alternative structures are sketched and argued against each other. The decision, and the reason for it, stay human." },
      { name: "Debugging support", text: "Hypotheses and log reading, faster. A fix counts only when the bug can be reproduced and then seen to disappear." },
      { name: "Refactoring assistance", text: "Mechanical changes across many files. Tests run before and after, so behavior stays the same." },
      { name: "Code review", text: "An AI pass catches what tired eyes miss. Every finding is verified, or dismissed with a reason." },
      { name: "Test generation", text: "Drafts of cases and edge cases. A person decides what a meaningful test is and checks that it fails for the right reason." },
      { name: "Documentation", text: "First drafts of READMEs and notes, produced from real code and corrected against what the code actually does." },
      { name: "Automation", text: "Repetitive chores scripted once: checks, builds, releases. The scripts are code too, and reviewed like it." },
      { name: "Structured prompting", text: "Context, constraints and acceptance criteria up front. A good brief is the cheapest form of quality control." },
      { name: "Human verification", text: "The rule behind all of the above: nothing ships that a person has not read, understood and tested." },
    ],
  },
  clients: {
    eyebrow: "For your project",
    title: "What this changes for you.",
    items: [
      { title: "Clear communication", text: "Specifications and decisions are written down, so you always know what is being built and why." },
      { title: "Maintainable code", text: "Typed, tested and reviewed, so someone else can pick it up without a guided tour." },
      { title: "Verifiable results", text: "Tests, previews and a health check back up claims instead of promises." },
      { title: "An honest pace", text: "AI shortens loops, not corners. Timelines reflect the review and testing that still have to happen." },
    ],
  },
  cta: { label: "Discuss a project", title: "Want a faster loop without lower standards?" },
};

const de: AiNativeContent = {
  meta: {
    title: "KI-native Entwicklung",
    description:
      "Was KI-natives Entwickeln wirklich bedeutet: KI-Agenten beschleunigen den Ablauf, während menschliches Urteilsvermögen, Tests und Git das Ergebnis unter Kontrolle halten.",
  },
  hero: {
    eyebrow: "KI-native Entwicklung",
    titleLead: "KI beschleunigt den Ablauf.",
    titleEmph: "Menschliches Urteil steuert das Ergebnis.",
    lede: "Was „KI-nativ“ in der Praxis heißt: ein schnellerer Weg von der Idee bis in die Produktion, bei dem eine Person für jede Entscheidung verantwortlich bleibt.",
    complexityLabel: "Komplexität",
  },
  definition: {
    eyebrow: "Der Gedanke",
    title: "KI ist das Werkzeug. Die Ingenieursarbeit bleibt menschlich.",
    body: "KI-Agenten sind sehr gut darin, zu entwerfen, zu suchen, zu vergleichen und zu wiederholen. Für das Ergebnis haften sie nicht. Ich nutze sie, um den Weg von der Frage zur Antwort zu verkürzen, und behalte Entscheidungen, Prüfung und Verantwortung.",
    is: {
      title: "Was es ist",
      items: [
        "Ein schnellerer Kreislauf aus Idee, Prototyp und Review",
        "KI für Recherche, Entwürfe, Refactorings, Reviews und Testideen",
        "Jede Änderung von einer Person gelesen, verstanden und freigegeben",
        "Tests, Typen und Git als Schiedsrichter",
      ],
    },
    isNot: {
      title: "Was es nicht ist",
      items: [
        "Code ausliefern, den niemand versteht",
        "Einer Zusammenfassung mehr trauen als der Dokumentation",
        "Tests weglassen, weil der Code „richtig aussieht“",
        "Geheimnisse oder Kundendaten in einen Prompt kopieren",
      ],
    },
  },
  explorer: {
    eyebrow: "Der Ablauf",
    title: "Neun Phasen, eine Regel: Nichts geht ungeprüft weiter.",
    intro: "Wähle eine Phase, um zu sehen, wer was tut, was dabei entsteht und welche Hürde sie nehmen muss.",
    tablist: "Phasen des Ablaufs",
    stage: "Phase",
    panel: {
      human: "Menschliches Urteil",
      ai: "KI-Agenten",
      tools: "Entwicklungswerkzeuge",
      artifacts: "Typische Ergebnisse",
      gate: "Prüfpunkt",
    },
    matrix: {
      title: "Wer wann beteiligt ist",
      caption: "Auch wo in der ersten Zeile „unterstützt“ steht, endet jede Phase mit einem menschlichen Prüfpunkt. Die Matrix zeigt, wer die Arbeit führt und wer unterstützt.",
      actorHeader: "Beteiligte",
      scrollLabel: "Zusammenarbeitsmatrix, auf kleinen Bildschirmen horizontal scrollbar",
      legend: { lead: "Führt", support: "Unterstützt", none: "Nicht beteiligt" },
    },
    actors: {
      human: "Menschliches Urteil",
      ai: "KI-Agenten",
      tools: "Entwicklungswerkzeuge",
      tests: "Tests",
      git: "Git",
      deploy: "Deployment",
    },
  },
  stages: [
    {
      name: "Verstehen",
      summary: "Aus einer vagen Anfrage ein lohnendes Problem machen.",
      human: "Die unbequemen Fragen stellen: Für wen ist das, woran erkennt man Erfolg, was gehört nicht dazu? Entscheiden, was wirklich zählt.",
      ai: "Spielt die skeptische Kollegin oder den skeptischen Kollegen: formuliert den Auftrag neu und bringt Unklarheiten und Randfälle zutage, die sonst übersehen würden.",
      tools: "Notizen, Skizzen sowie bestehendes Produkt oder Analysedaten, falls vorhanden.",
      artifacts: ["Briefing auf einer Seite", "Offene Fragen", "Erfolgskriterien"],
      gate: "Ziel und Grenzen lassen sich in einfachen Worten erklären, bevor es Code gibt.",
    },
    {
      name: "Recherchieren",
      summary: "Klären, was bekannt ist, bevor entschieden wird, was gebaut wird.",
      human: "Auswählen, welchen Quellen zu trauen ist und welche Optionen den Vergleich lohnen.",
      ai: "Durchsucht Dokumentationen, vergleicht Bibliotheken und Ansätze, fasst Abwägungen zusammen und entwirft Vergleichstabellen.",
      tools: "Offizielle Dokumentation, Changelogs, Paketregister und Quellcode.",
      artifacts: ["Optionsvergleich", "Entscheidungsnotizen", "Links zu Primärquellen"],
      gate: "Jede Aussage, die eine Entscheidung beeinflusst, wird an der Primärdokumentation geprüft, nicht an der Zusammenfassung.",
    },
    {
      name: "Planen",
      summary: "Die Struktur festlegen, bevor die erste Komponente entsteht.",
      human: "Die Architektur verantworten: Datenmodell, Grenzen, was zuerst gebaut wird und was warten kann.",
      ai: "Erkundet alternative Strukturen, entwirft Spezifikation und Aufgabenzerlegung und weist auf Risiken hin.",
      tools: "Diagramme, eine Aufgabenliste und Typdefinitionen als frühe Verträge.",
      artifacts: ["Spezifikation", "Architekturskizze", "Geordnete Aufgabenliste"],
      gate: "Der Plan passt auf eine Seite, und jede darin enthaltene Abwägung lässt sich verteidigen.",
    },
    {
      name: "Prototyp",
      summary: "Optionen am Bildschirm vergleichen statt in der Theorie.",
      human: "Das Gefühl beurteilen: Ergibt der Ablauf Sinn, stimmt die Hierarchie, ist das die einfachste funktionierende Lösung?",
      ai: "Erzeugt schnelle Wegwerfvarianten von Layout und Interaktion, damit sich Optionen nebeneinander vergleichen lassen.",
      tools: "Dev-Server, Browser-Devtools und Design-Tokens.",
      artifacts: ["Klickbarer Prototyp", "Gewählte Richtung", "Verworfene Optionen samt Gründen"],
      gate: "Prototyp-Code gilt als Wegwerfware, bis eine Richtung feststeht.",
    },
    {
      name: "Bauen",
      summary: "Den Plan in kleine, typisierte, prüfbare Teile überführen.",
      human: "Konventionen festlegen, jede Änderung selbst schreiben oder freigeben, Komponenten klein und Grenzen klar halten.",
      ai: "Setzt klar spezifizierte Teile um, schreibt Boilerplate und folgt den Mustern, die es im Code bereits gibt.",
      tools: "TypeScript im Strict-Modus, Linter, Formatter und Framework-Konventionen.",
      artifacts: ["Typisierte Komponenten", "Route-Handler und Actions", "Kleine, prüfbare Commits"],
      gate: "Typprüfung und Linter laufen durch, und jede ausgelieferte Zeile lässt sich erklären.",
    },
    {
      name: "Review",
      summary: "Die Änderung lesen wie jemand, der sie nicht geschrieben hat.",
      human: "Korrektheit, Sicherheit, Barrierefreiheit und Benennung mit frischem, kritischem Blick prüfen.",
      ai: "Ein zweites Augenpaar: markiert verdächtige Logik, fehlende Fälle und Abweichungen von der Spezifikation.",
      tools: "Git-Diff, statische Analyse und Barrierefreiheitsprüfungen.",
      artifacts: ["Review-Notizen", "Fehlerliste", "Checkliste für Sicherheit und Barrierefreiheit"],
      gate: "Befunde der KI sind Hinweise zum Überprüfen, keine Urteile: Jeder wird bestätigt oder mit Begründung verworfen.",
    },
    {
      name: "Testen",
      summary: "Das Verhalten belegen, auf das es ankommt, nicht das bequeme.",
      human: "Entscheiden, was nie kaputtgehen darf und wie ein aussagekräftiger Test aussieht.",
      ai: "Entwirft Testfälle und Randfälle, findet Lücken in der Abdeckung und hilft, Fehler nachzustellen.",
      tools: "Vitest, Typprüfungen, der Produktions-Build und Browserprüfungen.",
      artifacts: ["Unit- und Verhaltenstests", "Fehlerreproduktionen", "Ein grüner Build"],
      gate: "Tests scheitern aus dem richtigen Grund, bevor sie bestehen, und der Produktions-Build gelingt.",
    },
    {
      name: "Refactoring",
      summary: "Es einfacher machen, ohne zu verändern, was es tut.",
      human: "Entscheiden, was sich zu vereinfachen lohnt, und Cleverness widerstehen.",
      ai: "Schlägt Vereinfachungen vor, zieht Duplikate zusammen und passt Aufrufstellen mechanisch an.",
      tools: "Tests als Sicherheitsnetz, Compilerfehler als To-do-Liste und die Git-Historie.",
      artifacts: ["Kleinere Module", "Entfernter toter Code", "Aktualisierte Dokumentation"],
      gate: "Das Verhalten bleibt gleich: Tests bleiben grün, und der Diff bleibt lesbar.",
    },
    {
      name: "Ausliefern",
      summary: "Veröffentlichen und für das Danach verantwortlich bleiben.",
      human: "Den Release freigeben und verantworten, was danach geschieht.",
      ai: "Liest Build-Logs, erklärt Fehlschläge und entwirft Release-Notes und Dokumentation.",
      tools: "Git, CI, Vercel-Preview- und Produktions-Deployments sowie Health-Checks.",
      artifacts: ["Preview-Deployment", "Produktions-Release", "Release-Notes", "Health-Check"],
      gate: "Preview geprüft, Geheimnisse kontrolliert, Health-Endpoint grün und ein Weg zurück bekannt.",
    },
  ],
  chain: {
    eyebrow: "Von der Idee zur Produktion",
    title: "Jeder Pfeil ist ein Prüfpunkt.",
    intro: "Aus einer Idee wird Software, indem sie eine Folge von Ergebnissen durchläuft. Jedes davon kann eine Person lesen, hinterfragen und freigeben.",
    diagramTitle: "Von der Idee zur Produktion",
    steps: [
      { label: "Idee", detail: "Ein Bedarf, in den Worten der Kundschaft." },
      { label: "Anforderungen", detail: "Was gelten muss und was nicht dazugehört." },
      { label: "Spezifikation", detail: "Verhalten, so genau beschrieben, dass es sich testen lässt." },
      { label: "Architektur", detail: "Struktur, Daten und Grenzen, die Abwägungen schriftlich." },
      { label: "Komponenten", detail: "Kleine, typisierte Teile nach dieser Struktur." },
      { label: "Tests", detail: "Ausführbarer Beleg für das Verhalten, auf das es ankommt." },
      { label: "Review", detail: "Die Änderung kritisch von einer Person gelesen, bevor sie zusammengeführt wird." },
      { label: "Produktion", detail: "Ein ausgelieferter Release mit Health-Checks und einem Weg zurück." },
    ],
    footnote: "An jedem Pfeil gibt eine Person frei, bevor der nächste Schritt beginnt.",
  },
  practices: {
    eyebrow: "Praktiken",
    title: "Wie die Arbeit im Alltag aussieht.",
    intro: "Die eingesetzten Techniken und die Leitplanke, die zu jeder gehört.",
    items: [
      { name: "KI-gestützte Recherche", text: "Zusammenfassungen und Vergleiche, um Optionen schnell zu sichten. Relevante Aussagen werden an der Primärdokumentation geprüft." },
      { name: "Agentische Coding-Workflows", text: "Agenten übernehmen klar umrissene Aufgaben in kleinen Schritten. Den Rahmen setzt eine Person, das Ergebnis wird gelesen, Commits bleiben prüfbar." },
      { name: "Architekturvarianten erkunden", text: "Alternative Strukturen werden skizziert und gegeneinander abgewogen. Die Entscheidung und ihre Begründung bleiben menschlich." },
      { name: "Unterstützung beim Debuggen", text: "Hypothesen und Logauswertung, schneller. Eine Korrektur zählt erst, wenn sich der Fehler reproduzieren und danach verschwinden sieht." },
      { name: "Hilfe beim Refactoring", text: "Mechanische Änderungen über viele Dateien. Tests laufen davor und danach, damit das Verhalten gleich bleibt." },
      { name: "Code-Review", text: "Ein KI-Durchgang findet, was müde Augen übersehen. Jeder Befund wird geprüft oder mit Begründung verworfen." },
      { name: "Testgenerierung", text: "Entwürfe für Fälle und Randfälle. Eine Person entscheidet, was ein aussagekräftiger Test ist, und prüft, ob er aus dem richtigen Grund scheitert." },
      { name: "Dokumentation", text: "Erste Entwürfe für READMEs und Notizen, aus echtem Code erzeugt und an dem korrigiert, was der Code tatsächlich tut." },
      { name: "Automatisierung", text: "Wiederkehrende Aufgaben einmal als Skript: Prüfungen, Builds, Releases. Auch Skripte sind Code und werden entsprechend geprüft." },
      { name: "Strukturiertes Prompting", text: "Kontext, Randbedingungen und Abnahmekriterien vorab. Ein gutes Briefing ist die günstigste Form der Qualitätssicherung." },
      { name: "Menschliche Verifikation", text: "Die Regel hinter allem: Nichts geht live, was nicht eine Person gelesen, verstanden und getestet hat." },
    ],
  },
  clients: {
    eyebrow: "Für dein Projekt",
    title: "Was sich für dich dadurch ändert.",
    items: [
      { title: "Klare Kommunikation", text: "Spezifikationen und Entscheidungen sind schriftlich festgehalten, du weißt also stets, was gebaut wird und warum." },
      { title: "Wartbarer Code", text: "Typisiert, getestet und geprüft, damit andere ihn ohne Führung übernehmen können." },
      { title: "Überprüfbare Ergebnisse", text: "Tests, Vorschauen und ein Health-Check untermauern Aussagen, statt Versprechen zu machen." },
      { title: "Ehrliches Tempo", text: "KI verkürzt Schleifen, nicht Standards. Zeitpläne berücksichtigen Review und Tests, die weiterhin nötig sind." },
    ],
  },
  cta: { label: "Projekt besprechen", title: "Schneller arbeiten, ohne Abstriche bei der Qualität?" },
};

const th: AiNativeContent = {
  meta: {
    title: "การพัฒนาแบบ AI-native",
    description: "การพัฒนาแบบ AI-native ในทางปฏิบัติเป็นอย่างไร เอเจนต์ AI ช่วยเร่งขั้นตอนการทำงาน ส่วนวิจารณญาณของมนุษย์ การทดสอบ และ Git ควบคุมผลลัพธ์ไว้",
  },
  hero: {
    eyebrow: "การพัฒนาแบบ AI-native",
    titleLead: "AI เร่งขั้นตอนการทำงาน",
    titleEmph: "วิจารณญาณของมนุษย์ควบคุมผลลัพธ์",
    lede: "“AI-native” ในทางปฏิบัติ คือวงจรที่เร็วขึ้นจากไอเดียสู่ระบบจริง โดยมีคนรับผิดชอบทุกการตัดสินใจตลอดทาง",
    complexityLabel: "ความซับซ้อน",
  },
  definition: {
    eyebrow: "แนวคิด",
    title: "AI คือเครื่องมือ งานวิศวกรรมยังเป็นของมนุษย์",
    body: "เอเจนต์ AI เก่งเรื่องการร่างงาน ค้นหา เปรียบเทียบ และทำซ้ำ แต่ไม่ต้องรับผิดชอบต่อผลลัพธ์ จึงใช้เพื่อย่นระยะจากคำถามสู่คำตอบ ส่วนการตัดสินใจ การตรวจทาน และความรับผิดชอบยังอยู่กับคน",
    is: {
      title: "สิ่งที่เป็น",
      items: [
        "วงจรที่เร็วขึ้นระหว่างไอเดีย ต้นแบบ และการรีวิว",
        "ใช้ AI กับงานค้นคว้า ร่างงาน รีแฟกเตอร์ รีวิว และไอเดียสำหรับการทดสอบ",
        "ทุกการเปลี่ยนแปลงมีคนอ่าน เข้าใจ และอนุมัติ",
        "ให้การทดสอบ ชนิดข้อมูล และ Git ทำหน้าที่เป็นกรรมการ",
      ],
    },
    isNot: {
      title: "สิ่งที่ไม่ใช่",
      items: [
        "ส่งมอบโค้ดที่ไม่มีใครเข้าใจ",
        "เชื่อบทสรุปมากกว่าเอกสารต้นทาง",
        "ข้ามการทดสอบเพราะโค้ด “ดูถูกต้อง”",
        "นำความลับหรือข้อมูลลูกค้าไปวางในพรอมต์",
      ],
    },
  },
  explorer: {
    eyebrow: "ขั้นตอนการทำงาน",
    title: "เก้าขั้น กฎข้อเดียว: ไม่มีอะไรไปต่อโดยไม่ผ่านการตรวจสอบ",
    intro: "เลือกขั้นตอนเพื่อดูว่าใครทำอะไร ผลลัพธ์คืออะไร และต้องผ่านจุดตรวจใด",
    tablist: "ขั้นตอนการทำงาน",
    stage: "ขั้นที่",
    panel: {
      human: "วิจารณญาณของมนุษย์",
      ai: "เอเจนต์ AI",
      tools: "เครื่องมือวิศวกรรม",
      artifacts: "ผลงานที่มักได้",
      gate: "จุดตรวจสอบ",
    },
    matrix: {
      title: "ใครมีส่วนร่วมในแต่ละขั้น",
      caption: "แม้แถวแรกจะแสดงว่า “สนับสนุน” ทุกขั้นก็จบด้วยจุดตรวจโดยมนุษย์ ตารางนี้แสดงว่าใครนำงานและใครช่วยสนับสนุน",
      actorHeader: "ผู้มีส่วนร่วม",
      scrollLabel: "ตารางการทำงานร่วมกัน เลื่อนแนวนอนได้บนจอขนาดเล็ก",
      legend: { lead: "เป็นผู้นำ", support: "สนับสนุน", none: "ไม่เกี่ยวข้อง" },
    },
    actors: {
      human: "วิจารณญาณของมนุษย์",
      ai: "เอเจนต์ AI",
      tools: "เครื่องมือวิศวกรรม",
      tests: "การทดสอบ",
      git: "Git",
      deploy: "การดีพลอย",
    },
  },
  stages: [
    {
      name: "ทำความเข้าใจ",
      summary: "เปลี่ยนคำขอที่คลุมเครือให้เป็นโจทย์ที่คุ้มค่าแก่การแก้",
      human: "ถามคำถามที่ตอบยาก เช่น ทำให้ใคร ความสำเร็จหน้าตาเป็นอย่างไร อะไรอยู่นอกขอบเขต และตัดสินใจว่าอะไรสำคัญจริง",
      ai: "รับบทเพื่อนร่วมงานที่ช่างสงสัย สรุปโจทย์ซ้ำ และชี้จุดคลุมเครือกับกรณีสุดขอบที่อาจถูกมองข้าม",
      tools: "บันทึก ภาพสเก็ตช์ รวมถึงผลิตภัณฑ์หรือข้อมูลวิเคราะห์เดิม หากมี",
      artifacts: ["สรุปโจทย์หนึ่งหน้า", "คำถามที่ยังค้างอยู่", "เกณฑ์วัดความสำเร็จ"],
      gate: "อธิบายเป้าหมายและขอบเขตด้วยภาษาง่าย ๆ ได้ก่อนจะมีโค้ดใด ๆ",
    },
    {
      name: "ค้นคว้า",
      summary: "ดูให้รู้ว่ามีอะไรที่รู้กันอยู่แล้ว ก่อนตัดสินใจว่าจะสร้างอะไร",
      human: "เลือกว่าจะเชื่อแหล่งข้อมูลใด และตัวเลือกใดคุ้มค่าแก่การนำมาเปรียบเทียบ",
      ai: "ไล่อ่านเอกสาร เปรียบเทียบไลบรารีและแนวทาง สรุปข้อแลกเปลี่ยน และร่างตารางเปรียบเทียบ",
      tools: "เอกสารทางการ บันทึกการเปลี่ยนแปลงเวอร์ชัน ทะเบียนแพ็กเกจ และซอร์สโค้ด",
      artifacts: ["ตารางเปรียบเทียบตัวเลือก", "บันทึกการตัดสินใจ", "ลิงก์ไปยังแหล่งข้อมูลต้นทาง"],
      gate: "ทุกข้อกล่าวอ้างที่กระทบการตัดสินใจถูกตรวจกับเอกสารต้นทาง ไม่ใช่ตรวจกับบทสรุป",
    },
    {
      name: "วางแผน",
      summary: "กำหนดโครงสร้างก่อนเขียนคอมโพเนนต์แรก",
      human: "รับผิดชอบสถาปัตยกรรม ทั้งโมเดลข้อมูล ขอบเขตของแต่ละส่วน อะไรควรสร้างก่อน และอะไรควรเลื่อนไว้",
      ai: "สำรวจโครงสร้างทางเลือก ร่างข้อกำหนดและแตกงานย่อย พร้อมชี้ความเสี่ยง",
      tools: "แผนภาพ รายการงาน และนิยามชนิดข้อมูลในฐานะสัญญาตั้งแต่ต้น",
      artifacts: ["ข้อกำหนด", "ภาพร่างสถาปัตยกรรม", "รายการงานเรียงลำดับ"],
      gate: "แผนอยู่ในหนึ่งหน้ากระดาษ และปกป้องข้อแลกเปลี่ยนทุกข้อในแผนได้",
    },
    {
      name: "สร้างต้นแบบ",
      summary: "เปรียบเทียบตัวเลือกบนหน้าจอ ไม่ใช่ในทฤษฎี",
      human: "ตัดสินความรู้สึก ขั้นตอนสมเหตุสมผลไหม ลำดับความสำคัญถูกต้องไหม และนี่คือสิ่งที่เรียบง่ายที่สุดที่ใช้ได้หรือเปล่า",
      ai: "สร้างตัวแปรเลย์เอาต์และการโต้ตอบแบบใช้แล้วทิ้งอย่างรวดเร็ว เพื่อเทียบตัวเลือกเคียงกัน",
      tools: "เซิร์ฟเวอร์สำหรับพัฒนา เครื่องมือนักพัฒนาในเบราว์เซอร์ และดีไซน์โทเคน",
      artifacts: ["ต้นแบบที่กดใช้งานได้", "แนวทางที่เลือก", "ตัวเลือกที่ตัดทิ้งพร้อมเหตุผล"],
      gate: "โค้ดต้นแบบถือเป็นของใช้แล้วทิ้ง จนกว่าจะเลือกแนวทางได้",
    },
    {
      name: "สร้างจริง",
      summary: "เปลี่ยนแผนให้เป็นชิ้นเล็ก ๆ ที่กำหนดชนิดข้อมูลและรีวิวได้",
      human: "กำหนดข้อตกลงร่วม เขียนหรืออนุมัติทุกการเปลี่ยนแปลง รักษาคอมโพเนนต์ให้เล็กและขอบเขตให้ชัด",
      ai: "ลงมือทำชิ้นงานที่ระบุรายละเอียดชัดเจน เขียนโค้ดส่วนซ้ำ ๆ และทำตามรูปแบบที่มีอยู่ในโค้ดเบสแล้ว",
      tools: "TypeScript โหมดเข้มงวด ลินเตอร์ ตัวจัดรูปแบบ และข้อตกลงของเฟรมเวิร์ก",
      artifacts: ["คอมโพเนนต์ที่กำหนดชนิดข้อมูล", "Route handler และ action", "คอมมิตเล็ก ๆ ที่รีวิวง่าย"],
      gate: "ตัวตรวจชนิดข้อมูลและลินเตอร์ผ่าน และอธิบายได้ทุกบรรทัดที่ส่งขึ้นระบบ",
    },
    {
      name: "รีวิว",
      summary: "อ่านการเปลี่ยนแปลงเหมือนผู้รีวิวที่ไม่ได้เขียนมันเอง",
      human: "ตรวจความถูกต้อง ความปลอดภัย การเข้าถึงได้ และการตั้งชื่อ ด้วยสายตาใหม่และเชิงวิพากษ์",
      ai: "เป็นสายตาคู่ที่สอง ชี้ตรรกะน่าสงสัย กรณีที่ขาดหาย และจุดที่ไม่สอดคล้องกับข้อกำหนด",
      tools: "Git diff การวิเคราะห์โค้ดแบบสถิต และการตรวจการเข้าถึงได้",
      artifacts: ["บันทึกการรีวิว", "รายการที่ต้องแก้", "รายการตรวจด้านความปลอดภัยและการเข้าถึงได้"],
      gate: "ข้อสังเกตจาก AI เป็นเบาะแสที่ต้องตรวจสอบ ไม่ใช่คำตัดสิน ทุกข้อต้องยืนยัน หรือปัดตกพร้อมเหตุผล",
    },
    {
      name: "ทดสอบ",
      summary: "พิสูจน์พฤติกรรมที่สำคัญ ไม่ใช่พฤติกรรมที่ทดสอบง่าย",
      human: "ตัดสินใจว่าอะไรห้ามพังเด็ดขาด และการทดสอบที่มีความหมายควรเป็นแบบใด",
      ai: "ร่างกรณีทดสอบและกรณีสุดขอบ หาช่องว่างของการครอบคลุม และช่วยทำซ้ำบั๊ก",
      tools: "Vitest การตรวจชนิดข้อมูล การบิลด์สำหรับใช้งานจริง และการตรวจในเบราว์เซอร์",
      artifacts: ["การทดสอบหน่วยและพฤติกรรม", "ขั้นตอนทำซ้ำบั๊ก", "บิลด์ที่ผ่านทั้งหมด"],
      gate: "การทดสอบต้องล้มเหลวด้วยเหตุผลที่ถูกต้องก่อนจะผ่าน และบิลด์สำหรับใช้งานจริงต้องสำเร็จ",
    },
    {
      name: "รีแฟกเตอร์",
      summary: "ทำให้เรียบง่ายขึ้นโดยไม่เปลี่ยนสิ่งที่มันทำ",
      human: "ตัดสินว่าอะไรคุ้มค่าแก่การทำให้เรียบง่าย และหลีกเลี่ยงความเจ้าปัญญา",
      ai: "เสนอการทำให้เรียบง่ายขึ้น แยกโค้ดซ้ำ และปรับจุดเรียกใช้งานแบบอัตโนมัติ",
      tools: "การทดสอบเป็นตาข่ายนิรภัย ข้อผิดพลาดจากคอมไพเลอร์เป็นรายการสิ่งที่ต้องทำ และประวัติ Git",
      artifacts: ["โมดูลที่เล็กลง", "โค้ดที่ไม่ใช้แล้วถูกลบ", "เอกสารที่อัปเดต"],
      gate: "พฤติกรรมไม่เปลี่ยน การทดสอบยังผ่านหมด และ diff ยังอ่านง่าย",
    },
    {
      name: "ดีพลอย",
      summary: "ปล่อยงานออกไป และรับผิดชอบสิ่งที่เกิดขึ้นต่อจากนั้น",
      human: "อนุมัติการปล่อยเวอร์ชัน และรับผิดชอบสิ่งที่เกิดขึ้นหลังจากนั้น",
      ai: "อ่านบันทึกการบิลด์ อธิบายสาเหตุที่ล้มเหลว และร่างบันทึกการปล่อยเวอร์ชันกับเอกสาร",
      tools: "Git, CI, การดีพลอยแบบพรีวิวและใช้งานจริงบน Vercel และการตรวจสุขภาพระบบ",
      artifacts: ["การดีพลอยแบบพรีวิว", "เวอร์ชันใช้งานจริง", "บันทึกการปล่อยเวอร์ชัน", "การตรวจสุขภาพระบบ"],
      gate: "ตรวจพรีวิวแล้ว ตรวจความลับแล้ว เอนด์พอยต์ตรวจสุขภาพเป็นปกติ และรู้ทางย้อนกลับ",
    },
  ],
  chain: {
    eyebrow: "จากไอเดียสู่ระบบจริง",
    title: "ทุกลูกศรคือจุดตรวจ",
    intro: "ไอเดียกลายเป็นซอฟต์แวร์ได้ด้วยการผ่านชุดผลงานต่อเนื่อง แต่ละชิ้นเป็นสิ่งที่คนอ่าน ตั้งคำถาม และอนุมัติได้",
    diagramTitle: "จากไอเดียสู่ระบบจริง",
    steps: [
      { label: "ไอเดีย", detail: "ความต้องการ ตามคำพูดของลูกค้าเอง" },
      { label: "ความต้องการ", detail: "อะไรต้องเป็นจริง และอะไรอยู่นอกขอบเขต" },
      { label: "ข้อกำหนด", detail: "พฤติกรรมที่อธิบายละเอียดพอจะทดสอบได้" },
      { label: "สถาปัตยกรรม", detail: "โครงสร้าง ข้อมูล และขอบเขต พร้อมข้อแลกเปลี่ยนที่จดไว้" },
      { label: "คอมโพเนนต์", detail: "ชิ้นเล็ก ๆ ที่กำหนดชนิดข้อมูล สร้างตามโครงสร้างนั้น" },
      { label: "การทดสอบ", detail: "หลักฐานที่รันได้ของพฤติกรรมที่สำคัญ" },
      { label: "รีวิว", detail: "มีคนอ่านการเปลี่ยนแปลงอย่างวิพากษ์ก่อนรวมเข้าระบบ" },
      { label: "ระบบจริง", detail: "เวอร์ชันที่ดีพลอยแล้ว มีการตรวจสุขภาพและทางย้อนกลับ" },
    ],
    footnote: "ทุกลูกศรมีคนอนุมัติก่อนขั้นถัดไปจะเริ่ม",
  },
  practices: {
    eyebrow: "แนวปฏิบัติ",
    title: "งานในแต่ละวันหน้าตาเป็นอย่างไร",
    intro: "เทคนิคที่ใช้ และเครื่องกั้นความเสี่ยงที่มาคู่กัน",
    items: [
      { name: "การค้นคว้าด้วย AI ช่วย", text: "ใช้บทสรุปและการเปรียบเทียบเพื่อสำรวจตัวเลือกให้เร็ว ข้อกล่าวอ้างที่สำคัญต้องตรวจกับเอกสารต้นทาง" },
      { name: "เวิร์กโฟลว์เขียนโค้ดด้วยเอเจนต์", text: "เอเจนต์รับงานที่ขอบเขตชัดเจนทีละก้าวเล็ก ๆ คนเป็นผู้กำหนดขอบเขต อ่านผลลัพธ์ และรักษาคอมมิตให้รีวิวง่าย" },
      { name: "การสำรวจสถาปัตยกรรม", text: "ร่างโครงสร้างหลายแบบแล้วให้โต้แย้งกันเอง การตัดสินใจและเหตุผลยังเป็นของมนุษย์" },
      { name: "ตัวช่วยแก้บั๊ก", text: "ตั้งสมมติฐานและอ่านบันทึกได้เร็วขึ้น การแก้จะนับก็ต่อเมื่อทำซ้ำบั๊กได้และเห็นว่าหายไปจริง" },
      { name: "ตัวช่วยรีแฟกเตอร์", text: "แก้ไขเชิงกลไกข้ามหลายไฟล์ รันการทดสอบทั้งก่อนและหลัง เพื่อให้พฤติกรรมคงเดิม" },
      { name: "การรีวิวโค้ด", text: "การตรวจรอบหนึ่งด้วย AI จับสิ่งที่สายตาล้า ๆ มองข้าม ทุกข้อสังเกตต้องตรวจยืนยัน หรือปัดตกพร้อมเหตุผล" },
      { name: "การสร้างการทดสอบ", text: "ร่างกรณีทดสอบและกรณีสุดขอบ คนเป็นผู้ตัดสินว่าอะไรคือการทดสอบที่มีความหมาย และตรวจว่ามันล้มเหลวด้วยเหตุผลที่ถูกต้อง" },
      { name: "เอกสาร", text: "ร่างแรกของ README และบันทึกต่าง ๆ จากโค้ดจริง แล้วแก้ให้ตรงกับสิ่งที่โค้ดทำจริง" },
      { name: "ระบบอัตโนมัติ", text: "งานซ้ำ ๆ เขียนเป็นสคริปต์ครั้งเดียว ทั้งการตรวจ บิลด์ และปล่อยเวอร์ชัน สคริปต์ก็เป็นโค้ดและถูกรีวิวเช่นกัน" },
      { name: "การเขียนพรอมต์อย่างเป็นระบบ", text: "ให้บริบท ข้อจำกัด และเกณฑ์การตรวจรับตั้งแต่ต้น โจทย์ที่ดีคือการควบคุมคุณภาพที่ถูกที่สุด" },
      { name: "การตรวจสอบโดยมนุษย์", text: "กฎเบื้องหลังทุกข้อข้างต้น: ไม่มีอะไรขึ้นระบบจริงหากยังไม่มีคนอ่าน เข้าใจ และทดสอบ" },
    ],
  },
  clients: {
    eyebrow: "สำหรับโปรเจกต์ของคุณ",
    title: "สิ่งนี้เปลี่ยนอะไรสำหรับคุณ",
    items: [
      { title: "สื่อสารชัดเจน", text: "ข้อกำหนดและการตัดสินใจถูกจดไว้ คุณจึงรู้เสมอว่ากำลังสร้างอะไรและเพราะอะไร" },
      { title: "โค้ดที่ดูแลต่อได้", text: "กำหนดชนิดข้อมูล ทดสอบ และรีวิวแล้ว คนอื่นรับช่วงต่อได้โดยไม่ต้องมีคนพาเดินดู" },
      { title: "ผลลัพธ์ที่ตรวจสอบได้", text: "การทดสอบ ตัวอย่างพรีวิว และการตรวจสุขภาพระบบ ยืนยันสิ่งที่พูดแทนคำสัญญา" },
      { title: "ความเร็วที่ตรงไปตรงมา", text: "AI ย่นวงจร ไม่ได้ลัดมาตรฐาน กำหนดการสะท้อนงานรีวิวและทดสอบที่ยังต้องทำ" },
    ],
  },
  cta: { label: "ปรึกษาโปรเจกต์", title: "อยากได้วงจรที่เร็วขึ้นโดยมาตรฐานไม่ตก" },
};

export const aiNativeContent: Localized<AiNativeContent> = { en, de, th };
