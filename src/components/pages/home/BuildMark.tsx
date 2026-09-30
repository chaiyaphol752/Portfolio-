const POINTS = [
  { x: 70, y: 380, label: { dx: 0, dy: 30 } },
  { x: 150, y: 290, label: { dx: 0, dy: 30 } },
  { x: 250, y: 200, label: { dx: 0, dy: 30 } },
  { x: 340, y: 110, label: { dx: -28, dy: -26 } },
] as const;

/** Stepped build path: the same staircase idea as the 01–09 structure of the site. */
export function BuildMark({ alt, nodes }: { alt: string; nodes: readonly string[] }) {
  const path = POINTS.map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `H${p.x} V${p.y}`)).join(" ");
  const grid = [60, 120, 180, 240, 300, 360];
  return (
    <svg viewBox="0 0 420 460" role="img" aria-label={alt} className="h-auto w-full max-w-[26rem] overflow-visible">
      <rect x="0.5" y="0.5" width="419" height="459" className="fill-none stroke-ink" strokeWidth="1" />
      {grid.map((g) => (
        <g key={g} className="stroke-line" strokeWidth="1">
          <line x1={g} y1="0" x2={g} y2="460" />
          <line x1="0" y1={g + 40} x2="420" y2={g + 40} />
        </g>
      ))}
      <circle cx="210" cy="230" r="170" className="fill-none stroke-ink" strokeWidth="1" />
      <path d={path} className="fill-none stroke-ink" strokeWidth="1.5" />
      {POINTS.map((p, i) => {
        const last = i === POINTS.length - 1;
        return (
          <g key={i}>
            {last && <circle cx={p.x} cy={p.y} r="15" className="fill-none stroke-accent" strokeWidth="1" />}
            <circle cx={p.x} cy={p.y} r={last ? 6 : 5} className={last ? "fill-accent stroke-accent" : "fill-paper stroke-ink"} strokeWidth="1.5" />
            <text
              x={p.x + p.label.dx}
              y={p.y + p.label.dy}
              fontSize="11"
              letterSpacing="0.06em"
              className="fill-ink-3"
              style={{ fontFamily: "var(--font-geist-mono), var(--font-thai), monospace" }}
            >
              {String(i + 1).padStart(2, "0")} {nodes[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
