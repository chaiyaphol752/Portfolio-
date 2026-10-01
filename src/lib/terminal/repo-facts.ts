import { readdirSync } from "node:fs";
import path from "node:path";
import { locales } from "@/i18n/config";
import { pages } from "@/config/pages";

export interface RepoFacts {
  pages: number;
  languages: number;
  routes: number;
  /** The remaining figures are null when the source tree is not readable at build time. */
  contentModules: number | null;
  apiEndpoints: number | null;
  testFiles: number | null;
  pythonScripts: number | null;
}

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

function count(fn: () => number): number | null {
  try {
    return fn();
  } catch {
    // Source tree unavailable (e.g. trimmed deployment): the UI hides this figure.
    return null;
  }
}

/**
 * Facts derived from the real repository. Called from a statically rendered Server Component,
 * so the file-system reads happen once at build time, never per request.
 */
export function getRepoFacts(): RepoFacts {
  const root = process.cwd();
  const src = path.join(root, "src");
  return {
    pages: pages.length,
    languages: locales.length,
    routes: pages.length * locales.length,
    contentModules: count(() => readdirSync(path.join(src, "content")).filter((f) => /\.ts$/.test(f) && !f.endsWith(".test.ts")).length),
    apiEndpoints: count(() => listFiles(path.join(src, "app", "api")).filter((f) => /route\.ts$/.test(f)).length),
    testFiles: count(() => listFiles(src).filter((f) => /\.test\.tsx?$/.test(f)).length),
    pythonScripts: count(() => readdirSync(path.join(root, "scripts")).filter((f) => f.endsWith(".py")).length),
  };
}
