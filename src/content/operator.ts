import type { Localized } from "@/i18n/config";

/** Deliberately little language: Operator is a visual piece. Technical micro-labels stay in English. */
const en = {
  meta: {
    title: "Operator",
    description: "An after-hours view of the system behind the work: a masked operator, the screens, the orchestration and the code.",
  },
  figureAlt: "Illustration of a masked programmer lit by screen light; a single line of light runs across the visor.",
  threshold: { signal: "Session open", line: "A quiet room. A complex system." },
  operator: { label: "Operator", line: "Quiet systems, precisely built." },
  field: { label: "Eight surfaces, one system" },
  core: { label: "Orchestration core", line: "Intent in. Production out.", link: "Trace the full architecture" },
  code: { label: "Code as material", caption: "Fragments from this site's own repository." },
  quiet: { line: "The machine proposes. A person decides." },
  loop: { label: "Continuous system", line: "It keeps going." },
  collapse: { line: "Signal, not noise." },
  exit: {
    work: "View the work",
    project: "Start a project",
    back: "Return to portfolio",
    note: "Operator is a visual piece. The architecture and code are real; the figure is an illustration.",
  },
  scroll: "Scroll",
};

export type OperatorContent = typeof en;

const de: OperatorContent = {
  meta: {
    title: "Operator",
    description: "Ein Blick nach Feierabend auf das System hinter der Arbeit: ein maskierter Operator, die Bildschirme, die Orchestrierung und der Code.",
  },
  figureAlt: "Illustration einer maskierten Person am Rechner im Bildschirmlicht; eine einzelne Lichtlinie läuft über das Visier.",
  threshold: { signal: "Sitzung offen", line: "Ein stiller Raum. Ein komplexes System." },
  operator: { label: "Operator", line: "Stille Systeme, präzise gebaut." },
  field: { label: "Acht Oberflächen, ein System" },
  core: { label: "Orchestrierungskern", line: "Absicht rein. Produktion raus.", link: "Die ganze Architektur ansehen" },
  code: { label: "Code als Material", caption: "Fragmente aus dem Repository dieser Website." },
  quiet: { line: "Die Maschine schlägt vor. Ein Mensch entscheidet." },
  loop: { label: "Kontinuierliches System", line: "Es geht weiter." },
  collapse: { line: "Signal statt Rauschen." },
  exit: {
    work: "Arbeiten ansehen",
    project: "Projekt starten",
    back: "Zurück zum Portfolio",
    note: "Operator ist ein visuelles Stück. Architektur und Code sind echt; die Figur ist eine Illustration.",
  },
  scroll: "Scrollen",
};

const th: OperatorContent = {
  meta: {
    title: "Operator",
    description: "มองระบบเบื้องหลังงานในยามดึก: Operator ที่สวมหน้ากาก หน้าจอ Orchestration และโค้ด",
  },
  figureAlt: "ภาพประกอบโปรแกรมเมอร์สวมหน้ากากท่ามกลางแสงจากหน้าจอ มีเส้นแสงเส้นเดียวพาดผ่านแผ่นกระบังหน้า",
  threshold: { signal: "เริ่มเซสชัน", line: "ห้องที่เงียบ ระบบที่ซับซ้อน" },
  operator: { label: "Operator", line: "ระบบที่เงียบ แต่สร้างอย่างแม่นยำ" },
  field: { label: "แปดหน้าจอ หนึ่งระบบ" },
  core: { label: "แกนกลาง Orchestration", line: "เริ่มจากเจตนา จบที่ Production", link: "ดูสถาปัตยกรรมทั้งหมด" },
  code: { label: "โค้ดในฐานะวัสดุ", caption: "ชิ้นส่วนจาก Repository ของเว็บไซต์นี้เอง" },
  quiet: { line: "เครื่องเสนอ คนตัดสินใจ" },
  loop: { label: "ระบบที่ต่อเนื่อง", line: "และยังดำเนินต่อไป" },
  collapse: { line: "สัญญาณ ไม่ใช่เสียงรบกวน" },
  exit: {
    work: "ดูผลงาน",
    project: "เริ่มโปรเจกต์",
    back: "กลับสู่พอร์ตโฟลิโอ",
    note: "Operator เป็นงานภาพ สถาปัตยกรรมและโค้ดที่เห็นเป็นของจริง ส่วนตัวละครเป็นภาพประกอบ",
  },
  scroll: "เลื่อนลง",
};

export const operatorContent: Localized<OperatorContent> = { en, de, th };
