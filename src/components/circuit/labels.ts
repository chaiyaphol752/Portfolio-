import type { Locale, Localized } from "@/i18n/config";
import { circuit, type LayerId, type StageId, type Verb, type WorkflowId } from "./circuit-data";

/**
 * Display copy for the orchestration architecture.
 * English node, agent, stage and workflow text comes from the Python generator
 * (src/generated/ai-circuit.json); German and Thai are keyed by the same ids here.
 * circuit.test.ts fails if any generated id is missing a translation.
 */

type Translated = Exclude<Locale, "en">;

export interface NodeCopy {
  label: string;
  sub: string;
  /** One honest sentence about what this part does in the system. */
  role: string;
  /** What it is used for (only on the key nodes). */
  uses: string[];
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
    traceLabel: string;
    keyboardHint: string;
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
    tapHint: string;
    workflowLabel: string;
    workflowNone: string;
    workflowBadge: string;
    workflowSteps: string;
    workflowLive: string;
    parallel: string;
    step: string;
    showAgents: string;
    hideAgents: string;
    close: string;
    cloud: string;
    local: string;
    primaryTools: string;
    moreTools: string;
  };
  layers: Record<LayerId, string>;
  legend: Record<LegendKey, string>;
  status: { live: string; capability: string; n8n: string; liveDot: string };
  inspector: {
    responsibility: string;
    inputs: string;
    tools: string;
    models: string;
    viaRouter: string;
    output: string;
    checkpoint: string;
    related: string;
    connected: string;
    usedFor: string;
    layer: string;
    outgoing: string;
    incoming: string;
  };
  verbs: Record<Verb, string>;
  stages: Record<StageId, { label: string; summary: string }>;
  workflows: Record<WorkflowId, { label: string; summary: string }>;
  nodes: Record<string, NodeCopy>;
  agents: Record<string, AgentCopy>;
  /** Labels for legacy flow steps that are not nodes on the board. */
  steps: Record<string, string>;
}

type NodeRow = [string, string, string];
type AgentRow = [string, string, string];

