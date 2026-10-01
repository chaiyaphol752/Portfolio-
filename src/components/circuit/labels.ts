import type { Locale, Localized } from "@/i18n/config";
import type { LayerId } from "./circuit-data";

export interface NodeCopy {
  label: string;
  sub: string;
  /** One honest sentence about what this part does in the system. */
  role: string;
}

export interface AgentCopy {
  responsibility: string;
  inputs: string;
  output: string;
}

export type LegendKey = "flow" | "bus" | "automation" | "control";

export interface CircuitCopy {
  ui: {
    boardLabel: string;
    keyboardHint: string;
    scrollHint: string;
    inspector: string;
    idle: string;
    idleBody: string;
    clear: string;
    selectLabel: string;
    selectPlaceholder: string;
    legend: string;
    caption: string;
    staticSvg: string;
    live: string;
    showOnBoard: string;
  };
  layers: Record<LayerId, string>;
  legend: Record<LegendKey, string>;
  status: { live: string; capability: string; n8n: string; liveDot: string };
  inspector: { responsibility: string; inputs: string; tools: string; models: string; viaRouter: string; output: string; checkpoint: string; related: string; layer: string };
  nodes: Record<string, NodeCopy>;
  agents: Record<string, AgentCopy>;
  /** Labels for flow steps that are not nodes on the board. */
  steps: Record<string, string>;
}

