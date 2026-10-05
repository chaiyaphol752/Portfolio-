/**
 * Single source of truth for personal and contact information.
 * Components read from here; never repeat these literals elsewhere.
 */
export const profile = {
  name: "Chaiyaphol",
  shortName: "Chaiyaphol",
  monogram: "C",
  /** Positioning line used in metadata and the page header. */
  headline: "AI-assisted Digital Builder · IT Quereinsteiger",
  /** Drives the availability indicator in the header, home page and contact page (employment availability). */
  availability: "open" as "open" | "limited" | "closed",
  location: { en: "Germany", de: "Deutschland", th: "เยอรมนี" },
  contact: {
    email: "chaiyaphol.752@gmail.com",
    phone: { display: "+49 151 54914268", href: "tel:+4915154914268" },
  },
  links: {
    github: "https://github.com/chaiyaphol752",
    /** Add a LinkedIn URL to show it in the footer and contact page. */
    linkedin: undefined as string | undefined,
    /** Additional public profiles (kept empty: no freelance profiles are advertised). */
    freelance: [] as { label: string; url: string }[],
  },
  githubUsername: "chaiyaphol752",
  sourceRepo: "https://github.com/chaiyaphol752/Portfolio-",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const mailtoHref = `mailto:${profile.contact.email}`;

export type Profile = typeof profile;
