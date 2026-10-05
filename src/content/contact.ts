import type { Localized } from "@/i18n/config";
import type { ContactErrorCode, enquiryTypes } from "@/lib/contact/schema";

type EnquiryType = (typeof enquiryTypes)[number];

const en = {
  meta: {
    title: "Contact",
    description: "Contact Chaiyaphol — open to employment opportunities in IT, Web & AI-assisted digital work. Junior roles, Quereinsteiger positions, internships and collaborations.",
  },
  hero: {
    eyebrow: "Contact",
    title: "Let's talk.",
    lede: "I'm open to employment opportunities in IT, Web & AI-assisted digital work — junior roles, Quereinsteiger positions, internships or collaborations. Write in English, German or Thai.",
  },
  next: {
    title: "What happens next",
    steps: [
      { label: "Inbox", body: "Your message goes straight to my inbox, nowhere else." },
      { label: "Reply", body: "I read it and reply — usually within a day or two." },
      { label: "Talk", body: "We talk about the role or idea, my experience and whether it fits." },
    ],
  },
  direct: {
    title: "Prefer email or a call?",
    body: "Write or call directly, in English, German or Thai.",
  },
  privacy: "Your details are only used to answer this enquiry. They are not shared or added to any list.",
  form: {
    title: "Message",
    labels: {
      name: "Name",
      email: "Email",
      company: "Company",
      enquiryType: "What is this about?",
      message: "Message",
      language: "Preferred language",
      consent: "I agree that my details are used to reply to this enquiry.",
      optional: "optional",
    },
    placeholders: {
      name: "Your name",
      email: "you@company.com",
      company: "Company or team",
      message: "Tell me about the role, project or idea — and what would make it a good fit.",
    },
    select: "Select…",
    enquiryTypes: {
      "job-opportunity": "Job opportunity",
      internship: "Internship / training",
      collaboration: "Project collaboration",
      feedback: "Feedback on this portfolio",
      other: "Other",
    } satisfies Record<EnquiryType, string>,
    languages: { en: "English", de: "Deutsch", th: "ไทย" },
    submit: "Send message",
    sending: "Sending…",
    success: {
      title: "Message received.",
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
      "enquiryType.invalid": "Please choose what your message is about.",
      "message.short": "Please describe your message in at least 20 characters.",
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
    title: "Kontakt",
    description: "Kontakt zu Chaiyaphol – offen für Anstellungen in IT, Web & KI-gestützter digitaler Arbeit. Junior-Stellen, Quereinsteiger-Positionen, Praktika und Zusammenarbeit.",
  },
  hero: {
    eyebrow: "Kontakt",
    title: "Lass uns reden.",
    lede: "Ich bin offen für Anstellungen in IT, Web & KI-gestützter digitaler Arbeit – Junior-Stellen, Quereinsteiger-Positionen, Praktika oder Zusammenarbeit. Schreiben Sie auf Englisch, Deutsch oder Thai.",
  },
  next: {
    title: "So geht es weiter",
    steps: [
      { label: "Posteingang", body: "Ihre Nachricht landet direkt in meinem Posteingang – sonst nirgends." },
      { label: "Antwort", body: "Ich lese sie und antworte – meist innerhalb von ein bis zwei Tagen." },
      { label: "Gespräch", body: "Wir sprechen über die Stelle oder die Idee, meine Erfahrung und ob es passt." },
    ],
  },
  direct: {
    title: "Lieber per E-Mail oder Anruf?",
    body: "Schreiben oder rufen Sie direkt an – auf Englisch, Deutsch oder Thai.",
  },
  privacy: "Ihre Angaben werden nur zur Beantwortung dieser Anfrage genutzt. Sie werden nicht weitergegeben und landen in keiner Liste.",
  form: {
    title: "Nachricht",
    labels: {
      name: "Name",
      email: "E-Mail",
      company: "Unternehmen",
      enquiryType: "Worum geht es?",
      message: "Nachricht",
      language: "Bevorzugte Sprache",
      consent: "Ich bin einverstanden, dass meine Angaben zur Beantwortung dieser Anfrage verwendet werden.",
      optional: "optional",
    },
    placeholders: {
      name: "Ihr Name",
      email: "sie@unternehmen.de",
      company: "Unternehmen oder Team",
      message: "Erzählen Sie mir von der Stelle, dem Projekt oder der Idee – und was zu einem guten Fit machen würde.",
    },
    select: "Auswählen …",
    enquiryTypes: {
      "job-opportunity": "Stellenangebot",
      internship: "Praktikum / Ausbildung",
      collaboration: "Projektzusammenarbeit",
      feedback: "Feedback zu diesem Portfolio",
      other: "Etwas anderes",
    },
    languages: { en: "English", de: "Deutsch", th: "ไทย" },
    submit: "Nachricht senden",
    sending: "Wird gesendet …",
    success: {
      title: "Nachricht angekommen.",
      body: "Ihre Nachricht ist in meinem Posteingang. Die Antwort geht an die E-Mail-Adresse, die Sie angegeben haben.",
      acknowledged: "Eine Bestätigungs-E-Mail ist ebenfalls an Sie unterwegs.",
      again: "Weitere Nachricht senden",
    },
    states: {
      invalid: "Bitte prüfen Sie die markierten Felder.",
      rateLimited: "Zu viele Nachrichten in kurzer Zeit. Bitte versuchen Sie es in {minutes} Minute(n) erneut.",
      unavailable: "Das Formular kann gerade keine Nachrichten zustellen.",
      error: "Auf dem Server ist etwas schiefgelaufen – die Nachricht wurde nicht gesendet.",
      fallback: "Schreiben oder rufen Sie bitte direkt an:",
    },
    errors: {
      "name.short": "Bitte geben Sie Ihren Namen ein (mindestens 2 Zeichen).",
      "name.long": "Der Name ist zu lang (maximal 100 Zeichen).",
      "email.invalid": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      "email.long": "Die E-Mail-Adresse ist zu lang.",
      "company.long": "Der Unternehmensname ist zu lang (maximal 120 Zeichen).",
      "enquiryType.invalid": "Bitte wählen Sie aus, worum es geht.",
      "message.short": "Bitte beschreiben Sie Ihre Nachricht in mindestens 20 Zeichen.",
      "message.long": "Die Nachricht ist zu lang (maximal 4.000 Zeichen).",
      "language.invalid": "Bitte wählen Sie eine Sprache.",
      "consent.required": "Bitte bestätigen Sie, um fortzufahren.",
    },
  },
  mobileBar: "Direkt kontaktieren",
};

const th: ContactContent = {
  meta: {
    title: "ติดต่อ",
    description: "ติดต่อชัยพล — เปิดรับโอกาสทำงานในสาย IT, Web และงานดิจิทัลที่ใช้ AI ตำแหน่ง Junior งาน Quereinsteiger ฝึกงาน และงานร่วมมือ",
  },
  hero: {
    eyebrow: "ติดต่อ",
    title: "มาคุยกัน",
    lede: "เปิดรับโอกาสทำงานในสาย IT, Web และงานดิจิทัลที่ใช้ AI ทั้งตำแหน่ง Junior งาน Quereinsteiger ฝึกงาน หรืองานร่วมมือ เขียนมาเป็นภาษาอังกฤษ เยอรมัน หรือไทยก็ได้",
  },
  next: {
    title: "ขั้นตอนถัดไป",
    steps: [
      { label: "กล่องอีเมล", body: "ข้อความส่งตรงเข้าอีเมล ไม่ผ่านที่อื่น" },
      { label: "ตอบกลับ", body: "ข้อความถูกอ่านและตอบกลับ โดยปกติภายในหนึ่งถึงสองวัน" },
      { label: "พูดคุย", body: "เราคุยกันเรื่องตำแหน่งงานหรือไอเดีย ประสบการณ์ และความเข้ากันได้" },
    ],
  },
  direct: {
    title: "สะดวกอีเมลหรือโทรมากกว่าไหม",
    body: "เขียนหรือโทรมาโดยตรงได้เลย เป็นภาษาอังกฤษ เยอรมัน หรือไทยก็ได้",
  },
  privacy: "ข้อมูลที่กรอกใช้เพื่อตอบกลับคำขอนี้เท่านั้น ไม่มีการส่งต่อหรือเพิ่มเข้ารายชื่อใด ๆ",
  form: {
    title: "ข้อความ",
    labels: {
      name: "ชื่อ",
      email: "อีเมล",
      company: "บริษัท",
      enquiryType: "เรื่องเกี่ยวกับอะไร",
      message: "ข้อความ",
      language: "ภาษาที่สะดวก",
      consent: "ยินยอมให้ใช้ข้อมูลนี้เพื่อตอบกลับคำขอนี้",
      optional: "ไม่บังคับ",
    },
    placeholders: {
      name: "ชื่อของคุณ",
      email: "you@company.com",
      company: "บริษัทหรือทีม",
      message: "เล่าเรื่องตำแหน่งงาน โปรเจกต์ หรือไอเดีย และอะไรที่จะทำให้เข้ากันได้ดี",
    },
    select: "เลือก…",
    enquiryTypes: {
      "job-opportunity": "โอกาสการจ้างงาน",
      internship: "ฝึกงาน / อบรม",
      collaboration: "ร่วมงานโปรเจกต์",
      feedback: "ติชมพอร์ตโฟลิโอนี้",
      other: "อื่น ๆ",
    },
    languages: { en: "English", de: "Deutsch", th: "ไทย" },
    submit: "ส่งข้อความ",
    sending: "กำลังส่ง…",
    success: {
      title: "ได้รับข้อความแล้ว",
      body: "ข้อความอยู่ในกล่องอีเมลแล้ว คำตอบจะส่งไปที่อีเมลที่คุณกรอกไว้",
      acknowledged: "อีเมลยืนยันกำลังส่งไปหาคุณด้วยเช่นกัน",
      again: "ส่งข้อความอีกครั้ง",
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
      "enquiryType.invalid": "กรุณาเลือกว่าเรื่องเกี่ยวกับอะไร",
      "message.short": "กรุณาอธิบายข้อความอย่างน้อย 20 ตัวอักษร",
      "message.long": "ข้อความยาวเกินไป (สูงสุด 4,000 ตัวอักษร)",
      "language.invalid": "กรุณาเลือกภาษา",
      "consent.required": "กรุณายืนยันเพื่อดำเนินการต่อ",
    },
  },
  mobileBar: "ติดต่อโดยตรง",
};

export const contactContent: Localized<ContactContent> = { en, de, th };
