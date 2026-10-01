import type { Localized } from "@/i18n/config";
import type { ContactErrorCode, budgets, projectTypes } from "@/lib/contact/schema";

type ProjectType = (typeof projectTypes)[number];
type Budget = (typeof budgets)[number];

const en = {
  meta: {
    title: "Start a project",
    description: "Tell me what you're building: a new website, a redesign, new features, a web application, AI integration or automation. Email, phone or the project form.",
  },
  hero: {
    eyebrow: "Contact",
    title: "Tell me what you're building.",
    lede: "A new website, a redesign, a feature for something that already exists, or an AI workflow. Describe it in your own words — scope and budget can be rough.",
  },
  next: {
    title: "What happens next",
    steps: [
      { label: "Inbox", body: "Your enquiry goes straight to my inbox, nowhere else." },
      { label: "Reply", body: "I read it and reply with questions or a first take on scope and approach." },
      { label: "Plan", body: "If it's a fit, we agree on a clear plan before any work starts." },
    ],
  },
  direct: {
    title: "Prefer email or a call?",
    body: "Write or call directly, in English, German or Thai.",
  },
  privacy: "Your details are only used to answer this enquiry. They are not shared or added to any list.",
  form: {
    title: "Project enquiry",
    labels: {
      name: "Name",
      email: "Email",
      company: "Company",
      projectType: "What do you need?",
      budget: "Budget",
      message: "Message",
      language: "Preferred language",
      consent: "I agree that my details are used to reply to this enquiry.",
      optional: "optional",
    },
    placeholders: {
      name: "Your name",
      email: "you@company.com",
      company: "Company or team",
      message: "What are you building, what exists already, and what would a good outcome look like?",
    },
    select: "Select…",
    projectTypes: {
      "new-website": "New website",
      redesign: "Website redesign",
      features: "Add new features",
      webapp: "Web application",
      "ai-integration": "AI integration",
      automation: "Automation",
      "local-ai": "Local AI / private AI",
      other: "Other",
    } satisfies Record<ProjectType, string>,
    budgets: {
      "under-1k": "Under 1,000 USD",
      "1k-5k": "1,000 – 5,000 USD",
      "5k-15k": "5,000 – 15,000 USD",
      "15k-plus": "15,000 USD and up",
      unsure: "Not sure yet",
    } satisfies Record<Budget, string>,
    languages: { en: "English", de: "Deutsch", th: "ไทย" },
    submit: "Send enquiry",
    sending: "Sending…",
    success: {
      title: "Enquiry received.",
      body: "Your message is in my inbox. The reply will go to the email address you entered.",
      acknowledged: "A confirmation email is on its way to you as well.",
      again: "Send another message",
    },
    states: {
      invalid: "Please check the highlighted fields.",
      rateLimited: "Too many messages in a short time. Please try again in {minutes} minute(s).",
      unavailable: "The form can't deliver messages right now.",
      error: "Something went wrong on the server and the message was not sent.",
      fallback: "Please email or call directly:",
    },
    errors: {
      "name.short": "Please enter your name (at least 2 characters).",
      "name.long": "The name is too long (maximum 100 characters).",
      "email.invalid": "Please enter a valid email address.",
      "email.long": "The email address is too long.",
      "company.long": "The company name is too long (maximum 120 characters).",
      "projectType.invalid": "Please choose what you need.",
      "budget.invalid": "Please choose one of the budget ranges.",
      "message.short": "Please describe your project in at least 20 characters.",
      "message.long": "The message is too long (maximum 4,000 characters).",
      "language.invalid": "Please choose a language.",
      "consent.required": "Please confirm to continue.",
    } satisfies Record<ContactErrorCode, string>,
  },
  mobileBar: "Contact directly",
};

export type ContactContent = typeof en;