/** [label, sub, description] per node for German and Thai. English comes from the generator. */
const nodeTable: Record<string, Record<Translated, NodeRow>> = {
  "client": {
    de: ["Mensch · Kunde", "Ziel und Rahmen", "Die Person, die Ziel, Grenzen und Abnahmekriterien festlegt."],
    th: ["คน · ลูกค้า", "เป้าหมายและข้อจำกัด", "ผู้กำหนดเป้าหมาย ขอบเขต และเกณฑ์ว่างานแบบไหนถือว่าเสร็จ"],
  },
  "goal": {
    de: ["Input · Ziel", "Aufgabe, Kontext, Grenzen", "Die Aufgabe, wie das System sie erhält: Ziel, Kontext und Rahmenbedingungen."],
    th: ["Input · เป้าหมาย", "งาน บริบท ข้อจำกัด", "งานในรูปที่ระบบรับเข้าไป ทั้งเป้าหมาย บริบท และข้อจำกัด"],
  },
  "form": {
    de: ["Website-Formular", "Anfrage · Lead", "Ein Formular auf einer Website – wie das Kontaktformular hier –, das einen Workflow startet."],
    th: ["ฟอร์มบนเว็บไซต์", "คำขอ · ลูกค้าเป้าหมาย", "ฟอร์มบนเว็บไซต์ เช่น ฟอร์มติดต่อของเว็บนี้ ที่เป็นจุดเริ่มของ Workflow"],
  },
  "triggers": {
    de: ["Auslöser", "API · Webhook · Zeitplan", "Ereignisse, die automatisierte Arbeit starten: ein API-Aufruf, ein eingehender Webhook oder ein Zeitplan."],
    th: ["Trigger", "API · Webhook · ตามเวลา", "เหตุการณ์ที่เริ่มงานอัตโนมัติ เช่น การเรียก API, Webhook ที่เข้ามา หรือรอบเวลาที่ตั้งไว้"],
  },
  "application": {
    de: ["Anwendung", "Next.js · React", "Das Produkt, das Menschen nutzen – hier eine Anwendung mit Next.js, React und TypeScript."],
    th: ["แอปพลิเคชัน", "Next.js · React", "ผลิตภัณฑ์ที่ผู้ใช้ใช้งานจริง ในที่นี้คือแอปที่สร้างด้วย Next.js, React และ TypeScript"],
  },
  "orchestrator": {
    de: ["Orchestrator", "zentrale Koordination", "Die zentrale Koordination. Sie beantwortet keine Fragen selbst – sie entscheidet, wer woran arbeitet, hält den Zustand und führt die Ergebnisse zusammen."],
    th: ["Orchestrator", "ศูนย์กลางการประสานงาน", "ศูนย์กลางการประสานงาน ไม่ได้ตอบคำถามเอง แต่ตัดสินว่าใครทำงานอะไร เก็บสถานะ และรวมผลลัพธ์เข้าด้วยกัน"],
  },
  "state": {
    de: ["State · Checkpoints", "Kontext · Fortsetzen", "Hält Workflow-Zustand, Kontext und Checkpoints, damit Arbeit fortgesetzt oder zurückgerollt werden kann."],
    th: ["State · Checkpoint", "บริบท หน่วยความจำ ทำต่อ", "เก็บสถานะของ Workflow บริบท และ Checkpoint เพื่อให้ทำงานต่อหรือย้อนกลับได้"],
  },
  "planner": {
    de: ["Planner", "Aufgabenzerlegung", "Zerlegt das Ziel in kleine Aufgaben mit jeweils eigener Prüfung."],
    th: ["Planner", "แตกงานย่อย", "แตกเป้าหมายเป็นงานย่อย แต่ละงานมีจุดตรวจของตัวเอง"],
  },
  "agent-router": {
    de: ["Agent Router", "verteilt an Fach-Agents", "Weist jede Aufgabe dem spezialisierten Agent zu, der für diese Art Arbeit zuständig ist."],
    th: ["Agent Router", "ส่งงานให้ Agent เฉพาะทาง", "มอบแต่ละงานให้ Agent ที่รับผิดชอบงานประเภทนั้นโดยตรง"],
  },
  "model-router": {
    de: ["Model Router", "Fähigkeit · Datenschutz", "Wählt pro Aufgabe ein Modell nach Fähigkeit, Datenschutz, Kosten, Latenz und Verfügbarkeit. Agents rufen Modelle nie direkt auf."],
    th: ["Model Router", "เลือกโมเดลตามงาน", "เลือกโมเดลให้แต่ละงานตามความสามารถ ความเป็นส่วนตัว ต้นทุน ความหน่วง และความพร้อมใช้งาน Agent ไม่เรียกโมเดลโดยตรง"],
  },
  "chatgpt": {
    de: ["ChatGPT", "OpenAI-Modelle", "OpenAI-Modelle für Recherche, Analyse, Reasoning, Spezifikationen und Inhalte – nur über den Model Router erreichbar."],
    th: ["ChatGPT", "โมเดลของ OpenAI", "โมเดลของ OpenAI สำหรับค้นคว้า วิเคราะห์ ให้เหตุผล เขียนสเปก และเนื้อหา เรียกใช้ผ่าน Model Router เท่านั้น"],
  },
  "claude": {
    de: ["Claude", "Claude · Claude Code", "Claude und Claude Code für Repository-Analyse, Planung, Umsetzung, Refactoring, Debugging und Review."],
    th: ["Claude", "Claude · Claude Code", "Claude และ Claude Code สำหรับวิเคราะห์ Repository วางแผน เขียนโค้ด Refactor Debug และรีวิว"],
  },
  "local-ai": {
    de: ["Local AI", "privat, selbst gehostet", "Selbst gehostete Modelle für private Daten und offline-fähige Workflows – Runtimes im Stil von Ollama, LM Studio oder llama.cpp mit Embeddings und Retrieval. Gezeigt als Fähigkeit, nicht als laufendes Deployment."],
    th: ["Local AI", "ส่วนตัว รันเอง", "โมเดลที่รันเองสำหรับข้อมูลส่วนตัวและ Workflow ที่ทำงานออฟไลน์ได้ ใช้ Runtime แนว Ollama, LM Studio หรือ llama.cpp ร่วมกับ Embeddings และการค้นคืนข้อมูล แสดงในฐานะความสามารถ ไม่ใช่ระบบที่รันอยู่จริง"],
  },
  "research-agent": {
    de: ["Research Agent", "Quellen · Analyse", "Sammelt und analysiert Quellen und Dokumentation."],
    th: ["Research Agent", "แหล่งข้อมูล · วิเคราะห์", "รวบรวมและวิเคราะห์แหล่งข้อมูลกับเอกสารอ้างอิง"],
  },
  "browser-agent": {
    de: ["Web · Browser Agent", "Seiten · Formulare", "Liest und prüft Webseiten, Formulare und Live-Verhalten."],
    th: ["Web · Browser Agent", "หน้าเว็บ · ฟอร์ม · ตรวจ", "อ่านและตรวจหน้าเว็บ ฟอร์ม และการทำงานบนเว็บจริง"],
  },
  "frontend-agent": {
    de: ["Frontend Agent", "React · Next.js UI", "Baut Oberflächen mit React und Next.js."],
    th: ["Frontend Agent", "UI ด้วย React · Next.js", "สร้างหน้าจอด้วย React และ Next.js"],
  },
  "backend-agent": {
    de: ["Backend Agent", "APIs · Validierung", "Baut APIs, Validierung und Serverlogik."],
    th: ["Backend Agent", "API · Validation", "สร้าง API, Validation และตรรกะฝั่งเซิร์ฟเวอร์"],
  },
  "python-agent": {
    de: ["Python Agent", "Skripte · Tooling", "Schreibt Python-Skripte, Services und Entwickler-Tools."],
    th: ["Python Agent", "สคริปต์ · เครื่องมือ", "เขียนสคริปต์ Python, Service และเครื่องมือสำหรับนักพัฒนา"],
  },
  "data-agent": {
    de: ["Data Agent", "parsen · umwandeln", "Liest, bereinigt und transformiert Daten."],
    th: ["Data Agent", "อ่าน · แปลงข้อมูล", "อ่าน ทำความสะอาด และแปลงข้อมูล"],
  },
  "test-agent": {
    de: ["Test Agent", "Unit · E2E · a11y", "Schreibt und startet Unit-, End-to-End- und Barrierefreiheitstests."],
    th: ["Testing Agent", "Unit · E2E · a11y", "เขียนและรันเทสต์ Unit, End-to-End และ Accessibility"],
  },
  "review-agent": {
    de: ["Review Agent", "Diff · Sicherheit", "Prüft Änderungen auf Fehler, Sicherheit und Qualität – vor der menschlichen Freigabe."],
    th: ["Review Agent", "Diff · ความปลอดภัย", "รีวิวการเปลี่ยนแปลงหาบั๊ก ปัญหาความปลอดภัย และคุณภาพ ก่อนส่งให้คนอนุมัติ"],
  },
  "ai-agent": {
    de: ["AI Integration Agent", "Prompts · Tool Calls", "Verbindet Modelle mit Produkten: Prompts, Tool Calls, Fallbacks und Limits."],
    th: ["AI Integration Agent", "Prompt · Tool Call", "เชื่อมโมเดลเข้ากับผลิตภัณฑ์ ทั้ง Prompt, Tool Call, Fallback และขีดจำกัด"],
  },
  "local-agent": {
    de: ["Local AI Agent", "private Dokumente", "Arbeitet mit privaten Dokumenten – ausschließlich mit lokalen Modellen."],
    th: ["Local AI Agent", "เอกสารส่วนตัว", "ทำงานกับเอกสารส่วนตัวโดยใช้โมเดลที่รันในเครื่องเท่านั้น"],
  },
  "automation-agent": {
    de: ["Automation Agent", "Workflows · Jobs", "Entwirft und pflegt n8n-Workflows, Webhooks und geplante Jobs."],
    th: ["Automation Agent", "Workflow · Job", "ออกแบบและดูแล Workflow ใน n8n, Webhook และงานตามรอบเวลา"],
  },
  "deploy-agent": {
    de: ["Deployment Agent", "Release · Rollback", "Bereitet Releases und Rollbacks vor; deployt erst nach Freigabe."],
    th: ["Deployment Agent", "Release · Rollback", "เตรียม Release และแผน Rollback และ Deploy หลังได้รับอนุมัติเท่านั้น"],
  },
  "n8n": {
    de: ["n8n", "Workflow-Automatisierung", "Workflow-Automatisierung und Integration. Bewegt Daten und Ereignisse nach festen Regeln zwischen Systemen und übergibt Reasoning an den Orchestrator – n8n ist nicht das KI-Gehirn. Gezeigt als Fähigkeit der Automatisierungsarchitektur; in diesem Portfolio läuft keine n8n-Instanz."],
    th: ["n8n", "Workflow Automation", "Workflow Automation และการเชื่อมระบบ ส่งข้อมูลและ Event ระหว่างระบบตามกฎที่กำหนดไว้ และส่งงานที่ต้องคิดวิเคราะห์ต่อให้ Orchestrator n8n ไม่ใช่สมองของ AI แสดงในฐานะความสามารถด้านสถาปัตยกรรม Automation ไม่มี n8n ที่รันจริงในพอร์ตโฟลิโอนี้"],
  },
  "python": {
    de: ["Python", "Skripte · Services", "Programmierbarer Klebstoff zwischen KI, Daten und Automatisierung. Die Architektur auf dieser Seite erzeugt ein Python-Skript."],
    th: ["Python", "สคริปต์ · Service", "ตัวเชื่อมที่เขียนโปรแกรมได้ระหว่าง AI ข้อมูล และ Automation สถาปัตยกรรมในหน้านี้ก็สร้างด้วยสคริปต์ Python"],
  },
  "apis": {
    de: ["APIs", "REST · Node.js", "Verbindungen zu internen und externen Diensten über REST und Node.js."],
    th: ["API", "REST · Node.js", "การเชื่อมต่อกับบริการภายในและภายนอกผ่าน REST และ Node.js"],
  },
  "webhooks": {
    de: ["Webhooks", "Events rein · Events raus", "Ereignisse rein und raus – so benachrichtigen sich Systeme gegenseitig."],
    th: ["Webhook", "Event เข้า · Event ออก", "Event ขาเข้าและขาออก ช่องทางที่ระบบใช้แจ้งกันและกัน"],
  },
  "file-data": {
    de: ["Dateien · Daten", "CSV · JSON · PDF", "Liest und transformiert CSV-, JSON- und PDF-Dateien."],
    th: ["ไฟล์ · ข้อมูล", "CSV · JSON · PDF", "อ่านและแปลงไฟล์ CSV, JSON และ PDF"],
  },
  "browser": {
    de: ["Browser · Web-Tools", "laden · rendern · testen", "Lädt, rendert und testet Webseiten; diese Website wird mit Playwright geprüft."],
    th: ["Browser · Web Tools", "ดึง · เรนเดอร์ · ทดสอบ", "ดึง เรนเดอร์ และทดสอบหน้าเว็บ เว็บไซต์นี้ตรวจด้วย Playwright"],
  },
  "database": {
    de: ["PostgreSQL", "Datensätze · Zustand", "Speichert Datensätze und Workflow-Zustand."],
    th: ["PostgreSQL", "ข้อมูล · สถานะ", "เก็บข้อมูลและสถานะของ Workflow"],
  },
  "embeddings": {
    de: ["Embeddings", "Retrieval · RAG", "Private Dokumente, als Embeddings für Retrieval (RAG) indexiert."],
    th: ["Embeddings", "ค้นคืน · RAG", "เอกสารส่วนตัวที่ทำดัชนีเป็น Embeddings สำหรับการค้นคืน (RAG)"],
  },
  "private-docs": {
    de: ["Private Dokumente", "Dateien bleiben lokal", "Dokumente, die den Rechner oder das Firmennetz nicht verlassen dürfen."],
    th: ["เอกสารส่วนตัว", "ไฟล์ที่อยู่ในเครื่อง", "เอกสารที่ห้ามออกนอกเครื่องหรือเครือข่ายของบริษัท"],
  },
  "actions": {
    de: ["Externe Systeme", "CRM · Meldungen · APIs", "Wo freigegebene Ergebnisse landen: CRM-Updates, Benachrichtigungen, Drittanbieter-APIs."],
    th: ["ระบบภายนอก", "CRM · แจ้งเตือน · API", "ปลายทางของผลลัพธ์ที่อนุมัติแล้ว เช่น อัปเดต CRM การแจ้งเตือน หรือ API ภายนอก"],
  },
  "validation": {
    de: ["Validierung · Tests", "Schemas · Checks", "Schemas, Typen und Tests. Fehler gehen mit Kontext an den zuständigen Agent zurück."],
    th: ["Validation · Test", "Schema · การตรวจ", "Schema, Type และเทสต์ ถ้าไม่ผ่านจะส่งกลับไปยัง Agent ที่รับผิดชอบพร้อมบริบท"],
  },
  "approval": {
    de: ["Manuelle Freigabe", "Checkpoint vor Aktionen", "Ein Mensch gibt frei, bevor etwas Unumkehrbares passiert: senden, veröffentlichen, deployen oder löschen."],
    th: ["คนอนุมัติ", "Checkpoint ก่อนลงมือ", "คนต้องอนุมัติก่อนทำสิ่งที่ย้อนกลับไม่ได้ เช่น ส่ง เผยแพร่ Deploy หรือลบ"],
  },
  "github": {
    de: ["Git · GitHub", "Versionskontrolle · CI", "Versionskontrolle und CI. Jede Änderung ist ein geprüfter Commit."],
    th: ["Git · GitHub", "Version Control · CI", "Version Control และ CI ทุกการเปลี่ยนแปลงเป็น Commit ที่ผ่านการรีวิว"],
  },
  "vercel": {
    de: ["Vercel", "Build · Deploy", "Baut und deployt die Anwendung."],
    th: ["Vercel", "Build · Deploy", "Build และ Deploy แอปพลิเคชัน"],
  },
  "production": {
    de: ["Produktion", "Live-Anwendung", "Die Live-Anwendung, nach jedem Deploy geprüft."],
    th: ["Production", "แอปที่ใช้งานจริง", "แอปที่ใช้งานจริง ตรวจซ้ำทุกครั้งหลัง Deploy"],
  },
  "email": {
    de: ["E-Mail · Resend", "Benachrichtigungen", "Ausgehende E-Mails über Resend – live im Kontaktformular dieser Website."],
    th: ["อีเมล · Resend", "การแจ้งเตือน", "อีเมลขาออกผ่าน Resend ใช้งานจริงในฟอร์มติดต่อของเว็บไซต์นี้"],
  },
};

