import type { Localized } from "@/i18n/config";
import type { CategoryId, ProjectId } from "@/components/pages/projects/data";

interface ProjectCopy {
  tagline: string;
  problem: string;
  solution: string;
  decisions: readonly string[];
}

const en = {
  meta: {
    title: "Projects",
    description: "A project explorer with self-initiated concept projects and one live technical demonstration, each with the problem, solution and engineering decisions.",
  },
  hero: {
    eyebrow: "Projects",
    titlePlain: "Things built to",
    titleAccent: "show how I think.",
    lede: "Concept projects and technical demonstrations, each with the problem it addresses, the decisions behind it and the stack.",
    complexity: "Complexity",
  },
  ui: {
    eyebrow: "Project explorer",
    title: "Explore by category or keyword",
    body: "Self-initiated projects that show how I design and build. They are not client work, and each one is labelled accordingly.",
    searchLabel: "Search projects",
    searchPlaceholder: "Try “dashboard”, “PostgreSQL” or “mobile”",
    filterLabel: "Filter by category",
    all: "All",
    results: "{n} of {total} projects",
    empty: "No project matches. Try another word or clear the filters.",
    reset: "Clear filters",
    listLabel: "Projects",
    detailLabel: "Project details",
    open: "Open details",
  },
  kind: { concept: "Concept Project", demo: "Technical Demonstration" },
  detail: {
    problem: "The problem",
    solution: "The solution",
    decisions: "Engineering decisions",
    stack: "Stack",
    preview: "Responsive preview",
    previewNote: "Illustrative mock-up, not a screenshot.",
    links: "Links",
    source: "View source on GitHub",
    discuss: "Discuss a similar project",
  },
  categories: {
    saas: "SaaS",
    "business-website": "Business website",
    dashboard: "Dashboard",
    "e-commerce": "E-commerce concept",
    "ai-workflow": "AI workflow",
    "internal-tool": "Internal tool",
    "landing-page": "Landing page",
    "developer-tool": "Developer tool",
  } satisfies Record<CategoryId, string>,
  disclaimer: {
    title: "About these projects",
    body: "Concept Projects are self-initiated and use synthetic data. They were not delivered to real clients. The Technical Demonstration, this portfolio, is live and its source is public.",
  },
  projects: {
    "relay-desk": {
      tagline: "A shared inbox and ticketing tool for small service teams.",
      problem: "Small agencies track client requests across email threads and chat, so ownership and deadlines blur.",
      solution: "One queue with assignable tickets, status rules and a searchable history, built as a multi-tenant SaaS.",
      decisions: [
        "A tenant id on every row and every query, enforced in one data-access layer, so isolation is not left to each page.",
        "Server Actions validated with shared Zod schemas, so the form and the database agree on what a ticket is.",
        "Optimistic status changes reconciled with the server, keeping the queue fast without hiding failures.",
      ],
    },
    "fern-clay": {
      tagline: "A bilingual website for a small ceramics studio, with enquiries and workshop booking.",
      problem: "A craft studio needs to look as considered online as its work, in two languages, without a heavy CMS.",
      solution: "A fast editorial site with localized routes, a workshop calendar and an enquiry form validated on the server.",
      decisions: [
        "Content lives in typed files per language, so a missing translation fails the build instead of shipping.",
        "Images are sized and lazy-loaded through one helper to keep the heaviest page light on mobile.",
        "The enquiry form works without JavaScript and upgrades to inline feedback when it is available.",
      ],
    },
    gridwatch: {
      tagline: "An energy-usage dashboard for facility managers, built on synthetic data.",
      problem: "Facility teams read meters in spreadsheets and notice waste a month too late.",
      solution: "A dashboard that turns meter readings into trends, anomalies and a plain-language summary per building.",
      decisions: [
        "Charts are plain SVG driven by typed data, which keeps the bundle small and lets every chart be inspected by keyboard.",
        "Aggregation happens in SQL, close to the data, so the browser receives shapes it can draw directly.",
        "Anomalies are explained in words rather than only coloured red, so an alert can be acted on.",
      ],
    },
    tideline: {
      tagline: "A small-batch apparel store concept with a cart and a checkout flow that stops before real payment.",
      problem: "Small shops lose buyers to slow pages and checkouts that feel risky on a phone.",
      solution: "A storefront with fast product pages, a persistent cart and a short checkout designed mobile first.",
      decisions: [
        "Cart state lives on the server under an opaque id, so it survives reloads and devices.",
        "Prices are always recalculated on the server; the client only displays them.",
        "Checkout is three short steps with inline validation and a visible summary, tuned for thumbs first.",
      ],
    },
    "brief-loop": {
      tagline: "A workflow that turns a written brief into a reviewed pull request, with AI agents and human checkpoints.",
      problem: "AI-generated code is fast but inconsistent when requests are vague and nobody checks the result.",
      solution: "A repeatable loop: specification, plan, implementation by an agent, automated tests, then a human review gate before anything merges.",
      decisions: [
        "Each stage has an explicit input and output, so a failing stage can be rerun without starting over.",
        "Tests and type checks run before a person reviews, so review time goes to design questions.",
        "The human gate is mandatory. Agents never merge their own work.",
      ],
    },
    rota: {
      tagline: "An internal shift-planning tool for teams that still schedule in spreadsheets.",
      problem: "Shift swaps, leave and coverage rules live in someone's head, and conflicts surface on the day.",
      solution: "A weekly planner that applies coverage rules while you edit and explains every conflict it finds.",
      decisions: [
        "Scheduling rules are pure functions with unit tests, separate from the interface, so they can change safely.",
        "Every conflict message names the rule and the people affected instead of saying “invalid”.",
        "Keyboard-first editing, because planners spend hours in the grid.",
      ],
    },
    "schema-lens": {
      tagline: "A developer tool that inspects JSON payloads and generates typed validators.",
      problem: "Teams debug API responses by eye and write validators by hand, so mismatches slip into production.",
      solution: "Paste a payload, see its inferred shape and differences, and export a Zod schema with TypeScript types.",
      decisions: [
        "Inference is a pure module with a large table of unit tests, since edge cases are the whole product.",
        "Everything runs locally in the browser, so pasted data never leaves the machine.",
        "Output is deliberately readable, because generated code is still code someone maintains.",
      ],
    },
    "this-portfolio": {
      tagline: "The site you are reading: nine pages, three languages and a real backend.",
      problem: "A portfolio should prove engineering ability, not only describe it.",
      solution: "An original design system, typed content in EN, DE and TH, a validated contact backend, tests and automated deployment.",
      decisions: [
        "Server Components by default and client code only for interaction, which keeps the JavaScript small.",
        "Personal details live in one config file and all copy in typed content modules.",
        "Built with AI agents under human review, using the workflow described on the AI-native page.",
      ],
    },
  } satisfies Record<ProjectId, ProjectCopy>,
};

