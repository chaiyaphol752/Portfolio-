import type { Localized } from "@/i18n/config";

export const caseStepIds = [
  "problem",
  "discovery",
  "constraints",
  "ux",
  "architecture",
  "implementation",
  "testing",
  "performance",
  "tradeoffs",
  "future",
] as const;
export type CaseStepId = (typeof caseStepIds)[number];

export interface CaseSection {
  body: string;
  points: string[];
}

export interface TreeNode {
  label: string;
  children?: { edge: string; node: TreeNode }[];
}

export type DiagramContent =
  | { kind: "flow" | "layers"; title: string; caption: string; nodes: { label: string; detail: string }[] }
  | { kind: "tree"; title: string; caption: string; root: TreeNode };

export interface CaseContent {
  id: string;
  kind: "demo" | "concept";
  title: string;
  tagline: string;
  status: string;
  stack: string[];
  sections: Record<CaseStepId, CaseSection>;
  /** Diagrams are attached to the step they illustrate. */
  diagrams: Partial<Record<CaseStepId, DiagramContent>>;
}

export interface CaseStudiesContent {
  meta: { title: string; description: string };
  hero: { eyebrow: string; titleLead: string; titleEmph: string; lede: string; complexityLabel: string };
  labels: {
    index: string;
    kind: Record<CaseContent["kind"], string>;
    kindNote: Record<CaseContent["kind"], string>;
    status: string;
    stack: string;
    steps: Record<CaseStepId, string>;
    diagram: string;
  };
  cases: CaseContent[];
  cta: { label: string; title: string };
}