/** [role, inputs, outputs] per agent for German and Thai. */
const agentTable: Record<string, Record<Translated, AgentRow>> = {
  "research-agent": {
    de: ["Findet und fasst Quellen, Dokumentation und API-Referenzen zusammen – mit Belegen.", "Offene Fragen, Umfang", "Belegte Ergebnisse"],
    th: ["ค้นหาและสรุปแหล่งข้อมูล เอกสาร และ API Reference พร้อมอ้างอิง", "คำถามที่ยังไม่มีคำตอบ ขอบเขตงาน", "ข้อค้นพบพร้อมแหล่งอ้างอิง"],
  },
  "browser-agent": {
    de: ["Navigiert Seiten, füllt Formulare aus und prüft Live-Verhalten.", "URLs, zu prüfende Abläufe", "Seitendaten, Screenshots, Befunde"],
    th: ["เปิดหน้าเว็บ กรอกฟอร์ม และตรวจการทำงานบนเว็บจริง", "URL และ User Flow ที่ต้องตรวจ", "ข้อมูลหน้าเว็บ ภาพหน้าจอ และปัญหาที่พบ"],
  },
  "frontend-agent": {
    de: ["Baut barrierefreie, responsive Komponenten und Seiten.", "Designsystem, Inhalte, API-Verträge", "Typisierte React-Komponenten"],
    th: ["สร้าง Component และหน้าเว็บที่ Responsive และเข้าถึงได้", "Design System เนื้อหา และ API Contract", "React Component ที่มี Type ครบ"],
  },
  "backend-agent": {
    de: ["Setzt Endpunkte, Validierung und Serverlogik um.", "Datenmodell, Anforderungen", "Routen, Schemas, Server Actions"],
    th: ["สร้าง Endpoint, Validation และตรรกะฝั่งเซิร์ฟเวอร์", "Data Model และ Requirement", "Route, Schema และ Server Action"],
  },
  "python-agent": {
    de: ["Schreibt Skripte, Services und Tools: Generatoren, Konverter, API-Clients.", "Aufgabenbeschreibung, Beispieldaten", "Getestete Python-Module"],
    th: ["เขียนสคริปต์ Service และเครื่องมือ เช่น ตัวสร้างไฟล์ ตัวแปลงข้อมูล API Client", "สเปกงาน ข้อมูลตัวอย่าง", "โมดูล Python ที่ผ่านเทสต์"],
  },
  "data-agent": {
    de: ["Bereinigt, transformiert und gleicht Daten zwischen Formaten und Systemen ab.", "Dateien, API-Antworten, Schemas", "Geprüfte, strukturierte Daten"],
    th: ["ทำความสะอาด แปลง และกระทบยอดข้อมูลข้ามรูปแบบและระบบ", "ไฟล์ Response จาก API และ Schema", "ข้อมูลที่มีโครงสร้างและผ่านการตรวจ"],
  },
  "test-agent": {
    de: ["Schreibt und startet Unit-, End-to-End- und Barrierefreiheitstests.", "Änderungen, Abnahmekriterien", "Testergebnisse"],
    th: ["เขียนและรันเทสต์ Unit, End-to-End และ Accessibility", "การเปลี่ยนแปลง และเกณฑ์รับงาน", "ผลการทดสอบ"],
  },
  "review-agent": {
    de: ["Geht von Fehlern aus: prüft Diff, Sicherheit und Texte.", "Vollständiger Diff, Testergebnisse", "Befunde und Korrekturen"],
    th: ["ตั้งต้นว่ามีบั๊กเสมอ ตรวจ Diff ความปลอดภัย และข้อความ", "Diff ทั้งหมด ผลเทสต์", "สิ่งที่พบและการแก้ไข"],
  },
  "ai-agent": {
    de: ["Bindet Modelle in Produkte ein: Prompts, Tool Calling, Fallbacks und Limits.", "Use Case, Datenvorgaben", "KI-Funktionen, Adapter"],
    th: ["เชื่อมโมเดลเข้ากับผลิตภัณฑ์ ทั้ง Prompt, Tool Calling, Fallback และขีดจำกัด", "Use Case และข้อจำกัดด้านข้อมูล", "ฟีเจอร์ AI และ Adapter"],
  },
  "local-agent": {
    de: ["Beantwortet Fragen zu privaten Dokumenten nur mit lokalen Modellen – nichts verlässt den Rechner.", "Private Dokumente, eine Frage", "Belegte Antworten mit Quellen"],
    th: ["ตอบคำถามจากเอกสารส่วนตัวด้วยโมเดลในเครื่องเท่านั้น ข้อมูลไม่ออกนอกเครื่อง", "เอกสารส่วนตัว และคำถาม", "คำตอบที่อ้างอิงแหล่งที่มาได้"],
  },
  "automation-agent": {
    de: ["Entwirft n8n-Workflows, Webhooks und geplante Jobs rund um die KI-Schritte.", "Prozessbeschreibung, zu verbindende Systeme", "Workflow-Definitionen"],
    th: ["ออกแบบ Workflow ใน n8n, Webhook และงานตามรอบเวลาที่ล้อมขั้นตอน AI", "คำอธิบายกระบวนการ ระบบที่ต้องเชื่อม", "นิยาม Workflow"],
  },
  "deploy-agent": {
    de: ["Bereitet das Release vor, führt das Deploy aus und hält ein Rollback bereit.", "Ein freigegebener Build", "Deployment, Release Notes"],
    th: ["เตรียม Release สั่ง Deploy และมีแผน Rollback พร้อมเสมอ", "Build ที่ได้รับอนุมัติแล้ว", "Deployment และ Release Note"],
  },
};

