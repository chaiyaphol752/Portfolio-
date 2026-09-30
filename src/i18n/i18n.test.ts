import { describe, expect, it } from "vitest";
import { isLocale, matchLocale } from "./config";
import { alternatesFor, localizedPath, parsePathname, switchLocalePath } from "./routing";
import { interpolate } from "@/lib/interpolate";
import { common } from "@/content/common";
import { pageIds } from "@/config/pages";

describe("locale detection", () => {
  it("recognises supported locales only", () => {
    expect(isLocale("th")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
  it("honours Accept-Language quality values", () => {
    expect(matchLocale("fr;q=0.9, de;q=0.8, en;q=0.5")).toBe("de");
    expect(matchLocale("th-TH,th;q=0.9,en;q=0.8")).toBe("th");
  });
  it("falls back to English", () => {
    expect(matchLocale("fr-FR,es;q=0.8")).toBe("en");
    expect(matchLocale(null)).toBe("en");
  });
});

describe("routing", () => {
  it("builds localized paths", () => {
    expect(localizedPath("de", "")).toBe("/de");
    expect(localizedPath("th", "about")).toBe("/th/about");
    expect(localizedPath("en", "/lab/")).toBe("/en/lab");
  });
  it("parses pathnames", () => {
    expect(parsePathname("/de/case-studies")).toEqual({ locale: "de", slug: "case-studies" });
    expect(parsePathname("/about")).toEqual({ locale: null, slug: "about" });
  });
  it("keeps the page when switching language", () => {
    expect(switchLocalePath("/en/skills", "th")).toBe("/th/skills");
    expect(switchLocalePath("/de", "en")).toBe("/en");
  });
  it("lists alternates for every locale", () => {
    expect(alternatesFor("lab")).toEqual({ en: "/en/lab", de: "/de/lab", th: "/th/lab" });
  });
});

describe("shared copy", () => {
  it("interpolates placeholders", () => {
    expect(interpolate("Page {n} of {total}", { n: 2, total: 9 })).toBe("Page 2 of 9");
  });
  it("has a nav label for every page in every locale", () => {
    for (const locale of ["en", "de", "th"] as const) {
      for (const id of pageIds) expect(common[locale].nav[id]).toBeTruthy();
    }
  });
  it("never uses gendered Thai self-reference in shared copy", () => {
    expect(JSON.stringify(common.th)).not.toMatch(/ผม|ดิฉัน|ฉัน|ครับ|ค่ะ/);
  });
});
