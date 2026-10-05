import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Noto_Sans_Thai } from "next/font/google";
import { locales, localeMeta } from "@/i18n/config";
import { common } from "@/content/common";
import { profile } from "@/config/profile";
import { resolveLocale } from "@/lib/locale";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { CommandPalette } from "@/components/shell/CommandPalette";
import "../globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const thai = Noto_Sans_Thai({ subsets: ["thai", "latin"], variable: "--font-thai", display: "swap" });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#0c0e13", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} — ${profile.headline}`, template: `%s — ${profile.name}` },
  applicationName: `${profile.name} — Portfolio`,
  authors: [{ name: profile.name, url: profile.links.github }],
  robots: { index: true, follow: true },
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = common[locale];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.siteUrl,
    jobTitle: "AI-assisted Digital Builder (IT Quereinsteiger)",
    email: `mailto:${profile.contact.email}`,
    telephone: profile.contact.phone.display,
    knowsAbout: ["Web development", "Next.js", "TypeScript", "Python", "AI-assisted development", "Git workflows", "Automation", "Prototyping"],
    sameAs: [profile.links.github, profile.links.linkedin, ...profile.links.freelance.map((f) => f.url)].filter(Boolean),
  };

  return (
    <html lang={localeMeta[locale].htmlLang} className={`${geist.variable} ${geistMono.variable} ${serif.variable} ${thai.variable}`}>
      <body>
        <a
          href="#main"
          className="skip-link"
        >
          {t.skipToContent}
        </a>
        <Header locale={locale} t={t} brandName={profile.shortName} monogram={profile.monogram} available={profile.availability === "open"} />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer locale={locale} />
        <CommandPalette locale={locale} t={t} githubUrl={profile.links.github} sourceUrl={profile.sourceRepo} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