/** "Used for" lists for the key nodes, in the order of the English list in the generator. */
const usesTable: Record<string, Record<Translated, string[]>> = {
  orchestrator: {
    de: ["Workflow-Koordination", "Kontextweitergabe", "Zustandsverwaltung", "Aufgaben delegieren", "Agents und Tools wählen", "Arbeit routen", "Wiederholungen", "Checkpoints", "Ergebnisse zusammenführen"],
    th: ["ประสานงาน Workflow", "ส่งต่อบริบท", "จัดการสถานะ", "มอบหมายงาน", "เลือก Agent และเครื่องมือ", "Routing งาน", "ลองใหม่เมื่อพลาด", "Checkpoint", "รวมผลลัพธ์"],
  },
  chatgpt: {
    de: ["Recherche", "Analyse", "Reasoning", "Spezifikationen", "Inhalte", "Tool-Nutzung"],
    th: ["ค้นคว้า", "วิเคราะห์", "ให้เหตุผล", "เขียนสเปก", "เนื้อหา", "ใช้เครื่องมือ"],
  },
  claude: {
    de: ["Repository-Analyse", "Planung", "Umsetzung", "Refactoring", "Debugging", "Code-Review"],
    th: ["วิเคราะห์ Repository", "วางแผน", "เขียนโค้ด", "Refactor", "Debug", "Code Review"],
  },
  "local-ai": {
    de: ["Lokale Inferenz", "Private Dokumente", "Embeddings", "RAG", "Offline-Workflows"],
    th: ["Inference ในเครื่อง", "เอกสารส่วนตัว", "Embeddings", "RAG", "Workflow ออฟไลน์"],
  },
  n8n: {
    de: ["Webhooks", "Auslöser", "Zeitpläne", "API-Workflows", "E-Mail-Workflows", "Datenfluss", "Externe Integrationen", "Python-Services aufrufen", "KI-Workflows aufrufen"],
    th: ["Webhook", "Trigger", "งานตามรอบเวลา", "Workflow ของ API", "Workflow อีเมล", "ย้ายข้อมูล", "เชื่อมระบบภายนอก", "เรียก Service ที่เขียนด้วย Python", "เรียก AI Workflow"],
  },
  python: {
    de: ["Automatisierung", "KI-Tools", "API-Clients", "Datentransformation", "Dateiverarbeitung", "Agent-Tools", "Local-AI-Integration", "Backend-Utilities", "Entwickler-Tools"],
    th: ["Automation", "เครื่องมือ AI", "API Client", "แปลงข้อมูล", "ประมวลผลไฟล์", "เครื่องมือของ Agent", "เชื่อม Local AI", "Utility ฝั่ง Backend", "เครื่องมือสำหรับนักพัฒนา"],
  },
};

