import type { Localized } from "@/i18n/config";

const en = {
  meta: {
    title: "About",
    description: "A web developer who takes ideas through the full path to production — interface, application logic, backend, APIs and deployment — with AI as part of the engineering environment.",
  },
  hero: {
    eyebrow: "About",
    greeting: "Hi, I'm {name}.",
    title: "I like taking an idea all the way to something people can use.",
    lede: "Not just the mock-up, and not just the code. The whole path: what it should do, how it should feel, how it works underneath, and getting it safely online.",
  },
  facts: {
    title: "At a glance",
    based: "Based in",
    focus: "Focus",
    focusValue: "Websites, web apps, AI integration",
    languages: "This site",
    availability: "Availability",
    contact: "Contact",
    code: "Code",
  },
  path: {
    eyebrow: "What I work on",
    title: "Every layer, so nothing gets lost between them.",
    body: "Most problems in web projects happen at the seams — between design and code, or frontend and backend. Working across all of them keeps those seams small.",
    layers: [
      { title: "Interface", body: "Layout, typography and interaction that hold up on a phone as well as a wide screen." },
      { title: "Application logic", body: "State, forms, edge cases and the error messages nobody plans for." },
      { title: "Backend & data", body: "Server code, validation and databases that keep the data honest." },
      { title: "APIs & integrations", body: "Payments, email, CRMs, AI models — connected and handled when they fail." },
      { title: "Deployment", body: "Git, CI and Vercel, so shipping is routine instead of an event." },
    ],
  },
  ai: {
    eyebrow: "AI in the toolbox",
    title: "AI is part of how I work. It doesn't make the decisions.",
    body: "ChatGPT, Claude and Claude Code, and local models are everyday tools — the same way a good editor or a test runner is. They make the work faster and more thorough. They do not replace judgement.",
    helpsTitle: "Where AI helps",
    helps: ["Research and reading unfamiliar code", "Planning and breaking work down", "Drafting implementation", "Debugging and tracing errors", "Reviewing diffs", "Writing tests", "Automating repetitive steps"],
    staysTitle: "What stays an engineering responsibility",
    stays: [
      { title: "Architecture", body: "How the system is structured and why." },
      { title: "Security decisions", body: "Data handling, secrets, access and validation." },
      { title: "Production verification", body: "Checking that what ships actually works." },
    ],
  },
  working: {
    eyebrow: "Working together",
    title: "What you can expect.",
    items: [
      { title: "Scope in writing", body: "Before work starts, we agree on what will be built and what done means." },
      { title: "Visible progress", body: "Small steps you can see and comment on, instead of one big reveal." },
      { title: "Code you own", body: "Your repository, your hosting, readable code and a documented hand-over." },
      { title: "Straight answers", body: "If something is a bad idea, a risk or out of scope, you'll hear it early." },
    ],
  },
  closing: {
    title: "Have something in mind?",
    body: "Tell me what you're building or what needs fixing. You'll get a clear reply about scope, approach and timing.",
  },
};

export type AboutContent = typeof en;

