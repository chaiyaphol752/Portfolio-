import type { Localized } from "@/i18n/config";

const en = {
  meta: {
    title: "Journey",
    description:
      "How a web developer thinks and works: principles, workflow, and how AI fits in while human judgment stays in control.",
  },
  hero: {
    eyebrow: "Journey",
    complexity: "Complexity",
    titleA: "How I think,",
    titleAccent: "how I build.",
    lede: "A web developer's approach to projects: clear thinking first, fast tools second, and careful verification at every step.",
  },
  story: {
    eyebrow: "Who I am",
    statement: "I'm a web developer who cares about the whole path, from the first idea to a product that's live and dependable.",
    paragraphs: [
      "I design and build the interface people see, the backend that keeps it reliable, and the deployment that puts it in front of users. I like work where those parts have to fit together.",
      "AI tools are part of my daily workflow. I use them to research, draft and review faster, while the decisions about what to build and whether it's good enough stay with me.",
    ],
  },
  layers: {
    eyebrow: "The craft in layers",
    title: "Five layers I build on",
    intro: "Not a résumé. The layers of skill that every project I take on rests on.",
    tag: "Layer",
    items: [
      { title: "Fundamentals", text: "HTML, CSS and JavaScript understood properly: semantics, layout, the browser and the network. Frameworks come and go; this part stays." },
      { title: "Real interfaces", text: "Responsive, accessible components that hold up on a small phone and a wide monitor, with typography and spacing treated as design, not decoration." },
      { title: "Full-stack thinking", text: "APIs, validation, databases and deployment, so a feature is finished when it works in production, not when it renders on my machine." },
      { title: "AI-native workflow", text: "Agentic coding tools for research, prototyping, review and refactoring, always paired with tests and human verification." },
      { title: "Production habits", text: "Git history that tells a story, automated checks, documentation and code the next person can read and change." },
    ],
  },
  principles: {
    eyebrow: "Principles",
    title: "Principles I work by",
    items: [
      { title: "Clarity before cleverness", text: "If a simpler solution does the job, it wins. Clever code is a cost someone else pays later." },
      { title: "Responsive by default", text: "Mobile is a design surface of its own, not a squeezed desktop layout. Every screen size gets deliberate decisions." },
      { title: "Small steps, verified often", text: "Work in pieces small enough to review, test and ship. Problems surface early, when they're cheap." },
      { title: "Accessible and fast is the baseline", text: "Keyboard access, contrast, semantics and performance are part of “done”, not a later polish pass." },
      { title: "Leave it maintainable", text: "Clear structure, honest naming and short documentation, so a project can keep growing after the handover." },
    ],
  },
  workflow: {
    eyebrow: "Workflow",
    title: "How a project runs",
    intro: "A simple rhythm that keeps communication clear and surprises rare.",
    outcomeLabel: "Outcome",
    items: [
      { title: "Listen and scope", text: "We talk through goals, users and constraints. I ask the questions that turn a wish into a scope.", outcome: "A short written scope and a first plan" },
      { title: "Plan the solid core", text: "Pick the smallest version that delivers real value, and decide the stack and structure for it.", outcome: "Agreed priorities and architecture" },
      { title: "Build in reviewable steps", text: "Working increments you can see and respond to, with tests and checks running along the way.", outcome: "Regular, demonstrable progress" },
      { title: "Launch and iterate", text: "Deploy, verify in production, document, then improve based on what real use shows.", outcome: "A live product and a clear next list" },
    ],
  },
  mindset: {
    eyebrow: "Mindset",
    quote: "Understand the problem before the ticket, measure before optimizing, and write code the next person can read.",
    points: [
      "Prefer proven tools where they fit, new ones where they clearly win.",
      "Measure performance instead of guessing about it.",
      "Treat edge cases and error states as part of the design.",
      "Explain decisions in plain language, to clients as well as engineers.",
    ],
  },
  ai: {
    eyebrow: "Where AI fits",
    title: "AI accelerates the workflow.",
    accent: "Judgment controls the outcome.",
    lede: "AI agents are fast collaborators. They don't replace understanding what's being built or why.",
    helpsTitle: "AI helps with",
    helps: [
      "Researching options and reading unfamiliar code",
      "Drafting components, tests and documentation",
      "Exploring architecture alternatives",
      "Refactoring and first-pass code review",
      "Automating repetitive tasks",
    ],
    ownTitle: "I stay responsible for",
    owns: [
      "Framing the problem and the scope",
      "Architecture and trade-off decisions",
      "Security, privacy and data handling",
      "Reading, testing and verifying every change",
      "Deciding when something is good enough to ship",
    ],
  },
  balance: {
    eyebrow: "Speed and quality",
    title: "Fast where it's safe, slow where it matters.",
    fastTitle: "Where I move fast",
    fast: [
      "Scaffolding and boilerplate",
      "Exploring alternatives and prototypes",
      "Repetitive refactors with tests as a safety net",
      "Documentation drafts",
    ],
    slowTitle: "Where I slow down",
    slow: [
      "Data models and security boundaries",
      "Accessibility and real-device behavior",
      "Anything touching payments or personal data",
      "Final review before production",
    ],
    closing: "Speed is only useful when what ships is correct, so verification is never the step that gets skipped.",
  },
};