const stageTable: Record<StageId, Record<Translated, [string, string]>> = {
  intent: { de: ["Menschliche Absicht", "Eine Person, ein Formular oder ein Ereignis legt fest, was passieren soll."], th: ["เจตนาของคน", "คน ฟอร์ม หรือ Event เป็นตัวบอกว่าต้องทำอะไร"] },
  orchestrator: { de: ["Orchestrator", "Die Koordination: hält den Zustand, delegiert Arbeit und entscheidet, wann ein Ergebnis fertig ist."], th: ["Orchestrator", "ผู้ประสานงาน เก็บสถานะ มอบหมายงาน และตัดสินว่าผลลัพธ์พร้อมเมื่อไร"] },
  "plan-route": { de: ["Planen & routen", "Das Ziel wird zu Aufgaben; jede geht an den passenden Agent und das passende Modell."], th: ["วางแผนและ Routing", "เป้าหมายถูกแตกเป็นงานย่อย แล้วส่งไปยัง Agent และโมเดลที่เหมาะสม"] },
  agents: { de: ["Spezialisierte Agents", "Arbeiter mit je einer Aufgabe und nur den Tools, die sie brauchen."], th: ["Agent เฉพาะทาง", "แต่ละตัวรับผิดชอบงานเดียว และใช้เฉพาะเครื่องมือที่จำเป็น"] },
  models: { de: ["Modell-Ebene", "Cloud- und lokale Modelle, pro Aufgabe vom Model Router gewählt."], th: ["ชั้นโมเดล", "โมเดลบน Cloud และโมเดลในเครื่อง Model Router เลือกให้ตามงาน"] },
  tools: { de: ["Automatisierung & Tools", "n8n führt die Workflows aus, Python liefert die programmierbaren Tools."], th: ["Automation และเครื่องมือ", "n8n รัน Workflow ส่วน Python เป็นเครื่องมือที่เขียนโปรแกรมได้"] },
  data: { de: ["Daten & externe Systeme", "Datenbanken, private Dokumente und die Systeme, die Ergebnisse empfangen."], th: ["ข้อมูลและระบบภายนอก", "ฐานข้อมูล เอกสารส่วนตัว และระบบที่รับผลลัพธ์"] },
  control: { de: ["Validierung & Freigabe", "Jedes Ergebnis wird geprüft; Unumkehrbares gibt ein Mensch frei."], th: ["ตรวจสอบและอนุมัติ", "ทุกผลลัพธ์ผ่านการตรวจ และคนต้องอนุมัติก่อนทำสิ่งที่ย้อนกลับไม่ได้"] },
  delivery: { de: ["Auslieferung", "Geprüfte Änderungen gehen über GitHub und Vercel live; Nachrichten gehen per E-Mail raus."], th: ["ส่งมอบ", "การเปลี่ยนแปลงที่ผ่านรีวิวขึ้นระบบผ่าน GitHub และ Vercel ส่วนข้อความส่งออกทางอีเมล"] },
};