const de: AboutContent = {
  meta: {
    title: "Über mich",
    description: "Webentwicklung über den ganzen Weg bis zur Produktion – Oberfläche, Anwendungslogik, Backend, APIs und Deployment – mit KI als Teil der Engineering-Umgebung.",
  },
  hero: {
    eyebrow: "Über mich",
    greeting: "Hallo, ich bin {name}.",
    title: "Ich bringe Ideen gern bis zu einem Produkt, das Menschen wirklich nutzen.",
    lede: "Nicht nur das Mock-up und nicht nur den Code. Den ganzen Weg: was es leisten soll, wie es sich anfühlt, wie es technisch funktioniert – und wie es sicher online geht.",
  },
  facts: {
    title: "Auf einen Blick",
    based: "Standort",
    focus: "Schwerpunkt",
    focusValue: "Websites, Web-Apps, KI-Integration",
    languages: "Diese Website",
    availability: "Verfügbarkeit",
    contact: "Kontakt",
    code: "Code",
  },
  path: {
    eyebrow: "Woran ich arbeite",
    title: "Jede Ebene – damit zwischen ihnen nichts verloren geht.",
    body: "Die meisten Probleme in Webprojekten entstehen an den Übergängen – zwischen Design und Code oder zwischen Frontend und Backend. Wer alle Ebenen abdeckt, hält diese Übergänge klein.",
    layers: [
      { title: "Oberfläche", body: "Layout, Typografie und Interaktion, die auf dem Smartphone genauso funktionieren wie auf dem großen Bildschirm." },
      { title: "Anwendungslogik", body: "State, Formulare, Sonderfälle und die Fehlermeldungen, an die niemand denkt." },
      { title: "Backend & Daten", body: "Servercode, Validierung und Datenbanken, die die Daten sauber halten." },
      { title: "APIs & Integrationen", body: "Zahlungen, E-Mail, CRM, KI-Modelle – angebunden und abgesichert, wenn sie ausfallen." },
      { title: "Deployment", body: "Git, CI und Vercel, damit Releases Routine sind und kein Ereignis." },
    ],
  },
  ai: {
    eyebrow: "KI im Werkzeugkasten",
    title: "KI gehört zu meiner Arbeitsweise. Entscheidungen trifft sie nicht.",
    body: "ChatGPT, Claude und Claude Code sowie lokale Modelle sind Alltagswerkzeuge – so wie ein guter Editor oder ein Test-Runner. Sie machen die Arbeit schneller und gründlicher. Urteilsvermögen ersetzen sie nicht.",
    helpsTitle: "Wo KI hilft",
    helps: ["Recherche und fremden Code lesen", "Planen und Aufgaben zerlegen", "Implementierung entwerfen", "Debugging und Fehlersuche", "Diffs reviewen", "Tests schreiben", "Wiederkehrende Schritte automatisieren"],
    staysTitle: "Was in technischer Verantwortung bleibt",
    stays: [
      { title: "Architektur", body: "Wie das System aufgebaut ist und warum." },
      { title: "Sicherheitsentscheidungen", body: "Datenverarbeitung, Secrets, Zugriffe und Validierung." },
      { title: "Prüfung in Produktion", body: "Sicherstellen, dass das Ausgelieferte wirklich funktioniert." },
    ],
  },
  working: {
    eyebrow: "Zusammenarbeit",
    title: "Worauf du dich verlassen kannst.",
    items: [
      { title: "Umfang schriftlich", body: "Vor dem Start klären wir, was gebaut wird und was „fertig“ bedeutet." },
      { title: "Sichtbarer Fortschritt", body: "Kleine Schritte, die du sehen und kommentieren kannst – statt einer großen Enthüllung." },
      { title: "Code gehört dir", body: "Dein Repository, dein Hosting, lesbarer Code und eine dokumentierte Übergabe." },
      { title: "Klare Ansagen", body: "Wenn etwas eine schlechte Idee, ein Risiko oder außerhalb des Umfangs ist, erfährst du es früh." },
    ],
  },
  closing: {
    title: "Schon eine Idee?",
    body: "Erzähl mir, was du baust oder was repariert werden muss. Du bekommst eine klare Antwort zu Umfang, Vorgehen und Zeitplan.",
  },
};

