export const MIN_WIDTH = 320;
export const MAX_WIDTH = 1600;

export const DEVICE_PRESETS = [
  { id: "phone", width: 360 },
  { id: "phoneLarge", width: 430 },
  { id: "tablet", width: 768 },
  { id: "laptop", width: 1280 },
  { id: "desktop", width: 1536 },
] as const;

export type DevicePresetId = (typeof DEVICE_PRESETS)[number]["id"];

export function clampWidth(width: number): number {
  if (!Number.isFinite(width)) return MIN_WIDTH;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(width)));
}

/** Parses user-typed widths such as "768", "768px" or " 1024 ". */
export function parseWidth(text: string): number | null {
  const match = /^\s*(\d{2,4})(?:\s*px)?\s*$/i.exec(text);
  return match ? clampWidth(Number(match[1])) : null;
}

/** Mirrors Tailwind's container-query sizes so the label matches the CSS that actually applies. */
export const CONTAINER_BREAKPOINTS = [
  { name: "@xs", min: 320 },
  { name: "@sm", min: 384 },
  { name: "@md", min: 448 },
  { name: "@lg", min: 512 },
  { name: "@xl", min: 576 },
  { name: "@2xl", min: 672 },
  { name: "@3xl", min: 768 },
  { name: "@4xl", min: 896 },
  { name: "@5xl", min: 1024 },
] as const;

export function activeBreakpoint(width: number): string {
  let active: string = "base";
  for (const bp of CONTAINER_BREAKPOINTS) if (width >= bp.min) active = bp.name;
  return active;
}

/** Number of feature columns the sample layout shows at this container width. */
export function sampleColumns(width: number): 1 | 2 | 3 {
  if (width >= 768) return 3;
  if (width >= 448) return 2;
  return 1;
}

/** Scale factor that makes a frame of `width` fit into `available` pixels (never enlarges). */
export function fitScale(width: number, available: number): number {
  if (width <= 0 || available <= 0) return 1;
  return Math.min(1, available / width);
}