const workflowTable: Record<WorkflowId, Record<Translated, [string, string]>> = {
  development: { de: ["Entwicklung", "Von der Anforderung bis zum geprüften Production-Deploy."], th: ["พัฒนาซอฟต์แวร์", "จาก Requirement ไปจนถึง Deploy ขึ้น Production ที่ตรวจแล้ว"] },
  automation: { de: ["Automatisierung", "Ein n8n-Workflow, der Reasoning an den Orchestrator übergibt und erst nach Freigabe handelt."], th: ["Automation", "Workflow ใน n8n ที่ส่งงานคิดวิเคราะห์ให้ Orchestrator และลงมือทำหลังได้รับอนุมัติเท่านั้น"] },
  "ai-research": { de: ["KI-Recherche", "Eine Recherchefrage, beantwortet mit Cloud-Modellen, Web-Tools und menschlichem Review."], th: ["ค้นคว้าด้วย AI", "คำถามวิจัยที่ตอบด้วยโมเดลบน Cloud เครื่องมือเว็บ และให้คนรีวิว"] },
  "local-ai": { de: ["Local AI", "Antworten aus privaten Dokumenten, ohne sie an ein Cloud-Modell zu senden."], th: ["Local AI", "ตอบคำถามจากเอกสารส่วนตัวโดยไม่ส่งข้อมูลไปยังโมเดลบน Cloud"] },
  "website-lead": { de: ["Website-Lead", "Eine Anfrage über das Kontaktformular – geprüft, weitergeleitet und per E-Mail zugestellt."], th: ["ลูกค้าจากเว็บไซต์", "คำขอจากฟอร์มติดต่อที่ผ่านการตรวจ ส่งต่อ และส่งถึงทางอีเมล"] },
};