const th: AboutContent = {
  meta: {
    title: "เกี่ยวกับ",
    description: "นักพัฒนาเว็บที่พาไอเดียไปจนถึง Production ครบทุกชั้น ทั้งหน้าจอ Logic ของแอป Backend, API และ Deployment โดยมี AI เป็นส่วนหนึ่งของการทำงาน",
  },
  hero: {
    eyebrow: "เกี่ยวกับ",
    greeting: "สวัสดี นี่คือ {name}",
    title: "ชอบพาไอเดียไปให้ถึงสิ่งที่คนใช้งานได้จริง",
    lede: "ไม่ใช่แค่ Mock-up และไม่ใช่แค่โค้ด แต่ครบทั้งเส้นทาง ตั้งแต่ควรทำอะไร ใช้งานแล้วรู้สึกอย่างไร ทำงานข้างในอย่างไร ไปจนถึงขึ้นออนไลน์อย่างปลอดภัย",
  },
  facts: {
    title: "ข้อมูลโดยย่อ",
    based: "อยู่ที่",
    focus: "งานหลัก",
    focusValue: "เว็บไซต์ เว็บแอป และ AI Integration",
    languages: "เว็บไซต์นี้",
    availability: "สถานะ",
    contact: "ติดต่อ",
    code: "โค้ด",
  },
  path: {
    eyebrow: "งานที่ทำ",
    title: "ทำครบทุกชั้น เพื่อไม่ให้อะไรตกหล่นระหว่างทาง",
    body: "ปัญหาส่วนใหญ่ในโปรเจกต์เว็บเกิดตรงรอยต่อ ระหว่างดีไซน์กับโค้ด หรือระหว่าง Frontend กับ Backend การดูแลครบทุกชั้นทำให้รอยต่อเหล่านั้นเล็กลง",
    layers: [
      { title: "หน้าจอ", body: "Layout ตัวอักษร และ Interaction ที่ใช้ได้ดีทั้งบนมือถือและจอใหญ่" },
      { title: "Logic ของแอป", body: "State ฟอร์ม กรณีพิเศษ และข้อความ Error ที่มักไม่มีใครวางแผนไว้" },
      { title: "Backend และข้อมูล", body: "โค้ดฝั่งเซิร์ฟเวอร์ Validation และฐานข้อมูลที่รักษาข้อมูลให้ถูกต้อง" },
      { title: "API และการเชื่อมต่อ", body: "ระบบชำระเงิน อีเมล CRM โมเดล AI เชื่อมต่อและรับมือได้เมื่อระบบเหล่านั้นล่ม" },
      { title: "Deployment", body: "Git, CI และ Vercel ทำให้การ Release เป็นเรื่องปกติ ไม่ใช่เหตุการณ์ใหญ่" },
    ],
  },
  ai: {
    eyebrow: "AI ในกล่องเครื่องมือ",
    title: "AI เป็นส่วนหนึ่งของการทำงาน แต่ไม่ใช่ผู้ตัดสินใจ",
    body: "ChatGPT, Claude และ Claude Code รวมถึง Local model เป็นเครื่องมือที่ใช้ทุกวัน เหมือน Editor ดี ๆ หรือ Test runner ช่วยให้งานเร็วและละเอียดขึ้น แต่ไม่ได้มาแทนวิจารณญาณ",
    helpsTitle: "AI ช่วยตรงไหน",
    helps: ["ค้นคว้าและอ่านโค้ดที่ไม่คุ้นเคย", "วางแผนและแตกงานย่อย", "ร่างโค้ด", "Debug และไล่หา Error", "รีวิว Diff", "เขียนเทสต์", "ทำงานซ้ำ ๆ ให้อัตโนมัติ"],
    staysTitle: "สิ่งที่ยังเป็นความรับผิดชอบทางวิศวกรรม",
    stays: [
      { title: "สถาปัตยกรรม", body: "โครงสร้างของระบบเป็นแบบไหน และเพราะอะไร" },
      { title: "การตัดสินใจด้านความปลอดภัย", body: "การจัดการข้อมูล Secret สิทธิ์การเข้าถึง และ Validation" },
      { title: "ตรวจสอบบน Production", body: "เช็กว่าสิ่งที่ส่งขึ้นไปใช้งานได้จริง" },
    ],
  },
  working: {
    eyebrow: "ทำงานร่วมกัน",
    title: "สิ่งที่คาดหวังได้",
    items: [
      { title: "ขอบเขตเป็นลายลักษณ์อักษร", body: "ก่อนเริ่มงาน ตกลงกันว่าจะสร้างอะไร และแบบไหนเรียกว่าเสร็จ" },
      { title: "เห็นความคืบหน้า", body: "ทำเป็นช่วงสั้น ๆ ที่ดูและให้ความเห็นได้ ไม่ใช่รอเปิดตัวทีเดียว" },
      { title: "โค้ดเป็นของลูกค้า", body: "Repository และ Hosting เป็นของลูกค้าเอง โค้ดอ่านง่าย พร้อมเอกสารส่งมอบ" },
      { title: "พูดตรง ๆ", body: "ถ้าอะไรไม่ควรทำ มีความเสี่ยง หรือเกินขอบเขต จะบอกตั้งแต่เนิ่น ๆ" },
    ],
  },
  closing: {
    title: "มีโปรเจกต์ในใจไหม",
    body: "เล่ามาว่ากำลังสร้างอะไร หรืออะไรต้องแก้ แล้วจะได้คำตอบที่ชัดเจนเรื่องขอบเขต แนวทาง และระยะเวลา",
  },
};

export const aboutContent: Localized<AboutContent> = { en, de, th };
