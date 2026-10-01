import type { Family } from "./data";

/** Pad swatch per family: shared by the network, legend and example chains. */
export const padClass: Record<Family, string> = {
  web: "bg-ink",
  python: "bg-accent",
  ai: "border-[1.5px] border-accent-ink bg-paper",
  local: "bg-signal",
};