/** [label, sub, role] per node, per locale. Proper nouns stay untranslated. */
type NodeRow = [string, string, string];
const nodeTable: Record<string, Record<Locale, NodeRow>> = {
  triggers: {
    en: ["Triggers", "API · webhook · schedule", "Events that start automated work: an API call, an incoming webhook or a schedule."],
    de: ["Auslöser", "API · Webhook · Zeitplan", "Ereignisse, die automatisierte Arbeit starten: ein API-Aufruf, ein eingehender Webhook oder ein Zeitplan."],
    th: ["Trigger", "API · Webhook · ตามเวลา", "เหตุการณ์ที่เริ่มงานอัตโนมัติ เช่น การเรียก API, Webhook ที่เข้ามา หรือรอบเวลาที่ตั้งไว้"],
  },
  client: {
    en: ["Human · client", "goal and constraints", "The person or client who sets the goal, the limits and what counts as done."],
    de: ["Mensch · Kunde", "Ziel und Rahmen", "Die Person, die Ziel, Grenzen und Abnahmekriterien festlegt."],
    th: ["คน · ลูกค้า", "เป้าหมายและข้อจำกัด", "ผู้กำหนดเป้าหมาย ขอบเขต และเกณฑ์ว่างานแบบไหนถือว่าเสร็จ"],
  },
  goal: {
    en: ["Input · goal", "task, context, limits", "The task as the system receives it: goal, context and constraints."],
    de: ["Input · Ziel", "Aufgabe, Kontext, Grenzen", "Die Aufgabe, wie das System sie erhält: Ziel, Kontext und Rahmenbedingungen."],
    th: ["Input · เป้าหมาย", "งาน บริบท ข้อจำกัด", "งานในรูปที่ระบบรับเข้าไป ทั้งเป้าหมาย บริบท และข้อจำกัด"],
  },
  application: {
    en: ["Application", "Next.js · React · TypeScript", "The product people use — here a Next.js, React and TypeScript application."],
    de: ["Anwendung", "Next.js · React · TypeScript", "Das Produkt, das Menschen nutzen – hier eine Anwendung mit Next.js, React und TypeScript."],
    th: ["แอปพลิเคชัน", "Next.js · React · TypeScript", "ผลิตภัณฑ์ที่ผู้ใช้ใช้งานจริง ในที่นี้คือแอปที่สร้างด้วย Next.js, React และ TypeScript"],
  },
  state: {
    en: ["State · checkpoints", "context, memory, resume", "Keeps workflow state, context and checkpoints so work can resume or roll back."],
    de: ["State · Checkpoints", "Kontext, Gedächtnis, Fortsetzen", "Hält Workflow-Zustand, Kontext und Checkpoints, damit Arbeit fortgesetzt oder zurückgerollt werden kann."],
    th: ["State · Checkpoint", "บริบท หน่วยความจำ ทำต่อ", "เก็บสถานะของ Workflow บริบท และ Checkpoint เพื่อให้ทำงานต่อหรือย้อนกลับได้"],
  },
  orchestrator: {
    en: ["Orchestrator", "central coordination", "The central coordinator: plans the work, routes it to agents and models, tracks state and decides when a result is ready for review."],
    de: ["Orchestrator", "zentrale Koordination", "Die zentrale Koordination: plant die Arbeit, verteilt sie an Agents und Modelle, hält den Zustand und entscheidet, wann ein Ergebnis zur Prüfung bereit ist."],
    th: ["Orchestrator", "ศูนย์กลางการประสานงาน", "ศูนย์กลางของระบบ วางแผนงาน ส่งงานต่อให้ Agent และโมเดล ติดตามสถานะ และตัดสินว่าผลลัพธ์พร้อมให้ตรวจเมื่อไร"],
  },
  "model-router": {
    en: ["Model router", "capability · privacy · cost", "Chooses a model per task by capability, privacy, cost, latency and availability. Agents never call models directly."],
    de: ["Model Router", "Fähigkeit · Datenschutz · Kosten", "Wählt pro Aufgabe ein Modell nach Fähigkeit, Datenschutz, Kosten, Latenz und Verfügbarkeit. Agents rufen Modelle nie direkt auf."],
    th: ["Model Router", "ความสามารถ · ความเป็นส่วนตัว · ต้นทุน", "เลือกโมเดลให้แต่ละงานตามความสามารถ ความเป็นส่วนตัว ต้นทุน ความหน่วง และความพร้อมใช้งาน Agent ไม่เรียกโมเดลโดยตรง"],
  },
  planner: {
    en: ["Planner", "task decomposition", "Breaks the goal into small tasks, each with its own check."],
    de: ["Planner", "Aufgabenzerlegung", "Zerlegt das Ziel in kleine Aufgaben mit jeweils eigener Prüfung."],
    th: ["Planner", "แตกงานย่อย", "แตกเป้าหมายเป็นงานย่อย แต่ละงานมีจุดตรวจของตัวเอง"],
  },
  "agent-router": {
    en: ["Agent router", "assigns specialised agents", "Assigns each task to the specialised agent that owns that kind of work."],
    de: ["Agent Router", "verteilt an Fach-Agents", "Weist jede Aufgabe dem spezialisierten Agent zu, der für diese Art Arbeit zuständig ist."],
    th: ["Agent Router", "ส่งงานให้ Agent เฉพาะทาง", "มอบแต่ละงานให้ Agent ที่รับผิดชอบงานประเภทนั้นโดยตรง"],
  },
  chatgpt: {
    en: ["ChatGPT", "OpenAI models", "OpenAI models for research, analysis, reasoning, specifications and content — reached only through the model router."],
    de: ["ChatGPT", "OpenAI-Modelle", "OpenAI-Modelle für Recherche, Analyse, Reasoning, Spezifikationen und Inhalte – nur über den Model Router erreichbar."],
    th: ["ChatGPT", "โมเดลของ OpenAI", "โมเดลของ OpenAI สำหรับค้นคว้า วิเคราะห์ ให้เหตุผล เขียนสเปก และเนื้อหา เรียกใช้ผ่าน Model Router เท่านั้น"],
  },
  claude: {
    en: ["Claude", "Claude · Claude Code", "Claude and Claude Code for repository analysis, planning, implementation, refactoring, debugging and review."],
    de: ["Claude", "Claude · Claude Code", "Claude und Claude Code für Repository-Analyse, Planung, Umsetzung, Refactoring, Debugging und Review."],
    th: ["Claude", "Claude · Claude Code", "Claude และ Claude Code สำหรับวิเคราะห์ Repository วางแผน เขียนโค้ด Refactor Debug และรีวิว"],
  },
  "local-ai": {
    en: ["Local AI", "private, self-hosted", "Self-hosted models for private data and offline-capable workflows, in the style of Ollama, LM Studio or llama.cpp."],
    de: ["Local AI", "privat, selbst gehostet", "Selbst gehostete Modelle für private Daten und offline-fähige Workflows, etwa im Stil von Ollama, LM Studio oder llama.cpp."],
    th: ["Local AI", "ส่วนตัว รันเอง", "โมเดลที่รันเองสำหรับข้อมูลส่วนตัวและ Workflow ที่ทำงานออฟไลน์ได้ แนวเดียวกับ Ollama, LM Studio หรือ llama.cpp"],
  },
  "research-agent": {
    en: ["Research agent", "sources · analysis", "Collects and analyses sources and documentation."],
    de: ["Research Agent", "Quellen · Analyse", "Sammelt und analysiert Quellen und Dokumentation."],
    th: ["Research Agent", "แหล่งข้อมูล · วิเคราะห์", "รวบรวมและวิเคราะห์แหล่งข้อมูลกับเอกสารอ้างอิง"],
  },
  "browser-agent": {
    en: ["Web · browser agent", "pages · forms · checks", "Reads and checks web pages, forms and live behaviour."],
    de: ["Web · Browser Agent", "Seiten · Formulare · Checks", "Liest und prüft Webseiten, Formulare und Live-Verhalten."],
    th: ["Web · Browser Agent", "หน้าเว็บ · ฟอร์ม · ตรวจ", "อ่านและตรวจหน้าเว็บ ฟอร์ม และการทำงานบนเว็บจริง"],
  },
  "frontend-agent": {
    en: ["Frontend agent", "React · Next.js UI", "Builds interfaces in React and Next.js."],
    de: ["Frontend Agent", "React · Next.js UI", "Baut Oberflächen mit React und Next.js."],
    th: ["Frontend Agent", "UI ด้วย React · Next.js", "สร้างหน้าจอด้วย React และ Next.js"],
  },
  "backend-agent": {
    en: ["Backend agent", "APIs · validation", "Builds APIs, validation and server logic."],
    de: ["Backend Agent", "APIs · Validierung", "Baut APIs, Validierung und Serverlogik."],
    th: ["Backend Agent", "API · Validation", "สร้าง API, Validation และตรรกะฝั่งเซิร์ฟเวอร์"],
  },
  "python-agent": {
    en: ["Python agent", "scripts · tooling", "Writes Python scripts, services and developer tooling."],
    de: ["Python Agent", "Skripte · Tooling", "Schreibt Python-Skripte, Services und Entwickler-Tools."],
    th: ["Python Agent", "สคริปต์ · เครื่องมือ", "เขียนสคริปต์ Python, Service และเครื่องมือสำหรับนักพัฒนา"],
  },
  "data-agent": {
    en: ["Data agent", "parse · transform", "Parses, cleans and transforms data."],
    de: ["Data Agent", "parsen · umwandeln", "Liest, bereinigt und transformiert Daten."],
    th: ["Data Agent", "อ่าน · แปลงข้อมูล", "อ่าน ทำความสะอาด และแปลงข้อมูล"],
  },
  "test-agent": {
    en: ["Testing agent", "unit · e2e · a11y", "Writes and runs unit, end-to-end and accessibility tests."],
    de: ["Test Agent", "Unit · E2E · a11y", "Schreibt und startet Unit-, End-to-End- und Barrierefreiheitstests."],
    th: ["Testing Agent", "Unit · E2E · a11y", "เขียนและรันเทสต์ Unit, End-to-End และ Accessibility"],
  },
  "review-agent": {
    en: ["Review agent", "diff · security", "Reviews changes for bugs, security and quality before human approval."],
    de: ["Review Agent", "Diff · Sicherheit", "Prüft Änderungen auf Fehler, Sicherheit und Qualität – vor der menschlichen Freigabe."],
    th: ["Review Agent", "Diff · ความปลอดภัย", "รีวิวการเปลี่ยนแปลงหาบั๊ก ปัญหาความปลอดภัย และคุณภาพ ก่อนส่งให้คนอนุมัติ"],
  },
  "ai-agent": {
    en: ["AI integration agent", "prompts · tool calls", "Connects models to products: prompts, tool calls, fallbacks and limits."],
    de: ["AI Integration Agent", "Prompts · Tool Calls", "Verbindet Modelle mit Produkten: Prompts, Tool Calls, Fallbacks und Limits."],
    th: ["AI Integration Agent", "Prompt · Tool Call", "เชื่อมโมเดลเข้ากับผลิตภัณฑ์ ทั้ง Prompt, Tool Call, Fallback และขีดจำกัด"],
  },
  "local-agent": {
    en: ["Local AI agent", "private documents", "Works on private documents with local models only."],
    de: ["Local AI Agent", "private Dokumente", "Arbeitet mit privaten Dokumenten – ausschließlich mit lokalen Modellen."],
    th: ["Local AI Agent", "เอกสารส่วนตัว", "ทำงานกับเอกสารส่วนตัวโดยใช้โมเดลที่รันในเครื่องเท่านั้น"],
  },
  "automation-agent": {
    en: ["Automation agent", "workflows · jobs", "Designs and maintains n8n workflows, webhooks and scheduled jobs."],
    de: ["Automation Agent", "Workflows · Jobs", "Entwirft und pflegt n8n-Workflows, Webhooks und geplante Jobs."],
    th: ["Automation Agent", "Workflow · Job", "ออกแบบและดูแล Workflow ใน n8n, Webhook และงานตามรอบเวลา"],
  },
  "deploy-agent": {
    en: ["Deployment agent", "release · rollback", "Prepares releases and rollbacks; deploys only after approval."],
    de: ["Deployment Agent", "Release · Rollback", "Bereitet Releases und Rollbacks vor; deployt erst nach Freigabe."],
    th: ["Deployment Agent", "Release · Rollback", "เตรียม Release และแผน Rollback และ Deploy หลังได้รับอนุมัติเท่านั้น"],
  },
  n8n: {
    en: ["n8n", "workflow automation", "Workflow automation and integration: triggers, webhooks, schedules, API connections, email workflows and moving data between systems. Deterministic — it calls the orchestrator for reasoning; it is not the AI brain."],
    de: ["n8n", "Workflow-Automatisierung", "Workflow-Automatisierung und Integration: Auslöser, Webhooks, Zeitpläne, API-Verbindungen, E-Mail-Workflows und Datenfluss zwischen Systemen. Deterministisch – für Reasoning ruft n8n den Orchestrator auf, es ist nicht das KI-Gehirn."],
    th: ["n8n", "Workflow Automation", "ชั้น Automation และการเชื่อมระบบ ทั้ง Trigger, Webhook, งานตามรอบเวลา, การเชื่อม API, Workflow อีเมล และการส่งข้อมูลระหว่างระบบ ทำงานแบบกำหนดขั้นตอนตายตัว เมื่อต้องใช้การคิดวิเคราะห์จะเรียก Orchestrator ไม่ได้เป็นสมองของ AI"],
  },
  python: {
    en: ["Python", "scripts · services", "Programmable glue: scripts, data processing, API clients, local AI tooling and services. The diagram on this page is generated by a Python script."],
    de: ["Python", "Skripte · Services", "Programmierbarer Klebstoff: Skripte, Datenverarbeitung, API-Clients, Local-AI-Tooling und Services. Das Diagramm auf dieser Seite erzeugt ein Python-Skript."],
    th: ["Python", "สคริปต์ · Service", "ตัวเชื่อมที่เขียนโปรแกรมได้ ทั้งสคริปต์ ประมวลผลข้อมูล API Client เครื่องมือ Local AI และ Service แผนภาพในหน้านี้ก็สร้างด้วยสคริปต์ Python"],
  },
  apis: {
    en: ["APIs", "REST · Node.js", "Connections to internal and external services over REST and Node.js."],
    de: ["APIs", "REST · Node.js", "Verbindungen zu internen und externen Diensten über REST und Node.js."],
    th: ["API", "REST · Node.js", "การเชื่อมต่อกับบริการภายในและภายนอกผ่าน REST และ Node.js"],
  },
  webhooks: {
    en: ["Webhooks", "events in · events out", "Events in and out — how systems notify each other."],
    de: ["Webhooks", "Events rein · Events raus", "Ereignisse rein und raus – so benachrichtigen sich Systeme gegenseitig."],
    th: ["Webhook", "Event เข้า · Event ออก", "Event ขาเข้าและขาออก ช่องทางที่ระบบใช้แจ้งกันและกัน"],
  },
  "file-data": {
    en: ["File · data processing", "CSV · JSON · PDF", "Reads and transforms CSV, JSON and PDF files."],
    de: ["Datei · Datenverarbeitung", "CSV · JSON · PDF", "Liest und transformiert CSV-, JSON- und PDF-Dateien."],
    th: ["ไฟล์ · ประมวลผลข้อมูล", "CSV · JSON · PDF", "อ่านและแปลงไฟล์ CSV, JSON และ PDF"],
  },
  browser: {
    en: ["Browser · web tools", "fetch · render · test", "Fetches, renders and tests web pages; this site is checked with Playwright."],
    de: ["Browser · Web-Tools", "laden · rendern · testen", "Lädt, rendert und testet Webseiten; diese Website wird mit Playwright geprüft."],
    th: ["Browser · Web Tools", "ดึง · เรนเดอร์ · ทดสอบ", "ดึง เรนเดอร์ และทดสอบหน้าเว็บ เว็บไซต์นี้ตรวจด้วย Playwright"],
  },
  database: {
    en: ["PostgreSQL", "records · state", "Stores records and workflow state."],
    de: ["PostgreSQL", "Datensätze · Zustand", "Speichert Datensätze und Workflow-Zustand."],
    th: ["PostgreSQL", "ข้อมูล · สถานะ", "เก็บข้อมูลและสถานะของ Workflow"],
  },
  embeddings: {
    en: ["Documents · embeddings", "RAG · private search", "Private documents indexed as embeddings for retrieval (RAG)."],
    de: ["Dokumente · Embeddings", "RAG · private Suche", "Private Dokumente, als Embeddings für Retrieval (RAG) indexiert."],
    th: ["เอกสาร · Embeddings", "RAG · ค้นหาแบบส่วนตัว", "เอกสารส่วนตัวที่ทำดัชนีเป็น Embeddings สำหรับการค้นคืน (RAG)"],
  },
  validation: {
    en: ["Validation · tests", "schemas · checks", "Schemas, types and tests. Failures go back to the responsible agent with context."],
    de: ["Validierung · Tests", "Schemas · Checks", "Schemas, Typen und Tests. Fehler gehen mit Kontext an den zuständigen Agent zurück."],
    th: ["Validation · Test", "Schema · การตรวจ", "Schema, Type และเทสต์ ถ้าไม่ผ่านจะส่งกลับไปยัง Agent ที่รับผิดชอบพร้อมบริบท"],
  },
  approval: {
    en: ["Human approval", "checkpoint before action", "A person approves before anything irreversible: sending, publishing, deploying or deleting."],
    de: ["Manuelle Freigabe", "Checkpoint vor Aktionen", "Ein Mensch gibt frei, bevor etwas Unumkehrbares passiert: senden, veröffentlichen, deployen oder löschen."],
    th: ["คนอนุมัติ", "Checkpoint ก่อนลงมือ", "คนต้องอนุมัติก่อนทำสิ่งที่ย้อนกลับไม่ได้ เช่น ส่ง เผยแพร่ Deploy หรือลบ"],
  },
  github: {
    en: ["Git · GitHub", "version control · CI", "Version control and CI. Every change is a reviewed commit."],
    de: ["Git · GitHub", "Versionskontrolle · CI", "Versionskontrolle und CI. Jede Änderung ist ein geprüfter Commit."],
    th: ["Git · GitHub", "Version Control · CI", "Version Control และ CI ทุกการเปลี่ยนแปลงเป็น Commit ที่ผ่านการรีวิว"],
  },
  vercel: {
    en: ["Vercel", "build · deploy", "Builds and deploys the application."],
    de: ["Vercel", "Build · Deploy", "Baut und deployt die Anwendung."],
    th: ["Vercel", "Build · Deploy", "Build และ Deploy แอปพลิเคชัน"],
  },
  production: {
    en: ["Production", "live application", "The live application, verified after every deploy."],
    de: ["Produktion", "Live-Anwendung", "Die Live-Anwendung, nach jedem Deploy geprüft."],
    th: ["Production", "แอปที่ใช้งานจริง", "แอปที่ใช้งานจริง ตรวจซ้ำทุกครั้งหลัง Deploy"],
  },
  email: {
    en: ["Email · Resend", "notifications", "Outbound email via Resend — live for this site's contact form."],
    de: ["E-Mail · Resend", "Benachrichtigungen", "Ausgehende E-Mails über Resend – live im Kontaktformular dieser Website."],
    th: ["อีเมล · Resend", "การแจ้งเตือน", "อีเมลขาออกผ่าน Resend ใช้งานจริงในฟอร์มติดต่อของเว็บไซต์นี้"],
  },
  actions: {
    en: ["CRM · database · API", "external systems", "Approved actions in external systems: CRM updates, database writes, third-party APIs."],
    de: ["CRM · Datenbank · API", "externe Systeme", "Freigegebene Aktionen in externen Systemen: CRM-Updates, Datenbank-Schreibzugriffe, Drittanbieter-APIs."],
    th: ["CRM · ฐานข้อมูล · API", "ระบบภายนอก", "การทำงานในระบบภายนอกหลังอนุมัติ เช่น อัปเดต CRM เขียนฐานข้อมูล หรือเรียก API ภายนอก"],
  },
};

