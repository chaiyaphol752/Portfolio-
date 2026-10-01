#!/usr/bin/env python3
"""
Generates the AI orchestration architecture shown on the website.

Outputs (both committed, so production never needs a Python runtime):
  src/generated/ai-circuit.json   semantic architecture graph + presentation layouts
  public/generated/ai-circuit.svg standalone static rendering of the desktop layout

The JSON is a SEMANTIC graph first:
  stages       the nine architecture stages, in reading order (used by the mobile trace)
  nodes        id, label, type, stage, description, mobilePriority, status (live | capability)
  connections  typed relationships with a verb: delegates, routes, calls, reads-writes, ...
  agents       role, inputs, outputs, tools, model options and validation gate per agent
  workflows    selectable traces as ordered node-id paths (nested list = parallel steps)
  focus        what is related to each node, used for highlighting

Presentation lives separately under `layouts`. Only the desktop board needs coordinates;
tablet and mobile views are laid out by the frontend from stages + nodes.

English copy is the source here; German and Thai are keyed by the same ids in
src/components/circuit/labels.ts. Output is deterministic: same input, same bytes.

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

# ================================================================ semantic model
STAGES = [
    ("intent", "Human intent", "A person, a form or an event states what needs to happen."),
    ("orchestrator", "Orchestrator", "The coordinator: holds state, delegates work and decides when a result is ready."),
    ("plan-route", "Plan & route", "The goal becomes tasks; each task goes to the right agent and model."),
    ("agents", "Specialised agents", "Workers with one responsibility each and only the tools they need."),
    ("models", "Model layer", "Cloud models and local models, chosen per task by the model router."),
    ("tools", "Automation & tools", "n8n runs the workflows, Python provides the programmable tools."),
    ("data", "Data & external systems", "Databases, private documents and the systems that receive results."),
    ("control", "Validation & approval", "Checks run on every result; a person approves anything irreversible."),
    ("delivery", "Delivery", "Reviewed changes ship through GitHub and Vercel; messages go out by email."),
]
STAGE_IDS = [s[0] for s in STAGES]

VERBS = ["delegates", "routes", "calls", "reads-writes", "validates", "approves", "deploys", "triggers", "automates", "selects-model"]


@dataclass
class Node:
    id: str
    label: str
    sub: str
    type: str  # input | core | model | agent | tool | data | control | delivery
    stage: str
    description: str
    priority: int = 2  # mobilePriority: 1 primary, 2 standard, 3 detail
    status: str = "capability"  # "live" = running in this portfolio today
    uses: list[str] = field(default_factory=list)


NODES: list[Node] = [
    # ---- intent
    Node("client", "Human · client", "goal and constraints", "input", "intent", "The person or client who sets the goal, the limits and what counts as done.", 1),
    Node("goal", "Input · goal", "task, context, limits", "input", "intent", "The task as the system receives it: goal, context and constraints.", 1),
    Node("form", "Website form", "enquiry · lead", "input", "intent", "A form on a website — like the contact form on this site — that starts a workflow.", 2, "live"),
    Node("triggers", "Triggers", "API · webhook · schedule", "input", "intent", "Events that start automated work: an API call, an incoming webhook or a schedule.", 2),
    Node("application", "Application", "Next.js · React", "input", "intent", "The product people use — here a Next.js, React and TypeScript application.", 2, "live"),
    # ---- orchestrator
    Node(
        "orchestrator", "Orchestrator", "central coordination", "core", "orchestrator",
        "The central coordinator. It does not answer questions itself — it decides who works on what, keeps the state and puts the results together.",
        1, uses=["Workflow coordination", "Context passing", "State management", "Task delegation", "Selecting agents and tools", "Routing work", "Retries", "Checkpoints", "Aggregating results"],
    ),
    Node("state", "State · checkpoints", "context, memory, resume", "core", "orchestrator", "Keeps workflow state, context and checkpoints so work can resume or roll back.", 3),
    # ---- plan & route
    Node("planner", "Planner", "task decomposition", "core", "plan-route", "Breaks the goal into small tasks, each with its own check.", 1),
    Node("agent-router", "Agent router", "assigns agents", "core", "plan-route", "Assigns each task to the specialised agent that owns that kind of work.", 1),
    Node("model-router", "Model router", "capability · privacy", "core", "plan-route", "Chooses a model per task by capability, privacy, cost, latency and availability. Agents never call models directly.", 1),
    # ---- models
    Node("chatgpt", "ChatGPT", "OpenAI models", "model", "models", "OpenAI models for research, analysis, reasoning, specifications and content — reached only through the model router.", 1, uses=["Research", "Analysis", "Reasoning", "Specifications", "Content", "Tool use"]),
    Node("claude", "Claude", "Claude · Claude Code", "model", "models", "Claude and Claude Code for repository analysis, planning, implementation, refactoring, debugging and review.", 1, uses=["Repository analysis", "Planning", "Implementation", "Refactoring", "Debugging", "Code review"]),
    Node(
        "local-ai", "Local AI", "private, self-hosted", "model", "models",
        "Self-hosted models for private data and offline-capable workflows — Ollama-, LM Studio- or llama.cpp-style runtimes with embeddings and retrieval. Shown as a capability, not a running deployment.",
        1, uses=["Local inference", "Private documents", "Embeddings", "RAG", "Offline workflows"],
    ),
    # ---- agents
    Node("research-agent", "Research agent", "sources · analysis", "agent", "agents", "Collects and analyses sources and documentation.", 2),
    Node("browser-agent", "Web · browser agent", "pages · forms · checks", "agent", "agents", "Reads and checks web pages, forms and live behaviour.", 2),
    Node("frontend-agent", "Frontend agent", "React · Next.js UI", "agent", "agents", "Builds interfaces in React and Next.js.", 2),
    Node("backend-agent", "Backend agent", "APIs · validation", "agent", "agents", "Builds APIs, validation and server logic.", 2),
    Node("python-agent", "Python agent", "scripts · tooling", "agent", "agents", "Writes Python scripts, services and developer tooling.", 2),
    Node("data-agent", "Data agent", "parse · transform", "agent", "agents", "Parses, cleans and transforms data.", 2),
    Node("test-agent", "Testing agent", "unit · e2e · a11y", "agent", "agents", "Writes and runs unit, end-to-end and accessibility tests.", 2),
    Node("review-agent", "Review agent", "diff · security", "agent", "agents", "Reviews changes for bugs, security and quality before human approval.", 2),
    Node("ai-agent", "AI integration agent", "prompts · tool calls", "agent", "agents", "Connects models to products: prompts, tool calls, fallbacks and limits.", 2),
    Node("local-agent", "Local AI agent", "private documents", "agent", "agents", "Works on private documents with local models only.", 2),
    Node("automation-agent", "Automation agent", "workflows · jobs", "agent", "agents", "Designs and maintains n8n workflows, webhooks and scheduled jobs.", 2),
    Node("deploy-agent", "Deployment agent", "release · rollback", "agent", "agents", "Prepares releases and rollbacks; deploys only after approval.", 2),
    # ---- tools
    Node(
        "n8n", "n8n", "workflow automation", "tool", "tools",
        "Workflow automation and integration. It moves data and events between systems on fixed rules and hands reasoning work to the orchestrator — it is not the AI brain. Shown as an automation architecture capability; no n8n instance runs in this portfolio.",
        1, uses=["Webhooks", "Triggers", "Schedules", "API workflows", "Email workflows", "Data movement", "External integrations", "Calling Python services", "Calling AI workflows"],
    ),
    Node(
        "python", "Python", "scripts · services", "tool", "tools",
        "Programmable glue between AI, data and automation. The architecture on this page is generated by a Python script.",
        1, "live", uses=["Automation", "AI tools", "API clients", "Data transformation", "File processing", "Agent tools", "Local AI integration", "Backend utilities", "Developer tooling"],
    ),
    Node("apis", "APIs", "REST · Node.js", "tool", "tools", "Connections to internal and external services over REST and Node.js.", 2, "live"),
    Node("webhooks", "Webhooks", "events in · events out", "tool", "tools", "Events in and out — how systems notify each other.", 2),
    Node("file-data", "Files · data", "CSV · JSON · PDF", "tool", "tools", "Reads and transforms CSV, JSON and PDF files.", 3),
    Node("browser", "Browser · web tools", "fetch · render · test", "tool", "tools", "Fetches, renders and tests web pages; this site is checked with Playwright.", 3, "live"),
    # ---- data & external systems
    Node("database", "PostgreSQL", "records · state", "data", "data", "Stores records and workflow state.", 2),
    Node("embeddings", "Embeddings", "retrieval · RAG", "data", "data", "Private documents indexed as embeddings for retrieval (RAG).", 2),
    Node("private-docs", "Private documents", "files that stay local", "data", "data", "Documents that must not leave the machine or the company network.", 3),
    Node("actions", "External systems", "CRM · alerts · APIs", "delivery", "data", "Where approved results land: CRM updates, notifications, third-party APIs.", 2),
    # ---- control
    Node("validation", "Validation · tests", "schemas · checks", "control", "control", "Schemas, types and tests. Failures go back to the responsible agent with context.", 1, "live"),
    Node("approval", "Human approval", "checkpoint before action", "control", "control", "A person approves before anything irreversible: sending, publishing, deploying or deleting.", 1, "live"),
    # ---- delivery
    Node("github", "Git · GitHub", "version control · CI", "delivery", "delivery", "Version control and CI. Every change is a reviewed commit.", 2, "live"),
    Node("vercel", "Vercel", "build · deploy", "delivery", "delivery", "Builds and deploys the application.", 2, "live"),
    Node("production", "Production", "live application", "delivery", "delivery", "The live application, verified after every deploy.", 1, "live"),
    Node("email", "Email · Resend", "notifications", "delivery", "delivery", "Outbound email via Resend — live for this site's contact form.", 2, "live"),
]
N = {n.id: n for n in NODES}
assert len(N) == len(NODES), "duplicate node id"
assert all(n.stage in STAGE_IDS for n in NODES)

TOOLS = ["n8n", "python", "apis", "webhooks", "file-data", "browser"]
MODELS = ["chatgpt", "claude", "local-ai"]

# Agent specs: the only source of agent -> tool / model wiring.
AGENTS: dict[str, dict] = {
    "research-agent": {"tools": ["browser", "apis", "file-data"], "models": ["chatgpt", "claude", "local-ai"], "validation": "review-agent",
                       "role": "Finds and summarises sources, documentation and API references, with citations.", "inputs": "Open questions, scope", "outputs": "Sourced findings"},
    "browser-agent": {"tools": ["browser", "apis"], "models": ["chatgpt", "claude"], "validation": "validation",
                      "role": "Navigates pages, fills forms and checks live behaviour.", "inputs": "URLs, user flows to check", "outputs": "Page data, screenshots, issues"},
    "frontend-agent": {"tools": ["browser", "apis"], "models": ["claude", "chatgpt"], "validation": "test-agent",
                       "role": "Builds accessible, responsive components and pages.", "inputs": "Design system, content, API contracts", "outputs": "Typed React components"},
    "backend-agent": {"tools": ["apis", "webhooks", "python"], "models": ["claude", "chatgpt"], "validation": "test-agent",
                      "role": "Implements endpoints, validation and server logic.", "inputs": "Data model, requirements", "outputs": "Routes, schemas, server actions"},
    "python-agent": {"tools": ["python", "file-data", "apis"], "models": ["claude", "chatgpt", "local-ai"], "validation": "validation",
                     "role": "Writes scripts, services and tooling: generators, converters, API clients.", "inputs": "Task spec, sample data", "outputs": "Tested Python modules"},
    "data-agent": {"tools": ["python", "file-data", "apis"], "models": ["chatgpt", "claude", "local-ai"], "validation": "validation",
                   "role": "Cleans, transforms and reconciles data between formats and systems.", "inputs": "Files, API responses, schemas", "outputs": "Validated, structured data"},
    "test-agent": {"tools": ["browser", "python"], "models": ["claude", "chatgpt"], "validation": "validation",
                   "role": "Writes and runs unit, end-to-end and accessibility checks.", "inputs": "Changes, acceptance criteria", "outputs": "Test results"},
    "review-agent": {"tools": ["file-data", "browser"], "models": ["claude", "chatgpt"], "validation": "approval",
                     "role": "Assumes there are bugs: reviews the diff, security and copy.", "inputs": "Complete diff, test results", "outputs": "Findings and fixes"},
    "ai-agent": {"tools": ["apis", "python", "webhooks"], "models": ["chatgpt", "claude", "local-ai"], "validation": "review-agent",
                 "role": "Wires models into products: prompts, tool calling, fallbacks and limits.", "inputs": "Use case, data constraints", "outputs": "AI features, adapters"},
    "local-agent": {"tools": ["python", "file-data"], "models": ["local-ai"], "validation": "approval",
                    "role": "Answers over private documents with local models only — nothing leaves the machine.", "inputs": "Private documents, a question", "outputs": "Grounded answers with sources"},
    "automation-agent": {"tools": ["n8n", "webhooks", "apis", "python"], "models": ["chatgpt", "claude"], "validation": "approval",
                         "role": "Designs n8n workflows, webhooks and scheduled jobs around the AI steps.", "inputs": "Process description, systems to connect", "outputs": "Workflow definitions"},
    "deploy-agent": {"tools": ["webhooks", "apis"], "models": ["claude"], "validation": "approval",
                     "role": "Prepares the release, runs the deploy and keeps a rollback ready.", "inputs": "An approved build", "outputs": "Deployment, release notes"},
}
for agent_id, spec in AGENTS.items():
    assert N[agent_id].type == "agent", agent_id
    assert all(t in TOOLS for t in spec["tools"]), agent_id
    assert all(m in MODELS for m in spec["models"]), agent_id
    assert spec["validation"] in N, agent_id
assert sorted(AGENTS) == sorted(n.id for n in NODES if n.type == "agent")


@dataclass
class Connection:
    source: str
    target: str
    verb: str
    kind: str  # visual family: flow | model | agent-bus | automation | data | control | delivery

    @property
    def id(self) -> str:
        return f"{self.source}>{self.target}"


CONNECTIONS: list[Connection] = [
    Connection("client", "goal", "triggers", "flow"),
    Connection("form", "application", "triggers", "flow"),
    Connection("application", "goal", "triggers", "flow"),
    Connection("goal", "orchestrator", "delegates", "flow"),
    Connection("orchestrator", "state", "reads-writes", "flow"),
    Connection("orchestrator", "planner", "delegates", "flow"),
    Connection("planner", "agent-router", "routes", "flow"),
    Connection("orchestrator", "model-router", "routes", "model"),
    *[Connection("model-router", m, "selects-model", "model") for m in MODELS],
    *[Connection("agent-router", a, "routes", "agent-bus") for a in AGENTS],
    *[Connection(a, t, "calls", "agent-bus") for a, s in AGENTS.items() for t in s["tools"]],
    Connection("triggers", "n8n", "triggers", "automation"),
    Connection("n8n", "orchestrator", "triggers", "automation"),
    Connection("n8n", "webhooks", "automates", "automation"),
    Connection("n8n", "apis", "calls", "automation"),
    Connection("n8n", "python", "calls", "automation"),
    Connection("n8n", "email", "automates", "automation"),
    Connection("n8n", "database", "reads-writes", "automation"),
    Connection("n8n", "actions", "automates", "automation"),
    Connection("python", "local-ai", "calls", "data"),
    Connection("python", "private-docs", "reads-writes", "data"),
    Connection("python", "embeddings", "reads-writes", "data"),
    Connection("apis", "database", "reads-writes", "data"),
    Connection("file-data", "embeddings", "reads-writes", "data"),
    Connection("embeddings", "private-docs", "reads-writes", "data"),
    Connection("local-ai", "embeddings", "reads-writes", "data"),
    Connection("application", "validation", "calls", "control"),
    Connection("test-agent", "validation", "validates", "control"),
    Connection("review-agent", "approval", "validates", "control"),
    Connection("validation", "approval", "validates", "control"),
    Connection("approval", "github", "approves", "delivery"),
    Connection("approval", "email", "approves", "delivery"),
    Connection("approval", "actions", "approves", "delivery"),
    Connection("github", "vercel", "deploys", "delivery"),
    Connection("vercel", "production", "deploys", "delivery"),
]
C = {c.id: c for c in CONNECTIONS}
assert len(C) == len(CONNECTIONS), "duplicate connection"
for c in CONNECTIONS:
    assert c.source in N and c.target in N, c.id
    assert c.verb in VERBS, c.id

# Selectable workflow traces. Every step is a node id; a nested list is a parallel step.
WORKFLOWS = [
    ("development", "Development", "From a requirement to a verified production deploy.",
     ["goal", "orchestrator", "planner", ["frontend-agent", "backend-agent", "python-agent"], "test-agent", "review-agent", "github", "vercel", "production"]),
    ("automation", "Automation", "An n8n workflow that hands reasoning to the orchestrator and acts only after approval.",
     ["triggers", "n8n", "orchestrator", "automation-agent", ["python", "apis"], "validation", "approval", "actions"]),
    ("ai-research", "AI research", "A research question answered with cloud models, web tools and a human review.",
     ["goal", "orchestrator", "research-agent", ["chatgpt", "claude"], "browser", "python", "validation", "approval", "actions"]),
    ("local-ai", "Local AI", "Answers over private documents without sending them to a cloud model.",
     ["private-docs", "python", "embeddings", "local-ai", "validation", "application"]),
    ("website-lead", "Website lead", "A contact form enquiry validated, routed and delivered by email.",
     ["form", "application", "validation", "n8n", "email", "database", "actions"]),
]
for wid, _, _, steps in WORKFLOWS:
    for step in steps:
        for sid in step if isinstance(step, list) else [step]:
            assert sid in N, f"{wid}: unknown step {sid}"


# ================================================================ focus sets
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
    "local-ai": ["local-ai", "model-router", "orchestrator", *agents_using("local-ai"), "python", "file-data", "embeddings", "private-docs"],
    "python": ["python", *agents_with_tool("python"), "apis", "file-data", "n8n", "local-ai", "embeddings", "private-docs", "database"],
    "validation": ["validation", "test-agent", "review-agent", "approval", "github", "application"],
    "approval": ["validation", "approval", "review-agent", "github", "vercel", "production", "email", "actions"],
    "triggers": ["triggers", "n8n", "orchestrator", "webhooks"],
    "goal": ["client", "application", "goal", "orchestrator"],
    "form": ["form", "application", "validation", "n8n", "email"],
}
for agent_id, spec in AGENTS.items():
    FOCUS[agent_id] = [agent_id, "agent-router", "model-router", *spec["tools"], *spec["models"], spec["validation"]]
for t in TOOLS:
    FOCUS.setdefault(t, [t, *agents_with_tool(t)])
neighbours: dict[str, set[str]] = {n.id: {n.id} for n in NODES}
for c in CONNECTIONS:
    neighbours[c.source].add(c.target)
    neighbours[c.target].add(c.source)
for n in NODES:
    FOCUS.setdefault(n.id, sorted(neighbours[n.id]))
for key in list(FOCUS):
    assert all(i in N for i in FOCUS[key]), key
    FOCUS[key] = sorted(set(FOCUS[key]) | {key})

# Legacy step flows still rendered as step diagrams further down the AI-native page.
FLOWS = {
    "development": ["dev-orchestrator", "planner", ["frontend-agent", "backend-agent", "ai-systems-agent", "python-agent", "test-agent", "review-agent"], "merge", "automated-tests", "git", "github", "ci-build", "vercel", "production"],
    "production": ["application", "trigger-in", "n8n", "orchestrator", "agent-router", ["ai-agents", "python", "apis", "database"], "validation", "approval-when-required", ["email", "crm", "database", "web-app", "external-api"]],
    "lead-form": ["lead-form", "n8n", "validation", "database", "email", "notification"],
    "scheduled": ["schedule", "n8n", "apis", "python", "ai-model", "validation", "output"],
    "ai-business": ["n8n-trigger", "orchestrator", "research-agent", "ai-model", "python-data", "review-agent", "n8n", "external-system"],
}

# ================================================================ desktop layout
WIDTH, HEIGHT = 1340, 1040
NODE_W, NODE_H = 164, 50
CHAMFER = 8
COL = [180, 372, 564, 756, 948, 1140]  # main columns
HALF = [276, 468, 660, 852, 1044, 1236]  # half-offset columns: traces drop through the gaps
Y_INPUT, Y_ORCH, Y_PLANNER, Y_ROUTER = 70, 180, 270, 350
Y_AGENT_BUS, Y_AGENTS_A, Y_AGENTS_B = 410, 465, 540
Y_TOOL_BUS, Y_TOOLS, Y_DATA, Y_CONTROL, Y_ACTIONS = 622, 680, 790, 890, 985
X_MODEL_BUS, X_MODELS = 1035, 1150
CH_TRIGGER, CH_N8N = 40, 70  # left channels: triggers -> n8n, n8n -> orchestrator
LABEL_X = 27  # band labels render rotated in the left margin

LAYERS = [
    {"id": "input", "label": "Input", "y0": 30, "y1": 110},
    {"id": "orchestration", "label": "Orchestration", "y0": 135, "y1": 378},
    {"id": "agents", "label": "Agents", "y0": 392, "y1": 580},
    {"id": "tools", "label": "Automation & tools", "y0": 600, "y1": 720},
    {"id": "data", "label": "Data", "y0": 755, "y1": 825},
    {"id": "control", "label": "Control & delivery", "y0": 855, "y1": 1020},
]
MODEL_BOX = {"id": "models", "label": "AI models", "x0": 1062, "x1": 1300, "y0": 164, "y1": 350}

# (x, y, band) per node; the orchestrator is drawn larger.
POS: dict[str, tuple[float, float, str]] = {
    "triggers": (COL[0], Y_INPUT, "input"), "client": (420, Y_INPUT, "input"), "goal": (660, Y_INPUT, "input"),
    "application": (900, Y_INPUT, "input"), "form": (COL[5], Y_INPUT, "input"),
    "state": (420, Y_ORCH, "orchestration"), "orchestrator": (660, Y_ORCH, "orchestration"), "model-router": (900, Y_ORCH, "orchestration"),
    "planner": (660, Y_PLANNER, "orchestration"), "agent-router": (660, Y_ROUTER, "orchestration"),
    "chatgpt": (X_MODELS, 200, "models"), "claude": (X_MODELS, 258, "models"), "local-ai": (X_MODELS, 316, "models"),
    "research-agent": (COL[0], Y_AGENTS_A, "agents"), "browser-agent": (COL[1], Y_AGENTS_A, "agents"), "frontend-agent": (COL[2], Y_AGENTS_A, "agents"),
    "backend-agent": (COL[3], Y_AGENTS_A, "agents"), "python-agent": (COL[4], Y_AGENTS_A, "agents"), "data-agent": (COL[5], Y_AGENTS_A, "agents"),
    # Testing and review sit directly above validation and approval, so the results path
    # below the tool bus continues their column instead of an unrelated agent's.
    "test-agent": (HALF[0], Y_AGENTS_B, "agents"), "review-agent": (HALF[1], Y_AGENTS_B, "agents"), "ai-agent": (HALF[2], Y_AGENTS_B, "agents"),
    "local-agent": (HALF[3], Y_AGENTS_B, "agents"), "automation-agent": (HALF[4], Y_AGENTS_B, "agents"), "deploy-agent": (HALF[5], Y_AGENTS_B, "agents"),
    "n8n": (COL[0], Y_TOOLS, "tools"), "python": (COL[1], Y_TOOLS, "tools"), "apis": (COL[2], Y_TOOLS, "tools"),
    "webhooks": (COL[3], Y_TOOLS, "tools"), "file-data": (COL[4], Y_TOOLS, "tools"), "browser": (COL[5], Y_TOOLS, "tools"),
    "database": (COL[2], Y_DATA, "data"), "embeddings": (COL[4], Y_DATA, "data"), "private-docs": (COL[5], Y_DATA, "data"),
    "validation": (HALF[0], Y_CONTROL, "control"), "approval": (HALF[1], Y_CONTROL, "control"), "github": (HALF[2], Y_CONTROL, "control"),
    "vercel": (HALF[3], Y_CONTROL, "control"), "production": (HALF[4], Y_CONTROL, "control"),
    "email": (HALF[1], Y_ACTIONS, "control"), "actions": (HALF[2], Y_ACTIONS, "control"),
}
assert sorted(POS) == sorted(N), set(POS) ^ set(N)
SIZE = {nid: ((200, 56) if nid == "orchestrator" else (NODE_W, NODE_H)) for nid in N}


def top(nid: str, dx: float = 0): return (POS[nid][0] + dx, POS[nid][1] - SIZE[nid][1] / 2)
def bottom(nid: str, dx: float = 0): return (POS[nid][0] + dx, POS[nid][1] + SIZE[nid][1] / 2)
def left(nid: str, dy: float = 0): return (POS[nid][0] - SIZE[nid][0] / 2, POS[nid][1] + dy)
def right(nid: str, dy: float = 0): return (POS[nid][0] + SIZE[nid][0] / 2, POS[nid][1] + dy)


def simplify(points):
    out = []
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


def chamfered(points) -> str:
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


def length(points) -> float:
    return sum(abs(points[i][0] - points[i - 1][0]) + abs(points[i][1] - points[i - 1][1]) for i in range(1, len(points)))


def vline(a, b): return [bottom(a), top(b)]


def hline(a, b):
    return [right(a), left(b)] if POS[b][0] > POS[a][0] else [left(a), right(b)]


# Drawn traces. Each belongs to exactly one semantic connection; connections without a
# trace (e.g. n8n -> email) are still highlighted through their nodes.
TRACE_POINTS: dict[str, list] = {
    "client>goal": hline("client", "goal"),
    "application>goal": hline("application", "goal"),
    "form>application": hline("form", "application"),
    "goal>orchestrator": vline("goal", "orchestrator"),
    "orchestrator>state": hline("orchestrator", "state"),
    "orchestrator>model-router": hline("orchestrator", "model-router"),
    "orchestrator>planner": vline("orchestrator", "planner"),
    "planner>agent-router": vline("planner", "agent-router"),
    "triggers>n8n": [left("triggers"), (CH_TRIGGER, Y_INPUT), (CH_TRIGGER, Y_TOOLS + 8), left("n8n", 8)],
    "n8n>orchestrator": [left("n8n", -8), (CH_N8N, Y_TOOLS - 8), (CH_N8N, 225), (620, 225), bottom("orchestrator", -40)],
    "apis>database": vline("apis", "database"),
    "file-data>embeddings": vline("file-data", "embeddings"),
    "embeddings>private-docs": hline("embeddings", "private-docs"),
    # Results leave the tool bus under the testing agent and reach validation.
    "test-agent>validation": [(HALF[0], Y_TOOL_BUS), top("validation")],
    "validation>approval": hline("validation", "approval"),
    "approval>github": hline("approval", "github"),
    "github>vercel": hline("github", "vercel"),
    "vercel>production": hline("vercel", "production"),
    "approval>email": [bottom("approval"), top("email")],
    "approval>actions": [bottom("approval"), (HALF[1], 940), (HALF[2], 940), top("actions")],
}
for m in MODELS:
    TRACE_POINTS[f"model-router>{m}"] = [right("model-router"), (X_MODEL_BUS, Y_ORCH), (X_MODEL_BUS, POS[m][1]), left(m)]
for a in AGENTS:
    TRACE_POINTS[f"agent-router>{a}"] = [bottom("agent-router"), (660, Y_AGENT_BUS), (POS[a][0], Y_AGENT_BUS), top(a)]
for cid in TRACE_POINTS:
    assert cid in C, f"trace without connection: {cid}"

BUSES = [
    {"id": "agent-bus", "d": chamfered([(COL[0], Y_AGENT_BUS), (HALF[5], Y_AGENT_BUS)])},
    {"id": "tool-bus", "d": chamfered([(COL[0], Y_TOOL_BUS), (HALF[5], Y_TOOL_BUS)])},
    {"id": "model-bus", "d": chamfered([(X_MODEL_BUS, Y_ORCH), (X_MODEL_BUS, POS["local-ai"][1])])},
]
TAPS = [{"id": f"tap-{a}", "node": a, "d": chamfered([bottom(a), (POS[a][0], Y_TOOL_BUS)])} for a in AGENTS]
TAPS += [{"id": f"tap-{t}", "node": t, "d": chamfered([(POS[t][0], Y_TOOL_BUS), top(t)])} for t in TOOLS]
# Exact agent -> tool paths, one per "calls" connection.
ROUTES = {
    a: [{"tool": t, "connection": f"{a}>{t}", "d": chamfered([bottom(a), (POS[a][0], Y_TOOL_BUS), (POS[t][0], Y_TOOL_BUS), top(t)])} for t in s["tools"]]
    for a, s in AGENTS.items()
}


# ================================================================ build
def build() -> dict:
    prefix = {"input": "IN", "core": "U", "model": "M", "agent": "A", "tool": "J", "data": "D", "control": "Q", "delivery": "P"}
    counters: dict[str, int] = {}
    designators = {}
    for n in NODES:
        p = prefix[n.type]
        counters[p] = counters.get(p, 0) + 1
        designators[n.id] = f"{p}{counters[p]}"

    traces = [
        {"id": cid, "connection": cid, "kind": C[cid].kind, "d": chamfered(pts), "length": round(length(simplify(pts)))}
        for cid, pts in TRACE_POINTS.items()
    ]
    topology = {
        "nodes": [[n.id, n.type, n.stage, n.status] for n in NODES],
        "connections": [[c.id, c.verb] for c in CONNECTIONS],
        "agents": {a: [s["tools"], s["models"], s["validation"]] for a, s in AGENTS.items()},
        "workflows": [[w[0], w[3]] for w in WORKFLOWS],
        "positions": POS,
        "sizes": SIZE,
    }
    digest = hashlib.sha256(json.dumps(topology, sort_keys=True).encode()).hexdigest()[:12]
    viewbox = [0, 0, WIDTH, HEIGHT]
    return {
        "meta": {
            "generator": "scripts/generate_ai_circuit.py",
            "description": "AI orchestration architecture: human intent, an orchestrator with planner, agent router and model router, specialised agents, a separate model layer, n8n and Python in the automation and tool layer, data, validation, human approval and delivery.",
            "topologyHash": digest,
            "nodeCount": len(NODES),
            "edgeCount": len(traces),
            "connectionCount": len(CONNECTIONS),
            "agentCount": len(AGENTS),
            "stageCount": len(STAGES),
            "workflowCount": len(WORKFLOWS),
            "groupCount": len(LAYERS) + 1,
            "traceLength": sum(t["length"] for t in traces),
        },
        # Alias of layouts.desktop.viewBox for consumers that only need the static SVG's size.
        "viewBox": viewbox,
        "verbs": VERBS,
        "stages": [{"id": sid, "label": label, "summary": summary, "nodeIds": [n.id for n in NODES if n.stage == sid]} for sid, label, summary in STAGES],
        "nodes": [
            {
                "id": n.id, "label": n.label, "sub": n.sub, "type": n.type, "stage": n.stage, "description": n.description,
                "mobilePriority": n.priority, "status": n.status, "uses": n.uses,
            }
            for n in NODES
        ],
        "connections": [{"id": c.id, "from": c.source, "to": c.target, "verb": c.verb, "kind": c.kind} for c in CONNECTIONS],
        "agents": {
            a: {"role": s["role"], "inputs": s["inputs"], "outputs": s["outputs"], "tools": s["tools"], "models": s["models"], "validation": s["validation"]}
            for a, s in AGENTS.items()
        },
        "tools": TOOLS,
        "models": MODELS,
        "focus": FOCUS,
        "workflows": [{"id": wid, "label": label, "summary": summary, "steps": steps} for wid, label, summary, steps in WORKFLOWS],
        "flows": FLOWS,
        "layouts": {
            "desktop": {
                "viewBox": viewbox,
                "layers": LAYERS,
                "labelX": LABEL_X,
                "modelBox": MODEL_BOX,
                "positions": {
                    nid: {"x": x, "y": y, "w": SIZE[nid][0], "h": SIZE[nid][1], "band": band, "designator": designators[nid]}
                    for nid, (x, y, band) in POS.items()
                },
                "traces": traces,
                "buses": BUSES,
                "taps": TAPS,
                "routes": ROUTES,
            }
        },
    }


# ================================================================ static SVG
COLORS = {
    "board": "#0f1014", "band": "#14161c", "bandline": "#22252e", "dot": "#1b1d24", "trace": "#3a3e4a", "bus": "#5a5f6d",
    "auto": "#c2310f", "data": "#2f6b4f", "text": "#eceae3", "mute": "#9b9ea9", "ok": "#4fd18b",
}
TYPE_STROKE = {
    "input": "#eceae3", "core": "#f2411a", "model": "#eceae3", "agent": "#9b9ea9",
    "tool": "#eceae3", "data": "#4fd18b", "control": "#4fd18b", "delivery": "#eceae3",
}
KIND_COLOR = {"flow": "trace", "model": "bus", "agent-bus": "bus", "automation": "auto", "data": "data", "control": "data", "delivery": "trace"}


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def render_svg(data: dict) -> str:
    lay = data["layouts"]["desktop"]
    w, h = WIDTH, HEIGHT
    o = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-labelledby="t d" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">',
        '<title id="t">AI orchestration architecture</title>',
        f'<desc id="d">{esc(data["meta"]["description"])} Generated by {data["meta"]["generator"]}.</desc>',
        f'<rect width="{w}" height="{h}" fill="{COLORS["board"]}"/>',
        f'<defs><pattern id="g" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="{COLORS["dot"]}"/></pattern></defs>',
        f'<rect width="{w}" height="{h}" fill="url(#g)"/>',
    ]
    for layer in LAYERS:
        cy = (layer["y0"] + layer["y1"]) / 2
        o.append(f'<rect x="16" y="{layer["y0"]}" width="{w - 32}" height="{layer["y1"] - layer["y0"]}" fill="{COLORS["band"]}" fill-opacity="0.55" stroke="{COLORS["bandline"]}"/>')
        o.append(f'<text x="{LABEL_X}" y="{cy}" transform="rotate(-90 {LABEL_X} {cy})" text-anchor="middle" dominant-baseline="middle" font-size="8.5" letter-spacing="1" fill="{COLORS["mute"]}">{esc(layer["label"].upper())}</text>')
    mb = MODEL_BOX
    o.append(f'<rect x="{mb["x0"]}" y="{mb["y0"]}" width="{mb["x1"] - mb["x0"]}" height="{mb["y1"] - mb["y0"]}" fill="none" stroke="{COLORS["bus"]}" stroke-dasharray="4 4"/>')
    o.append(f'<text x="{mb["x1"]}" y="{mb["y0"] - 6}" text-anchor="end" font-size="8.5" letter-spacing="1" fill="{COLORS["mute"]}">{esc(mb["label"].upper())}</text>')
    for bus in lay["buses"]:
        o.append(f'<path d="{bus["d"]}" fill="none" stroke="{COLORS["bus"]}" stroke-width="4" stroke-linecap="round"/>')
    for tap in lay["taps"]:
        o.append(f'<path d="{tap["d"]}" fill="none" stroke="{COLORS["trace"]}" stroke-width="1.6"/>')
    for t in lay["traces"]:
        o.append(f'<path d="{t["d"]}" fill="none" stroke="{COLORS[KIND_COLOR[t["kind"]]]}" stroke-width="2" stroke-linejoin="round"/>')
    for n in data["nodes"]:
        p = lay["positions"][n["id"]]
        x, y = p["x"] - p["w"] / 2, p["y"] - p["h"] / 2
        core = n["id"] == "orchestrator"
        o.append(f'<g><rect x="{x}" y="{y}" width="{p["w"]}" height="{p["h"]}" rx="3" fill="{COLORS["board"]}" stroke="{TYPE_STROKE[n["type"]]}" stroke-width="{2 if core else 1.2}"/>')
        o.append(f'<text x="{x + 6}" y="{y - 4}" font-size="8" fill="{COLORS["mute"]}" letter-spacing="1">{p["designator"]}</text>')
        if n["status"] == "live":
            o.append(f'<circle cx="{x + p["w"] - 8}" cy="{y + 8}" r="2.6" fill="{COLORS["ok"]}"/>')
        o.append(f'<text x="{p["x"]}" y="{p["y"] - 2}" font-size="{13.5 if core else 12}" fill="{COLORS["text"]}" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600">{esc(n["label"])}</text>')
        o.append(f'<text x="{p["x"]}" y="{p["y"] + 13}" font-size="8.5" fill="{COLORS["mute"]}" text-anchor="middle">{esc(n["sub"])}</text></g>')
    o.append(f'<circle cx="{w - 300}" cy="{h - 12}" r="2.6" fill="{COLORS["ok"]}"/><text x="{w - 292}" y="{h - 9}" font-size="9" fill="{COLORS["mute"]}">LIVE IN THIS SITE · OTHERS: CAPABILITY</text>')
    o.append(f'<text x="28" y="{h - 9}" font-size="9" fill="{COLORS["mute"]}">GENERATED BY {esc(data["meta"]["generator"].upper())} · {data["meta"]["topologyHash"]}</text>')
    o.append("</svg>")
    return "\n".join(o) + "\n"


def main() -> None:
    data = build()
    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    SVG_OUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    SVG_OUT.write_text(render_svg(data), encoding="utf-8")
    m = data["meta"]
    print(f"ai-circuit: {m['nodeCount']} nodes, {m['connectionCount']} connections ({m['edgeCount']} drawn), {m['agentCount']} agents, {m['workflowCount']} workflows, hash {m['topologyHash']}")
    print(f"  -> {JSON_OUT.relative_to(ROOT)}")
    print(f"  -> {SVG_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
