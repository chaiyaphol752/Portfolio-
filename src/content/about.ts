import type { Localized } from "@/i18n/config";

const en = {
  meta: {
    title: "About",
    description: "Chaiyaphol — IT Quereinsteiger in Germany. Practical experience building web, app and automation projects with AI-assisted workflows. Honest, test-driven and quick to learn.",
  },
  hero: {
    eyebrow: "About",
    greeting: "Hi, I'm {name}.",
    title: "IT Quereinsteiger. Digital builder. Always learning.",
    lede: "I'm transitioning into IT and building real digital projects along the way — websites, an Android app prototype, automations and AI-assisted experiments. My strength is turning an idea into a working prototype: defining requirements clearly, using AI tools effectively, testing the result and improving it iteratively.",
  },
  facts: {
    title: "At a glance",
    based: "Based in",
    focus: "Focus",
    focusValue: "Web development, automation & AI-assisted digital work",
    languages: "Site languages",
    availability: "Looking for",
    education: "Education",
    contact: "Contact",
    code: "Code",
  },
  background: {
    eyebrow: "Background",
    title: "Education & languages.",
    education: {
      title: "Education",
      degree: "Bachelor's Degree – English Program",
      school: "Mahachulalongkornrajavidyalaya University, Thailand",
      note: "German credential evaluation currently in progress.",
    },
    languages: {
      title: "Languages",
      items: [
        { language: "Thai", level: "Native" },
        { language: "English", level: "Very good spoken communication · good written communication" },
        { language: "German", level: "B1–B2 spoken communication · very good reading comprehension" },
      ],
    },
  },
  path: {
    eyebrow: "How I work",
    title: "From idea to working prototype.",
    body: "I define the requirements, use AI tools to accelerate the work, review and test everything myself, and improve it in short iterations. Nothing ships that I have not read, run and checked.",
    layers: [
      { title: "Requirements", body: "Goals, constraints and a definition of done — agreed in writing before any code exists." },
      { title: "AI-assisted build", body: "AI drafts, explains and accelerates. I decide the structure and read every change." },
      { title: "Review", body: "Every diff is reviewed: correctness, edge cases, security and what it does to the design." },
      { title: "Test", body: "Automated tests, type checks, linting and QA on real screen sizes." },
      { title: "Deploy & iterate", body: "Git, CI and Vercel make shipping routine; real usage shows what to improve next." },
    ],
  },
  ai: {
    eyebrow: "AI in the toolbox",
    title: "AI is part of how I work. It doesn't make the decisions.",
    body: "ChatGPT, Claude and Claude Code, and local models are everyday tools — the same way a good editor or a test runner is. They make the work faster and more thorough. They do not replace judgement.",
    helpsTitle: "Where AI helps",
    helps: ["Research and reading unfamiliar code", "Planning and breaking work down", "Drafting implementation", "Debugging and tracing errors", "Reviewing diffs", "Writing tests", "Automating repetitive steps"],
    staysTitle: "What stays my responsibility",
    stays: [
      { title: "Architecture", body: "How the system is structured and why." },
      { title: "Security decisions", body: "Data handling, secrets, access and validation." },
      { title: "Production verification", body: "Checking that what ships actually works." },
    ],
  },
  working: {
    eyebrow: "In a team",
    title: "What you can expect.",
    items: [
      { title: "Clear communication", body: "I ask when something is unclear, write down what was agreed and keep progress visible." },
      { title: "Ownership", body: "From requirements to deployment, I follow a task through instead of stopping at the hand-off." },
      { title: "Fast, honest learning", body: "I learn new tools quickly — and say clearly what I have not done yet." },
      { title: "Straight answers", body: "If something is a risk or outside my level, you will hear it early." },
    ],
  },
  closing: {
    title: "Open to employment opportunities in IT, Web & AI-assisted digital work.",
    body: "Junior roles, Quereinsteiger positions, internships or collaborations. Write to me and I'll reply with how my experience fits.",
  },
};

export type AboutContent = typeof en;