type AgentRow = [string, string, string];
const agentTable: Record<string, Record<Locale, AgentRow>> = {
  "research-agent": {
    en: ["Finds and summarises sources, documentation and API references, with citations.", "Open questions, scope", "Sourced findings"],
    de: ["Findet und fasst Quellen, Dokumentation und API-Referenzen zusammen – mit Belegen.", "Offene Fragen, Umfang", "Belegte Ergebnisse"],
    th: ["ค้นหาและสรุปแหล่งข้อมูล เอกสาร และ API Reference พร้อมอ้างอิง", "คำถามที่ยังไม่มีคำตอบ ขอบเขตงาน", "ข้อค้นพบพร้อมแหล่งอ้างอิง"],
  },
  "browser-agent": {
    en: ["Navigates pages, fills forms and checks live behaviour.", "URLs, user flows to check", "Page data, screenshots, issues"],
    de: ["Navigiert Seiten, füllt Formulare aus und prüft Live-Verhalten.", "URLs, zu prüfende Abläufe", "Seitendaten, Screenshots, Befunde"],
    th: ["เปิดหน้าเว็บ กรอกฟอร์ม และตรวจการทำงานบนเว็บจริง", "URL และ User Flow ที่ต้องตรวจ", "ข้อมูลหน้าเว็บ ภาพหน้าจอ และปัญหาที่พบ"],
  },
  "frontend-agent": {
    en: ["Builds accessible, responsive components and pages.", "Design system, content, API contracts", "Typed React components"],
    de: ["Baut barrierefreie, responsive Komponenten und Seiten.", "Designsystem, Inhalte, API-Verträge", "Typisierte React-Komponenten"],
    th: ["สร้าง Component และหน้าเว็บที่ Responsive และเข้าถึงได้", "Design System เนื้อหา และ API Contract", "React Component ที่มี Type ครบ"],
  },
  "backend-agent": {
    en: ["Implements endpoints, validation and server logic.", "Data model, requirements", "Routes, schemas, server actions"],
    de: ["Setzt Endpunkte, Validierung und Serverlogik um.", "Datenmodell, Anforderungen", "Routen, Schemas, Server Actions"],
    th: ["สร้าง Endpoint, Validation และตรรกะฝั่งเซิร์ฟเวอร์", "Data Model และ Requirement", "Route, Schema และ Server Action"],
  },
  "python-agent": {
    en: ["Writes scripts, services and tooling: generators, converters, API clients.", "Task spec, sample data", "Tested Python modules"],
    de: ["Schreibt Skripte, Services und Tools: Generatoren, Konverter, API-Clients.", "Aufgabenbeschreibung, Beispieldaten", "Getestete Python-Module"],
    th: ["เขียนสคริปต์ Service และเครื่องมือ เช่น ตัวสร้างไฟล์ ตัวแปลงข้อมูล API Client", "สเปกงาน ข้อมูลตัวอย่าง", "โมดูล Python ที่ผ่านเทสต์"],
  },
  "data-agent": {
    en: ["Cleans, transforms and reconciles data between formats and systems.", "Files, API responses, schemas", "Validated, structured data"],
    de: ["Bereinigt, transformiert und gleicht Daten zwischen Formaten und Systemen ab.", "Dateien, API-Antworten, Schemas", "Geprüfte, strukturierte Daten"],
    th: ["ทำความสะอาด แปลง และกระทบยอดข้อมูลข้ามรูปแบบและระบบ", "ไฟล์ Response จาก API และ Schema", "ข้อมูลที่มีโครงสร้างและผ่านการตรวจ"],
  },
  "test-agent": {
    en: ["Writes and runs unit, end-to-end and accessibility checks.", "Changes, acceptance criteria", "Test results"],
    de: ["Schreibt und startet Unit-, End-to-End- und Barrierefreiheitstests.", "Änderungen, Abnahmekriterien", "Testergebnisse"],
    th: ["เขียนและรันเทสต์ Unit, End-to-End และ Accessibility", "การเปลี่ยนแปลง และเกณฑ์รับงาน", "ผลการทดสอบ"],
  },
  "review-agent": {
    en: ["Assumes there are bugs: reviews the diff, security and copy.", "Complete diff, test results", "Findings and fixes"],
    de: ["Geht von Fehlern aus: prüft Diff, Sicherheit und Texte.", "Vollständiger Diff, Testergebnisse", "Befunde und Korrekturen"],
    th: ["ตั้งต้นว่ามีบั๊กเสมอ ตรวจ Diff ความปลอดภัย และข้อความ", "Diff ทั้งหมด ผลเทสต์", "สิ่งที่พบและการแก้ไข"],
  },
  "ai-agent": {
    en: ["Wires models into products: prompts, tool calling, fallbacks and limits.", "Use case, data constraints", "AI features, adapters"],
    de: ["Bindet Modelle in Produkte ein: Prompts, Tool Calling, Fallbacks und Limits.", "Use Case, Datenvorgaben", "KI-Funktionen, Adapter"],
    th: ["เชื่อมโมเดลเข้ากับผลิตภัณฑ์ ทั้ง Prompt, Tool Calling, Fallback และขีดจำกัด", "Use Case และข้อจำกัดด้านข้อมูล", "ฟีเจอร์ AI และ Adapter"],
  },
  "local-agent": {
    en: ["Answers over private documents with local models only — nothing leaves the machine.", "Private documents, a question", "Grounded answers with sources"],
    de: ["Beantwortet Fragen zu privaten Dokumenten nur mit lokalen Modellen – nichts verlässt den Rechner.", "Private Dokumente, eine Frage", "Belegte Antworten mit Quellen"],
    th: ["ตอบคำถามจากเอกสารส่วนตัวด้วยโมเดลในเครื่องเท่านั้น ข้อมูลไม่ออกนอกเครื่อง", "เอกสารส่วนตัว และคำถาม", "คำตอบที่อ้างอิงแหล่งที่มาได้"],
  },
  "automation-agent": {
    en: ["Designs n8n workflows, webhooks and scheduled jobs around the AI steps.", "Process description, systems to connect", "Workflow definitions"],
    de: ["Entwirft n8n-Workflows, Webhooks und geplante Jobs rund um die KI-Schritte.", "Prozessbeschreibung, zu verbindende Systeme", "Workflow-Definitionen"],
    th: ["ออกแบบ Workflow ใน n8n, Webhook และงานตามรอบเวลาที่ล้อมขั้นตอน AI", "คำอธิบายกระบวนการ ระบบที่ต้องเชื่อม", "นิยาม Workflow"],
  },
  "deploy-agent": {
    en: ["Prepares the release, runs the deploy and keeps a rollback ready.", "An approved build", "Deployment, release notes"],
    de: ["Bereitet das Release vor, führt das Deploy aus und hält ein Rollback bereit.", "Ein freigegebener Build", "Deployment, Release Notes"],
    th: ["เตรียม Release สั่ง Deploy และมีแผน Rollback พร้อมเสมอ", "Build ที่ได้รับอนุมัติแล้ว", "Deployment และ Release Note"],
  },
};