export type ProjectsContent = typeof en;

const de: ProjectsContent = {
  meta: {
    title: "Projekte",
    description: "Ein Projekt-Explorer mit selbst initiierten Konzeptprojekten und einer live laufenden technischen Demonstration, jeweils mit Problem, Lösung und technischen Entscheidungen.",
  },
  hero: {
    eyebrow: "Projekte",
    titlePlain: "Gebaut, um zu",
    titleAccent: "zeigen, wie ich denke.",
    lede: "Konzeptprojekte und technische Demonstrationen, jeweils mit dem Problem, den Entscheidungen dahinter und dem Stack.",
    complexity: "Komplexität",
  },
  ui: {
    eyebrow: "Projekt-Explorer",
    title: "Nach Kategorie oder Stichwort erkunden",
    body: "Selbst initiierte Projekte, die zeigen, wie ich gestalte und baue. Es sind keine Kundenprojekte, und jedes ist entsprechend gekennzeichnet.",
    searchLabel: "Projekte durchsuchen",
    searchPlaceholder: "Zum Beispiel „Dashboard“, „PostgreSQL“ oder „mobil“",
    filterLabel: "Nach Kategorie filtern",
    all: "Alle",
    results: "{n} von {total} Projekten",
    empty: "Kein Projekt passt. Versuche ein anderes Wort oder setze die Filter zurück.",
    reset: "Filter zurücksetzen",
    listLabel: "Projekte",
    detailLabel: "Projektdetails",
    open: "Details öffnen",
  },
  kind: { concept: "Konzeptprojekt", demo: "Technische Demonstration" },
  detail: {
    problem: "Das Problem",
    solution: "Die Lösung",
    decisions: "Technische Entscheidungen",
    stack: "Stack",
    preview: "Responsive-Vorschau",
    previewNote: "Illustrativer Entwurf, kein Screenshot.",
    links: "Links",
    source: "Quellcode auf GitHub ansehen",
    discuss: "Ähnliches Projekt besprechen",
  },
  categories: {
    saas: "SaaS",
    "business-website": "Unternehmenswebsite",
    dashboard: "Dashboard",
    "e-commerce": "E-Commerce-Konzept",
    "ai-workflow": "KI-Workflow",
    "internal-tool": "Internes Tool",
    "landing-page": "Landingpage",
    "developer-tool": "Entwickler-Tool",
  },
  disclaimer: {
    title: "Zu diesen Projekten",
    body: "Konzeptprojekte sind selbst initiiert und nutzen synthetische Daten. Sie wurden nicht für echte Kundschaft umgesetzt. Die technische Demonstration, dieses Portfolio, läuft live und der Quellcode ist öffentlich.",
  },
  projects: {
    "relay-desk": {
      tagline: "Ein gemeinsamer Posteingang mit Ticketsystem für kleine Dienstleistungsteams.",
      problem: "Kleine Agenturen verfolgen Kundenanfragen in E-Mail-Verläufen und Chats, wodurch Zuständigkeiten und Fristen verschwimmen.",
      solution: "Eine einzige Warteschlange mit zuweisbaren Tickets, Statusregeln und durchsuchbarer Historie, umgesetzt als mandantenfähiges SaaS.",
      decisions: [
        "Eine Mandanten-ID in jeder Zeile und jeder Abfrage, erzwungen in einer zentralen Datenzugriffsschicht, damit Isolation nicht jeder Seite überlassen bleibt.",
        "Server Actions mit gemeinsamen Zod-Schemata validiert, sodass Formular und Datenbank dasselbe unter einem Ticket verstehen.",
        "Optimistische Statuswechsel, die mit dem Server abgeglichen werden: Die Warteschlange bleibt schnell, ohne Fehler zu verbergen.",
      ],
    },
    "fern-clay": {
      tagline: "Eine zweisprachige Website für ein kleines Keramikstudio mit Anfragen und Workshop-Buchung.",
      problem: "Ein Handwerksstudio soll online so durchdacht wirken wie seine Arbeit, in zwei Sprachen und ohne schwerfälliges CMS.",
      solution: "Eine schnelle, redaktionelle Website mit lokalisierten Routen, Workshop-Kalender und serverseitig validiertem Anfrageformular.",
      decisions: [
        "Inhalte liegen in typisierten Dateien je Sprache, sodass eine fehlende Übersetzung den Build scheitern lässt, statt auszuliefern.",
        "Bilder werden über einen einzigen Helfer skaliert und verzögert geladen, damit die schwerste Seite mobil leicht bleibt.",
        "Das Anfrageformular funktioniert ohne JavaScript und erweitert sich um direktes Feedback, wenn es verfügbar ist.",
      ],
    },
    gridwatch: {
      tagline: "Ein Energieverbrauchs-Dashboard für Facility-Manager, aufgebaut auf synthetischen Daten.",
      problem: "Facility-Teams lesen Zähler in Tabellen ab und bemerken Verschwendung einen Monat zu spät.",
      solution: "Ein Dashboard, das Zählerstände in Trends, Auffälligkeiten und eine verständliche Zusammenfassung je Gebäude verwandelt.",
      decisions: [
        "Diagramme sind schlichtes SVG auf Basis typisierter Daten: kleines Bundle und jedes Diagramm per Tastatur prüfbar.",
        "Aggregation passiert in SQL, nah an den Daten, sodass der Browser direkt zeichenbare Formen erhält.",
        "Auffälligkeiten werden in Worten erklärt statt nur rot eingefärbt, damit ein Alarm auch zu Handlungen führt.",
      ],
    },
    tideline: {
      tagline: "Ein Shop-Konzept für Kleinserien-Kleidung mit Warenkorb und Checkout, der vor der echten Zahlung endet.",
      problem: "Kleine Shops verlieren Kaufinteressierte an langsame Seiten und Checkouts, die sich auf dem Handy riskant anfühlen.",
      solution: "Ein Shopfront mit schnellen Produktseiten, dauerhaftem Warenkorb und kurzem, mobil gedachtem Checkout.",
      decisions: [
        "Der Warenkorb liegt serverseitig unter einer undurchsichtigen ID und überlebt Reloads und Geräte.",
        "Preise werden immer auf dem Server neu berechnet; der Client zeigt sie nur an.",
        "Der Checkout besteht aus drei kurzen Schritten mit direkter Validierung und sichtbarer Zusammenfassung, zuerst für Daumen optimiert.",
      ],
    },
    "brief-loop": {
      tagline: "Ein Workflow, der ein schriftliches Briefing mit KI-Agenten und menschlichen Kontrollpunkten in einen geprüften Pull Request verwandelt.",
      problem: "KI-generierter Code ist schnell, aber uneinheitlich, wenn Anfragen vage bleiben und niemand das Ergebnis prüft.",
      solution: "Ein wiederholbarer Kreislauf: Spezifikation, Plan, Umsetzung durch einen Agenten, automatisierte Tests und dann ein menschliches Review-Tor, bevor etwas gemergt wird.",
      decisions: [
        "Jede Stufe hat klare Ein- und Ausgaben, sodass eine fehlgeschlagene Stufe wiederholt werden kann, ohne neu zu beginnen.",
        "Tests und Typprüfungen laufen vor dem Review durch einen Menschen, sodass die Reviewzeit den Designfragen gehört.",
        "Das menschliche Tor ist Pflicht. Agenten mergen ihre Arbeit nie selbst.",
      ],
    },
    rota: {
      tagline: "Ein internes Schichtplanungs-Tool für Teams, die noch in Tabellen planen.",
      problem: "Schichttausch, Urlaub und Besetzungsregeln existieren nur in den Köpfen, und Konflikte zeigen sich erst am Tag selbst.",
      solution: "Ein Wochenplaner, der Besetzungsregeln beim Bearbeiten anwendet und jeden gefundenen Konflikt erklärt.",
      decisions: [
        "Planungsregeln sind reine Funktionen mit Unit-Tests, getrennt von der Oberfläche, sodass sie sich sicher ändern lassen.",
        "Jede Konfliktmeldung nennt die Regel und die betroffenen Personen, statt nur „ungültig“ zu sagen.",
        "Bearbeitung per Tastatur zuerst, weil Planende Stunden im Raster verbringen.",
      ],
    },
    "schema-lens": {
      tagline: "Ein Entwickler-Tool, das JSON-Payloads untersucht und typisierte Validatoren erzeugt.",
      problem: "Teams prüfen API-Antworten nach Augenmaß und schreiben Validatoren von Hand, sodass Abweichungen in Produktion gelangen.",
      solution: "Payload einfügen, erkannte Struktur und Unterschiede sehen und ein Zod-Schema mit TypeScript-Typen exportieren.",
      decisions: [
        "Die Erkennung ist ein reines Modul mit einer umfangreichen Tabelle an Unit-Tests, denn die Randfälle sind das eigentliche Produkt.",
        "Alles läuft lokal im Browser, sodass eingefügte Daten den Rechner nie verlassen.",
        "Die Ausgabe ist bewusst gut lesbar, denn generierter Code ist weiterhin Code, den jemand pflegt.",
      ],
    },
    "this-portfolio": {
      tagline: "Die Website, die du gerade liest: neun Seiten, drei Sprachen und ein echtes Backend.",
      problem: "Ein Portfolio soll technisches Können belegen, nicht nur beschreiben.",
      solution: "Ein eigenständiges Designsystem, typisierte Inhalte in EN, DE und TH, ein validiertes Kontakt-Backend, Tests und automatisiertes Deployment.",
      decisions: [
        "Standardmäßig Server Components und Client-Code nur für Interaktion, damit das JavaScript klein bleibt.",
        "Persönliche Angaben liegen in einer Konfigurationsdatei und alle Texte in typisierten Inhaltsmodulen.",
        "Gebaut mit KI-Agenten unter menschlichem Review, nach dem Workflow, der auf der KI-nativ-Seite beschrieben ist.",
      ],
    },
  },
};

