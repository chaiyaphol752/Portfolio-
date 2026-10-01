import circuit from "@/generated/ai-circuit.json";
import { pages } from "@/config/pages";
import { locales } from "@/i18n/config";
import s from "./operator.module.css";

/** A code token: plain text, or a styled kind. Fragments are copied from this repository. */
type Tok = string | [string, "k" | "s" | "c" | "f" | "a" | "n"];
type Line = Tok[];

export function Code({ lines, className }: { lines: Line[]; className?: string }) {
  return (
    <pre className={`${s.code} ${className ?? ""}`}>
      {lines.map((line, i) => (
        <span key={i} className={s.codeLine}>
          {line.map((t, j) => (typeof t === "string" ? t : <span key={j} className={s[`t_${t[1]}`]}>{t[0]}</span>))}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}

type Frame = "monitor" | "bare" | "table" | "device";

/** Screens deliberately differ: a monitor, a bare hairline terminal, a borderless table, a device. */
function Chrome({ title, children, className, frame = "monitor" }: { title: string; children: React.ReactNode; className?: string; frame?: Frame }) {
  return (
    <div className={`${s.screen} ${s[`frame_${frame}`]} ${className ?? ""}`}>
      <div className={s.screenBar}>
        <span className={s.screenTitle}>{title}</span>
      </div>
      <div className={s.screenBody}>{children}</div>
    </div>
  );
}

/* ---------- real fragments ---------- */

const deliverTs: Line[] = [
  [["export async function", "k"], " ", ["deliverContact", "f"], "(input: ContactInput) {"],
  ["  ", ["const", "k"], " email = ", ["emailConfig", "f"], "();"],
  ["  ", ["if", "k"], " (email) tasks.", ["push", "f"], "({ name: ", ['"email"', "s"], ", run: … });"],
  ["  ", ["if", "k"], " (", ["hasDatabase", "f"], "()) tasks.", ["push", "f"], "({ name: ", ['"database"', "s"], " });"],
  ["  ", ["const", "k"], " settled = ", ["await", "k"], " Promise.", ["allSettled", "f"], "(…);"],
  ["  ", ["// never claims success when nothing accepted it", "c"]],
  ["  ", ["if", "k"], " (!channels.length) ", ["return", "k"], " { ok: ", ["false", "a"], " };"],
  ["}"],
];

export const agentsPy: Line[] = [
  [["AGENTS", "f"], " = {"],
  ["  ", ['"python-agent"', "s"], ": {"],
  ["    ", ['"tools"', "s"], ": [", ['"python"', "s"], ", ", ['"file-data"', "s"], ", ", ['"apis"', "s"], "],"],
  ["    ", ['"models"', "s"], ": [", ['"claude"', "s"], ", ", ['"chatgpt"', "s"], ", ", ['"local-ai"', "s"], "],"],
  ["    ", ['"validation"', "s"], ": ", ['"validation"', "s"], ","],
  ["  },"],
  ["  ", ['"local-agent"', "s"], ": { ", ['"models"', "s"], ": [", ['"local-ai"', "s"], "] },"],
  ["}"],
];

const zodTs: Line[] = [
  [["export const", "k"], " contactSchema = z.", ["object", "f"], "({"],
  ["  name: z.", ["string", "f"], "().", ["trim", "f"], "().", ["min", "f"], "(", ["2", "n"], ").", ["max", "f"], "(", ["100", "n"], "),"],
  ["  email: z.", ["string", "f"], "().", ["max", "f"], "(", ["200", "n"], ").", ["email", "f"], "(),"],
  ["  website: z.", ["string", "f"], "().", ["max", "f"], "(", ["0", "n"], "), ", ["// honeypot", "c"]],
  ["});"],
];

/** Real commits from this repository (short hash, subject), newest first. */
const commits: [string, string][] = [
  ["b438dcb", "Responsive orchestration architecture"],
  ["005d253", "Layered, bus-routed AI architecture"],
  ["cc3adfc", "Make real submissions opt-in in e2e"],
  ["1801e6f", "Ignore local env files explicitly"],
  ["f97e1fc", "Contact page with Resend delivery"],
  ["972bcbc", "Fix phone overflows, add QA scripts"],
  ["7dd5dfd", "Foundation: app shell, i18n, design system"],
];

const pipeline = ["lint", "typecheck", "test", "build", "deploy"];

/* ---------- screens: each one has a single visual purpose ---------- */

export function CodeScreen({ className }: { className?: string }) {
  return (
    <Chrome title="src/lib/contact/deliver.ts" className={className}>
      <Code lines={deliverTs} />
    </Chrome>
  );
}

export function PythonScreen({ className }: { className?: string }) {
  return (
    <Chrome title="scripts/generate_ai_circuit.py" className={className}>
      <Code lines={agentsPy} />
    </Chrome>
  );
}

export function SchemaScreen({ className }: { className?: string }) {
  return (
    <Chrome title="src/lib/contact/schema.ts" className={className}>
      <Code lines={zodTs} />
    </Chrome>
  );
}

const chain = ["Intent", "Orchestrator", "Agents", "Models", "Tools", "Production"];

/** Ultrawide monitor: the distilled orchestration bus. */
export function ArchitectureScreen({ className }: { className?: string }) {
  return (
    <Chrome title="architecture · orchestration bus" className={className}>
      <ol className={s.miniBus}>
        {chain.map((c, i) => (
          <li key={c} className={i === 1 ? s.miniBusCore : undefined}>{c}</li>
        ))}
      </ol>
    </Chrome>
  );
}

/** Portrait terminal: the real history of this site. */
export function TerminalScreen({ className }: { className?: string }) {
  return (
    <Chrome title="git log --oneline" className={className} frame="bare">
      <ul className={s.log}>
        {commits.map(([hash, subject]) => (
          <li key={hash}>
            <span className={s.t_c}>{hash}</span> {subject}
          </li>
        ))}
      </ul>
    </Chrome>
  );
}

/** Small diagnostic panel: counts computed from the real configuration at build time. */
export function DiagnosticScreen({ className }: { className?: string }) {
  const rows: [string, string][] = [
    ["routes", String(pages.length * locales.length)],
    ["locales", locales.join(" · ")],
    ["agents", String(circuit.meta.agentCount)],
    ["topology", circuit.meta.topologyHash],
  ];
  return (
    <Chrome title="system" className={className} frame="table">
      <dl className={s.diag}>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Chrome>
  );
}

/** Thin vertical log: the release pipeline, one stage per row. */
export function PipelineScreen({ className }: { className?: string }) {
  return (
    <Chrome title="release" className={className} frame="bare">
      <ol className={s.pipeline}>
        {pipeline.map((p) => (
          <li key={p}>
            <span aria-hidden className={s.tick} />
            {p}
          </li>
        ))}
      </ol>
    </Chrome>
  );
}

/** Minimal UI prototype: a wireframe of an interface being designed. */
export function PrototypeScreen({ className }: { className?: string }) {
  return (
    <Chrome title="interface · draft" className={className} frame="device">
      <div className={s.proto} aria-hidden>
        <span className={s.protoHead} />
        <span className={s.protoLine} />
        <span className={s.protoLine} style={{ width: "62%" }} />
        <span className={s.protoBtn} />
      </div>
    </Chrome>
  );
}

const roster = ["research", "frontend", "backend", "python", "ai integration", "automation", "testing", "review", "deployment"];

/** Agent roster: a translucent plane listing the specialised agents. */
export function AgentScreen({ className }: { className?: string }) {
  return (
    <Chrome title="agents · roster" className={`${s.agentPlane} ${className ?? ""}`} frame="bare">
      <ul className={s.roster}>
        {roster.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </Chrome>
  );
}

/** Lines used by the "code as material" scene: real fragments, set as typography. */
export const materialRows: { text: Line; size: "xl" | "l" | "m"; speed: number }[] = [
  { text: [["deliverContact", "f"], "(input)"], size: "xl", speed: -24 },
  { text: [["AGENTS", "f"], "[", ['"python-agent"', "s"], "][", ['"models"', "s"], "] → claude · chatgpt · local-ai"], size: "m", speed: 18 },
  { text: ["z.", ["string", "f"], "().", ["trim", "f"], "().", ["max", "f"], "(", ["4000", "n"], ")"], size: "l", speed: -14 },
  { text: [["git", "k"], " push origin main  →  ", ["vercel", "f"], "  →  ", ["production", "a"]], size: "m", speed: 22 },
  { text: ['{ "topologyHash": ', [`"${circuit.meta.topologyHash}"`, "s"], ', "agents": ', [String(circuit.meta.agentCount), "n"], " }"], size: "l", speed: -20 },
  { text: [["python3", "k"], " scripts/generate_ai_circuit.py"], size: "xl", speed: 16 },
];

export function MaterialRow({ row }: { row: (typeof materialRows)[number] }) {
  return (
    <p className={`${s.materialRow} ${s[`size_${row.size}`]}`} style={{ "--speed": row.speed } as React.CSSProperties}>
      {row.text.map((t, j) => (typeof t === "string" ? t : <span key={j} className={s[`t_${t[1]}`]}>{t[0]}</span>))}
    </p>
  );
}