/** Flow steps that are not nodes on the board. */
const stepTable: Record<string, Record<Locale, string>> = {
  "dev-orchestrator": { en: "Development orchestrator", de: "Entwicklungs-Orchestrator", th: "Development Orchestrator" },
  "ai-systems-agent": { en: "AI systems agent", de: "AI Systems Agent", th: "AI Systems Agent" },
  merge: { en: "Merge", de: "Merge", th: "Merge" },
  "automated-tests": { en: "Automated tests", de: "Automatisierte Tests", th: "เทสต์อัตโนมัติ" },
  git: { en: "Git", de: "Git", th: "Git" },
  "ci-build": { en: "CI · build", de: "CI · Build", th: "CI · Build" },
  "trigger-in": { en: "API · webhook · schedule", de: "API · Webhook · Zeitplan", th: "API · Webhook · ตามเวลา" },
  "ai-agents": { en: "AI agents", de: "AI Agents", th: "AI Agent" },
  "approval-when-required": { en: "Human approval when required", de: "Manuelle Freigabe, wenn nötig", th: "คนอนุมัติเมื่อจำเป็น" },
  crm: { en: "CRM", de: "CRM", th: "CRM" },
  "web-app": { en: "Web app", de: "Web-App", th: "เว็บแอป" },
  "external-api": { en: "External API", de: "Externe API", th: "API ภายนอก" },
  "lead-form": { en: "Lead form", de: "Lead-Formular", th: "ฟอร์มลูกค้าเป้าหมาย" },
  notification: { en: "Notification", de: "Benachrichtigung", th: "แจ้งเตือน" },
  schedule: { en: "Schedule", de: "Zeitplan", th: "ตามรอบเวลา" },
  "ai-model": { en: "AI model", de: "KI-Modell", th: "โมเดล AI" },
  output: { en: "Output", de: "Ergebnis", th: "ผลลัพธ์" },
  "n8n-trigger": { en: "n8n trigger", de: "n8n-Auslöser", th: "n8n Trigger" },
  "python-data": { en: "Python · data tool", de: "Python · Daten-Tool", th: "Python · เครื่องมือข้อมูล" },
  "external-system": { en: "External system", de: "Externes System", th: "ระบบภายนอก" },
};

