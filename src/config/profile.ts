/**
 * Single source of truth for personal information.
 * Everything marked PLACEHOLDER should be replaced before sending the site to clients.
 */
export const profile = {
  /** PLACEHOLDER: confirm the name you want shown publicly. */
  name: "Chaiyaphol",
  shortName: "Chaiyaphol",
  /** Two-letter monogram used in the brand mark. */
  monogram: "C",
  availability: "open" as "open" | "limited" | "closed",
  /** PLACEHOLDER: city / country shown in the footer and About page. */
  location: { en: "Thailand", de: "Thailand", th: "ประเทศไทย" },
  timezone: "Asia/Bangkok",
  /**
   * PLACEHOLDER: public contact email. Leave `undefined` to hide mailto links;
   * the contact form remains the primary channel.
   */
  email: undefined as string | undefined,
  links: {
    github: "https://github.com/chaiyaphol752",
    /** PLACEHOLDER: add your LinkedIn URL, or leave undefined to hide it. */
    linkedin: undefined as string | undefined,
    /** PLACEHOLDER: add freelance profile URLs, e.g. { label: "Upwork", url: "..." }. */
    freelance: [] as { label: string; url: string }[],
  },
  githubUsername: "chaiyaphol752",
  /** Repository that contains this site's source (shown on Page 09). */
  sourceRepo: "https://github.com/chaiyaphol752/Portfolio-",
  /** PLACEHOLDER: optional portrait at /public/profile.jpg. */
  profileImage: undefined as string | undefined,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export type Profile = typeof profile;