const de: AboutContent = {
  meta: {
    title: "Über mich",
    description: "Chaiyaphol – IT-Quereinsteiger in Deutschland. Praktische Erfahrung im Bau von Web-, App- und Automatisierungsprojekten mit KI-gestützten Workflows. Ehrlich, testgetrieben und schnell im Lernen.",
  },
  hero: {
    eyebrow: "Über mich",
    greeting: "Hallo, ich bin {name}.",
    title: "IT-Quereinsteiger. Digital Builder. Immer am Lernen.",
    lede: "Ich steige in die IT ein und baue auf dem Weg echte digitale Projekte – Websites, einen Android-App-Prototyp, Automatisierungen und KI-gestützte Experimente. Meine Stärke ist, aus einer Idee einen funktionierenden Prototyp zu machen: Anforderungen klar definieren, KI-Werkzeuge wirksam einsetzen, das Ergebnis testen und iterativ verbessern.",
  },
  facts: {
    title: "Auf einen Blick",
    based: "Ansässig in",
    focus: "Schwerpunkt",
    focusValue: "Webentwicklung, Automatisierung & KI-gestützte digitale Arbeit",
    languages: "Sprachen dieser Website",
    availability: "Auf der Suche nach",
    education: "Bildung",
    contact: "Kontakt",
    code: "Code",
  },
  background: {
    eyebrow: "Hintergrund",
    title: "Bildung & Sprachen.",
    education: {
      title: "Bildung",
      degree: "Bachelor-Abschluss – English Program",
      school: "Mahachulalongkornrajavidyalaya University, Thailand",
      note: "Die Anerkennung des Abschlusses in Deutschland läuft derzeit.",
    },
    languages: {
      title: "Sprachen",
      items: [
        { language: "Thai", level: "Muttersprache" },
        { language: "English", level: "Sehr gute mündliche Kommunikation · gute schriftliche Kommunikation" },
        { language: "German", level: "B1–B2 mündliche Kommunikation · sehr gutes Leseverständnis" },
      ],
    },
  },
  path: {
    eyebrow: "So arbeite ich",
    title: "Von der Idee zum funktionierenden Prototyp.",
    body: "Ich definiere die Anforderungen, nutze KI-Werkzeuge, um die Arbeit zu beschleunigen, lese und teste alles selbst und verbessere es in kurzen Iterationen. Nichts geht live, das ich nicht gelesen, ausgeführt und geprüft habe.",
    layers: [
      { title: "Anforderungen", body: "Ziele, Rahmenbedingungen und eine Definition of Done – schriftlich vereinbart, bevor Code entsteht." },
      { title: "KI-gestütztes Bauen", body: "KI entwirft, erklärt und beschleunigt. Ich entscheide über die Struktur und lese jede Änderung." },
      { title: "Review", body: "Jeder Diff wird geprüft: Korrektheit, Sonderfälle, Sicherheit und die Wirkung auf das Design." },
      { title: "Testen", body: "Automatisierte Tests, Typprüfungen, Linting und QA auf echten Bildschirmgrößen." },
      { title: "Deploy & Iterieren", body: "Git, CI und Vercel machen das Ausliefern zur Routine; die echte Nutzung zeigt, was als Nächstes besser wird." },
    ],
  },
  ai: {
    eyebrow: "KI im Werkzeugkasten",
    title: "KI gehört zu meiner Arbeitsweise. Die Entscheidungen trifft sie nicht.",
    body: "ChatGPT, Claude und Claude Code sowie lokale Modelle sind Alltagswerkzeuge – wie ein guter Editor oder ein Test-Runner. Sie machen die Arbeit schneller und gründlicher. Urteilsvermögen ersetzen sie nicht.",
    helpsTitle: "Wo KI hilft",
    helps: ["Recherche und das Lesen unbekannten Codes", "Planen und Zerlegen von Arbeit", "Implementierungen entwerfen", "Debugging und Fehlersuche", "Diffs reviewen", "Tests schreiben", "Wiederkehrende Schritte automatisieren"],
    staysTitle: "Was in meiner Verantwortung bleibt",
    stays: [
      { title: "Architektur", body: "Wie das System aufgebaut ist und warum." },
      { title: "Sicherheitsentscheidungen", body: "Datenverarbeitung, Secrets, Zugriffe und Validierung." },
      { title: "Prüfung in Produktion", body: "Sicherstellen, dass das Ausgelieferte wirklich funktioniert." },
    ],
  },
  working: {
    eyebrow: "Im Team",
    title: "Was Sie erwarten können.",
    items: [
      { title: "Klare Kommunikation", body: "Ich frage nach, wenn etwas unklar ist, halte Vereinbarungen schriftlich fest und mache Fortschritt sichtbar." },
      { title: "Eigenverantwortung", body: "Von den Anforderungen bis zum Deployment begleite ich eine Aufgabe bis zum Ende, statt an der Übergabe aufzuhören." },
      { title: "Schnelles, ehrliches Lernen", body: "Ich lerne neue Werkzeuge schnell – und sage klar, was ich noch nicht gemacht habe." },
      { title: "Klare Ansagen", body: "Wenn etwas ein Risiko ist oder über mein Niveau hinausgeht, erfahren Sie es früh." },
    ],
  },
  closing: {
    title: "Offen für Anstellungen in IT, Web & KI-gestützter digitaler Arbeit.",
    body: "Junior-Stellen, Quereinsteiger-Positionen, Praktika oder Zusammenarbeit. Schreiben Sie mir, und ich antworte, wie meine Erfahrung dazu passt.",
  },
};

