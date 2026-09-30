export interface Rgb {
  r: number;
  g: number;
  b: number;
}
export interface Hsl {
  h: number;
  s: number;
  l: number;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Accepts #abc, abc, #aabbcc, aabbcc. Returns null for anything else. */
export function parseHex(input: string): Rgb | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim());
  if (!match) return null;
  let hex = match[1] as string;
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
  const n = Number.parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function toHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l: l * 100 };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r1, g1, b1] =
    hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x] : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x];
  const m = ln - c / 2;
  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
}

/** WCAG 2.x relative luminance. */
export function luminance({ r, g, b }: Rgb): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export type WcagLevel = "AAA" | "AA" | "AA-large" | "fail";

export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-large";
  return "fail";
}

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/** Target lightness (%) for each step; the base colour replaces the nearest one. */
const LIGHTNESS_RAMP = [97, 93, 85, 75, 64, 54, 45, 36, 28, 20, 13];

export interface ScaleStop {
  step: number;
  hex: string;
  isBase: boolean;
}

/** Generates an 11-step tonal scale that keeps the hue and lands the base colour exactly on its nearest step. */
export function generateScale(baseHex: string): ScaleStop[] {
  const rgb = parseHex(baseHex);
  if (!rgb) return [];
  const base = rgbToHsl(rgb);
  let baseIndex = 0;
  LIGHTNESS_RAMP.forEach((l, index) => {
    if (Math.abs(l - base.l) < Math.abs((LIGHTNESS_RAMP[baseIndex] as number) - base.l)) baseIndex = index;
  });
  return SCALE_STEPS.map((step, index) => {
    if (index === baseIndex) return { step, hex: toHex(rgb), isBase: true };
    const l = LIGHTNESS_RAMP[index] as number;
    // Very light and very dark tones look cleaner with slightly less saturation.
    const saturation = base.s * (0.6 + 0.4 * (1 - Math.abs(l - 50) / 50));
    return { step, hex: toHex(hslToRgb({ h: base.h, s: saturation, l })), isBase: false };
  });
}

export function slugifyTokenName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "brand";
}

export type TokenFormat = "css" | "tailwind" | "json";

export function tokensToText(name: string, scale: ScaleStop[], format: TokenFormat): string {
  const slug = slugifyTokenName(name);
  if (format === "json") {
    return JSON.stringify({ [slug]: Object.fromEntries(scale.map((s) => [String(s.step), s.hex])) }, null, 2);
  }
  const lines = scale.map((s) => `  --color-${slug}-${s.step}: ${s.hex};`).join("\n");
  return format === "tailwind" ? `@theme {\n${lines}\n}` : `:root {\n${lines}\n}`;
}

/** Black or white, whichever reads better on the given background. */
export function readableOn(bg: Rgb): "#101114" | "#ffffff" {
  return contrastRatio(bg, { r: 255, g: 255, b: 255 }) >= contrastRatio(bg, { r: 16, g: 17, b: 20 }) ? "#ffffff" : "#101114";
}