export type AboutContent = typeof en;

const de: AboutContent = {
  meta: {
    title: "Werdegang",
    description:
      "Wie Webentwicklung hier gedacht und umgesetzt wird: Prinzipien, Ablauf und die Rolle von KI, während das menschliche Urteil die Kontrolle behält.",
  },
  hero: {
    eyebrow: "Werdegang",
    complexity: "Komplexität",
    titleA: "Wie ich denke,",
    titleAccent: "wie ich baue.",
    lede: "Die Herangehensweise an Webprojekte: erst klar denken, dann schnelle Werkzeuge einsetzen und jeden Schritt sorgfältig prüfen.",
  },
  story: {
    eyebrow: "Wer ich bin",
    statement: "Mich interessiert der gesamte Weg: von der ersten Idee bis zu einem Produkt, das live und verlässlich läuft.",
    paragraphs: [
      "Ich gestalte und baue die Oberfläche, die Menschen sehen, das Backend, das sie zuverlässig macht, und das Deployment, das sie zu den Nutzenden bringt. Am liebsten arbeite ich dort, wo diese Teile zusammenpassen müssen.",
      "KI-Werkzeuge gehören zu meinem Alltag. Ich nutze sie, um schneller zu recherchieren, zu entwerfen und zu prüfen. Die Entscheidung, was gebaut wird und ob es gut genug ist, bleibt bei mir.",
    ],
  },
  layers: {
    eyebrow: "Handwerk in Schichten",
    title: "Fünf Schichten, auf denen ich aufbaue",
    intro: "Kein Lebenslauf, sondern die Fähigkeiten, auf denen jedes Projekt ruht.",
    tag: "Schicht",
    items: [
      { title: "Grundlagen", text: "HTML, CSS und JavaScript richtig verstanden: Semantik, Layout, Browser und Netzwerk. Frameworks kommen und gehen, dieses Fundament bleibt." },
      { title: "Echte Oberflächen", text: "Responsive, barrierefreie Komponenten, die auf dem kleinen Smartphone wie auf dem breiten Monitor tragen. Typografie und Abstände sind Gestaltung, keine Dekoration." },
      { title: "Full-Stack-Denken", text: "APIs, Validierung, Datenbanken und Deployment: Eine Funktion ist fertig, wenn sie in Produktion läuft, nicht wenn sie auf dem eigenen Rechner erscheint." },
      { title: "KI-nativer Workflow", text: "Agentische Coding-Werkzeuge für Recherche, Prototyping, Review und Refactoring, immer gekoppelt mit Tests und menschlicher Prüfung." },
      { title: "Produktionsroutine", text: "Eine Git-Historie, die eine Geschichte erzählt, automatisierte Prüfungen, Dokumentation und Code, den die nächste Person lesen und ändern kann." },
    ],
  },
  principles: {
    eyebrow: "Prinzipien",
    title: "Wonach ich arbeite",
    items: [
      { title: "Klarheit vor Cleverness", text: "Wenn die einfachere Lösung reicht, gewinnt sie. Clever geschriebener Code ist eine Last, die später jemand anderes trägt." },
      { title: "Responsive als Standard", text: "Mobil ist eine eigene Gestaltungsfläche, kein gequetschtes Desktop-Layout. Jede Bildschirmgröße bekommt bewusste Entscheidungen." },
      { title: "Kleine Schritte, oft geprüft", text: "Ich arbeite in Stücken, die sich prüfen, testen und ausliefern lassen. Probleme zeigen sich früh, wenn sie noch wenig kosten." },
      { title: "Barrierefrei und schnell als Basis", text: "Tastaturbedienung, Kontrast, Semantik und Performance gehören zu „fertig“ und sind kein nachträglicher Feinschliff." },
      { title: "Wartbar hinterlassen", text: "Klare Struktur, ehrliche Benennung und kurze Dokumentation, damit ein Projekt nach der Übergabe weiterwachsen kann." },
    ],
  },
  workflow: {
    eyebrow: "Ablauf",
    title: "So läuft ein Projekt",
    intro: "Ein einfacher Rhythmus, der die Kommunikation klar hält und Überraschungen selten macht.",
    outcomeLabel: "Ergebnis",
    items: [
      { title: "Zuhören und eingrenzen", text: "Wir klären Ziele, Nutzende und Rahmenbedingungen. Ich stelle die Fragen, die aus einem Wunsch einen Umfang machen.", outcome: "Ein kurzer, schriftlicher Projektumfang und ein erster Plan" },
      { title: "Den soliden Kern planen", text: "Die kleinste Version mit echtem Nutzen wählen und dafür Stack und Struktur festlegen.", outcome: "Abgestimmte Prioritäten und Architektur" },
      { title: "In prüfbaren Schritten bauen", text: "Lauffähige Zwischenstände, die du sehen und kommentieren kannst, mit laufenden Tests und Prüfungen.", outcome: "Regelmäßiger, vorzeigbarer Fortschritt" },
      { title: "Live gehen und verbessern", text: "Deployen, in Produktion prüfen, dokumentieren und danach anhand der echten Nutzung verbessern.", outcome: "Ein Produkt im Livebetrieb und eine klare Liste der nächsten Schritte" },
    ],
  },
  mindset: {
    eyebrow: "Denkweise",
    quote: "Das Problem verstehen, bevor das Ticket abgearbeitet wird, messen vor dem Optimieren und Code schreiben, den die nächste Person lesen kann.",
    points: [
      "Bewährte Werkzeuge nutzen, wo sie passen, neue dort, wo sie klar gewinnen.",
      "Performance messen, statt sie zu erraten.",
      "Randfälle und Fehlerzustände als Teil des Designs behandeln.",
      "Entscheidungen in einfacher Sprache erklären, für Auftraggebende ebenso wie für Entwickelnde.",
    ],
  },
  ai: {
    eyebrow: "Wo KI ins Spiel kommt",
    title: "KI beschleunigt den Workflow.",
    accent: "Urteilsvermögen steuert das Ergebnis.",
    lede: "KI-Agenten sind schnelle Sparringspartner. Sie ersetzen nicht das Verständnis dafür, was gebaut wird und warum.",
    helpsTitle: "KI unterstützt bei",
    helps: [
      "Optionen recherchieren und unbekannten Code lesen",
      "Komponenten, Tests und Dokumentation entwerfen",
      "Architekturvarianten durchspielen",
      "Refactoring und erster Code-Review",
      "Wiederkehrende Aufgaben automatisieren",
    ],
    ownTitle: "Verantwortlich bleibe ich für",
    owns: [
      "Problemstellung und Umfang",
      "Architektur und Abwägungen",
      "Sicherheit, Datenschutz und Datenumgang",
      "Jede Änderung lesen, testen und prüfen",
      "Die Entscheidung, wann etwas gut genug für den Livegang ist",
    ],
  },
  balance: {
    eyebrow: "Tempo und Qualität",
    title: "Schnell, wo es sicher ist. Langsam, wo es zählt.",
    fastTitle: "Hier bin ich schnell",
    fast: [
      "Gerüste und Boilerplate",
      "Alternativen und Prototypen erkunden",
      "Wiederkehrende Refactorings mit Tests als Sicherheitsnetz",
      "Dokumentationsentwürfe",
    ],
    slowTitle: "Hier nehme ich mir Zeit",
    slow: [
      "Datenmodelle und Sicherheitsgrenzen",
      "Barrierefreiheit und Verhalten auf echten Geräten",
      "Alles rund um Zahlungen oder personenbezogene Daten",
      "Die Abschlussprüfung vor der Produktion",
    ],
    closing: "Tempo nützt nur, wenn das Ausgelieferte stimmt. Deshalb fällt die Prüfung nie weg.",
  },
};