const de: ContactContent = {
  meta: {
    title: "Projekt starten",
    description: "Erzähl mir, was du baust: neue Website, Redesign, neue Features, Webanwendung, KI-Integration oder Automatisierung. Per E-Mail, Telefon oder Projektformular.",
  },
  hero: {
    eyebrow: "Kontakt",
    title: "Erzähl mir, was du baust.",
    lede: "Eine neue Website, ein Redesign, ein Feature für etwas Bestehendes oder ein KI-Workflow. Beschreib es mit deinen eigenen Worten – Umfang und Budget dürfen grob sein.",
  },
  next: {
    title: "So geht es weiter",
    steps: [
      { label: "Posteingang", body: "Deine Anfrage landet direkt in meinem Posteingang – sonst nirgends." },
      { label: "Antwort", body: "Ich lese sie und antworte mit Rückfragen oder einer ersten Einschätzung zu Umfang und Vorgehen." },
      { label: "Plan", body: "Wenn es passt, vereinbaren wir einen klaren Plan, bevor die Arbeit beginnt." },
    ],
  },
  direct: {
    title: "Lieber per E-Mail oder Anruf?",
    body: "Schreib oder ruf direkt an – auf Deutsch, Englisch oder Thai.",
  },
  privacy: "Deine Angaben werden nur zur Beantwortung dieser Anfrage genutzt. Sie werden nicht weitergegeben und landen in keinem Verteiler.",
  form: {
    title: "Projektanfrage",
    labels: {
      name: "Name",
      email: "E-Mail",
      company: "Unternehmen",
      projectType: "Was brauchst du?",
      budget: "Budget",
      message: "Nachricht",
      language: "Bevorzugte Sprache",
      consent: "Ich bin einverstanden, dass meine Angaben zur Beantwortung dieser Anfrage verwendet werden.",
      optional: "optional",
    },
    placeholders: {
      name: "Dein Name",
      email: "du@firma.de",
      company: "Unternehmen oder Team",
      message: "Was baust du, was gibt es schon, und wie sähe ein gutes Ergebnis aus?",
    },
    select: "Auswählen…",
    projectTypes: {
      "new-website": "Neue Website",
      redesign: "Website-Redesign",
      features: "Neue Features ergänzen",
      webapp: "Webanwendung",
      "ai-integration": "KI-Integration",
      automation: "Automatisierung",
      "local-ai": "Lokale / private KI",
      other: "Etwas anderes",
    },
    budgets: {
      "under-1k": "Unter 1.000 USD",
      "1k-5k": "1.000 – 5.000 USD",
      "5k-15k": "5.000 – 15.000 USD",
      "15k-plus": "Ab 15.000 USD",
      unsure: "Noch unklar",
    },
    languages: { en: "English", de: "Deutsch", th: "ไทย" },
    submit: "Anfrage senden",
    sending: "Wird gesendet…",
    success: {
      title: "Anfrage angekommen.",
      body: "Deine Nachricht ist in meinem Posteingang. Die Antwort geht an die E-Mail-Adresse, die du angegeben hast.",
      acknowledged: "Eine Bestätigung ist außerdem an dich unterwegs.",
      again: "Weitere Nachricht senden",
    },
    states: {
      invalid: "Bitte prüfe die markierten Felder.",
      rateLimited: "Zu viele Nachrichten in kurzer Zeit. Bitte versuche es in {minutes} Minute(n) erneut.",
      unavailable: "Das Formular kann gerade keine Nachrichten zustellen.",
      error: "Auf dem Server ist etwas schiefgelaufen – die Nachricht wurde nicht gesendet.",
      fallback: "Schreib oder ruf bitte direkt an:",
    },
    errors: {
      "name.short": "Bitte gib deinen Namen ein (mindestens 2 Zeichen).",
      "name.long": "Der Name ist zu lang (maximal 100 Zeichen).",
      "email.invalid": "Bitte gib eine gültige E-Mail-Adresse ein.",
      "email.long": "Die E-Mail-Adresse ist zu lang.",
      "company.long": "Der Unternehmensname ist zu lang (maximal 120 Zeichen).",
      "projectType.invalid": "Bitte wähle aus, was du brauchst.",
      "budget.invalid": "Bitte wähle einen der Budgetrahmen.",
      "message.short": "Bitte beschreib dein Projekt in mindestens 20 Zeichen.",
      "message.long": "Die Nachricht ist zu lang (maximal 4.000 Zeichen).",
      "language.invalid": "Bitte wähle eine Sprache.",
      "consent.required": "Bitte bestätige, um fortzufahren.",
    },
  },
  mobileBar: "Direkt kontaktieren",
};

