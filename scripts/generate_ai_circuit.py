#!/usr/bin/env python3
"""
Generates the AI orchestration architecture shown on the website.

Outputs (both committed, so production never needs a Python runtime):
  src/generated/ai-circuit.json   layered topology, routed traces, buses, focus sets,
                                  agent specs and workflow flows for the React renderer
  public/generated/ai-circuit.svg standalone static rendering (no-JS fallback, previews)

The architecture is layered top to bottom:
  INPUT -> ORCHESTRATION (+ AI MODELS via the model router) -> AGENTS
  -> AUTOMATION & TOOLS -> DATA -> CONTROL & DELIVERY
Agents never wire directly to every tool: they sit on an agent bus fed by the agent
router and reach tools through a shared tool bus. Which tools and models an agent may
use is declared in AGENTS below; the per-agent routes are derived from that.

Output is deterministic: same topology, same bytes.
Usage: python3 scripts/generate_ai_circuit.py
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JSON_OUT = ROOT / "src" / "generated" / "ai-circuit.json"
SVG_OUT = ROOT / "public" / "generated" / "ai-circuit.svg"

WIDTH, HEIGHT = 1340, 1040
NODE_W, NODE_H = 150, 46
CHAMFER = 8

# Six main columns and six half-offset columns, so traces can drop through the gaps.
COL = [180, 372, 564, 756, 948, 1140]
HALF = [276, 468, 660, 852, 1044, 1236]

# Row centres (y) and bus lines.
Y_INPUT = 70
Y_ORCH = 180
Y_PLANNER = 270
Y_ROUTER = 350
Y_AGENT_BUS = 410
Y_AGENTS_A = 465
Y_AGENTS_B = 540
Y_TOOL_BUS = 622
Y_TOOLS = 680
Y_DATA = 790
Y_CONTROL = 890
Y_ACTIONS = 985
X_MODEL_BUS = 1035
X_MODELS = 1150
CH_TRIGGER = 40  # outer left channel: triggers -> n8n
CH_N8N = 70  # inner left channel: n8n -> orchestrator

# Band labels render rotated in the left margin (x = LABEL_X), clear of the channels.
LABEL_X = 27
LAYERS = [
    {"id": "input", "label": "Input", "y0": 30, "y1": 110},
    {"id": "orchestration", "label": "Orchestration", "y0": 135, "y1": 378},
    {"id": "agents", "label": "Agents", "y0": 392, "y1": 580},
    {"id": "tools", "label": "Automation & tools", "y0": 600, "y1": 720},
    {"id": "data", "label": "Data", "y0": 755, "y1": 825},
    {"id": "control", "label": "Control & delivery", "y0": 855, "y1": 1020},
]
MODEL_BOX = {"id": "models", "label": "AI models", "x0": 1062, "x1": 1300, "y0": 164, "y1": 350}


@dataclass
class Node:
    id: str
    label: str
    sub: str
    layer: str
    x: float
    y: float
    kind: str = "node"  # input | core | model | agent | tool | data | control | delivery
    # "live" = running in this portfolio today; "capability" = architecture I build, not deployed here.
    status: str = "capability"
    w: float = NODE_W
    h: float = NODE_H

    def top(self, dx: float = 0) -> tuple[float, float]:
        return (self.x + dx, self.y - self.h / 2)

    def bottom(self, dx: float = 0) -> tuple[float, float]:
        return (self.x + dx, self.y + self.h / 2)

    def left(self, dy: float = 0) -> tuple[float, float]:
        return (self.x - self.w / 2, self.y + dy)

    def right(self, dy: float = 0) -> tuple[float, float]:
        return (self.x + self.w / 2, self.y + dy)


NODES: list[Node] = [
    # INPUT
    Node("triggers", "Triggers", "API · webhook · schedule", "input", COL[0], Y_INPUT, "input"),
    Node("client", "Human · client", "goal and constraints", "input", 420, Y_INPUT, "input"),
    Node("goal", "Input · goal", "task, context, limits", "input", 660, Y_INPUT, "input"),
    Node("application", "Application", "Next.js · React · TypeScript", "input", 900, Y_INPUT, "input", "live"),
    # ORCHESTRATION
    Node("state", "State · checkpoints", "context, memory, resume", "orchestration", 420, Y_ORCH, "core"),
    Node("orchestrator", "Orchestrator", "central coordination", "orchestration", 660, Y_ORCH, "core", w=190, h=52),
    Node("model-router", "Model router", "capability · privacy · cost", "orchestration", 900, Y_ORCH, "core"),
    Node("planner", "Planner", "task decomposition", "orchestration", 660, Y_PLANNER, "core"),
    Node("agent-router", "Agent router", "assigns specialised agents", "orchestration", 660, Y_ROUTER, "core"),
    # AI MODELS
    Node("chatgpt", "ChatGPT", "OpenAI models", "models", X_MODELS, 200, "model"),
    Node("claude", "Claude", "Claude · Claude Code", "models", X_MODELS, 258, "model"),
    Node("local-ai", "Local AI", "private, self-hosted", "models", X_MODELS, 316, "model"),
    # AGENTS (row A on main columns, row B on half columns)
    Node("research-agent", "Research agent", "sources · analysis", "agents", COL[0], Y_AGENTS_A, "agent"),
    Node("browser-agent", "Web · browser agent", "pages · forms · checks", "agents", COL[1], Y_AGENTS_A, "agent"),
    Node("frontend-agent", "Frontend agent", "React · Next.js UI", "agents", COL[2], Y_AGENTS_A, "agent"),
    Node("backend-agent", "Backend agent", "APIs · validation", "agents", COL[3], Y_AGENTS_A, "agent"),
    Node("python-agent", "Python agent", "scripts · tooling", "agents", COL[4], Y_AGENTS_A, "agent"),
    Node("data-agent", "Data agent", "parse · transform", "agents", COL[5], Y_AGENTS_A, "agent"),
    # Testing and review sit directly above validation and human approval, so the results
    # path below the tool bus continues their column instead of an unrelated agent's.
    Node("test-agent", "Testing agent", "unit · e2e · a11y", "agents", HALF[0], Y_AGENTS_B, "agent"),
    Node("review-agent", "Review agent", "diff · security", "agents", HALF[1], Y_AGENTS_B, "agent"),
    Node("ai-agent", "AI integration agent", "prompts · tool calls", "agents", HALF[2], Y_AGENTS_B, "agent"),
    Node("local-agent", "Local AI agent", "private documents", "agents", HALF[3], Y_AGENTS_B, "agent"),
    Node("automation-agent", "Automation agent", "workflows · jobs", "agents", HALF[4], Y_AGENTS_B, "agent"),
    Node("deploy-agent", "Deployment agent", "release · rollback", "agents", HALF[5], Y_AGENTS_B, "agent"),
    # AUTOMATION & TOOLS
    Node("n8n", "n8n", "workflow automation", "tools", COL[0], Y_TOOLS, "tool"),
    Node("python", "Python", "scripts · services", "tools", COL[1], Y_TOOLS, "tool", "live"),
    Node("apis", "APIs", "REST · Node.js", "tools", COL[2], Y_TOOLS, "tool", "live"),
    Node("webhooks", "Webhooks", "events in · events out", "tools", COL[3], Y_TOOLS, "tool"),
    Node("file-data", "File · data processing", "CSV · JSON · PDF", "tools", COL[4], Y_TOOLS, "tool"),
    Node("browser", "Browser · web tools", "fetch · render · test", "tools", COL[5], Y_TOOLS, "tool", "live"),
    # DATA
    Node("database", "PostgreSQL", "records · state", "data", COL[2], Y_DATA, "data"),
    Node("embeddings", "Documents · embeddings", "RAG · private search", "data", COL[4], Y_DATA, "data"),
    # CONTROL & DELIVERY
    Node("validation", "Validation · tests", "schemas · checks", "control", HALF[0], Y_CONTROL, "control", "live"),
    Node("approval", "Human approval", "checkpoint before action", "control", HALF[1], Y_CONTROL, "control", "live"),
    Node("github", "Git · GitHub", "version control · CI", "control", HALF[2], Y_CONTROL, "delivery", "live"),
    Node("vercel", "Vercel", "build · deploy", "control", HALF[3], Y_CONTROL, "delivery", "live"),
    Node("production", "Production", "live application", "control", HALF[4], Y_CONTROL, "delivery", "live"),
    Node("email", "Email · Resend", "notifications", "control", HALF[1], Y_ACTIONS, "delivery", "live"),
    Node("actions", "CRM · database · API", "external systems", "control", HALF[2], Y_ACTIONS, "delivery"),
]
N = {n.id: n for n in NODES}

TOOLS = ["n8n", "python", "apis", "webhooks", "file-data", "browser"]
MODELS = ["chatgpt", "claude", "local-ai"]

# Agent specs: the only source of agent -> tool / model wiring.
AGENTS: dict[str, dict] = {
    "research-agent": {"tools": ["browser", "apis", "file-data"], "models": ["chatgpt", "claude", "local-ai"], "checkpoint": "review-agent"},
    "browser-agent": {"tools": ["browser", "apis"], "models": ["chatgpt", "claude"], "checkpoint": "validation"},
    "frontend-agent": {"tools": ["browser", "apis"], "models": ["claude", "chatgpt"], "checkpoint": "test-agent"},
    "backend-agent": {"tools": ["apis", "webhooks", "python"], "models": ["claude", "chatgpt"], "checkpoint": "test-agent"},
    "python-agent": {"tools": ["python", "file-data", "apis"], "models": ["claude", "chatgpt", "local-ai"], "checkpoint": "validation"},
    "data-agent": {"tools": ["python", "file-data", "apis"], "models": ["chatgpt", "claude", "local-ai"], "checkpoint": "validation"},
    "ai-agent": {"tools": ["apis", "python", "webhooks"], "models": ["chatgpt", "claude", "local-ai"], "checkpoint": "review-agent"},
    "local-agent": {"tools": ["python", "file-data"], "models": ["local-ai"], "checkpoint": "approval"},
    "automation-agent": {"tools": ["n8n", "webhooks", "apis", "python"], "models": ["chatgpt", "claude"], "checkpoint": "approval"},
    "test-agent": {"tools": ["browser", "python"], "models": ["claude", "chatgpt"], "checkpoint": "validation"},
    "review-agent": {"tools": ["file-data", "browser"], "models": ["claude", "chatgpt"], "checkpoint": "approval"},
    "deploy-agent": {"tools": ["webhooks", "apis"], "models": ["claude"], "checkpoint": "approval"},
}
for agent_id, spec in AGENTS.items():
    assert N[agent_id].kind == "agent", agent_id
    assert all(t in TOOLS for t in spec["tools"]), agent_id
    assert all(m in MODELS for m in spec["models"]), agent_id
    assert spec["checkpoint"] in N, agent_id


# ---------------------------------------------------------------- geometry helpers
def simplify(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    out: list[tuple[float, float]] = []
    for x, y in points:
        p = (round(x, 1), round(y, 1))
        if not out or out[-1] != p:
            out.append(p)
    i = 1
    while i < len(out) - 1:
        (x0, y0), (x1, y1), (x2, y2) = out[i - 1], out[i], out[i + 1]
        if (x0 == x1 == x2) or (y0 == y1 == y2):
            out.pop(i)
        else:
            i += 1
    return out


def sgn(v: float) -> int:
    return (v > 0) - (v < 0)


def chamfered(points: list[tuple[float, float]]) -> str:
    """Orthogonal polyline -> SVG path with 45° corner cuts, like PCB copper."""
    pts = simplify(points)
    d = [f"M{pts[0][0]:g} {pts[0][1]:g}"]
    for i in range(1, len(pts) - 1):
        (x0, y0), (x1, y1), (x2, y2) = pts[i - 1], pts[i], pts[i + 1]
        c = min(CHAMFER, (abs(x1 - x0) + abs(y1 - y0)) / 2, (abs(x2 - x1) + abs(y2 - y1)) / 2)
        ux, uy, vx, vy = sgn(x1 - x0), sgn(y1 - y0), sgn(x2 - x1), sgn(y2 - y1)
        d.append(f"L{x1 - ux * c:g} {y1 - uy * c:g}")
        d.append(f"L{x1 + vx * c:g} {y1 + vy * c:g}")
    d.append(f"L{pts[-1][0]:g} {pts[-1][1]:g}")
    return " ".join(d)


def length(points: list[tuple[float, float]]) -> float:
    return sum(abs(points[i][0] - points[i - 1][0]) + abs(points[i][1] - points[i - 1][1]) for i in range(1, len(points)))


# ---------------------------------------------------------------- traces
@dataclass
class Edge:
    source: str
    target: str
    kind: str  # flow | model | agent-bus | automation | data | control | delivery
    points: list[tuple[float, float]]

    @property
    def id(self) -> str:
        return f"{self.source}--{self.target}"


def straight_v(a: str, b: str, kind: str) -> Edge:
    return Edge(a, b, kind, [N[a].bottom(), N[b].top()])


def straight_h(a: str, b: str, kind: str) -> Edge:
    na, nb = N[a], N[b]
    rightwards = nb.x > na.x
    return Edge(a, b, kind, [na.right() if rightwards else na.left(), nb.left() if rightwards else nb.right()])


EDGES: list[Edge] = [
    straight_h("client", "goal", "flow"),
    straight_h("application", "goal", "flow"),
    straight_v("goal", "orchestrator", "flow"),
    straight_h("orchestrator", "state", "flow"),
    straight_h("orchestrator", "model-router", "model"),
    straight_v("orchestrator", "planner", "flow"),
    straight_v("planner", "agent-router", "flow"),
    # Triggers reach n8n through the outer left channel.
    Edge("triggers", "n8n", "automation", [N["triggers"].left(), (CH_TRIGGER, Y_INPUT), (CH_TRIGGER, Y_TOOLS + 8), N["n8n"].left(8)]),
    # n8n hands reasoning work to the orchestrator through the inner channel (passing under the state node).
    Edge("n8n", "orchestrator", "automation", [N["n8n"].left(-8), (CH_N8N, Y_TOOLS - 8), (CH_N8N, 225), (620, 225), N["orchestrator"].bottom(-40)]),
    straight_v("apis", "database", "data"),
    straight_v("file-data", "embeddings", "data"),
    # Tool results return to validation through the gap between n8n and Python.
    Edge("tool-bus", "validation", "control", [(HALF[0], Y_TOOL_BUS), N["validation"].top()]),
    straight_h("validation", "approval", "control"),
    straight_h("approval", "github", "delivery"),
    straight_h("github", "vercel", "delivery"),
    straight_h("vercel", "production", "delivery"),
    # Approved actions fan out to outbound systems.
    Edge("approval", "email", "delivery", [N["approval"].bottom(), N["email"].top()]),
    Edge("approval", "actions", "delivery", [N["approval"].bottom(), (HALF[1], 940), (HALF[2], 940), N["actions"].top()]),
]

# Model router -> models over a short vertical bus: models are never wired to tools directly.
for m in MODELS:
    EDGES.append(Edge("model-router", m, "model", [N["model-router"].right(), (X_MODEL_BUS, Y_ORCH), (X_MODEL_BUS, N[m].y), N[m].left()]))

# Agent router -> each agent over the agent bus (overlapping segments render as one bus).
for agent_id in AGENTS:
    a = N[agent_id]
    EDGES.append(Edge("agent-router", agent_id, "agent-bus", [N["agent-router"].bottom(), (660, Y_AGENT_BUS), (a.x, Y_AGENT_BUS), a.top()]))

BUSES = [
    {"id": "agent-bus", "label": "agent bus", "d": chamfered([(COL[0], Y_AGENT_BUS), (HALF[5], Y_AGENT_BUS)])},
    {"id": "tool-bus", "label": "tool bus", "d": chamfered([(COL[0], Y_TOOL_BUS), (HALF[5], Y_TOOL_BUS)])},
    {"id": "model-bus", "label": "model bus", "d": chamfered([(X_MODEL_BUS, Y_ORCH), (X_MODEL_BUS, N["local-ai"].y)])},
]

# Taps: each agent drops onto the tool bus; each tool hangs from it.
TAPS = []
for agent_id in AGENTS:
    a = N[agent_id]
    TAPS.append({"id": f"tap-{agent_id}", "node": agent_id, "d": chamfered([a.bottom(), (a.x, Y_TOOL_BUS)])})
for t in TOOLS:
    TAPS.append({"id": f"tap-{t}", "node": t, "d": chamfered([(N[t].x, Y_TOOL_BUS), N[t].top()])})

# Per-agent routes to exactly the tools it declares (highlighted on selection).
AGENT_ROUTES = {
    agent_id: [
        {"tool": t, "d": chamfered([N[agent_id].bottom(), (N[agent_id].x, Y_TOOL_BUS), (N[t].x, Y_TOOL_BUS), N[t].top()])}
        for t in spec["tools"]
    ]
    for agent_id, spec in AGENTS.items()
}


# ---------------------------------------------------------------- focus sets
def agents_using(model: str) -> list[str]:
    return [a for a, s in AGENTS.items() if model in s["models"]]


def agents_with_tool(tool: str) -> list[str]:
    return [a for a, s in AGENTS.items() if tool in s["tools"]]


FOCUS: dict[str, list[str]] = {
    "orchestrator": ["goal", "orchestrator", "state", "planner", "agent-router", "model-router", *AGENTS, "validation", "approval"],
    "planner": ["orchestrator", "planner", "agent-router", "state"],
    "agent-router": ["planner", "agent-router", *AGENTS],
    "model-router": ["orchestrator", "model-router", *MODELS],
    "n8n": ["triggers", "n8n", "orchestrator", "webhooks", "apis", "python", "database", "automation-agent", "validation", "approval", "email", "actions"],
    "chatgpt": ["chatgpt", "model-router", "orchestrator", *agents_using("chatgpt")],
    "claude": ["claude", "model-router", "orchestrator", *agents_using("claude"), "github"],
    "local-ai": ["local-ai", "model-router", "orchestrator", *agents_using("local-ai"), "python", "file-data", "embeddings"],
    "python": ["python", *agents_with_tool("python"), "apis", "file-data", "n8n", "local-ai", "embeddings", "database"],
    "validation": ["validation", "test-agent", "review-agent", "approval", "github"],
    "approval": ["validation", "approval", "review-agent", "github", "vercel", "production", "email", "actions"],
    "triggers": ["triggers", "n8n", "orchestrator", "webhooks"],
    "goal": ["client", "application", "goal", "orchestrator"],
}
for agent_id, spec in AGENTS.items():
    FOCUS[agent_id] = [agent_id, "agent-router", "model-router", *spec["tools"], *spec["models"], spec["checkpoint"]]
for t in TOOLS:
    FOCUS.setdefault(t, [t, *agents_with_tool(t)])

neighbours: dict[str, set[str]] = {n.id: {n.id} for n in NODES}
for e in EDGES:
    if e.source in N:
        neighbours[e.source].add(e.target)
        neighbours[e.target].add(e.source)
for n in NODES:
    FOCUS.setdefault(n.id, sorted(neighbours[n.id]))
for key in list(FOCUS):
    assert all(i in N for i in FOCUS[key]), key
    FOCUS[key] = sorted(set(FOCUS[key]) | {key})

# ---------------------------------------------------------------- flows (rendered as step diagrams)
# Step ids that match node ids cross-link to the architecture; nested lists are parallel branches.
FLOWS = {
    "development": ["dev-orchestrator", "planner", ["frontend-agent", "backend-agent", "ai-systems-agent", "python-agent", "test-agent", "review-agent"], "merge", "automated-tests", "git", "github", "ci-build", "vercel", "production"],
    "production": ["application", "trigger-in", "n8n", "orchestrator", "agent-router", ["ai-agents", "python", "apis", "database"], "validation", "approval-when-required", ["email", "crm", "database", "web-app", "external-api"]],
    "lead-form": ["lead-form", "n8n", "validation", "database", "email", "notification"],
    "scheduled": ["schedule", "n8n", "apis", "python", "ai-model", "validation", "output"],
    "ai-business": ["n8n-trigger", "orchestrator", "research-agent", "ai-model", "python-data", "review-agent", "n8n", "external-system"],
}


# ---------------------------------------------------------------- build
def build() -> dict:
    prefix = {"input": "IN", "core": "U", "node": "U", "model": "M", "agent": "A", "tool": "J", "data": "D", "control": "Q", "delivery": "P"}
    counters: dict[str, int] = {}
    designators = {}
    for n in NODES:
        p = prefix[n.kind]
        counters[p] = counters.get(p, 0) + 1
        designators[n.id] = f"{p}{counters[p]}"

    topology = {"nodes": [[n.id, n.layer, n.x, n.y] for n in NODES], "edges": [e.id for e in EDGES], "agents": AGENTS, "flows": FLOWS}
    digest = hashlib.sha256(json.dumps(topology, sort_keys=True).encode()).hexdigest()[:12]
    edges = [
        {"id": e.id, "source": e.source, "target": e.target, "kind": e.kind, "d": chamfered(e.points), "length": round(length(e.points))}
        for e in EDGES
    ]
    return {
        "meta": {
            "generator": "scripts/generate_ai_circuit.py",
            "description": "AI orchestration architecture: input, orchestrator, planner and agent router, a separate model layer, specialised agents, an automation and tool layer with n8n and Python, data, validation, human approval and delivery.",
            "topologyHash": digest,
            "nodeCount": len(NODES),
            "edgeCount": len(EDGES),
            "agentCount": len(AGENTS),
            "groupCount": len(LAYERS) + 1,
            "traceLength": sum(e["length"] for e in edges),
            "layout": "layered, top to bottom, bus-routed",
        },
        "viewBox": [0, 0, WIDTH, HEIGHT],
        "node": {"width": NODE_W, "height": NODE_H},
        "layers": LAYERS,
        "labelX": LABEL_X,
        "modelBox": MODEL_BOX,
        "nodes": [
            {
                "id": n.id, "label": n.label, "sub": n.sub, "layer": n.layer, "kind": n.kind, "status": n.status,
                "designator": designators[n.id], "x": n.x, "y": n.y, "w": n.w, "h": n.h,
            }
            for n in NODES
        ],
        "edges": edges,
        "buses": BUSES,
        "taps": TAPS,
        "agents": {a: {**s, "routes": AGENT_ROUTES[a]} for a, s in AGENTS.items()},
        "tools": TOOLS,
        "models": MODELS,
        "focus": FOCUS,
        "flows": FLOWS,
    }


# ---------------------------------------------------------------- static SVG
C = {
    "board": "#0f1014", "band": "#14161c", "bandline": "#22252e", "dot": "#1b1d24", "trace": "#3a3e4a", "bus": "#5a5f6d",
    "auto": "#c2310f", "data": "#2f6b4f", "text": "#eceae3", "mute": "#9b9ea9", "ok": "#4fd18b",
}
KIND_STROKE = {
    "input": "#eceae3", "core": "#f2411a", "node": "#f2411a", "model": "#eceae3", "agent": "#9b9ea9",
    "tool": "#eceae3", "data": "#4fd18b", "control": "#4fd18b", "delivery": "#eceae3",
}
EDGE_COLOR = {"flow": "trace", "model": "bus", "agent-bus": "bus", "automation": "auto", "data": "data", "control": "data", "delivery": "trace"}


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def render_svg(data: dict) -> str:
    w, h = WIDTH, HEIGHT
    o = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-labelledby="t d" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">',
        '<title id="t">AI orchestration architecture</title>',
        f'<desc id="d">{esc(data["meta"]["description"])} Generated by {data["meta"]["generator"]}.</desc>',
        f'<rect width="{w}" height="{h}" fill="{C["board"]}"/>',
        f'<defs><pattern id="g" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="{C["dot"]}"/></pattern></defs>',
        f'<rect width="{w}" height="{h}" fill="url(#g)"/>',
    ]
    for layer in LAYERS:
        o.append(f'<rect x="16" y="{layer["y0"]}" width="{w - 32}" height="{layer["y1"] - layer["y0"]}" fill="{C["band"]}" fill-opacity="0.55" stroke="{C["bandline"]}"/>')
        cy = (layer["y0"] + layer["y1"]) / 2
        o.append(f'<text x="{LABEL_X}" y="{cy}" transform="rotate(-90 {LABEL_X} {cy})" text-anchor="middle" dominant-baseline="middle" font-size="8.5" letter-spacing="1" fill="{C["mute"]}">{esc(layer["label"].upper())}</text>')
    mb = MODEL_BOX
    o.append(f'<rect x="{mb["x0"]}" y="{mb["y0"]}" width="{mb["x1"] - mb["x0"]}" height="{mb["y1"] - mb["y0"]}" fill="none" stroke="{C["bus"]}" stroke-dasharray="4 4"/>')
    o.append(f'<text x="{mb["x1"]}" y="{mb["y0"] - 6}" text-anchor="end" font-size="8.5" letter-spacing="1" fill="{C["mute"]}">{esc(mb["label"].upper())}</text>')
    for bus in data["buses"]:
        o.append(f'<path d="{bus["d"]}" fill="none" stroke="{C["bus"]}" stroke-width="4" stroke-linecap="round"/>')
    for tap in data["taps"]:
        o.append(f'<path d="{tap["d"]}" fill="none" stroke="{C["trace"]}" stroke-width="1.6"/>')
    for e in data["edges"]:
        o.append(f'<path d="{e["d"]}" fill="none" stroke="{C[EDGE_COLOR[e["kind"]]]}" stroke-width="2" stroke-linejoin="round"/>')
    for n in data["nodes"]:
        x, y, nw, nh = n["x"] - n["w"] / 2, n["y"] - n["h"] / 2, n["w"], n["h"]
        core = n["id"] == "orchestrator"
        o.append(f'<g><rect x="{x}" y="{y}" width="{nw}" height="{nh}" rx="3" fill="{C["board"]}" stroke="{KIND_STROKE[n["kind"]]}" stroke-width="{2 if core else 1.2}"/>')
        o.append(f'<text x="{x + 6}" y="{y - 4}" font-size="8" fill="{C["mute"]}" letter-spacing="1">{n["designator"]}</text>')
        if n["status"] == "live":
            o.append(f'<circle cx="{x + nw - 8}" cy="{y + 8}" r="2.6" fill="{C["ok"]}"/>')
        o.append(f'<text x="{n["x"]}" y="{n["y"] - 2}" font-size="{13.5 if core else 12}" fill="{C["text"]}" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600">{esc(n["label"])}</text>')
        o.append(f'<text x="{n["x"]}" y="{n["y"] + 13}" font-size="8.5" fill="{C["mute"]}" text-anchor="middle">{esc(n["sub"])}</text></g>')
    o.append(f'<circle cx="{w - 300}" cy="{h - 12}" r="2.6" fill="{C["ok"]}"/><text x="{w - 292}" y="{h - 9}" font-size="9" fill="{C["mute"]}">LIVE IN THIS SITE · OTHERS: CAPABILITY</text>')
    o.append(f'<text x="28" y="{h - 9}" font-size="9" fill="{C["mute"]}">GENERATED BY {esc(data["meta"]["generator"].upper())} · {data["meta"]["topologyHash"]}</text>')
    o.append("</svg>")
    return "\n".join(o) + "\n"


def main() -> None:
    data = build()
    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    SVG_OUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    SVG_OUT.write_text(render_svg(data), encoding="utf-8")
    m = data["meta"]
    print(f"ai-circuit: {m['nodeCount']} nodes, {m['edgeCount']} traces, {m['agentCount']} agents, hash {m['topologyHash']}")
    print(f"  -> {JSON_OUT.relative_to(ROOT)}")
    print(f"  -> {SVG_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
