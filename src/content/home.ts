import type { Localized } from "@/i18n/config";

const en = {
  meta: {
    title: "Web developer × AI-native builder",
    description:
      "Portfolio of a web developer who builds modern, responsive websites and web applications with AI-native engineering workflows, from idea to reliable production software.",
  },
  hero: {
    eyebrow: "Portfolio",
    lineA: "Web developer",
    lineB: "AI-native",
    lineC: "builder",
    value:
      "I build modern web experiences and use AI-native engineering workflows to move efficiently from idea to reliable production software.",
  },
  capabilitiesLabel: "Capabilities",
  capabilities: [
    "Responsive interfaces",
    "Full-stack web apps",
    "APIs & databases",
    "AI-assisted engineering",
    "Accessibility & performance",
    "Testing & deployment",
  ],
  visual: {
    alt: "Diagram of a build path in four steps: idea, plan, build, ship.",
    nodes: ["Idea", "Plan", "Build", "Ship"],
    caption: "From idea to production, one deliberate step at a time.",
  },
  sitemap: {
    eyebrow: "How to read this site",
    title: "Nine pages, each a little more technical.",
    body: "Start with the overview. Go deeper whenever you want proof: interface work, case studies, a working lab, a real backend and a command center.",
    simple: "Simple",
    technical: "Technical",
  },
};

export type HomeContent = typeof en;

const de: HomeContent = {
  meta: {
    title: "Webentwicklung × KI-natives Bauen",
    description:
      "Portfolio für moderne, responsive Websites und Webanwendungen: mit KI-nativen Entwicklungs-Workflows von der Idee bis zur verlässlichen Produktion.",
  },
  hero: {
    eyebrow: "Portfolio",
    lineA: "Webentwicklung",
    lineB: "KI-natives",
    lineC: "Bauen",
    value:
      "Ich baue moderne Web-Erlebnisse und nutze KI-native Entwicklungs-Workflows, um effizient von der Idee zu verlässlicher Produktionssoftware zu kommen.",
  },
  capabilitiesLabel: "Kompetenzen",
  capabilities: [
    "Responsive Oberflächen",
    "Full-Stack-Webanwendungen",
    "APIs & Datenbanken",
    "KI-gestützte Entwicklung",
    "Barrierefreiheit & Performance",
    "Tests & Deployment",
  ],
  visual: {
    alt: "Diagramm eines Bauwegs in vier Schritten: Idee, Plan, Bau, Livegang.",
    nodes: ["Idee", "Plan", "Bau", "Live"],
    caption: "Von der Idee zur Produktion, Schritt für Schritt mit Absicht.",
  },
  sitemap: {
    eyebrow: "So liest sich diese Seite",
    title: "Neun Seiten, jede ein Stück technischer.",
    body: "Beginne mit dem Überblick. Geh tiefer, wenn du Belege sehen willst: Oberflächen, Fallstudien, ein funktionierendes Labor, ein echtes Backend und eine Kommandozentrale.",
    simple: "Einfach",
    technical: "Technisch",
  },
};

const th: HomeContent = {
  meta: {
    title: "นักพัฒนาเว็บ × AI-native builder",
    description:
      "พอร์ตโฟลิโอนักพัฒนาเว็บที่สร้างเว็บไซต์และเว็บแอปสมัยใหม่แบบ responsive ด้วยกระบวนการพัฒนาแบบ AI-native ตั้งแต่ไอเดียจนถึงซอฟต์แวร์ที่พร้อมใช้งานจริง",
  },
  hero: {
    eyebrow: "พอร์ตโฟลิโอ",
    lineA: "นักพัฒนาเว็บ",
    lineB: "AI-native",
    lineC: "builder",
    value:
      "สร้างประสบการณ์เว็บสมัยใหม่ และใช้กระบวนการพัฒนาแบบ AI-native เพื่อเดินจากไอเดียสู่ซอฟต์แวร์ที่เชื่อถือได้อย่างมีประสิทธิภาพ",
  },
  capabilitiesLabel: "ความสามารถ",
  capabilities: [
    "อินเทอร์เฟซ responsive",
    "เว็บแอปแบบ full-stack",
    "API และฐานข้อมูล",
    "การพัฒนาโดยมี AI ช่วย",
    "การเข้าถึงได้และประสิทธิภาพ",
    "การทดสอบและการ deploy",
  ],
  visual: {
    alt: "แผนภาพเส้นทางการสร้างสี่ขั้น: ไอเดีย วางแผน สร้าง เปิดใช้งาน",
    nodes: ["ไอเดีย", "วางแผน", "สร้าง", "เปิดใช้"],
    caption: "จากไอเดียสู่ระบบจริง ทีละขั้นอย่างตั้งใจ",
  },
  sitemap: {
    eyebrow: "วิธีอ่านเว็บไซต์นี้",
    title: "เก้าหน้า แต่ละหน้าลึกขึ้นอีกขั้น",
    body: "เริ่มจากภาพรวม แล้วลงลึกได้ทุกเมื่อที่อยากเห็นหลักฐาน ทั้งงานอินเทอร์เฟซ กรณีศึกษา ห้องทดลองที่ใช้งานได้จริง แบ็กเอนด์จริง และศูนย์ควบคุม",
    simple: "เรียบง่าย",
    technical: "เชิงเทคนิค",
  },
};

export const homeContent: Localized<HomeContent> = { en, de, th };
