import { readdirSync } from "node:fs";
import path from "node:path";
import { locales } from "@/i18n/config";
import { pages } from "@/config/pages";

export interface RepoFacts {
  pages: number;
  languages: number;
  routes: number;
  /** null when the source tree is not readable at build time. */
  contentModules: number | null;
  apiEndpoints: number | null;
}

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

/**
 * Facts derived from the real repository. Called from a statically rendered Server Component,
 * so the file-system reads happen once at build time, never per request.
 */
export function getRepoFacts(): RepoFacts {
  let contentModules: number | null = null;
  let apiEndpoints: number | null = null;
  try {
    const src = path.join(process.cwd(), "src");
    contentModules = readdirSync(path.join(src, "content")).filter((f) => /\.ts$/.test(f) && !f.endsWith(".test.ts")).length;
    apiEndpoints = listFiles(path.join(src, "app", "api")).filter((f) => /route\.ts$/.test(f)).length;
  } catch {
    // Source tree unavailable (e.g. trimmed deployment): the UI hides these two figures.
  }
  return { pages: pages.length, languages: locales.length, routes: pages.length * locales.length, contentModules, apiEndpoints };
}