const th: ContactContent = {
  meta: {
    title: "เริ่มโปรเจกต์",
    description: "เล่าให้ฟังว่ากำลังสร้างอะไร ทั้งเว็บไซต์ใหม่ Redesign ฟีเจอร์ใหม่ เว็บแอป AI Integration หรือ Automation ติดต่อทางอีเมล โทรศัพท์ หรือแบบฟอร์มโปรเจกต์",
  },
  hero: {
    eyebrow: "ติดต่อ",
    title: "เล่าให้ฟังว่ากำลังสร้างอะไร",
    lede: "จะเป็นเว็บไซต์ใหม่ Redesign ฟีเจอร์สำหรับระบบที่มีอยู่แล้ว หรือ AI Workflow ก็ได้ เล่าแบบสบาย ๆ ได้เลย ขอบเขตและงบประมาณคร่าว ๆ ก็พอ",
  },
  next: {
    title: "ขั้นตอนถัดไป",
    steps: [
      { label: "กล่องอีเมล", body: "ข้อความส่งตรงเข้าอีเมล ไม่ผ่านที่อื่น" },
      { label: "ตอบกลับ", body: "อ่านรายละเอียดแล้วตอบกลับพร้อมคำถาม หรือแนวทางเบื้องต้นเรื่องขอบเขตและวิธีทำ" },
      { label: "วางแผน", body: "ถ้างานเหมาะสม จะตกลงแผนงานที่ชัดเจนร่วมกันก่อนเริ่มงาน" },
    ],
  },
  direct: {
    title: "สะดวกอีเมลหรือโทรมากกว่า",
    body: "ส่งอีเมลหรือโทรมาได้โดยตรง ใช้ภาษาไทย อังกฤษ หรือเยอรมันก็ได้",
  },
  privacy: "ข้อมูลที่กรอกใช้เพื่อตอบกลับคำขอนี้เท่านั้น ไม่มีการส่งต่อหรือเพิ่มเข้ารายชื่อใด ๆ",
  form: {
    title: "แบบฟอร์มโปรเจกต์",
    labels: {
      name: "ชื่อ",
      email: "อีเมล",
      company: "บริษัท",
      projectType: "ต้องการอะไร",
      budget: "งบประมาณ",
      message: "ข้อความ",
      language: "ภาษาที่สะดวก",
      consent: "ยินยอมให้ใช้ข้อมูลนี้เพื่อตอบกลับคำขอนี้",
      optional: "ไม่บังคับ",
    },
    placeholders: {
      name: "ชื่อ-นามสกุล",
      email: "you@company.com",
      company: "บริษัทหรือทีม",
      message: "กำลังสร้างอะไร มีอะไรอยู่แล้วบ้าง และผลลัพธ์ที่ดีควรเป็นแบบไหน",
    },
    select: "เลือก…",
    projectTypes: {
      "new-website": "เว็บไซต์ใหม่",
      redesign: "Redesign เว็บไซต์",
      features: "เพิ่มฟีเจอร์ใหม่",
      webapp: "เว็บแอปพลิเคชัน",
      "ai-integration": "AI Integration",
      automation: "Automation",
      "local-ai": "Local AI / Private AI",
      other: "อื่น ๆ",
    },
    budgets: {
      "under-1k": "ต่ำกว่า 1,000 USD",
      "1k-5k": "1,000 – 5,000 USD",
      "5k-15k": "5,000 – 15,000 USD",
      "15k-plus": "15,000 USD ขึ้นไป",
      unsure: "ยังไม่แน่ใจ",
    },
    languages: { en: "English", de: "Deutsch", th: "ไทย" },
    submit: "ส่งข้อความ",
    sending: "กำลังส่ง…",
    success: {
      title: "ได้รับข้อความแล้ว",
      body: "ข้อความเข้าอีเมลเรียบร้อย คำตอบจะส่งไปที่อีเมลที่กรอกไว้",
      acknowledged: "อีเมลยืนยันกำลังส่งไปยังอีเมลที่กรอกไว้ด้วย",
      again: "ส่งข้อความใหม่",
    },
    states: {
      invalid: "กรุณาตรวจสอบช่องที่ไฮไลต์ไว้",
      rateLimited: "ส่งข้อความถี่เกินไป กรุณาลองใหม่ในอีก {minutes} นาที",
      unavailable: "ขณะนี้แบบฟอร์มยังส่งข้อความไม่ได้",
      error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ ข้อความยังส่งไม่ออก",
      fallback: "ติดต่อทางอีเมลหรือโทรได้โดยตรง:",
    },
    errors: {
      "name.short": "กรุณากรอกชื่อ (อย่างน้อย 2 ตัวอักษร)",
      "name.long": "ชื่อยาวเกินไป (สูงสุด 100 ตัวอักษร)",
      "email.invalid": "กรุณากรอกอีเมลให้ถูกต้อง",
      "email.long": "อีเมลยาวเกินไป",
      "company.long": "ชื่อบริษัทยาวเกินไป (สูงสุด 120 ตัวอักษร)",
      "projectType.invalid": "กรุณาเลือกสิ่งที่ต้องการ",
      "budget.invalid": "กรุณาเลือกช่วงงบประมาณ",
      "message.short": "กรุณาอธิบายโปรเจกต์อย่างน้อย 20 ตัวอักษร",
      "message.long": "ข้อความยาวเกินไป (สูงสุด 4,000 ตัวอักษร)",
      "language.invalid": "กรุณาเลือกภาษา",
      "consent.required": "กรุณายืนยันเพื่อดำเนินการต่อ",
    },
  },
  mobileBar: "ติดต่อโดยตรง",
};

export const contactContent: Localized<ContactContent> = { en, de, th };