const verbTable: Record<Verb, Record<Locale, string>> = {
  delegates: { en: "delegates to", de: "delegiert an", th: "มอบหมายให้" },
  routes: { en: "routes to", de: "leitet an", th: "ส่งต่อไปยัง" },
  calls: { en: "calls", de: "ruft auf", th: "เรียกใช้" },
  "reads-writes": { en: "reads / writes", de: "liest / schreibt", th: "อ่าน / เขียน" },
  validates: { en: "validates for", de: "prüft für", th: "ตรวจสอบให้" },
  approves: { en: "approves", de: "gibt frei", th: "อนุมัติ" },
  deploys: { en: "deploys to", de: "deployt nach", th: "Deploy ไปที่" },
  triggers: { en: "triggers", de: "löst aus", th: "เริ่มงานของ" },
  automates: { en: "automates", de: "automatisiert", th: "ทำงานอัตโนมัติกับ" },
  "selects-model": { en: "selects model", de: "wählt Modell", th: "เลือกโมเดล" },
};

/** Legacy flow steps that are not nodes on the board. */
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
  "n8n-trigger": { en: "n8n trigger", de: "n8n-Auslöser", th: "Trigger ของ n8n" },
  "python-data": { en: "Python · data tool", de: "Python · Daten-Tool", th: "Python · เครื่องมือข้อมูล" },
  "external-system": { en: "External system", de: "Externes System", th: "ระบบภายนอก" },
};

type Rest = Omit<CircuitCopy, "nodes" | "agents" | "steps" | "stages" | "workflows" | "verbs">;

function build(locale: Locale, rest: Rest): CircuitCopy {
  const nodes: Record<string, NodeCopy> = {};
  for (const n of circuit.nodes) {
    if (locale === "en") nodes[n.id] = { label: n.label, sub: n.sub, role: n.description, uses: n.uses };
    else {
      const [label, sub, role] = nodeTable[n.id]?.[locale] ?? [n.label, n.sub, n.description];
      nodes[n.id] = { label, sub, role, uses: usesTable[n.id]?.[locale] ?? n.uses };
    }
  }
  const agents: Record<string, AgentCopy> = {};
  for (const [id, a] of Object.entries(circuit.agents)) {
    if (locale === "en") agents[id] = { responsibility: a.role, inputs: a.inputs, output: a.outputs };
    else {
      const [responsibility, inputs, output] = agentTable[id]?.[locale] ?? [a.role, a.inputs, a.outputs];
      agents[id] = { responsibility, inputs, output };
    }
  }
  const stages = Object.fromEntries(
    circuit.stages.map((s) => [s.id, locale === "en" ? { label: s.label, summary: s.summary } : { label: stageTable[s.id][locale][0], summary: stageTable[s.id][locale][1] }]),
  ) as CircuitCopy["stages"];
  const workflows = Object.fromEntries(
    circuit.workflows.map((w) => [w.id, locale === "en" ? { label: w.label, summary: w.summary } : { label: workflowTable[w.id][locale][0], summary: workflowTable[w.id][locale][1] }]),
  ) as CircuitCopy["workflows"];
  const verbs = Object.fromEntries(Object.entries(verbTable).map(([v, row]) => [v, row[locale]])) as CircuitCopy["verbs"];
  const steps = Object.fromEntries(Object.entries(stepTable).map(([id, row]) => [id, row[locale]]));
  return { ...rest, nodes, agents, stages, workflows, verbs, steps };
}

const en = build("en", {
  ui: {
    boardLabel: "Interactive AI orchestration architecture",
    traceLabel: "AI orchestration, stage by stage",
    keyboardHint: "Tab to a component, arrow keys to move, Enter to select, Esc to clear.",
    inspector: "Inspector",
    idle: "Nothing selected",
    idleBody: "Pick a component to see what it does and which paths it uses, or follow a workflow.",
    clear: "Clear",
    selectLabel: "Component",
    selectPlaceholder: "Choose a component…",
    legend: "Legend",
    caption: "Generated by {generator} · {hash} · {nodes} components · {connections} connections · {agents} agents",
    staticSvg: "Open the static SVG",
    live: "{label} selected. {count} related components highlighted.",
    showOnBoard: "Show {label} in the architecture",
    tapHint: "Tap any component for details.",
    workflowLabel: "Follow a workflow",
    workflowNone: "Whole system",
    workflowBadge: "Workflow simulation · architecture demo",
    workflowSteps: "Steps",
    workflowLive: "{label} workflow: {count} steps highlighted.",
    parallel: "in parallel",
    step: "Step {n}",
    showAgents: "Show all {count} agents",
    hideAgents: "Hide agents",
    close: "Close details",
    cloud: "Cloud",
    local: "Local · private",
    primaryTools: "Core",
    moreTools: "Also in this layer",
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
    responsibility: "Role",
    inputs: "Inputs",
    tools: "Tools",
    models: "Model options",
    viaRouter: "via the model router",
    output: "Output",
    checkpoint: "Validation gate",
    related: "Related",
    connected: "Connected to",
    usedFor: "Used for",
    layer: "Layer",
    outgoing: "{verb} {node}",
    incoming: "{node} {verb} this",
  },
});