const pick = <T,>(table: Record<string, Record<Locale, T>>, locale: Locale) =>
  Object.fromEntries(Object.entries(table).map(([id, row]) => [id, row[locale]])) as Record<string, T>;

function build(locale: Locale, rest: Omit<CircuitCopy, "nodes" | "agents" | "steps">): CircuitCopy {
  const nodes = Object.fromEntries(Object.entries(pick(nodeTable, locale)).map(([id, [label, sub, role]]) => [id, { label, sub, role }]));
  const agents = Object.fromEntries(Object.entries(pick(agentTable, locale)).map(([id, [responsibility, inputs, output]]) => [id, { responsibility, inputs, output }]));
  return { ...rest, nodes, agents, steps: pick(stepTable, locale) };
}

const en = build("en", {
  ui: {
    boardLabel: "Interactive AI orchestration architecture",
    keyboardHint: "Tab to a component, arrow keys to move, Enter to select, Esc to clear.",
    scrollHint: "Scroll sideways to see the whole architecture",
    inspector: "Inspector",
    idle: "Nothing selected",
    idleBody: "Pick a component to see what it does and which paths it uses.",
    clear: "Clear",
    selectLabel: "Component",
    selectPlaceholder: "Choose a component…",
    legend: "Legend",
    caption: "Generated by {generator} · {hash} · {nodes} components · {traces} traces · {agents} agents",
    staticSvg: "Open the static SVG",
    live: "{label} selected. {count} related components highlighted.",
    showOnBoard: "Show {label} in the architecture",
  },
  layers: { input: "Input", orchestration: "Orchestration", models: "AI models", agents: "Agents", tools: "Automation & tools", data: "Data", control: "Control & delivery" },
  legend: { flow: "Coordination", bus: "Bus (agents, tools, models)", automation: "n8n automation path", control: "Data, validation and control" },
  status: {
    live: "Used in this portfolio",
    capability: "Architecture capability — not deployed in this portfolio",
    n8n: "Automation architecture · n8n workflow capability — no live n8n instance runs in this portfolio",
    liveDot: "Used in this portfolio",
  },
  inspector: {
    responsibility: "Responsibility",
    inputs: "Inputs",
    tools: "Tools",
    models: "Model options",
    viaRouter: "via the model router",
    output: "Output",
    checkpoint: "Checked by",
    related: "Related",
    layer: "Layer",
  },
});

