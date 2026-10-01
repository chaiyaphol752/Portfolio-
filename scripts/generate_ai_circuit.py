#!/usr/bin/env python3
"""
Generates the AI-native engineering circuit used on the website.

Outputs (both committed, so production never needs a Python runtime):
  src/generated/ai-circuit.json   topology + layout + focus sets for the interactive React/SVG view
  public/generated/ai-circuit.svg standalone static rendering (no-JS fallback, previews)

Layout is computed on a grid and traces are routed orthogonally with 45° chamfered
corners, like copper on a PCB. Output is deterministic: same topology, same bytes.

Usage: python3 scripts/generate_ai_circuit.py
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JSON_OUT = ROOT / "src" / "generated" / "ai-circuit.json"
SVG_OUT = ROOT / "public" / "generated" / "ai-circuit.svg"

# ---------------------------------------------------------------- grid geometry
COL_W = 134  # horizontal pitch between grid columns
ROW_H = 98  # vertical pitch between grid rows
MARGIN_X = 100
MARGIN_Y = 64
NODE_W = 150
NODE_H = 46
CHAMFER = 9  # 45° corner cut, in px
BUS_X = MARGIN_X + 0.62 * COL_W  # vertical agent bus between column 0 and column 1

GROUPS = {
    "human": "Human intent and review",
    "orchestration": "Planning and orchestration",
    "model": "Models: cloud and local",
    "agent": "Specialised agents",
    "tool": "Tools and integrations",
    "data": "Data and private context",
    "quality": "Validation and tests",
    "delivery": "Delivery and production",
}

# Designator prefixes, as on a printed circuit board silkscreen.
PREFIX = {"human": "H", "orchestration": "U", "model": "M", "agent": "A", "tool": "J", "data": "D", "quality": "Q", "delivery": "P"}


@dataclass
class Node:
    id: str
    label: str
    group: str
    col: float
    row: float
    sub: str = ""
    designator: str = ""

    @property
    def x(self) -> float:
        return MARGIN_X + self.col * COL_W

    @property
    def y(self) -> float:
        return MARGIN_Y + self.row * ROW_H

    def port(self, side: str) -> tuple[float, float]:
        if side == "top":
            return (self.x, self.y - NODE_H / 2)
        if side == "bottom":
            return (self.x, self.y + NODE_H / 2)
        if side == "left":
            return (self.x - NODE_W / 2, self.y)
        return (self.x + NODE_W / 2, self.y)


@dataclass
class Edge:
    source: str
    target: str
    kind: str = "signal"  # signal | bus | data | agent-bus | side
    label: str = ""
    points: list[tuple[float, float]] = field(default_factory=list)

    @property
    def id(self) -> str:
        return f"{self.source}--{self.target}"


# ---------------------------------------------------------------- topology
NODES = [
    Node("intent", "Human intent", "human", 4, 0, "goal · constraints"),
    Node("planner", "Planner", "orchestration", 2, 1, "task decomposition"),
    Node("orchestrator", "Orchestrator", "orchestration", 4, 1, "state · checkpoints"),
    Node("research", "Research", "orchestration", 6, 1, "sources · analysis"),
    Node("chatgpt", "ChatGPT", "model", 2, 2, "OpenAI ecosystem"),
    Node("claude", "Claude", "model", 4, 2, "Claude Code"),
    Node("local-ai", "Local AI", "model", 6, 2, "self-hosted models"),
    Node("private-data", "Private data", "data", 8, 2, "documents · files"),
    Node("router", "Tool router", "orchestration", 4, 3, "tool + model routing"),
    Node("embeddings", "Embeddings · RAG", "data", 8, 3, "vector search"),
    Node("design-agent", "Design agent", "agent", 0, 2, "UI · tokens"),
    Node("frontend-agent", "Frontend agent", "agent", 0, 3, "React · Next.js"),
    Node("backend-agent", "Backend agent", "agent", 0, 4, "APIs · data"),
    Node("test-agent", "Test agent", "agent", 0, 5, "unit · e2e"),
    Node("review-agent", "Review agent", "agent", 0, 6, "diff · security"),
    Node("python", "Python", "tool", 2, 4, "scripts · automation"),
    Node("web-api", "Web · API", "tool", 4, 4, "HTTP · webhooks"),
    Node("data", "Data", "data", 6, 4, "transform · parse"),
    Node("github", "GitHub", "tool", 8, 4, "repository · CI"),
    Node("automation", "Automation", "tool", 2, 5, "jobs · pipelines"),
    Node("backend", "Backend", "tool", 4, 5, "server · validation"),
    Node("database", "Database", "data", 6, 5, "PostgreSQL"),
    Node("validation", "Validation · tests", "quality", 4, 6, "types · tests · review"),
    Node("human-review", "Human approval", "human", 6, 6, "verify · decide"),
    Node("vercel", "Deployment", "delivery", 4, 7, "Vercel"),
    Node("production", "Production", "delivery", 4, 8, "live application"),
]

EDGES = [
    Edge("intent", "orchestrator"),
    Edge("planner", "orchestrator", "bus"),
    Edge("orchestrator", "research", "bus"),
    Edge("orchestrator", "chatgpt"),
    Edge("orchestrator", "claude"),
    Edge("orchestrator", "local-ai"),
    Edge("research", "chatgpt"),
    Edge("chatgpt", "router"),
    Edge("claude", "router"),
    Edge("local-ai", "router"),
    Edge("local-ai", "private-data", "data"),
    Edge("private-data", "embeddings", "data"),
    Edge("embeddings", "data", "data"),
    Edge("router", "python"),
    Edge("router", "web-api"),
    Edge("router", "data"),
    Edge("router", "github"),
    Edge("orchestrator", "design-agent", "agent-bus"),
    Edge("orchestrator", "frontend-agent", "agent-bus"),
    Edge("orchestrator", "backend-agent", "agent-bus"),
    Edge("orchestrator", "test-agent", "agent-bus"),
    Edge("orchestrator", "review-agent", "agent-bus"),
    Edge("python", "web-api", "data"),
    Edge("web-api", "data", "data"),
    Edge("python", "automation"),
    Edge("web-api", "backend"),
    Edge("data", "database", "data"),
    Edge("backend", "database", "data"),
    Edge("automation", "validation"),
    Edge("backend", "validation"),
    Edge("database", "human-review"),
    Edge("validation", "human-review", "data"),
    Edge("github", "vercel", "side"),
    Edge("validation", "vercel"),
    Edge("vercel", "production"),
]

# Curated highlight sets: what lights up when a node is selected. Nodes not listed
# fall back to their direct neighbours.
FOCUS = {
    "chatgpt": ["chatgpt", "orchestrator", "research", "router", "web-api", "validation"],
    "python": ["python", "automation", "local-ai", "router", "web-api", "data", "backend", "backend-agent", "test-agent"],
    "local-ai": ["local-ai", "private-data", "embeddings", "python", "router", "orchestrator", "data"],
    "claude": ["claude", "orchestrator", "planner", "router", "frontend-agent", "backend-agent", "test-agent", "review-agent", "github", "validation"],
    "intent": ["intent", "orchestrator", "planner", "human-review", "production"],
    "human-review": ["human-review", "intent", "validation", "database", "vercel"],
    "github": ["github", "router", "vercel", "production", "claude", "review-agent", "validation"],
}

# Extra links that matter for a focus set but are not drawn as separate traces.
FOCUS_LINKS = {
    "python": [("python", "local-ai"), ("python", "backend-agent")],
    "local-ai": [("python", "local-ai")],
    "claude": [("claude", "github")],
}


# ---------------------------------------------------------------- routing
def route(edge: Edge, nodes: dict[str, Node], lane: dict[float, int]) -> list[tuple[float, float]]:
    a, b = nodes[edge.source], nodes[edge.target]

    if edge.kind == "agent-bus":
        # Shared trunk: every agent tap leaves the same orchestrator pad, runs above the
        # planner row, then drops down the bus. Overlapping segments read as one bus.
        sx, sy = a.port("top")
        sx -= NODE_W / 2 - 20
        trunk_y = (nodes["intent"].y + a.y) / 2
        tx, ty = b.port("right")
        return [(sx, sy), (sx, trunk_y), (BUS_X, trunk_y), (BUS_X, ty), (tx, ty)]

    if edge.kind == "side":
        # Elbow into the target's side port: used for long runs down an empty column.
        sx, sy = a.port("bottom")
        tx, ty = b.port("right" if a.x > b.x else "left")
        return [(sx, sy), (sx, ty), (tx, ty)]

    if a.row == b.row:
        left, right = (a, b) if a.col < b.col else (b, a)
        p1, p2 = left.port("right"), right.port("left")
        return [p1, p2] if left is a else [p2, p1]

    if a.col == b.col:
        p1 = a.port("bottom" if b.row > a.row else "top")
        p2 = b.port("top" if b.row > a.row else "bottom")
        return [p1, p2]

    down = b.row > a.row
    sx, sy = a.port("bottom" if down else "top")
    tx, ty = b.port("top" if down else "bottom")
    # Spread parallel horizontal runs into lanes so traces never overlap.
    key = round((sy + ty) / 2)
    offset = lane.get(key, 0)
    lane[key] = offset + 1
    shift = ((offset + 1) // 2) * 8 * (1 if offset % 2 else -1)
    mid = (sy + ty) / 2 + shift
    return [(sx, sy), (sx, mid), (tx, mid), (tx, ty)]


def spread_pins(edges: list[Edge], nodes: dict[str, Node]) -> None:
    """Distributes traces that leave the same port so pads do not stack on one point."""
    by_port: dict[tuple[str, tuple[float, float]], list[Edge]] = {}
    for e in edges:
        for end in (0, -1):
            nid = e.source if end == 0 else e.target
            by_port.setdefault((nid, e.points[end]), []).append(e)
    for (nid, (px, py)), group in by_port.items():
        group = [e for e in group if e.kind != "agent-bus" and e.kind != "side"]
        if len(group) < 2:
            continue
        node = nodes[nid]
        horizontal_port = abs(py - node.y) > 1  # top/bottom port: spread along x
        group.sort(key=lambda e: other_end_x(e, nid, nodes) if horizontal_port else other_end_y(e, nid, nodes))
        n = len(group)
        for i, e in enumerate(group):
            delta = (i - (n - 1) / 2) * (min(22, (NODE_W - 30) / n) if horizontal_port else min(10, (NODE_H - 12) / n))
            end = 0 if e.source == nid and e.points[0] == (px, py) else -1
            pts = e.points
            if horizontal_port:
                pts[end] = (px + delta, py)
                neighbour = 1 if end == 0 else -2
                nx, ny = pts[neighbour]
                if abs(nx - px) < 0.5:
                    pts[neighbour] = (px + delta, ny)
            else:
                pts[end] = (px, py + delta)
                neighbour = 1 if end == 0 else -2
                nx, ny = pts[neighbour]
                if abs(ny - py) < 0.5:
                    pts[neighbour] = (nx, py + delta)


def other_end_x(e: Edge, nid: str, nodes: dict[str, Node]) -> float:
    return nodes[e.target if e.source == nid else e.source].x


def other_end_y(e: Edge, nid: str, nodes: dict[str, Node]) -> float:
    return nodes[e.target if e.source == nid else e.source].y


def simplify(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    out: list[tuple[float, float]] = []
    for p in points:
        p = (round(p[0], 1), round(p[1], 1))
        if out and abs(out[-1][0] - p[0]) < 0.05 and abs(out[-1][1] - p[1]) < 0.05:
            continue
        out.append(p)
    # Drop collinear midpoints.
    i = 1
    while i < len(out) - 1:
        (x0, y0), (x1, y1), (x2, y2) = out[i - 1], out[i], out[i + 1]
        if (abs(x0 - x1) < 0.05 and abs(x1 - x2) < 0.05) or (abs(y0 - y1) < 0.05 and abs(y1 - y2) < 0.05):
            out.pop(i)
        else:
            i += 1
    return out


def chamfered_path(points: list[tuple[float, float]]) -> str:
    """Polyline -> SVG path with 45° corner cuts."""
    if len(points) < 2:
        return ""
    d = [f"M{points[0][0]:g} {points[0][1]:g}"]
    for i in range(1, len(points) - 1):
        (x0, y0), (x1, y1), (x2, y2) = points[i - 1], points[i], points[i + 1]
        len_in = abs(x1 - x0) + abs(y1 - y0)
        len_out = abs(x2 - x1) + abs(y2 - y1)
        c = min(CHAMFER, len_in / 2, len_out / 2)
        ux, uy = sign(x1 - x0), sign(y1 - y0)
        vx, vy = sign(x2 - x1), sign(y2 - y1)
        d.append(f"L{x1 - ux * c:g} {y1 - uy * c:g}")
        d.append(f"L{x1 + vx * c:g} {y1 + vy * c:g}")
    d.append(f"L{points[-1][0]:g} {points[-1][1]:g}")
    return " ".join(d)


def sign(v: float) -> int:
    return (v > 0) - (v < 0)


def path_length(points: list[tuple[float, float]]) -> float:
    return sum(abs(points[i][0] - points[i - 1][0]) + abs(points[i][1] - points[i - 1][1]) for i in range(1, len(points)))


# ---------------------------------------------------------------- build
def build() -> dict:
    nodes = {n.id: n for n in NODES}
    counters: dict[str, int] = {}
    for n in NODES:
        prefix = PREFIX[n.group]
        counters[prefix] = counters.get(prefix, 0) + 1
        n.designator = f"{prefix}{counters[prefix]}"

    for e in EDGES:
        assert e.source in nodes and e.target in nodes, f"unknown node in {e.id}"

    lanes: dict[float, int] = {}
    for e in EDGES:
        e.points = route(e, nodes, lanes)
    spread_pins(EDGES, nodes)
    for e in EDGES:
        e.points = simplify(e.points)

    neighbours: dict[str, set[str]] = {n.id: {n.id} for n in NODES}
    for e in EDGES:
        neighbours[e.source].add(e.target)
        neighbours[e.target].add(e.source)
    focus = {nid: sorted(set(FOCUS.get(nid, [])) or neighbours[nid]) for nid in nodes}
    for nid, ids in FOCUS.items():
        assert all(i in nodes for i in ids), f"unknown node in focus set {nid}"

    width = MARGIN_X * 2 + 8 * COL_W
    height = MARGIN_Y * 2 + 8 * ROW_H
    topology = {
        "nodes": [{"id": n.id, "group": n.group, "col": n.col, "row": n.row} for n in NODES],
        "edges": [e.id for e in EDGES],
    }
    digest = hashlib.sha256(json.dumps(topology, sort_keys=True).encode()).hexdigest()[:12]

    return {
        "meta": {
            "generator": "scripts/generate_ai_circuit.py",
            "description": "AI-native engineering circuit: human intent through orchestration, cloud and local models, tools, validation and deployment.",
            "topologyHash": digest,
            "nodeCount": len(NODES),
            "edgeCount": len(EDGES),
            "groupCount": len(GROUPS),
            "traceLength": round(sum(path_length(e.points) for e in EDGES)),
            "grid": {"columns": 9, "rows": 9, "pitchX": COL_W, "pitchY": ROW_H},
        },
        "viewBox": [0, 0, width, height],
        "node": {"width": NODE_W, "height": NODE_H},
        "groups": [{"id": k, "label": v} for k, v in GROUPS.items()],
        "nodes": [
            {
                "id": n.id,
                "label": n.label,
                "sub": n.sub,
                "group": n.group,
                "designator": n.designator,
                "x": round(n.x, 1),
                "y": round(n.y, 1),
            }
            for n in NODES
        ],
        "edges": [
            {
                "id": e.id,
                "source": e.source,
                "target": e.target,
                "kind": e.kind,
                "d": chamfered_path(e.points),
                "points": [[x, y] for x, y in e.points],
                "length": round(path_length(e.points)),
            }
            for e in EDGES
        ],
        "focus": focus,
        "focusLinks": {k: [list(p) for p in v] for k, v in FOCUS_LINKS.items()},
        "bus": {"x": round(BUS_X, 1)},
    }


# ---------------------------------------------------------------- static SVG
COLORS = {
    "board": "#0f1014",
    "grid": "#1b1d24",
    "trace": "#3a3e4a",
    "bus": "#4a4f5c",
    "data": "#2f5b47",
    "pad": "#f2411a",
    "text": "#eceae3",
    "mute": "#9b9ea9",
}
GROUP_STROKE = {
    "human": "#eceae3",
    "orchestration": "#f2411a",
    "model": "#f2411a",
    "agent": "#9b9ea9",
    "tool": "#eceae3",
    "data": "#4fd18b",
    "quality": "#4fd18b",
    "delivery": "#eceae3",
}


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def render_svg(data: dict) -> str:
    x0, y0, w, h = data["viewBox"]
    nw, nh = data["node"]["width"], data["node"]["height"]
    out = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {w} {h}" role="img" aria-labelledby="t d" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">',
        '<title id="t">AI-native engineering circuit</title>',
        f'<desc id="d">{esc(data["meta"]["description"])} Generated by {data["meta"]["generator"]}.</desc>',
        f'<rect width="{w}" height="{h}" fill="{COLORS["board"]}"/>',
        '<defs><pattern id="g" width="14" height="14" patternUnits="userSpaceOnUse">'
        f'<circle cx="1" cy="1" r="0.9" fill="{COLORS["grid"]}"/></pattern></defs>',
        f'<rect width="{w}" height="{h}" fill="url(#g)"/>',
    ]
    for e in data["edges"]:
        color = COLORS["data"] if e["kind"] == "data" else COLORS["bus"] if e["kind"] in ("bus", "agent-bus") else COLORS["trace"]
        width = 3 if e["kind"] == "agent-bus" else 2
        out.append(f'<path d="{e["d"]}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"/>')
        for px, py in (e["points"][0], e["points"][-1]):
            out.append(f'<circle cx="{px}" cy="{py}" r="3" fill="{COLORS["board"]}" stroke="{COLORS["pad"]}" stroke-width="1.5"/>')
    for n in data["nodes"]:
        x, y = n["x"] - nw / 2, n["y"] - nh / 2
        stroke = GROUP_STROKE[n["group"]]
        out.append(f'<g><rect x="{x}" y="{y}" width="{nw}" height="{nh}" rx="3" fill="{COLORS["board"]}" stroke="{stroke}" stroke-width="1.2"/>')
        out.append(f'<text x="{x + 8}" y="{y - 5}" font-size="8.5" fill="{COLORS["mute"]}" letter-spacing="1">{n["designator"]}</text>')
        out.append(f'<text x="{n["x"]}" y="{n["y"] - 2}" font-size="12.5" fill="{COLORS["text"]}" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600">{esc(n["label"])}</text>')
        out.append(f'<text x="{n["x"]}" y="{n["y"] + 13}" font-size="8.5" fill="{COLORS["mute"]}" text-anchor="middle">{esc(n["sub"])}</text></g>')
    out.append(f'<text x="{w - 18}" y="{h - 16}" font-size="9" fill="{COLORS["mute"]}" text-anchor="end">GENERATED BY {esc(data["meta"]["generator"].upper())} · {data["meta"]["topologyHash"]}</text>')
    out.append("</svg>")
    return "\n".join(out) + "\n"


def main() -> None:
    data = build()
    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    SVG_OUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    SVG_OUT.write_text(render_svg(data), encoding="utf-8")
    m = data["meta"]
    print(f"ai-circuit: {m['nodeCount']} nodes, {m['edgeCount']} traces, {m['traceLength']}px copper, hash {m['topologyHash']}")
    print(f"  -> {JSON_OUT.relative_to(ROOT)}")
    print(f"  -> {SVG_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