const en: CaseStudiesContent = {
  meta: {
    title: "Case studies",
    description:
      "Three detailed write-ups of the decisions, constraints and tradeoffs behind a build: this portfolio and two concept projects, clearly labeled.",
  },
  hero: {
    eyebrow: "Case studies",
    titleLead: "Beyond the pixels:",
    titleEmph: "how the work is reasoned.",
    lede: "Three write-ups of the decisions, constraints and tradeoffs behind a build. One is this very site; two are concept projects, labeled as such.",
    complexityLabel: "Complexity",
  },
  labels: {
    index: "Case studies",
    kind: { demo: "Technical demonstration", concept: "Concept project" },
    kindNote: {
      demo: "Real, running software: the site you are reading.",
      concept: "A design exercise. There is no real client and nothing was delivered.",
    },
    status: "Status",
    stack: "Stack",
    steps: {
      problem: "Problem",
      discovery: "Discovery",
      constraints: "Constraints",
      ux: "UX decision",
      architecture: "Architecture",
      implementation: "Implementation",
      testing: "Testing",
      performance: "Performance",
      tradeoffs: "Tradeoffs",
      future: "Future improvements",
    },
    diagram: "Diagram",
  },
  cases: [
    {
      id: "portfolio",
      kind: "demo",
      title: "This portfolio, built as a product",
      tagline: "A trilingual site with a real backend: what the architecture looks like, and why.",
      status: "Live: you are reading it",
      stack: ["Next.js App Router", "TypeScript (strict)", "Tailwind CSS", "Zod", "Neon Postgres", "Vercel"],
      sections: {
        problem: {
          body: "A portfolio has one job: make a stranger confident enough to get in touch. It also has to show engineering, and a page of screenshots shows very little of it.",
          points: [],
        },
        discovery: {
          body: "I listed what a client actually checks. Can they read it in their own language? Does it work on a phone? Does the contact form really reach me? Can they see the code behind it?",
          points: [],
        },
        constraints: {
          body: "Fixed from the start:",
          points: [
            "Three languages (English, German, Thai) with no runtime translation service",
            "The contact form must never claim success if nothing was delivered",
            "No secrets in the client bundle or in the repository",
            "Minimal client-side JavaScript; most pages should be plain prerendered HTML",
          ],
        },
        ux: {
          body: "Every page lives at a predictable, language-prefixed URL, and the language follows the visitor rather than the other way round. The order in which it is decided is deliberate.",
          points: [],
        },
        architecture: {
          body: "The site is server-first. Pages are React Server Components rendered at build time for each language, and only interactive islands ship JavaScript. The contact form is the one real request path.",
          points: [],
        },
        implementation: {
          body: "Language dictionaries are typed TypeScript modules. One type defines the shape; the German and Thai versions must match it, so a missing translation fails the type check instead of shipping.",
          points: [
            "A small proxy handles locale redirects",
            "Validation rules live in one Zod schema shared by the server logic and the tests",
            "Delivery is a thin layer with pluggable channels, so the database is optional",
          ],
        },
        testing: {
          body: "The logic that can quietly break is covered by automated tests: locale matching, path building, the validation schema, the rate limiter and delivery behavior.",
          points: [
            "With no delivery channel configured, the result is “unavailable”, never a fake success",
            "Shared copy is checked for missing labels in every language",
            "Lint, type check, tests and a production build run together through one check command",
          ],
        },
        performance: {
          body: "What is true by construction, rather than by measurement:",
          points: [
            "Every page in every language is prerendered to static HTML at build time",
            "Fonts are self-hosted by the framework, with no third-party font request",
            "Client JavaScript is limited to the menu, language switcher, command palette and the interactive sections",
            "No translation requests at runtime",
          ],
        },
        tradeoffs: {
          body: "Each of these was a choice, not an accident:",
          points: [
            "Copy lives in code: editing needs a commit, in exchange for type safety and no CMS to run",
            "The in-memory rate limiter is per server instance, so it slows bursts but is not a global guarantee",
            "The database is optional; without one the form relies on a webhook, and says so when neither exists",
          ],
        },
        future: {
          body: "If the site grows:",
          points: [
            "Move the rate limit to a shared store",
            "Add an inbox view for stored submissions",
            "Add an optional CMS layer that keeps the same typed content shape",
          ],
        },
      },
      diagrams: {
        ux: {
          kind: "tree",
          title: "Which language does a visitor see?",
          caption: "The order of decisions in this site's proxy.",
          root: {
            label: "Request without a language prefix, e.g. /about",
            children: [
              { edge: "Prefix present (/de/…)", node: { label: "Serve that language" } },
              {
                edge: "No prefix",
                node: {
                  label: "Saved language cookie?",
                  children: [
                    { edge: "Yes", node: { label: "Redirect to the saved language" } },
                    {
                      edge: "No",
                      node: {
                        label: "Read the Accept-Language header",
                        children: [
                          { edge: "Supported language found", node: { label: "Redirect to it" } },
                          { edge: "Nothing matches", node: { label: "Redirect to English" } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        architecture: {
          kind: "flow",
          title: "Life of a contact request",
          caption: "From the form to an honest response.",
          nodes: [
            { label: "Browser", detail: "The form posts to a Server Action and works on server-rendered HTML." },
            { label: "Server Action", detail: "Runs on Vercel and reads the raw form data." },
            { label: "Zod validation", detail: "Returns stable error codes per field, translated in the browser." },
            { label: "Spam and rate checks", detail: "A hidden honeypot field plus a per-visitor rate limit." },
            { label: "Delivery", detail: "A Postgres row and/or a webhook; at least one must accept." },
            { label: "Response", detail: "Success only if a channel accepted it; otherwise an honest error." },
          ],
        },
      },
    },
    {
      id: "booking",
      kind: "concept",
      title: "Appointment booking for a small studio",
      tagline: "A concept for replacing chat-based scheduling with a flow that cannot double-book.",
      status: "Design exercise, not built for a client",
      stack: ["Next.js", "PostgreSQL", "Server Actions", "Zod", "Time-zone-aware scheduling"],
      sections: {
        problem: {
          body: "Imagine a small studio, such as a physiotherapist or a photographer, that books clients through messages. Times get confused, slots are promised twice, and every change costs a conversation.",
          points: [],
        },
        discovery: {
          body: "Mapping the booking lifecycle shows where it breaks: choosing a time, confirming, rescheduling, cancelling. Most errors come from two people holding the same slot in their head.",
          points: [],
        },
        constraints: {
          body: "The rules any solution has to respect:",
          points: [
            "Bookings must never overlap, even when two people click at the same moment",
            "Customers are mostly on phones and may be in a different time zone",
            "Staff need to block time off without touching each booking",
            "Personal data stays minimal: name and contact details only",
          ],
        },
        ux: {
          body: "Service first, then time. Duration depends on the service, so the calendar can show only slots that truly fit. Days with nothing available are disabled rather than hidden, so the customer understands why.",
          points: [],
        },
        architecture: {
          body: "Availability is computed on the server from working hours, existing bookings and time off. The database enforces the final rule: an exclusion constraint on time ranges makes an overlapping booking impossible, whatever the application does.",
          points: [],
        },
        implementation: {
          body: "Slot generation is a pure function: hours, duration and existing bookings in, free slots out. Keeping it free of framework code makes the tricky part easy to test.",
          points: [
            "Times are stored in UTC, with the studio's time zone kept alongside",
            "Rescheduling is cancel-then-book inside one transaction",
            "Staff time off is modeled as a booking of a special type",
          ],
        },
        testing: {
          body: "Tests concentrate on the rules that cost money when they are wrong:",
          points: [
            "Adjacent bookings are allowed; overlapping ones are not",
            "Days on which the clocks change",
            "Two simultaneous attempts on one slot: exactly one wins",
            "Bookings that cross midnight",
          ],
        },
        performance: {
          body: "Because the server sends one day of slots at a time, payloads stay small however far ahead the calendar runs. The booking page can be mostly server-rendered, with the calendar as its only interactive island.",
          points: [],
        },
        tradeoffs: {
          body: "Three deliberate compromises:",
          points: [
            "Database-level constraints add a migration step but remove a whole class of race bugs",
            "Offering alternatives after a conflict is more work than an error message, but it saves the customer effort",
            "No customer accounts keeps friction low, at the cost of a manage-booking link sent by email",
          ],
        },
        future: {
          body: "Where this could go next:",
          points: ["Calendar sync through an iCal feed", "Reminder messages to reduce no-shows", "Several staff members, each with their own hours"],
        },
      },
      diagrams: {
        ux: {
          kind: "tree",
          title: "The booking flow as decisions",
          caption: "What the customer sees at each step.",
          root: {
            label: "Customer opens the booking page",
            children: [
              {
                edge: "No service chosen",
                node: { label: "Show services with their duration; no calendar yet" },
              },
              {
                edge: "Service chosen",
                node: {
                  label: "Show days that still have room",
                  children: [
                    {
                      edge: "Day chosen",
                      node: {
                        label: "Show only slots that fit the duration",
                        children: [
                          { edge: "Slot taken in the meantime", node: { label: "Offer the nearest alternatives; keep the typed details" } },
                          { edge: "Slot still free", node: { label: "Confirm and send a summary" } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        architecture: {
          kind: "flow",
          title: "From day picker to confirmed booking",
          caption: "The database has the final say.",
          nodes: [
            { label: "Customer picks a day", detail: "The browser sends only the service and the date." },
            { label: "Availability query", detail: "The server derives free slots from hours, time off and bookings." },
            { label: "Slot list", detail: "Only the chosen day is sent back to the browser." },
            { label: "Booking action", detail: "Validates the input, then inserts inside a transaction." },
            { label: "Database constraint", detail: "Overlapping time ranges are rejected by the database itself." },
            { label: "Confirmation", detail: "Success, or alternative slots if the slot was just taken." },
          ],
        },
      },
    },
    {
      id: "multilingual",
      kind: "concept",
      title: "Multilingual website for a local guesthouse",
      tagline: "A concept for keeping three languages accurate, fast and findable.",
      status: "Design exercise, fictional business",
      stack: ["Next.js", "TypeScript", "Locale-prefixed routing", "Structured data"],
      sections: {
        problem: {
          body: "A fictional guesthouse welcomes guests who read Thai, English and German. Its old site is one English page with a translation plugin on top: prices drift between languages and search engines see a muddle.",
          points: [],
        },
        discovery: {
          body: "The facts (prices, hours, address) and the words (descriptions, tone) change at different speeds. Mixing them is what makes translations drift.",
          points: [],
        },
        constraints: {
          body: "What shaped the solution:",
          points: [
            "The owners are not developers and update prices often",
            "Guests mostly arrive from search and from phones",
            "A missing translation must be noticed before a guest sees it",
            "Hosting cost should stay close to zero",
          ],
        },
        ux: {
          body: "Language is part of the address, so a link shows the same thing to everyone and search engines can index each version. A visible switcher keeps the current page instead of dropping guests on the home page.",
          points: [],
        },
        architecture: {
          body: "Facts and words live in separate layers. One typed data file owns prices and hours; each language owns only its wording and references the facts. The build assembles static pages per language.",
          points: [],
        },
        implementation: {
          body: "Content modules share one type. Money, dates and opening hours go through locale-aware formatters rather than hand-typed strings.",
          points: [
            "hreflang alternates generated for every page",
            "Structured data for the business built from the facts layer",
            "A switcher that preserves the page and remembers the choice",
          ],
        },
        testing: {
          body: "Checks target the ways multilingual sites usually rot:",
          points: [
            "A test asserts that every language defines every key",
            "A price appears identically in all languages because it is rendered from one value",
            "A link check over the generated routes",
          ],
        },
        performance: {
          body: "All pages are prerendered per language, so the server does no work per visit. There is no client-side translation, so guests download only the language they read.",
          points: [],
        },
        tradeoffs: {
          body: "The compromises worth naming:",
          points: [
            "Editing through code is a barrier for owners; a CMS removes it but adds cost and a second source of truth",
            "Typed content forces a translation for every key, which slows new features but stops gaps",
            "Three languages triple the copy review; a native-speaker review step belongs in the plan",
          ],
        },
        future: {
          body: "Next steps:",
          points: ["A headless CMS with the same schema and draft previews", "A translation review checklist per release", "Online booking, reusing the booking concept"],
        },
      },
      diagrams: {
        architecture: {
          kind: "layers",
          title: "Facts and words, kept apart",
          caption: "Each layer feeds the next.",
          nodes: [
            { label: "Facts", detail: "Prices, hours and address: one record, language-neutral." },
            { label: "Copy per language", detail: "Descriptions and labels in Thai, English and German." },
            { label: "Type check", detail: "The build fails if any language is missing a key." },
            { label: "Static pages", detail: "One prerendered page per language and route." },
            { label: "Search metadata", detail: "Language alternates and structured data from the same facts." },
            { label: "CDN", detail: "Served from the edge as plain HTML." },
          ],
        },
      },
    },
  ],
  cta: { label: "Discuss a project", title: "Want this kind of thinking on your project?" },
};

const de: CaseStudiesContent = {
  meta: {
    title: "Fallstudien",
    description:
      "Drei ausführliche Fallstudien zu Entscheidungen, Randbedingungen und Abwägungen hinter einem Projekt: dieses Portfolio und zwei Konzeptprojekte, klar gekennzeichnet.",
  },
  hero: {
    eyebrow: "Fallstudien",
    titleLead: "Mehr als Pixel:",
    titleEmph: "wie die Arbeit durchdacht ist.",
    lede: "Drei Fallstudien zu Entscheidungen, Randbedingungen und Abwägungen hinter einem Projekt. Eine ist genau diese Website, zwei sind Konzeptprojekte und als solche gekennzeichnet.",
    complexityLabel: "Komplexität",
  },
  labels: {
    index: "Fallstudien",
    kind: { demo: "Technische Demonstration", concept: "Konzeptprojekt" },
    kindNote: {
      demo: "Echte, laufende Software: die Website, die du gerade liest.",
      concept: "Eine Designübung. Es gibt keinen echten Kunden und nichts wurde ausgeliefert.",
    },
    status: "Status",
    stack: "Stack",
    steps: {
      problem: "Problem",
      discovery: "Erkundung",
      constraints: "Randbedingungen",
      ux: "UX-Entscheidung",
      architecture: "Architektur",
      implementation: "Umsetzung",
      testing: "Tests",
      performance: "Performance",
      tradeoffs: "Abwägungen",
      future: "Nächste Schritte",
    },
    diagram: "Diagramm",
  },
  cases: [
    {
      id: "portfolio",
      kind: "demo",
      title: "Dieses Portfolio, gebaut wie ein Produkt",
      tagline: "Eine dreisprachige Website mit echtem Backend: wie die Architektur aussieht und warum.",
      status: "Live: Du liest sie gerade",
      stack: ["Next.js App Router", "TypeScript (strict)", "Tailwind CSS", "Zod", "Neon Postgres", "Vercel"],
      sections: {
        problem: {
          body: "Ein Portfolio hat eine Aufgabe: Fremde so zu überzeugen, dass sie Kontakt aufnehmen. Es muss außerdem Ingenieurarbeit zeigen, und eine Seite voller Screenshots zeigt davon sehr wenig.",
          points: [],
        },
        discovery: {
          body: "Ich habe aufgelistet, was Kunden tatsächlich prüfen. Lässt es sich in der eigenen Sprache lesen? Funktioniert es auf dem Smartphone? Kommt das Kontaktformular wirklich bei mir an? Ist der Code dahinter einsehbar?",
          points: [],
        },
        constraints: {
          body: "Von Anfang an festgelegt:",
          points: [
            "Drei Sprachen (Englisch, Deutsch, Thai) ohne Übersetzungsdienst zur Laufzeit",
            "Das Kontaktformular meldet nie Erfolg, wenn nichts zugestellt wurde",
            "Keine Geheimnisse im Client-Bundle oder im Repository",
            "Minimales JavaScript im Browser; die meisten Seiten sollen vorab erzeugtes HTML sein",
          ],
        },
        ux: {
          body: "Jede Seite hat eine vorhersehbare Adresse mit Sprachpräfix, und die Sprache folgt dem Besucher, nicht umgekehrt. Die Reihenfolge der Entscheidung ist bewusst gewählt.",
          points: [],
        },
        architecture: {
          body: "Die Website ist Server-first. Seiten sind React Server Components, die pro Sprache beim Build erzeugt werden; nur interaktive Inseln liefern JavaScript aus. Das Kontaktformular ist der einzige echte Anfragepfad.",
          points: [],
        },
        implementation: {
          body: "Die Sprachwörterbücher sind typisierte TypeScript-Module. Ein Typ legt die Struktur fest; die deutsche und die thailändische Fassung müssen ihm entsprechen, sodass eine fehlende Übersetzung den Typcheck bricht, statt auszuliefern.",
          points: [
            "Ein kleiner Proxy übernimmt die Weiterleitung nach Sprache",
            "Die Validierungsregeln stehen in einem Zod-Schema, das Serverlogik und Tests gemeinsam nutzen",
            "Die Zustellung ist eine dünne Schicht mit austauschbaren Kanälen, die Datenbank ist also optional",
          ],
        },
        testing: {
          body: "Die Logik, die unbemerkt brechen kann, ist durch automatische Tests abgedeckt: Spracherkennung, Pfadbildung, Validierungsschema, Ratenbegrenzung und Zustellverhalten.",
          points: [
            "Ohne konfigurierten Zustellkanal lautet das Ergebnis „nicht verfügbar“, nie ein vorgetäuschter Erfolg",
            "Gemeinsame Texte werden auf fehlende Bezeichnungen in jeder Sprache geprüft",
            "Lint, Typcheck, Tests und Produktions-Build laufen gemeinsam über einen einzigen Check-Befehl",
          ],
        },
        performance: {
          body: "Was durch den Aufbau feststeht, nicht durch Messung:",
          points: [
            "Jede Seite in jeder Sprache wird beim Build als statisches HTML vorgerendert",
            "Schriften werden vom Framework selbst gehostet, ohne Anfrage an Drittanbieter",
            "JavaScript im Browser beschränkt sich auf Menü, Sprachwechsel, Befehlspalette und die interaktiven Bereiche",
            "Keine Übersetzungsanfragen zur Laufzeit",
          ],
        },
        tradeoffs: {
          body: "Jeder dieser Punkte war eine Entscheidung, kein Zufall:",
          points: [
            "Texte liegen im Code: Änderungen brauchen einen Commit, dafür gibt es Typsicherheit und kein CMS zu betreiben",
            "Die Ratenbegrenzung im Arbeitsspeicher gilt pro Serverinstanz, bremst also Schübe, ist aber keine globale Garantie",
            "Die Datenbank ist optional; ohne sie verlässt sich das Formular auf einen Webhook und sagt es offen, wenn keins von beidem vorhanden ist",
          ],
        },
        future: {
          body: "Wenn die Website wächst:",
          points: [
            "Die Ratenbegrenzung in einen gemeinsamen Speicher verlagern",
            "Eine Posteingangsansicht für gespeicherte Anfragen ergänzen",
            "Eine optionale CMS-Schicht mit derselben typisierten Inhaltsstruktur hinzufügen",
          ],
        },
      },
      diagrams: {
        ux: {
          kind: "tree",
          title: "Welche Sprache sieht ein Besucher?",
          caption: "Die Reihenfolge der Entscheidungen im Proxy dieser Website.",
          root: {
            label: "Anfrage ohne Sprachpräfix, z. B. /about",
            children: [
              { edge: "Präfix vorhanden (/de/…)", node: { label: "Diese Sprache ausliefern" } },
              {
                edge: "Kein Präfix",
                node: {
                  label: "Gespeichertes Sprach-Cookie?",
                  children: [
                    { edge: "Ja", node: { label: "Zur gespeicherten Sprache weiterleiten" } },
                    {
                      edge: "Nein",
                      node: {
                        label: "Accept-Language-Header auslesen",
                        children: [
                          { edge: "Unterstützte Sprache gefunden", node: { label: "Dorthin weiterleiten" } },
                          { edge: "Nichts passt", node: { label: "Auf Englisch weiterleiten" } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        architecture: {
          kind: "flow",
          title: "Der Weg einer Kontaktanfrage",
          caption: "Vom Formular bis zur ehrlichen Antwort.",
          nodes: [
            { label: "Browser", detail: "Das Formular sendet an eine Server Action und funktioniert mit serverseitig erzeugtem HTML." },
            { label: "Server Action", detail: "Läuft auf Vercel und liest die rohen Formulardaten." },
            { label: "Zod-Validierung", detail: "Liefert stabile Fehlercodes pro Feld, die im Browser übersetzt werden." },
            { label: "Spam- und Ratenprüfung", detail: "Ein verstecktes Honeypot-Feld plus Ratenbegrenzung pro Besucher." },
            { label: "Zustellung", detail: "Eine Postgres-Zeile und/oder ein Webhook; mindestens einer muss annehmen." },
            { label: "Antwort", detail: "Erfolg nur, wenn ein Kanal angenommen hat; sonst ein ehrlicher Fehler." },
          ],
        },
      },
    },
    {
      id: "booking",
      kind: "concept",
      title: "Terminbuchung für ein kleines Studio",
      tagline: "Ein Konzept, das Terminabsprachen per Chat durch einen Ablauf ersetzt, der keine Doppelbuchung zulässt.",
      status: "Designübung, nicht für einen Kunden gebaut",
      stack: ["Next.js", "PostgreSQL", "Server Actions", "Zod", "Zeitzonenbewusste Terminlogik"],
      sections: {
        problem: {
          body: "Stell dir ein kleines Studio vor, etwa eine Physiotherapie oder ein Fotostudio, das Termine per Nachricht vergibt. Uhrzeiten werden verwechselt, Termine doppelt zugesagt, und jede Änderung kostet ein Gespräch.",
          points: [],
        },
        discovery: {
          body: "Der Buchungsablauf zeigt, wo es hakt: Zeit wählen, bestätigen, verschieben, absagen. Die meisten Fehler entstehen, weil zwei Personen denselben Termin im Kopf haben.",
          points: [],
        },
        constraints: {
          body: "Die Regeln, die jede Lösung einhalten muss:",
          points: [
            "Buchungen dürfen sich nie überschneiden, auch wenn zwei Personen im selben Moment klicken",
            "Kundschaft nutzt überwiegend das Smartphone und befindet sich womöglich in einer anderen Zeitzone",
            "Mitarbeitende müssen Zeit blockieren können, ohne einzelne Buchungen anzufassen",
            "Personenbezogene Daten bleiben minimal: nur Name und Kontaktdaten",
          ],
        },
        ux: {
          body: "Erst die Leistung, dann die Zeit. Die Dauer hängt von der Leistung ab, daher zeigt der Kalender nur Termine, die wirklich passen. Tage ohne Verfügbarkeit sind deaktiviert statt versteckt, damit klar ist, warum.",
          points: [],
        },
        architecture: {
          body: "Die Verfügbarkeit wird auf dem Server aus Arbeitszeiten, bestehenden Buchungen und Abwesenheiten berechnet. Die letzte Regel setzt die Datenbank durch: Eine Exclusion-Constraint auf Zeiträumen macht eine überlappende Buchung unmöglich, egal was die Anwendung tut.",
          points: [],
        },
        implementation: {
          body: "Die Terminberechnung ist eine reine Funktion: Zeiten, Dauer und bestehende Buchungen hinein, freie Termine heraus. Ohne Framework-Code lässt sich der knifflige Teil leicht testen.",
          points: [
            "Zeiten werden in UTC gespeichert, die Zeitzone des Studios liegt daneben",
            "Verschieben heißt absagen und neu buchen in einer Transaktion",
            "Abwesenheiten des Teams werden als Buchung eines besonderen Typs modelliert",
          ],
        },
        testing: {
          body: "Die Tests konzentrieren sich auf Regeln, die bei Fehlern Geld kosten:",
          points: [
            "Direkt aufeinanderfolgende Buchungen sind erlaubt, überlappende nicht",
            "Tage mit Zeitumstellung",
            "Zwei gleichzeitige Versuche auf einen Termin: genau einer gewinnt",
            "Buchungen über Mitternacht hinaus",
          ],
        },
        performance: {
          body: "Da der Server immer nur die Termine eines Tages sendet, bleiben die Datenmengen klein, egal wie weit der Kalender reicht. Die Buchungsseite kann größtenteils serverseitig erzeugt werden, der Kalender ist die einzige interaktive Insel.",
          points: [],
        },
        tradeoffs: {
          body: "Drei bewusste Kompromisse:",
          points: [
            "Constraints in der Datenbank erfordern eine Migration, beseitigen aber eine ganze Klasse von Race-Condition-Fehlern",
            "Alternativen nach einem Konflikt anzubieten ist aufwendiger als eine Fehlermeldung, erspart der Kundschaft aber Mühe",
            "Ohne Kundenkonto bleibt die Hürde niedrig, dafür gibt es einen Link zur Buchungsverwaltung per E-Mail",
          ],
        },
        future: {
          body: "Wohin es weitergehen könnte:",
          points: ["Kalenderabgleich über einen iCal-Feed", "Erinnerungsnachrichten gegen Nichterscheinen", "Mehrere Teammitglieder mit eigenen Arbeitszeiten"],
        },
      },
      diagrams: {
        ux: {
          kind: "tree",
          title: "Der Buchungsablauf als Entscheidungen",
          caption: "Was die Kundschaft in jedem Schritt sieht.",
          root: {
            label: "Kundschaft öffnet die Buchungsseite",
            children: [
              { edge: "Keine Leistung gewählt", node: { label: "Leistungen mit Dauer zeigen; noch kein Kalender" } },
              {
                edge: "Leistung gewählt",
                node: {
                  label: "Tage mit freien Plätzen zeigen",
                  children: [
                    {
                      edge: "Tag gewählt",
                      node: {
                        label: "Nur Termine zeigen, die zur Dauer passen",
                        children: [
                          { edge: "Termin inzwischen vergeben", node: { label: "Nächste Alternativen anbieten; Eingaben behalten" } },
                          { edge: "Termin weiterhin frei", node: { label: "Bestätigen und Zusammenfassung senden" } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        architecture: {
          kind: "flow",
          title: "Von der Tagesauswahl zur bestätigten Buchung",
          caption: "Die Datenbank hat das letzte Wort.",
          nodes: [
            { label: "Kundschaft wählt einen Tag", detail: "Der Browser sendet nur Leistung und Datum." },
            { label: "Verfügbarkeitsabfrage", detail: "Der Server leitet freie Termine aus Zeiten, Abwesenheiten und Buchungen ab." },
            { label: "Terminliste", detail: "Nur der gewählte Tag geht zurück an den Browser." },
            { label: "Buchungsaktion", detail: "Prüft die Eingaben und fügt dann in einer Transaktion ein." },
            { label: "Datenbank-Constraint", detail: "Überlappende Zeiträume weist die Datenbank selbst ab." },
            { label: "Bestätigung", detail: "Erfolg oder alternative Termine, falls der Termin gerade vergeben wurde." },
          ],
        },
      },
    },
    {
      id: "multilingual",
      kind: "concept",
      title: "Mehrsprachige Website für eine lokale Pension",
      tagline: "Ein Konzept, das drei Sprachen korrekt, schnell und auffindbar hält.",
      status: "Designübung, fiktives Unternehmen",
      stack: ["Next.js", "TypeScript", "Routing mit Sprachpräfix", "Strukturierte Daten"],
      sections: {
        problem: {
          body: "Eine fiktive Pension begrüßt Gäste, die Thai, Englisch und Deutsch lesen. Die alte Website ist eine englische Seite mit einem Übersetzungs-Plugin darüber: Preise weichen zwischen den Sprachen ab, und Suchmaschinen sehen ein Durcheinander.",
          points: [],
        },
        discovery: {
          body: "Fakten (Preise, Zeiten, Adresse) und Worte (Beschreibungen, Tonfall) ändern sich unterschiedlich schnell. Sie zu vermischen lässt Übersetzungen auseinanderlaufen.",
          points: [],
        },
        constraints: {
          body: "Was die Lösung geprägt hat:",
          points: [
            "Die Inhaber sind keine Entwickler und ändern Preise oft",
            "Gäste kommen meist über die Suche und per Smartphone",
            "Eine fehlende Übersetzung muss auffallen, bevor ein Gast sie sieht",
            "Die Hostingkosten sollen nahe null bleiben",
          ],
        },
        ux: {
          body: "Die Sprache gehört zur Adresse, sodass ein Link für alle dasselbe zeigt und Suchmaschinen jede Fassung indexieren können. Ein sichtbarer Sprachwechsel bleibt auf der aktuellen Seite, statt Gäste auf der Startseite abzusetzen.",
          points: [],
        },
        architecture: {
          body: "Fakten und Worte liegen in getrennten Schichten. Eine typisierte Datendatei besitzt Preise und Zeiten; jede Sprache besitzt nur ihre Formulierungen und verweist auf die Fakten. Der Build erzeugt pro Sprache statische Seiten.",
          points: [],
        },
        implementation: {
          body: "Die Inhaltsmodule teilen sich einen Typ. Geld, Datum und Öffnungszeiten laufen über sprachsensible Formatierer statt über von Hand getippte Texte.",
          points: [
            "hreflang-Alternativen für jede Seite erzeugt",
            "Strukturierte Daten zum Unternehmen aus der Faktenschicht gebildet",
            "Ein Sprachwechsel, der die Seite beibehält und die Wahl merkt",
          ],
        },
        testing: {
          body: "Die Prüfungen zielen darauf, wie mehrsprachige Websites üblicherweise verrotten:",
          points: [
            "Ein Test stellt sicher, dass jede Sprache jeden Schlüssel definiert",
            "Ein Preis erscheint in allen Sprachen identisch, weil er aus einem einzigen Wert gerendert wird",
            "Ein Linkcheck über die erzeugten Routen",
          ],
        },
        performance: {
          body: "Alle Seiten werden pro Sprache vorgerendert, der Server leistet also pro Besuch keine Arbeit. Es gibt keine Übersetzung im Browser, Gäste laden nur die Sprache, die sie lesen.",
          points: [],
        },
        tradeoffs: {
          body: "Die Kompromisse, die man benennen sollte:",
          points: [
            "Änderungen per Code sind für Inhaber eine Hürde; ein CMS beseitigt sie, bringt aber Kosten und eine zweite Quelle der Wahrheit",
            "Typisierte Inhalte erzwingen eine Übersetzung für jeden Schlüssel, was neue Funktionen bremst, aber Lücken verhindert",
            "Drei Sprachen verdreifachen die Textprüfung; ein Schritt mit Muttersprachlern gehört in den Plan",
          ],
        },
        future: {
          body: "Nächste Schritte:",
          points: ["Ein Headless-CMS mit demselben Schema und Entwurfsvorschau", "Eine Checkliste zur Übersetzungsprüfung pro Release", "Online-Buchung auf Basis des Buchungskonzepts"],
        },
      },
      diagrams: {
        architecture: {
          kind: "layers",
          title: "Fakten und Worte, getrennt gehalten",
          caption: "Jede Schicht speist die nächste.",
          nodes: [
            { label: "Fakten", detail: "Preise, Zeiten und Adresse: ein Datensatz, sprachneutral." },
            { label: "Texte pro Sprache", detail: "Beschreibungen und Bezeichnungen auf Thai, Englisch und Deutsch." },
            { label: "Typcheck", detail: "Der Build schlägt fehl, wenn einer Sprache ein Schlüssel fehlt." },
            { label: "Statische Seiten", detail: "Eine vorgerenderte Seite pro Sprache und Route." },
            { label: "Such-Metadaten", detail: "Sprachalternativen und strukturierte Daten aus denselben Fakten." },
            { label: "CDN", detail: "Als reines HTML vom Edge ausgeliefert." },
          ],
        },
      },
    },
  ],
  cta: { label: "Projekt besprechen", title: "Soll dieses Denken auch in dein Projekt fließen?" },
};

const th: CaseStudiesContent = {
  meta: {
    title: "กรณีศึกษา",
    description: "กรณีศึกษาเชิงลึกสามเรื่องเกี่ยวกับการตัดสินใจ ข้อจำกัด และข้อแลกเปลี่ยนเบื้องหลังงานที่สร้าง ได้แก่พอร์ตโฟลิโอนี้และโปรเจกต์แนวคิดอีกสองเรื่อง ระบุไว้ชัดเจน",
  },
  hero: {
    eyebrow: "กรณีศึกษา",
    titleLead: "มากกว่าแค่ภาพที่เห็น:",
    titleEmph: "เบื้องหลังวิธีคิดของงาน",
    lede: "สามเรื่องเล่าเกี่ยวกับการตัดสินใจ ข้อจำกัด และข้อแลกเปลี่ยนเบื้องหลังงานที่สร้าง เรื่องหนึ่งคือเว็บไซต์นี้เอง อีกสองเรื่องเป็นโปรเจกต์แนวคิด และระบุไว้ตามนั้น",
    complexityLabel: "ความซับซ้อน",
  },
  labels: {
    index: "กรณีศึกษา",
    kind: { demo: "งานสาธิตทางเทคนิค", concept: "โปรเจกต์แนวคิด" },
    kindNote: {
      demo: "ซอฟต์แวร์ที่ทำงานจริง คือเว็บไซต์ที่กำลังอ่านอยู่นี้",
      concept: "แบบฝึกด้านการออกแบบ ไม่มีลูกค้าจริงและไม่ได้ส่งมอบงานใด ๆ",
    },
    status: "สถานะ",
    stack: "เทคโนโลยี",
    steps: {
      problem: "โจทย์",
      discovery: "การสำรวจ",
      constraints: "ข้อจำกัด",
      ux: "การตัดสินใจด้าน UX",
      architecture: "สถาปัตยกรรม",
      implementation: "การลงมือทำ",
      testing: "การทดสอบ",
      performance: "ประสิทธิภาพ",
      tradeoffs: "ข้อแลกเปลี่ยน",
      future: "สิ่งที่ปรับปรุงต่อ",
    },
    diagram: "แผนภาพ",
  },
  cases: [
    {
      id: "portfolio",
      kind: "demo",
      title: "พอร์ตโฟลิโอนี้ ในฐานะผลิตภัณฑ์",
      tagline: "เว็บไซต์สามภาษาที่มีแบ็กเอนด์จริง สถาปัตยกรรมเป็นอย่างไรและทำไมจึงออกแบบแบบนี้",
      status: "ใช้งานจริง: เว็บไซต์ที่กำลังอ่านอยู่นี้",
      stack: ["Next.js App Router", "TypeScript (strict)", "Tailwind CSS", "Zod", "Neon Postgres", "Vercel"],
      sections: {
        problem: {
          body: "พอร์ตโฟลิโอมีหน้าที่หลักข้อเดียว คือทำให้คนแปลกหน้ามั่นใจพอที่จะติดต่อมา และยังต้องแสดงฝีมือทางวิศวกรรมด้วย ซึ่งหน้าเว็บที่มีแต่ภาพหน้าจอแสดงได้น้อยมาก",
          points: [],
        },
        discovery: {
          body: "เริ่มจากรายการสิ่งที่ลูกค้าตรวจดูจริง ๆ อ่านได้ในภาษาของตัวเองไหม ใช้บนมือถือได้ดีไหม แบบฟอร์มติดต่อส่งถึงผู้รับจริงไหม และดูโค้ดเบื้องหลังได้หรือเปล่า",
          points: [],
        },
        constraints: {
          body: "เงื่อนไขที่กำหนดไว้ตั้งแต่ต้น:",
          points: [
            "รองรับสามภาษา (อังกฤษ เยอรมัน ไทย) โดยไม่พึ่งบริการแปลภาษาขณะใช้งาน",
            "แบบฟอร์มติดต่อต้องไม่แจ้งว่าสำเร็จ หากยังไม่มีช่องทางใดรับข้อความไว้",
            "ไม่มีความลับในโค้ดฝั่งไคลเอนต์หรือในรีโพซิทอรี",
            "ใช้ JavaScript ฝั่งไคลเอนต์ให้น้อยที่สุด หน้าส่วนใหญ่ควรเป็น HTML ที่สร้างไว้ล่วงหน้า",
          ],
        },
        ux: {
          body: "ทุกหน้าเข้าถึงได้ผ่าน URL ที่คาดเดาได้และมีรหัสภาษานำหน้า ภาษาจะตามผู้เข้าชม ไม่ใช่ให้ผู้เข้าชมต้องตามภาษา ลำดับการตัดสินใจถูกกำหนดไว้อย่างตั้งใจ",
          points: [],
        },
        architecture: {
          body: "เว็บไซต์เน้นฝั่งเซิร์ฟเวอร์เป็นหลัก หน้าต่าง ๆ เป็น React Server Components ที่สร้างตอนบิลด์แยกตามภาษา และมีเพียงส่วนที่โต้ตอบได้เท่านั้นที่ส่ง JavaScript ไปยังเบราว์เซอร์ แบบฟอร์มติดต่อคือเส้นทางคำขอจริงเพียงเส้นเดียว",
          points: [],
        },
        implementation: {
          body: "พจนานุกรมภาษาเป็นโมดูล TypeScript ที่กำหนดชนิดข้อมูลไว้ ชนิดเดียวกำหนดโครงสร้าง ส่วนฉบับเยอรมันและไทยต้องตรงตามนั้น หากขาดคำแปลจะไม่ผ่านการตรวจชนิดข้อมูล แทนที่จะหลุดขึ้นระบบจริง",
          points: [
            "พร็อกซีขนาดเล็กจัดการการเปลี่ยนเส้นทางตามภาษา",
            "กฎการตรวจสอบข้อมูลอยู่ในสคีมา Zod ตัวเดียว ใช้ร่วมกันทั้งตรรกะฝั่งเซิร์ฟเวอร์และการทดสอบ",
            "การส่งข้อความเป็นชั้นบาง ๆ ที่เสียบช่องทางต่าง ๆ ได้ ฐานข้อมูลจึงเป็นทางเลือก",
          ],
        },
        testing: {
          body: "ตรรกะที่อาจพังเงียบ ๆ มีการทดสอบอัตโนมัติครอบคลุม ได้แก่ การจับคู่ภาษา การสร้างพาธ สคีมาตรวจสอบข้อมูล ตัวจำกัดอัตรา และพฤติกรรมการส่งข้อความ",
          points: [
            "เมื่อไม่ได้ตั้งค่าช่องทางส่งข้อความ ผลลัพธ์คือ “ใช้งานไม่ได้” ไม่ใช่ความสำเร็จปลอม",
            "ตรวจข้อความส่วนกลางว่าไม่ขาดป้ายกำกับในทุกภาษา",
            "ลินต์ ตรวจชนิดข้อมูล ทดสอบ และบิลด์จริง รันพร้อมกันผ่านคำสั่งตรวจสอบเดียว",
          ],
        },
        performance: {
          body: "สิ่งที่เป็นจริงโดยโครงสร้าง ไม่ใช่จากการวัดผล:",
          points: [
            "ทุกหน้าในทุกภาษาถูกสร้างเป็น HTML แบบสถิตไว้ล่วงหน้าตอนบิลด์",
            "ฟอนต์ถูกโฮสต์เองโดยเฟรมเวิร์ก ไม่มีคำขอไปยังบริการฟอนต์ของบุคคลที่สาม",
            "JavaScript ฝั่งไคลเอนต์จำกัดอยู่ที่เมนู ตัวสลับภาษา พาเลตคำสั่ง และส่วนที่โต้ตอบได้",
            "ไม่มีคำขอแปลภาษาขณะใช้งาน",
          ],
        },
        tradeoffs: {
          body: "ทุกข้อเป็นการเลือก ไม่ใช่เรื่องบังเอิญ:",
          points: [
            "ข้อความอยู่ในโค้ด การแก้ไขต้องคอมมิต แลกกับความปลอดภัยของชนิดข้อมูลและไม่ต้องดูแล CMS",
            "ตัวจำกัดอัตราในหน่วยความจำทำงานแยกตามอินสแตนซ์ของเซิร์ฟเวอร์ ช่วยชะลอการส่งรัว ๆ แต่ไม่ใช่การรับประกันระดับทั้งระบบ",
            "ฐานข้อมูลเป็นทางเลือก หากไม่มีจะใช้เว็บฮุก และแจ้งตรง ๆ เมื่อไม่มีทั้งสองอย่าง",
          ],
        },
        future: {
          body: "หากเว็บไซต์เติบโตขึ้น:",
          points: [
            "ย้ายตัวจำกัดอัตราไปไว้ที่พื้นที่เก็บข้อมูลร่วม",
            "เพิ่มหน้ากล่องข้อความสำหรับดูรายการที่บันทึกไว้",
            "เพิ่มชั้น CMS แบบเลือกได้ โดยคงโครงสร้างเนื้อหาที่กำหนดชนิดไว้เหมือนเดิม",
          ],
        },
      },
      diagrams: {
        ux: {
          kind: "tree",
          title: "ผู้เข้าชมจะเห็นภาษาใด",
          caption: "ลำดับการตัดสินใจในพร็อกซีของเว็บไซต์นี้",
          root: {
            label: "คำขอที่ไม่มีรหัสภาษา เช่น /about",
            children: [
              { edge: "มีรหัสภาษา (/de/…)", node: { label: "แสดงภาษานั้น" } },
              {
                edge: "ไม่มีรหัสภาษา",
                node: {
                  label: "มีคุกกี้ภาษาที่บันทึกไว้หรือไม่",
                  children: [
                    { edge: "มี", node: { label: "เปลี่ยนเส้นทางไปภาษาที่บันทึกไว้" } },
                    {
                      edge: "ไม่มี",
                      node: {
                        label: "อ่านส่วนหัว Accept-Language",
                        children: [
                          { edge: "พบภาษาที่รองรับ", node: { label: "เปลี่ยนเส้นทางไปภาษานั้น" } },
                          { edge: "ไม่ตรงกับภาษาใดเลย", node: { label: "เปลี่ยนเส้นทางไปภาษาอังกฤษ" } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        architecture: {
          kind: "flow",
          title: "เส้นทางของคำขอติดต่อ",
          caption: "จากแบบฟอร์มสู่คำตอบที่ตรงไปตรงมา",
          nodes: [
            { label: "เบราว์เซอร์", detail: "แบบฟอร์มส่งไปยัง Server Action และทำงานได้กับ HTML ที่เรนเดอร์จากเซิร์ฟเวอร์" },
            { label: "Server Action", detail: "ทำงานบน Vercel และอ่านข้อมูลดิบจากแบบฟอร์ม" },
            { label: "ตรวจสอบด้วย Zod", detail: "ส่งรหัสข้อผิดพลาดที่คงที่ต่อแต่ละช่อง แล้วแปลเป็นภาษาในเบราว์เซอร์" },
            { label: "ตรวจสแปมและอัตราการส่ง", detail: "ช่องล่อบอตที่ซ่อนอยู่ และตัวจำกัดอัตราต่อผู้เข้าชม" },
            { label: "การส่งข้อความ", detail: "แถวในฐานข้อมูล Postgres และ/หรือเว็บฮุก ต้องมีอย่างน้อยหนึ่งช่องทางที่รับไว้" },
            { label: "การตอบกลับ", detail: "แจ้งสำเร็จเมื่อมีช่องทางรับไว้แล้วเท่านั้น ไม่เช่นนั้นแจ้งข้อผิดพลาดตามจริง" },
          ],
        },
      },
    },
    {
      id: "booking",
      kind: "concept",
      title: "ระบบนัดหมายสำหรับสตูดิโอขนาดเล็ก",
      tagline: "แนวคิดที่แทนการนัดผ่านแชตด้วยขั้นตอนที่จองซ้ำไม่ได้",
      status: "แบบฝึกการออกแบบ ไม่ได้สร้างให้ลูกค้ารายใด",
      stack: ["Next.js", "PostgreSQL", "Server Actions", "Zod", "การจัดตารางที่รองรับเขตเวลา"],
      sections: {
        problem: {
          body: "ลองนึกถึงสตูดิโอเล็ก ๆ เช่น คลินิกกายภาพบำบัดหรือช่างภาพ ที่รับนัดผ่านข้อความ เวลาสับสน คิวถูกรับปากซ้ำ และการเปลี่ยนแต่ละครั้งต้องเสียเวลาคุยกันใหม่",
          points: [],
        },
        discovery: {
          body: "เมื่อไล่ดูวงจรการนัดหมาย จะเห็นจุดที่พัง ได้แก่ เลือกเวลา ยืนยัน เลื่อน และยกเลิก ข้อผิดพลาดส่วนใหญ่เกิดจากสองคนจำคิวเดียวกันไว้ในหัว",
          points: [],
        },
        constraints: {
          body: "กฎที่ทุกแนวทางต้องรักษาไว้:",
          points: [
            "การจองต้องไม่ทับซ้อนกัน แม้สองคนกดพร้อมกันในเสี้ยววินาทีเดียวกัน",
            "ลูกค้าส่วนใหญ่ใช้มือถือ และอาจอยู่คนละเขตเวลา",
            "ทีมงานต้องบล็อกเวลาว่างได้โดยไม่ต้องแตะการจองทีละรายการ",
            "เก็บข้อมูลส่วนบุคคลให้น้อยที่สุด เฉพาะชื่อและช่องทางติดต่อ",
          ],
        },
        ux: {
          body: "เลือกบริการก่อน แล้วค่อยเลือกเวลา เพราะระยะเวลาขึ้นกับบริการ ปฏิทินจึงแสดงเฉพาะช่วงเวลาที่ใช้ได้จริง วันที่ไม่มีคิวว่างจะถูกปิดไว้แทนที่จะซ่อน ลูกค้าจะได้เข้าใจเหตุผล",
          points: [],
        },
        architecture: {
          body: "ความพร้อมให้บริการคำนวณบนเซิร์ฟเวอร์จากเวลาทำงาน การจองที่มีอยู่ และเวลาหยุด กฎข้อสุดท้ายให้ฐานข้อมูลบังคับใช้ ข้อจำกัดแบบ exclusion บนช่วงเวลาทำให้การจองที่ทับซ้อนเป็นไปไม่ได้ ไม่ว่าแอปพลิเคชันจะทำอะไร",
          points: [],
        },
        implementation: {
          body: "การสร้างช่วงเวลาว่างเป็นฟังก์ชันบริสุทธิ์ ใส่เวลาทำการ ระยะเวลา และการจองที่มีอยู่เข้าไป แล้วได้ช่วงเวลาว่างออกมา การไม่ผูกกับโค้ดของเฟรมเวิร์กทำให้ส่วนที่ยากทดสอบได้ง่าย",
          points: [
            "เก็บเวลาเป็น UTC และเก็บเขตเวลาของสตูดิโอไว้คู่กัน",
            "การเลื่อนนัดคือยกเลิกแล้วจองใหม่ภายในทรานแซกชันเดียว",
            "เวลาหยุดของทีมงานถูกจำลองเป็นการจองชนิดพิเศษ",
          ],
        },
        testing: {
          body: "การทดสอบเน้นกฎที่ผิดแล้วเสียหายจริง:",
          points: [
            "การจองที่ต่อเนื่องกันพอดีทำได้ แต่ทับซ้อนไม่ได้",
            "วันที่มีการปรับเวลานาฬิกา",
            "สองคำขอพร้อมกันต่อคิวเดียว สำเร็จได้เพียงหนึ่งราย",
            "การจองที่คร่อมเที่ยงคืน",
          ],
        },
        performance: {
          body: "เซิร์ฟเวอร์ส่งช่วงเวลาทีละหนึ่งวัน ข้อมูลที่ส่งจึงเล็กเสมอ ไม่ว่าปฏิทินจะไกลแค่ไหน หน้าจองเรนเดอร์จากเซิร์ฟเวอร์ได้เป็นส่วนใหญ่ โดยปฏิทินเป็นส่วนโต้ตอบเพียงส่วนเดียว",
          points: [],
        },
        tradeoffs: {
          body: "การยอมแลกสามข้อที่ตั้งใจ:",
          points: [
            "ข้อจำกัดระดับฐานข้อมูลเพิ่มขั้นตอนการย้ายโครงสร้าง แต่ขจัดบั๊กการแย่งคิวไปทั้งกลุ่ม",
            "เสนอทางเลือกหลังเกิดการชนกันใช้แรงมากกว่าข้อความแจ้งข้อผิดพลาด แต่ช่วยลดภาระของลูกค้า",
            "ไม่บังคับมีบัญชีลูกค้าทำให้ใช้งานง่าย แต่ต้องส่งลิงก์จัดการการจองทางอีเมลแทน",
          ],
        },
        future: {
          body: "ต่อยอดได้ในอนาคต:",
          points: ["ซิงก์ปฏิทินผ่านฟีด iCal", "ส่งข้อความเตือนเพื่อลดการไม่มาตามนัด", "รองรับทีมงานหลายคน แต่ละคนมีเวลาทำงานของตนเอง"],
        },
      },
      diagrams: {
        ux: {
          kind: "tree",
          title: "ขั้นตอนการจองในรูปแบบการตัดสินใจ",
          caption: "สิ่งที่ลูกค้าเห็นในแต่ละขั้น",
          root: {
            label: "ลูกค้าเปิดหน้าจอง",
            children: [
              { edge: "ยังไม่ได้เลือกบริการ", node: { label: "แสดงบริการพร้อมระยะเวลา ยังไม่แสดงปฏิทิน" } },
              {
                edge: "เลือกบริการแล้ว",
                node: {
                  label: "แสดงวันที่ยังมีคิวว่าง",
                  children: [
                    {
                      edge: "เลือกวันแล้ว",
                      node: {
                        label: "แสดงเฉพาะช่วงเวลาที่พอดีกับระยะเวลา",
                        children: [
                          { edge: "คิวถูกจองไประหว่างนั้น", node: { label: "เสนอทางเลือกใกล้เคียง และคงข้อมูลที่กรอกไว้" } },
                          { edge: "คิวยังว่างอยู่", node: { label: "ยืนยันและส่งสรุปให้" } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        architecture: {
          kind: "flow",
          title: "จากการเลือกวันถึงการจองที่ยืนยันแล้ว",
          caption: "ฐานข้อมูลเป็นผู้ตัดสินขั้นสุดท้าย",
          nodes: [
            { label: "ลูกค้าเลือกวัน", detail: "เบราว์เซอร์ส่งเฉพาะบริการและวันที่" },
            { label: "สอบถามความพร้อม", detail: "เซิร์ฟเวอร์หาช่วงเวลาว่างจากเวลาทำการ เวลาหยุด และการจอง" },
            { label: "รายการช่วงเวลา", detail: "ส่งกลับไปยังเบราว์เซอร์เฉพาะวันที่เลือก" },
            { label: "การดำเนินการจอง", detail: "ตรวจสอบข้อมูล แล้วบันทึกภายในทรานแซกชัน" },
            { label: "ข้อจำกัดของฐานข้อมูล", detail: "ช่วงเวลาที่ทับซ้อนถูกฐานข้อมูลปฏิเสธเอง" },
            { label: "การยืนยัน", detail: "สำเร็จ หรือเสนอช่วงเวลาอื่นหากคิวเพิ่งถูกจองไป" },
          ],
        },
      },
    },
    {
      id: "multilingual",
      kind: "concept",
      title: "เว็บไซต์หลายภาษาสำหรับเกสต์เฮาส์ท้องถิ่น",
      tagline: "แนวคิดที่ทำให้สามภาษาถูกต้อง รวดเร็ว และค้นเจอได้",
      status: "แบบฝึกการออกแบบ ธุรกิจสมมติ",
      stack: ["Next.js", "TypeScript", "การกำหนดเส้นทางด้วยรหัสภาษา", "ข้อมูลเชิงโครงสร้าง"],
      sections: {
        problem: {
          body: "เกสต์เฮาส์สมมติแห่งหนึ่งต้อนรับแขกที่อ่านภาษาไทย อังกฤษ และเยอรมัน เว็บไซต์เดิมเป็นหน้าภาษาอังกฤษหน้าเดียวที่ครอบด้วยปลั๊กอินแปลภาษา ราคาในแต่ละภาษาไม่ตรงกัน และเสิร์ชเอนจินเห็นเป็นเรื่องสับสน",
          points: [],
        },
        discovery: {
          body: "ข้อเท็จจริง (ราคา เวลา ที่อยู่) กับถ้อยคำ (คำอธิบาย น้ำเสียง) เปลี่ยนแปลงด้วยความเร็วต่างกัน การปนกันคือสาเหตุที่คำแปลค่อย ๆ เพี้ยน",
          points: [],
        },
        constraints: {
          body: "สิ่งที่กำหนดแนวทางแก้:",
          points: [
            "เจ้าของไม่ใช่นักพัฒนา และแก้ราคาบ่อย",
            "แขกส่วนใหญ่มาจากการค้นหาและใช้มือถือ",
            "ต้องรู้ให้ได้ว่าขาดคำแปลก่อนที่แขกจะเห็น",
            "ค่าโฮสติ้งควรใกล้ศูนย์",
          ],
        },
        ux: {
          body: "ภาษาเป็นส่วนหนึ่งของที่อยู่ ลิงก์เดียวกันจึงแสดงผลเหมือนกันสำหรับทุกคน และเสิร์ชเอนจินจัดทำดัชนีได้ทุกฉบับ ตัวสลับภาษาที่มองเห็นได้จะคงหน้าปัจจุบันไว้ แทนที่จะพาแขกกลับไปหน้าแรก",
          points: [],
        },
        architecture: {
          body: "ข้อเท็จจริงและถ้อยคำอยู่คนละชั้น ไฟล์ข้อมูลที่กำหนดชนิดไว้ไฟล์เดียวเป็นเจ้าของราคาและเวลา แต่ละภาษาดูแลเฉพาะถ้อยคำของตนและอ้างอิงถึงข้อเท็จจริงนั้น ตอนบิลด์จะประกอบเป็นหน้าสถิตแยกตามภาษา",
          points: [],
        },
        implementation: {
          body: "โมดูลเนื้อหาใช้ชนิดข้อมูลร่วมกัน เงิน วันที่ และเวลาเปิดทำการผ่านตัวจัดรูปแบบที่รองรับภาษา ไม่ใช่ข้อความที่พิมพ์เอง",
          points: [
            "สร้างลิงก์ทางเลือก hreflang ให้ทุกหน้า",
            "สร้างข้อมูลเชิงโครงสร้างของธุรกิจจากชั้นข้อเท็จจริง",
            "ตัวสลับภาษาที่คงหน้าเดิมและจำตัวเลือกไว้",
          ],
        },
        testing: {
          body: "การตรวจมุ่งไปที่จุดที่เว็บไซต์หลายภาษามักเสื่อมสภาพ:",
          points: [
            "มีการทดสอบยืนยันว่าทุกภาษากำหนดครบทุกคีย์",
            "ราคาแสดงตรงกันในทุกภาษา เพราะเรนเดอร์จากค่าเดียว",
            "ตรวจลิงก์ทั่วทุกเส้นทางที่สร้างขึ้น",
          ],
        },
        performance: {
          body: "ทุกหน้าถูกสร้างไว้ล่วงหน้าแยกตามภาษา เซิร์ฟเวอร์จึงไม่ต้องทำงานต่อการเข้าชมแต่ละครั้ง ไม่มีการแปลฝั่งเบราว์เซอร์ แขกจึงโหลดเฉพาะภาษาที่อ่าน",
          points: [],
        },
        tradeoffs: {
          body: "ข้อแลกเปลี่ยนที่ควรพูดตรง ๆ:",
          points: [
            "การแก้ไขผ่านโค้ดเป็นอุปสรรคสำหรับเจ้าของ CMS แก้ได้แต่เพิ่มค่าใช้จ่ายและแหล่งข้อมูลที่สอง",
            "เนื้อหาที่กำหนดชนิดบังคับให้มีคำแปลครบทุกคีย์ ทำให้เพิ่มฟีเจอร์ช้าลง แต่กันช่องโหว่ได้",
            "สามภาษาทำให้งานตรวจข้อความเพิ่มเป็นสามเท่า จึงควรมีขั้นตอนให้เจ้าของภาษาตรวจในแผน",
          ],
        },
        future: {
          body: "ขั้นต่อไป:",
          points: ["Headless CMS ที่ใช้สคีมาเดิมและมีตัวอย่างฉบับร่าง", "รายการตรวจคำแปลทุกครั้งที่ปล่อยเวอร์ชัน", "จองออนไลน์ โดยนำแนวคิดระบบนัดหมายมาใช้ต่อ"],
        },
      },
      diagrams: {
        architecture: {
          kind: "layers",
          title: "แยกข้อเท็จจริงออกจากถ้อยคำ",
          caption: "แต่ละชั้นป้อนข้อมูลให้ชั้นถัดไป",
          nodes: [
            { label: "ข้อเท็จจริง", detail: "ราคา เวลา และที่อยู่ เป็นระเบียนเดียวที่ไม่ผูกกับภาษา" },
            { label: "ข้อความแต่ละภาษา", detail: "คำอธิบายและป้ายกำกับเป็นภาษาไทย อังกฤษ และเยอรมัน" },
            { label: "ตรวจชนิดข้อมูล", detail: "บิลด์จะล้มเหลวหากภาษาใดขาดคีย์" },
            { label: "หน้าสถิต", detail: "หนึ่งหน้าที่สร้างไว้ล่วงหน้าต่อภาษาและเส้นทาง" },
            { label: "เมทาดาทาสำหรับการค้นหา", detail: "ลิงก์ทางเลือกของภาษาและข้อมูลเชิงโครงสร้างจากข้อเท็จจริงชุดเดียวกัน" },
            { label: "CDN", detail: "ให้บริการจากเอดจ์เป็น HTML ธรรมดา" },
          ],
        },
      },
    },
  ],
  cta: { label: "ปรึกษาโปรเจกต์", title: "อยากได้วิธีคิดแบบนี้ในโปรเจกต์ของคุณไหม" },
};

export const caseStudiesContent: Localized<CaseStudiesContent> = { en, de, th };