const de = build("de", {
  ui: {
    boardLabel: "Interaktive KI-Orchestrierungsarchitektur",
    traceLabel: "KI-Orchestrierung, Stufe für Stufe",
    keyboardHint: "Mit Tab zu einer Komponente, Pfeiltasten zum Bewegen, Enter zum Auswählen, Esc zum Zurücksetzen.",
    inspector: "Inspektor",
    idle: "Nichts ausgewählt",
    idleBody: "Wähl eine Komponente, um zu sehen, was sie tut und welche Pfade sie nutzt – oder folge einem Workflow.",
    clear: "Zurücksetzen",
    selectLabel: "Komponente",
    selectPlaceholder: "Komponente wählen…",
    legend: "Legende",
    caption: "Erzeugt von {generator} · {hash} · {nodes} Komponenten · {connections} Verbindungen · {agents} Agents",
    staticSvg: "Statisches SVG öffnen",
    live: "{label} ausgewählt. {count} verwandte Komponenten hervorgehoben.",
    showOnBoard: "{label} in der Architektur zeigen",
    tapHint: "Tippe auf eine Komponente für Details.",
    workflowLabel: "Einem Workflow folgen",
    workflowNone: "Ganzes System",
    workflowBadge: "Workflow-Simulation · Architektur-Demo",
    workflowSteps: "Schritte",
    workflowLive: "Workflow {label}: {count} Schritte hervorgehoben.",
    parallel: "parallel",
    step: "Schritt {n}",
    showAgents: "Alle {count} Agents zeigen",
    hideAgents: "Agents ausblenden",
    close: "Details schließen",
    cloud: "Cloud",
    local: "Lokal · privat",
    primaryTools: "Kern",
    moreTools: "Außerdem in dieser Ebene",
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
    checkpoint: "Prüfstelle",
    related: "Verbunden mit",
    connected: "Verbindungen",
    usedFor: "Wofür",
    layer: "Ebene",
    outgoing: "{verb}: {node}",
    incoming: "{node} {verb} diese Komponente",
  },
});

const th = build("th", {
  ui: {
    boardLabel: "สถาปัตยกรรม AI Orchestration แบบโต้ตอบได้",
    traceLabel: "AI Orchestration ทีละขั้น",
    keyboardHint: "กด Tab ไปที่องค์ประกอบ ใช้ลูกศรเลื่อน Enter เพื่อเลือก Esc เพื่อล้าง",
    inspector: "รายละเอียด",
    idle: "ยังไม่ได้เลือก",
    idleBody: "เลือกองค์ประกอบเพื่อดูหน้าที่และเส้นทางที่ใช้ หรือเลือกดูตาม Workflow",
    clear: "ล้าง",
    selectLabel: "องค์ประกอบ",
    selectPlaceholder: "เลือกองค์ประกอบ…",
    legend: "คำอธิบายสัญลักษณ์",
    caption: "สร้างโดย {generator} · {hash} · {nodes} องค์ประกอบ · {connections} การเชื่อมต่อ · {agents} Agent",
    staticSvg: "เปิดไฟล์ SVG แบบคงที่",
    live: "เลือก {label} แล้ว ไฮไลต์องค์ประกอบที่เกี่ยวข้อง {count} รายการ",
    showOnBoard: "แสดง {label} ในสถาปัตยกรรม",
    tapHint: "แตะองค์ประกอบใดก็ได้เพื่อดูรายละเอียด",
    workflowLabel: "ดูตาม Workflow",
    workflowNone: "ทั้งระบบ",
    workflowBadge: "จำลอง Workflow · เดโมสถาปัตยกรรม",
    workflowSteps: "ขั้นตอน",
    workflowLive: "Workflow {label}: ไฮไลต์ {count} ขั้นตอน",
    parallel: "ทำพร้อมกัน",
    step: "ขั้นที่ {n}",
    showAgents: "ดู Agent ทั้ง {count} ตัว",
    hideAgents: "ซ่อน Agent",
    close: "ปิดรายละเอียด",
    cloud: "Cloud",
    local: "ในเครื่อง · ส่วนตัว",
    primaryTools: "หลัก",
    moreTools: "เครื่องมืออื่นในชั้นนี้",
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
    checkpoint: "จุดตรวจ",
    related: "เกี่ยวข้องกับ",
    connected: "เชื่อมกับ",
    usedFor: "ใช้สำหรับ",
    layer: "ชั้น",
    outgoing: "{verb} {node}",
    incoming: "{node} {verb} ส่วนนี้",
  },
});

export const circuitCopy: Localized<CircuitCopy> = { en, de, th };

/** Label for a flow step: a board node, or a step-only label. */
export function stepLabel(copy: CircuitCopy, id: string): string {
  return copy.nodes[id]?.label ?? copy.steps[id] ?? id;
}

/** Exposed for tests: every generated id must have a German and Thai entry. */
export const translationTables = { nodeTable, agentTable, stageTable, workflowTable, usesTable };