const de = build("de", {
  ui: {
    boardLabel: "Interaktive KI-Orchestrierungsarchitektur",
    keyboardHint: "Mit Tab zu einer Komponente, Pfeiltasten zum Bewegen, Enter zum Auswählen, Esc zum Zurücksetzen.",
    scrollHint: "Seitlich scrollen, um die ganze Architektur zu sehen",
    inspector: "Inspektor",
    idle: "Nichts ausgewählt",
    idleBody: "Wähl eine Komponente, um zu sehen, was sie tut und welche Pfade sie nutzt.",
    clear: "Zurücksetzen",
    selectLabel: "Komponente",
    selectPlaceholder: "Komponente wählen…",
    legend: "Legende",
    caption: "Erzeugt von {generator} · {hash} · {nodes} Komponenten · {traces} Leiterbahnen · {agents} Agents",
    staticSvg: "Statisches SVG öffnen",
    live: "{label} ausgewählt. {count} verwandte Komponenten hervorgehoben.",
    showOnBoard: "{label} in der Architektur zeigen",
  },
  layers: { input: "Input", orchestration: "Orchestrierung", models: "KI-Modelle", agents: "Agents", tools: "Automatisierung & Tools", data: "Daten", control: "Kontrolle & Auslieferung" },
  legend: { flow: "Koordination", bus: "Bus (Agents, Tools, Modelle)", automation: "n8n-Automatisierungspfad", control: "Daten, Validierung und Kontrolle" },
  status: {
    live: "In diesem Portfolio im Einsatz",
    capability: "Architektur-Fähigkeit – in diesem Portfolio nicht deployt",
    n8n: "Automatisierungsarchitektur · n8n-Workflow-Fähigkeit – in diesem Portfolio läuft keine n8n-Instanz",
    liveDot: "In diesem Portfolio im Einsatz",
  },
  inspector: {
    responsibility: "Aufgabe",
    inputs: "Input",
    tools: "Tools",
    models: "Modelloptionen",
    viaRouter: "über den Model Router",
    output: "Ergebnis",
    checkpoint: "Geprüft durch",
    related: "Verbunden mit",
    layer: "Ebene",
  },
});