const th: AboutContent = {
  meta: {
    title: "เกี่ยวกับ",
    description: "ชัยพล — IT Quereinsteiger ในเยอรมนี มีประสบการณ์จริงในการสร้างโปรเจกต์เว็บ แอป และระบบอัตโนมัติด้วย Workflow ที่มี AI ช่วย ตรงไปตรงมา เน้นการทดสอบ และเรียนรู้เร็ว",
  },
  hero: {
    eyebrow: "เกี่ยวกับ",
    greeting: "สวัสดี นี่คือ {name}",
    title: "IT Quereinsteiger นักสร้างดิจิทัล และเรียนรู้อยู่เสมอ",
    lede: "กำลังเปลี่ยนสายเข้าสู่งาน IT และสร้างโปรเจกต์ดิจิทัลจริงไปพร้อมกัน ทั้งเว็บไซต์ ต้นแบบแอป Android ระบบอัตโนมัติ และการทดลองกับ AI จุดแข็งคือการเปลี่ยนไอเดียให้เป็นต้นแบบที่ใช้งานได้: กำหนดความต้องการให้ชัดเจน ใช้เครื่องมือ AI อย่างมีประสิทธิภาพ ทดสอบผลลัพธ์ และปรับปรุงวนซ้ำ",
  },
  facts: {
    title: "ข้อมูลโดยย่อ",
    based: "อยู่ที่",
    focus: "งานหลัก",
    focusValue: "พัฒนาเว็บ ระบบอัตโนมัติ และงานดิจิทัลที่ใช้ AI",
    languages: "ภาษาของเว็บไซต์",
    availability: "กำลังมองหา",
    education: "การศึกษา",
    contact: "ติดต่อ",
    code: "โค้ด",
  },
  background: {
    eyebrow: "ภูมิหลัง",
    title: "การศึกษาและภาษา",
    education: {
      title: "การศึกษา",
      degree: "ปริญญาตรี หลักสูตรภาษาอังกฤษ",
      school: "Mahachulalongkornrajavidyalaya University, Thailand",
      note: "กำลังดำเนินการรับรองวุฒิการศึกษาในเยอรมนี",
    },
    languages: {
      title: "ภาษา",
      items: [
        { language: "ไทย", level: "ภาษาแม่" },
        { language: "English", level: "พูดสื่อสารได้ดีมาก · เขียนได้ดี" },
        { language: "German", level: "พูดระดับ B1–B2 · อ่านเข้าใจได้ดีมาก" },
      ],
    },
  },
  path: {
    eyebrow: "วิธีทำงาน",
    title: "จากไอเดียสู่ต้นแบบที่ใช้งานได้",
    body: "กำหนดความต้องการ ใช้เครื่องมือ AI เร่งงาน อ่านและทดสอบทุกอย่างด้วยตัวเอง แล้วปรับปรุงเป็นรอบสั้น ๆ ไม่มีอะไรขึ้นระบบโดยที่ยังไม่ได้อ่าน รัน และตรวจสอบ",
    layers: [
      { title: "ความต้องการ", body: "เป้าหมาย ข้อจำกัด และนิยามของคำว่าเสร็จ ตกลงเป็นลายลักษณ์อักษรก่อนมีโค้ดแม้แต่บรรทัดเดียว" },
      { title: "สร้างโดยมี AI ช่วย", body: "AI ช่วยร่าง อธิบาย และเร่งงาน ส่วนโครงสร้างคนเป็นผู้ตัดสินใจ และอ่านทุกการเปลี่ยนแปลง" },
      { title: "รีวิว", body: "ตรวจทุก Diff ทั้งความถูกต้อง กรณีพิเศษ ความปลอดภัย และผลต่อการออกแบบ" },
      { title: "ทดสอบ", body: "เทสต์อัตโนมัติ Type Check Linting และ QA บนหน้าจอจริงหลายขนาด" },
      { title: "Deploy และทำซ้ำ", body: "Git, CI และ Vercel ทำให้การส่งมอบเป็นเรื่องปกติ ส่วนการใช้งานจริงบอกว่าต้องปรับอะไรต่อ" },
    ],
  },
  ai: {
    eyebrow: "AI ในกล่องเครื่องมือ",
    title: "AI เป็นส่วนหนึ่งของการทำงาน แต่ไม่ใช่ผู้ตัดสินใจ",
    body: "ChatGPT, Claude และ Claude Code รวมถึง Local Model เป็นเครื่องมือที่ใช้ทุกวัน เหมือน Editor ดี ๆ หรือ Test Runner ช่วยให้งานเร็วและละเอียดขึ้น แต่ไม่ได้มาแทนวิจารณญาณ",
    helpsTitle: "AI ช่วยตรงไหน",
    helps: ["ค้นคว้าและอ่านโค้ดที่ไม่คุ้นเคย", "วางแผนและแตกงานย่อย", "ร่างโค้ด", "Debug และไล่หา Error", "รีวิว Diff", "เขียนเทสต์", "ทำงานซ้ำ ๆ ให้อัตโนมัติ"],
    staysTitle: "สิ่งที่คนยังรับผิดชอบเอง",
    stays: [
      { title: "สถาปัตยกรรม", body: "โครงสร้างของระบบเป็นแบบไหน และเพราะอะไร" },
      { title: "การตัดสินใจด้านความปลอดภัย", body: "การจัดการข้อมูล Secret สิทธิ์การเข้าถึง และ Validation" },
      { title: "ตรวจสอบบน Production", body: "เช็กว่าสิ่งที่ส่งขึ้นไปใช้งานได้จริง" },
    ],
  },
  working: {
    eyebrow: "ในทีม",
    title: "สิ่งที่คาดหวังได้",
    items: [
      { title: "สื่อสารชัดเจน", body: "ถามเมื่ออะไรไม่ชัด จดสิ่งที่ตกลงกันไว้เป็นลายลักษณ์อักษร และทำให้เห็นความคืบหน้าเสมอ" },
      { title: "รับผิดชอบจนจบ", body: "ตั้งแต่กำหนดความต้องการจนถึง Deploy ดูแลงานชิ้นหนึ่งจนจบ ไม่หยุดตรงจุดส่งต่อ" },
      { title: "เรียนรู้เร็วและตรงไปตรงมา", body: "เรียนรู้เครื่องมือใหม่ได้เร็ว และบอกชัดเจนว่าอะไรยังไม่เคยทำ" },
      { title: "ตอบตรง ๆ", body: "ถ้าอะไรมีความเสี่ยงหรือเกินความสามารถ คุณจะรู้ตั้งแต่เนิ่น ๆ" },
    ],
  },
  closing: {
    title: "เปิดรับโอกาสทำงานในสาย IT, Web และงานดิจิทัลที่ใช้ AI",
    body: "ตำแหน่ง Junior งาน Quereinsteiger ฝึกงาน หรืองานร่วมมือ เขียนมาได้เลย แล้วจะตอบกลับว่าประสบการณ์เข้ากันได้อย่างไร",
  },
};

export const aboutContent: Localized<AboutContent> = { en, de, th };