const th: ProjectsContent = {
  meta: {
    title: "โปรเจกต์",
    description: "ตัวสำรวจโปรเจกต์ที่รวมโปรเจกต์แนวคิดที่ริเริ่มเองและเดโมทางเทคนิคที่ใช้งานจริงหนึ่งชิ้น พร้อมปัญหา วิธีแก้ และการตัดสินใจทางวิศวกรรม",
  },
  hero: {
    eyebrow: "โปรเจกต์",
    titlePlain: "สร้างขึ้นเพื่อ",
    titleAccent: "แสดงวิธีคิด",
    lede: "โปรเจกต์แนวคิดและเดโมทางเทคนิค แต่ละชิ้นบอกปัญหาที่แก้ การตัดสินใจเบื้องหลัง และสแต็กที่ใช้",
    complexity: "ความซับซ้อน",
  },
  ui: {
    eyebrow: "ตัวสำรวจโปรเจกต์",
    title: "สำรวจตามหมวดหมู่หรือคำค้น",
    body: "โปรเจกต์ที่ริเริ่มเองเพื่อแสดงวิธีออกแบบและสร้างงาน ไม่ใช่งานของลูกค้า และทุกชิ้นติดป้ายกำกับไว้ชัดเจน",
    searchLabel: "ค้นหาโปรเจกต์",
    searchPlaceholder: "ลองพิมพ์ “dashboard”, “PostgreSQL” หรือ “มือถือ”",
    filterLabel: "กรองตามหมวดหมู่",
    all: "ทั้งหมด",
    results: "{n} จาก {total} โปรเจกต์",
    empty: "ไม่พบโปรเจกต์ที่ตรงกัน ลองใช้คำอื่นหรือล้างตัวกรอง",
    reset: "ล้างตัวกรอง",
    listLabel: "โปรเจกต์",
    detailLabel: "รายละเอียดโปรเจกต์",
    open: "ดูรายละเอียด",
  },
  kind: { concept: "โปรเจกต์แนวคิด", demo: "เดโมทางเทคนิค" },
  detail: {
    problem: "ปัญหา",
    solution: "วิธีแก้",
    decisions: "การตัดสินใจทางวิศวกรรม",
    stack: "สแต็ก",
    preview: "ตัวอย่างบนหลายขนาดหน้าจอ",
    previewNote: "ภาพจำลองเพื่อประกอบคำอธิบาย ไม่ใช่ภาพหน้าจอจริง",
    links: "ลิงก์",
    source: "ดูซอร์สโค้ดบน GitHub",
    discuss: "ปรึกษาโปรเจกต์ที่คล้ายกัน",
  },
  categories: {
    saas: "SaaS",
    "business-website": "เว็บไซต์ธุรกิจ",
    dashboard: "แดชบอร์ด",
    "e-commerce": "แนวคิดอีคอมเมิร์ซ",
    "ai-workflow": "เวิร์กโฟลว์ AI",
    "internal-tool": "เครื่องมือภายในองค์กร",
    "landing-page": "แลนดิงเพจ",
    "developer-tool": "เครื่องมือสำหรับนักพัฒนา",
  },
  disclaimer: {
    title: "เกี่ยวกับโปรเจกต์เหล่านี้",
    body: "โปรเจกต์แนวคิดริเริ่มขึ้นเองและใช้ข้อมูลสังเคราะห์ ไม่ได้ส่งมอบให้ลูกค้าจริง ส่วนเดโมทางเทคนิคคือพอร์ตโฟลิโอนี้ ซึ่งใช้งานอยู่จริงและเปิดซอร์สโค้ดสาธารณะ",
  },
  projects: {
    "relay-desk": {
      tagline: "กล่องข้อความร่วมและระบบจัดการทิกเก็ตสำหรับทีมบริการขนาดเล็ก",
      problem: "เอเจนซีขนาดเล็กติดตามคำขอของลูกค้าผ่านอีเมลและแชต ทำให้ผู้รับผิดชอบและกำหนดส่งเริ่มไม่ชัดเจน",
      solution: "คิวเดียวที่มอบหมายทิกเก็ตได้ มีกฎสถานะและประวัติที่ค้นหาได้ พัฒนาเป็น SaaS แบบหลายผู้เช่า",
      decisions: [
        "ใส่รหัสผู้เช่าในทุกแถวและทุกคำสั่งค้นหา บังคับใช้ที่ชั้นเข้าถึงข้อมูลชั้นเดียว เพื่อไม่ให้การแยกข้อมูลขึ้นอยู่กับแต่ละหน้า",
        "Server Actions ตรวจสอบด้วยสคีมา Zod ร่วม ทำให้ฟอร์มและฐานข้อมูลเข้าใจตรงกันว่าทิกเก็ตคืออะไร",
        "เปลี่ยนสถานะแบบทันทีแล้วค่อยปรับให้ตรงกับเซิร์ฟเวอร์ ทำให้คิวลื่นไหลโดยไม่ซ่อนข้อผิดพลาด",
      ],
    },
    "fern-clay": {
      tagline: "เว็บไซต์สองภาษาสำหรับสตูดิโอเซรามิกขนาดเล็ก พร้อมแบบฟอร์มสอบถามและจองเวิร์กช็อป",
      problem: "สตูดิโองานฝีมือต้องดูพิถีพิถันบนออนไลน์เท่ากับตัวงาน ทั้งสองภาษา โดยไม่ต้องใช้ CMS ที่หนัก",
      solution: "เว็บไซต์สไตล์บรรณาธิการที่เร็ว มีเส้นทางแยกตามภาษา ปฏิทินเวิร์กช็อป และแบบฟอร์มสอบถามที่ตรวจสอบฝั่งเซิร์ฟเวอร์",
      decisions: [
        "เก็บเนื้อหาเป็นไฟล์ที่กำหนดชนิดข้อมูลแยกตามภาษา หากขาดคำแปลบิลด์จะล้มเหลวแทนที่จะปล่อยออกไป",
        "ปรับขนาดและโหลดรูปแบบหน่วงผ่านตัวช่วยเดียว เพื่อให้หน้าที่หนักที่สุดยังเบาบนมือถือ",
        "แบบฟอร์มสอบถามใช้งานได้แม้ไม่มี JavaScript และอัปเกรดเป็นการแจ้งผลทันทีเมื่อมี",
      ],
    },
    gridwatch: {
      tagline: "แดชบอร์ดการใช้พลังงานสำหรับผู้จัดการอาคาร สร้างบนข้อมูลสังเคราะห์",
      problem: "ทีมดูแลอาคารอ่านมิเตอร์ในสเปรดชีตและรู้ว่ามีการสิ้นเปลืองช้าไปหนึ่งเดือน",
      solution: "แดชบอร์ดที่แปลงค่ามิเตอร์เป็นแนวโน้ม ความผิดปกติ และสรุปด้วยภาษาเข้าใจง่ายของแต่ละอาคาร",
      decisions: [
        "กราฟเป็น SVG ล้วนขับเคลื่อนด้วยข้อมูลที่กำหนดชนิด ทำให้บันเดิลเล็กและตรวจดูทุกกราฟด้วยคีย์บอร์ดได้",
        "รวมข้อมูลด้วย SQL ใกล้กับข้อมูล เบราว์เซอร์จึงได้รับรูปทรงที่วาดได้ทันที",
        "อธิบายความผิดปกติเป็นข้อความ ไม่ใช่แค่ระบายสีแดง เพื่อให้การแจ้งเตือนนำไปลงมือทำได้",
      ],
    },
    tideline: {
      tagline: "แนวคิดร้านเสื้อผ้าผลิตจำนวนน้อย มีตะกร้าและขั้นตอนชำระเงินที่หยุดก่อนการจ่ายเงินจริง",
      problem: "ร้านเล็กเสียผู้ซื้อไปกับหน้าเว็บช้าและการชำระเงินที่ดูเสี่ยงบนมือถือ",
      solution: "หน้าร้านที่หน้าสินค้าโหลดเร็ว ตะกร้าอยู่ต่อเนื่อง และขั้นตอนชำระเงินสั้นที่ออกแบบโดยเริ่มจากมือถือ",
      decisions: [
        "เก็บสถานะตะกร้าไว้ฝั่งเซิร์ฟเวอร์ด้วยรหัสที่อ่านความหมายไม่ได้ จึงคงอยู่แม้รีโหลดหรือเปลี่ยนอุปกรณ์",
        "คำนวณราคาใหม่ที่เซิร์ฟเวอร์ทุกครั้ง ฝั่งไคลเอนต์ทำหน้าที่แสดงผลเท่านั้น",
        "ชำระเงินสามขั้นสั้น ๆ มีการตรวจสอบทันทีและสรุปรายการที่มองเห็นตลอด ปรับให้ใช้งานด้วยนิ้วโป้งได้สะดวก",
      ],
    },
    "brief-loop": {
      tagline: "เวิร์กโฟลว์ที่เปลี่ยนบรีฟที่เขียนไว้ให้เป็น pull request ที่ผ่านการรีวิว ด้วยเอเจนต์ AI และจุดตรวจโดยคน",
      problem: "โค้ดที่ AI สร้างเร็วแต่ไม่สม่ำเสมอ เมื่อคำขอคลุมเครือและไม่มีใครตรวจผลลัพธ์",
      solution: "วงจรที่ทำซ้ำได้ ได้แก่ สเปก แผนงาน การพัฒนาโดยเอเจนต์ เทสต์อัตโนมัติ แล้วผ่านประตูรีวิวโดยคนก่อนที่อะไรจะถูกรวมเข้าโค้ดหลัก",
      decisions: [
        "ทุกขั้นมีอินพุตและเอาต์พุตที่ชัดเจน หากขั้นใดล้มเหลวก็รันซ้ำเฉพาะขั้นนั้นได้โดยไม่ต้องเริ่มใหม่",
        "รันเทสต์และตรวจชนิดข้อมูลก่อนที่คนจะรีวิว เวลารีวิวจึงไปอยู่กับคำถามด้านการออกแบบ",
        "ประตูรีวิวโดยคนเป็นข้อบังคับ เอเจนต์ไม่รวมงานของตัวเองเข้าโค้ดหลัก",
      ],
    },
    rota: {
      tagline: "เครื่องมือวางตารางกะภายในองค์กรสำหรับทีมที่ยังใช้สเปรดชีต",
      problem: "การสลับกะ การลา และกฎการจัดคนให้ครบอยู่ในหัวของใครบางคน และปัญหาโผล่ขึ้นในวันจริง",
      solution: "ตารางรายสัปดาห์ที่ใช้กฎการจัดคนขณะแก้ไข และอธิบายทุกข้อขัดแย้งที่พบ",
      decisions: [
        "กฎการจัดตารางเป็นฟังก์ชันล้วนพร้อมเทสต์หน่วย แยกจากหน้าจอ จึงเปลี่ยนแปลงได้อย่างปลอดภัย",
        "ทุกข้อความแจ้งข้อขัดแย้งระบุกฎและคนที่ได้รับผลกระทบ ไม่ใช่แค่บอกว่า “ไม่ถูกต้อง”",
        "แก้ไขด้วยคีย์บอร์ดเป็นหลัก เพราะคนจัดตารางใช้เวลาหลายชั่วโมงอยู่ในตาราง",
      ],
    },
    "schema-lens": {
      tagline: "เครื่องมือสำหรับนักพัฒนาที่ตรวจดู JSON payload และสร้างตัวตรวจสอบที่กำหนดชนิดข้อมูล",
      problem: "ทีมดีบักคำตอบของ API ด้วยตาและเขียนตัวตรวจสอบเอง ความไม่ตรงกันจึงหลุดขึ้นระบบจริง",
      solution: "วาง payload แล้วดูโครงสร้างที่อนุมานได้และความแตกต่าง จากนั้นส่งออกสคีมา Zod พร้อมชนิดข้อมูล TypeScript",
      decisions: [
        "การอนุมานเป็นโมดูลล้วนที่มีตารางเทสต์หน่วยจำนวนมาก เพราะกรณีขอบคือตัวผลิตภัณฑ์ทั้งหมด",
        "ทุกอย่างทำงานในเบราว์เซอร์ของผู้ใช้ ข้อมูลที่วางจึงไม่ออกจากเครื่อง",
        "ผลลัพธ์ตั้งใจให้อ่านง่าย เพราะโค้ดที่สร้างขึ้นก็ยังเป็นโค้ดที่ต้องมีคนดูแลต่อ",
      ],
    },
    "this-portfolio": {
      tagline: "เว็บไซต์ที่กำลังอ่านอยู่นี้ เก้าหน้า สามภาษา และแบ็กเอนด์ที่ใช้งานจริง",
      problem: "พอร์ตโฟลิโอควรพิสูจน์ความสามารถทางวิศวกรรม ไม่ใช่แค่บรรยาย",
      solution: "ระบบดีไซน์ดั้งเดิม เนื้อหาที่กำหนดชนิดข้อมูลทั้ง EN, DE และ TH แบ็กเอนด์ติดต่อที่ตรวจสอบข้อมูล เทสต์ และการดีพลอยอัตโนมัติ",
      decisions: [
        "ใช้ Server Components เป็นค่าเริ่มต้น และใช้โค้ดฝั่งไคลเอนต์เฉพาะส่วนโต้ตอบ เพื่อให้ JavaScript เล็ก",
        "ข้อมูลส่วนตัวอยู่ในไฟล์คอนฟิกเดียว และข้อความทั้งหมดอยู่ในโมดูลเนื้อหาที่กำหนดชนิดข้อมูล",
        "สร้างด้วยเอเจนต์ AI ภายใต้การรีวิวของคน ตามเวิร์กโฟลว์ที่อธิบายไว้ในหน้า AI-native",
      ],
    },
  },
};

export const projectsContent: Localized<ProjectsContent> = { en, de, th };