const th = build("th", {
  ui: {
    boardLabel: "สถาปัตยกรรม AI Orchestration แบบโต้ตอบได้",
    keyboardHint: "กด Tab ไปที่องค์ประกอบ ใช้ลูกศรเลื่อน Enter เพื่อเลือก Esc เพื่อล้าง",
    scrollHint: "เลื่อนด้านข้างเพื่อดูสถาปัตยกรรมทั้งหมด",
    inspector: "รายละเอียด",
    idle: "ยังไม่ได้เลือก",
    idleBody: "เลือกองค์ประกอบเพื่อดูหน้าที่และเส้นทางที่ใช้",
    clear: "ล้าง",
    selectLabel: "องค์ประกอบ",
    selectPlaceholder: "เลือกองค์ประกอบ…",
    legend: "คำอธิบายสัญลักษณ์",
    caption: "สร้างโดย {generator} · {hash} · {nodes} องค์ประกอบ · {traces} เส้นทาง · {agents} Agent",
    staticSvg: "เปิดไฟล์ SVG แบบคงที่",
    live: "เลือก {label} แล้ว ไฮไลต์องค์ประกอบที่เกี่ยวข้อง {count} รายการ",
    showOnBoard: "แสดง {label} ในสถาปัตยกรรม",
  },
  layers: { input: "Input", orchestration: "Orchestration", models: "โมเดล AI", agents: "Agent", tools: "Automation และเครื่องมือ", data: "ข้อมูล", control: "ควบคุมและส่งมอบ" },
  legend: { flow: "การประสานงาน", bus: "Bus (Agent, เครื่องมือ, โมเดล)", automation: "เส้นทาง Automation ของ n8n", control: "ข้อมูล การตรวจ และการควบคุม" },
  status: {
    live: "ใช้งานจริงในพอร์ตโฟลิโอนี้",
    capability: "ความสามารถด้านสถาปัตยกรรม ไม่ได้ Deploy ในพอร์ตโฟลิโอนี้",
    n8n: "สถาปัตยกรรม Automation · ความสามารถด้าน Workflow ของ n8n ไม่มี n8n ที่รันจริงในพอร์ตโฟลิโอนี้",
    liveDot: "ใช้งานจริงในพอร์ตโฟลิโอนี้",
  },
  inspector: {
    responsibility: "หน้าที่",
    inputs: "Input",
    tools: "เครื่องมือ",
    models: "ตัวเลือกโมเดล",
    viaRouter: "ผ่าน Model Router",
    output: "Output",
    checkpoint: "ตรวจโดย",
    related: "เกี่ยวข้องกับ",
    layer: "ชั้น",
  },
});

export const circuitCopy: Localized<CircuitCopy> = { en, de, th };

/** Label for a flow step: a board node, or a step-only label. */
export function stepLabel(copy: CircuitCopy, id: string): string {
  return copy.nodes[id]?.label ?? copy.steps[id] ?? id;
}