const th: AboutContent = {
  meta: {
    title: "เส้นทาง",
    description: "วิธีคิดและวิธีทำงานของนักพัฒนาเว็บ ทั้งหลักการ ขั้นตอน และบทบาทของ AI ที่มนุษย์ยังเป็นผู้ควบคุมผลลัพธ์",
  },
  hero: {
    eyebrow: "เส้นทาง",
    complexity: "ความซับซ้อน",
    titleA: "วิธีคิด",
    titleAccent: "และวิธีสร้าง",
    lede: "แนวทางการทำโปรเจกต์เว็บ: คิดให้ชัดก่อน ใช้เครื่องมือเร็วเป็นลำดับถัดมา และตรวจสอบอย่างรอบคอบทุกขั้นตอน",
  },
  story: {
    eyebrow: "ตัวตนในงาน",
    statement: "ให้ความสำคัญกับทั้งเส้นทาง ตั้งแต่ไอเดียแรกไปจนถึงผลิตภัณฑ์ที่เปิดใช้งานจริงและไว้ใจได้",
    paragraphs: [
      "ออกแบบและสร้างทั้งส่วนหน้าที่ผู้ใช้เห็น แบ็กเอนด์ที่ทำให้ระบบเชื่อถือได้ และการดีพลอยที่ส่งงานถึงมือผู้ใช้ ชอบงานที่ทุกส่วนต้องเข้ากันอย่างลงตัว",
      "เครื่องมือ AI เป็นส่วนหนึ่งของการทำงานประจำวัน ใช้เพื่อค้นคว้า ร่าง และตรวจงานได้เร็วขึ้น ส่วนการตัดสินใจว่าจะสร้างอะไรและดีพอหรือยังนั้นยังเป็นของมนุษย์เสมอ",
    ],
  },
  layers: {
    eyebrow: "งานฝีมือเป็นชั้น ๆ",
    title: "ห้าชั้นที่ทุกโปรเจกต์ตั้งอยู่บน",
    intro: "ไม่ใช่เรซูเม่ แต่เป็นชั้นของทักษะที่รองรับทุกโปรเจกต์",
    tag: "ชั้นที่",
    items: [
      { title: "พื้นฐาน", text: "เข้าใจ HTML, CSS และ JavaScript อย่างถูกต้อง ทั้งความหมายของโครงสร้าง เลย์เอาต์ เบราว์เซอร์ และเครือข่าย เฟรมเวิร์กเปลี่ยนไปเรื่อย ๆ แต่พื้นฐานนี้ยังอยู่" },
      { title: "อินเทอร์เฟซที่ใช้งานจริง", text: "คอมโพเนนต์ที่ responsive และเข้าถึงได้ รองรับตั้งแต่มือถือจอเล็กถึงจอมอนิเตอร์กว้าง โดยมองตัวอักษรและระยะห่างเป็นงานออกแบบ ไม่ใช่เครื่องประดับ" },
      { title: "คิดแบบ full-stack", text: "API การตรวจสอบข้อมูล ฐานข้อมูล และการดีพลอย ฟีเจอร์ถือว่าเสร็จเมื่อทำงานบนระบบจริง ไม่ใช่แค่แสดงผลได้บนเครื่องตัวเอง" },
      { title: "เวิร์กโฟลว์แบบ AI-native", text: "ใช้เครื่องมือเขียนโค้ดแบบเอเจนต์สำหรับค้นคว้า ทำต้นแบบ ตรวจทาน และรีแฟกเตอร์ โดยจับคู่กับการทดสอบและการตรวจสอบโดยมนุษย์เสมอ" },
      { title: "นิสัยแบบระบบจริง", text: "ประวัติ Git ที่เล่าเรื่องได้ การตรวจสอบอัตโนมัติ เอกสารประกอบ และโค้ดที่คนถัดไปอ่านและแก้ไขต่อได้" },
    ],
  },
  principles: {
    eyebrow: "หลักการ",
    title: "หลักที่ใช้ทำงาน",
    items: [
      { title: "ชัดเจนก่อนฉลาดล้ำ", text: "ถ้าวิธีที่เรียบง่ายกว่าแก้ปัญหาได้ วิธีนั้นชนะ โค้ดที่ฉลาดเกินจำเป็นคือต้นทุนที่คนอื่นต้องจ่ายทีหลัง" },
      { title: "Responsive เป็นค่าเริ่มต้น", text: "มือถือคือพื้นที่ออกแบบของตัวเอง ไม่ใช่เลย์เอาต์เดสก์ท็อปที่ถูกบีบลงมา ทุกขนาดหน้าจอได้รับการตัดสินใจอย่างตั้งใจ" },
      { title: "ก้าวเล็ก ตรวจบ่อย", text: "ทำงานเป็นชิ้นที่ตรวจ ทดสอบ และส่งมอบได้ ปัญหาจะโผล่เร็วตอนที่ยังแก้ได้ไม่แพง" },
      { title: "เข้าถึงได้และเร็วคือมาตรฐานขั้นต่ำ", text: "การใช้งานด้วยคีย์บอร์ด คอนทราสต์ โครงสร้างที่มีความหมาย และประสิทธิภาพ เป็นส่วนหนึ่งของคำว่าเสร็จ ไม่ใช่งานขัดเกลาทีหลัง" },
      { title: "ทิ้งไว้ให้ดูแลต่อได้", text: "โครงสร้างชัด ตั้งชื่อตรงไปตรงมา และมีเอกสารสั้น ๆ เพื่อให้โปรเจกต์เติบโตต่อได้หลังส่งมอบ" },
    ],
  },
  workflow: {
    eyebrow: "ขั้นตอนการทำงาน",
    title: "โปรเจกต์ดำเนินไปอย่างไร",
    intro: "จังหวะการทำงานเรียบง่ายที่ช่วยให้การสื่อสารชัดเจนและเกิดเรื่องไม่คาดคิดน้อย",
    outcomeLabel: "ผลลัพธ์",
    items: [
      { title: "ฟังและกำหนดขอบเขต", text: "คุยเรื่องเป้าหมาย ผู้ใช้ และข้อจำกัด ถามคำถามที่เปลี่ยนความต้องการให้เป็นขอบเขตงาน", outcome: "ขอบเขตงานสั้น ๆ เป็นลายลักษณ์อักษรและแผนแรก" },
      { title: "วางแผนแกนหลักที่แข็งแรง", text: "เลือกเวอร์ชันเล็กที่สุดที่สร้างคุณค่าจริง แล้วกำหนดสแตกและโครงสร้างให้เหมาะ", outcome: "ลำดับความสำคัญและสถาปัตยกรรมที่ตกลงร่วมกัน" },
      { title: "สร้างเป็นขั้นที่ตรวจทานได้", text: "ส่งมอบงานที่ใช้งานได้เป็นช่วง ๆ ให้ดูและให้ความเห็นได้ พร้อมการทดสอบและการตรวจสอบที่ทำงานไปด้วยกัน", outcome: "ความคืบหน้าที่เห็นได้จริงอย่างสม่ำเสมอ" },
      { title: "เปิดใช้งานและปรับปรุงต่อ", text: "ดีพลอย ตรวจสอบบนระบบจริง จัดทำเอกสาร แล้วปรับปรุงตามสิ่งที่การใช้งานจริงบอก", outcome: "ผลิตภัณฑ์ที่ใช้งานจริงและรายการสิ่งที่จะทำต่อ" },
    ],
  },
  mindset: {
    eyebrow: "แนวคิด",
    quote: "เข้าใจปัญหาก่อนลงมือทำตามงานที่ได้รับ วัดผลก่อนปรับแต่ง และเขียนโค้ดที่คนถัดไปอ่านรู้เรื่อง",
    points: [
      "ใช้เครื่องมือที่พิสูจน์แล้วเมื่อเหมาะสม และใช้ของใหม่เมื่อดีกว่าอย่างชัดเจน",
      "วัดประสิทธิภาพแทนการเดา",
      "มองกรณีขอบและสถานะข้อผิดพลาดเป็นส่วนหนึ่งของการออกแบบ",
      "อธิบายการตัดสินใจด้วยภาษาเข้าใจง่าย ทั้งกับลูกค้าและกับวิศวกร",
    ],
  },
  ai: {
    eyebrow: "AI อยู่ตรงไหน",
    title: "AI เร่งกระบวนการทำงาน",
    accent: "วิจารณญาณของมนุษย์กำหนดผลลัพธ์",
    lede: "เอเจนต์ AI คือผู้ช่วยที่รวดเร็ว แต่ไม่ได้มาแทนความเข้าใจว่ากำลังสร้างอะไรและเพื่ออะไร",
    helpsTitle: "AI ช่วยเรื่อง",
    helps: [
      "ค้นหาทางเลือกและอ่านโค้ดที่ไม่คุ้นเคย",
      "ร่างคอมโพเนนต์ การทดสอบ และเอกสาร",
      "ลองเปรียบเทียบแนวทางสถาปัตยกรรม",
      "รีแฟกเตอร์และตรวจโค้ดรอบแรก",
      "ทำงานซ้ำ ๆ ให้อัตโนมัติ",
    ],
    ownTitle: "ส่วนที่มนุษย์รับผิดชอบเอง",
    owns: [
      "การตั้งโจทย์และกำหนดขอบเขต",
      "การตัดสินใจเรื่องสถาปัตยกรรมและข้อแลกเปลี่ยน",
      "ความปลอดภัย ความเป็นส่วนตัว และการจัดการข้อมูล",
      "อ่าน ทดสอบ และตรวจสอบทุกการเปลี่ยนแปลง",
      "ตัดสินว่าเมื่อไรดีพอจะขึ้นระบบจริง",
    ],
  },
  balance: {
    eyebrow: "ความเร็วและคุณภาพ",
    title: "เร็วในจุดที่ปลอดภัย ช้าลงในจุดที่สำคัญ",
    fastTitle: "จุดที่ทำได้เร็ว",
    fast: [
      "โครงเริ่มต้นและโค้ดพื้นฐาน",
      "สำรวจทางเลือกและทำต้นแบบ",
      "รีแฟกเตอร์ซ้ำ ๆ โดยมีการทดสอบเป็นตาข่ายนิรภัย",
      "ร่างเอกสาร",
    ],
    slowTitle: "จุดที่ต้องช้าลง",
    slow: [
      "โมเดลข้อมูลและขอบเขตความปลอดภัย",
      "การเข้าถึงได้และพฤติกรรมบนอุปกรณ์จริง",
      "ทุกอย่างที่เกี่ยวกับการชำระเงินหรือข้อมูลส่วนบุคคล",
      "การตรวจรอบสุดท้ายก่อนขึ้นระบบจริง",
    ],
    closing: "ความเร็วมีประโยชน์ต่อเมื่อสิ่งที่ส่งมอบถูกต้อง ดังนั้นการตรวจสอบจึงไม่ใช่ขั้นตอนที่ถูกข้าม",
  },
};

export const aboutContent: Localized<AboutContent> = { en, de, th };
