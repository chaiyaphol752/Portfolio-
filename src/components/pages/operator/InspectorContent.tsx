"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CornerDownLeft } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { PageId } from "@/config/pages";
import type { OperatorContent } from "@/content/operator";
import { localizedPath } from "@/i18n/routing";
import { runOperatorCommand } from "@/lib/operator/terminal";
import { circuit } from "@/components/circuit/circuit-data";
import { circuitCopy } from "@/components/circuit/labels";
import { agentsPy, Code } from "./screens";
import type { SurfaceId } from "./Inspector";
import s from "./inspector.module.css";

interface Props {
  surface: SurfaceId;
  locale: Locale;
  t: OperatorContent;
  onNavigate: () => void;
}

function Portal({ href, label, onNavigate }: { href: string; label: string; onNavigate: () => void }) {
  return (
    <Link href={href} onClick={onNavigate} className={s.portal}>
      {label}
      <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}

function Architecture({ locale, t, onNavigate }: Omit<Props, "surface">) {
  return (
    <>
      <ol className={s.spine}>
        {t.inspect.architecture.map(([label, body], i) => (
          <li key={label} data-core={i === 1 ? "" : undefined}>
            <span className={s.spineDot} aria-hidden />
            <span className={s.spineLabel}>{label}</span>
            <span className={s.spineBody}>{body}</span>
          </li>
        ))}
      </ol>
      <Portal href={localizedPath(locale, "ai-native")} label={t.inspect.links.architecture} onNavigate={onNavigate} />
    </>
  );
}

function Python({ locale, t, onNavigate }: Omit<Props, "surface">) {
  return (
    <>
      <p className={s.lead}>{t.inspect.python.lead}</p>
      <div className={s.hub}>
        <span className={s.hubCore}>Python</span>
        <ul className={s.hubLinks}>
          {t.inspect.python.uses.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>
      <figure className={s.fragment} tabIndex={0} aria-label="scripts/generate_ai_circuit.py">
        <figcaption>scripts/generate_ai_circuit.py</figcaption>
        <Code lines={agentsPy} />
      </figure>
      <Portal href={localizedPath(locale, "capabilities")} label={t.inspect.links.python} onNavigate={onNavigate} />
    </>
  );
}

const quick = ["help", "stack", "ai", "python", "security", "projects", "contact"];

function Terminal({ locale, t, onNavigate }: Omit<Props, "surface">) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [log, setLog] = useState<{ cmd: string; lines: string[] }[]>([{ cmd: "", lines: [t.terminal.intro] }]);

  const run = (cmd: string) => {
    const result = runOperatorCommand(cmd, t.terminal);
    if (result.clear) setLog([]);
    else if (cmd.trim()) setLog((prev) => [...prev.slice(-30), { cmd: cmd.trim().slice(0, 60), lines: result.lines }]);
    if (result.navigate) {
      const href = localizedPath(locale, result.navigate satisfies PageId);
      window.setTimeout(() => {
        onNavigate();
        router.push(href);
      }, 650);
    }
  };

  return (
    <div className={s.console}>
      <div className={s.consoleLog} role="log" aria-live="polite" aria-label={t.terminal.label}>
        {log.map((entry, i) => (
          <div key={i}>
            {entry.cmd && (
              <p className={s.consoleCmd}>
                <span aria-hidden>operator ~ $ </span>
                {entry.cmd}
              </p>
            )}
            {entry.lines.map((line, j) => (
              <p key={j} className={s.consoleLine}>{line}</p>
            ))}
          </div>
        ))}
      </div>
      <form
        className={s.consoleForm}
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue("");
          inputRef.current?.focus();
        }}
      >
        <label htmlFor={inputId} className="sr-only">{t.terminal.label}</label>
        <span aria-hidden className={s.prompt}>$</span>
        <input
          ref={inputRef}
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={60}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          placeholder={t.terminal.placeholder}
          className={s.consoleInput}
        />
        <button type="submit" className={s.consoleRun}>
          {t.terminal.run}
          <CornerDownLeft className="size-3.5" aria-hidden />
        </button>
      </form>
      <div className={s.chips}>
        {quick.map((c) => (
          <button key={c} type="button" onClick={() => run(c)} className={s.chip}>{c}</button>
        ))}
      </div>
    </div>
  );
}

function Pipeline({ locale, t, onNavigate }: Omit<Props, "surface">) {
  const [active, setActive] = useState(0);
  const stages = t.inspect.pipeline;
  const current = stages[active]!;
  return (
    <>
      <ol className={s.rail}>
        {stages.map(([label], i) => (
          <li key={label}>
            <button type="button" aria-pressed={i === active} onClick={() => setActive(i)} className={s.railStop}>
              <span className={s.railDot} aria-hidden />
              {label}
            </button>
          </li>
        ))}
      </ol>
      <div className={s.detail} aria-live="polite">
        <p className={s.detailKicker}>{String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</p>
        <p className={s.detailTitle}>{current[0]}</p>
        <p className={s.detailBody}>{current[1]}</p>
      </div>
      <Portal href={localizedPath(locale, "systems")} label={t.inspect.links.pipeline} onNavigate={onNavigate} />
    </>
  );
}

const agentOrder = ["research-agent", "frontend-agent", "backend-agent", "python-agent", "ai-agent", "automation-agent", "test-agent", "review-agent", "deploy-agent"];

function Agents({ locale, t, onNavigate }: Omit<Props, "surface">) {
  const copy = circuitCopy[locale];
  const [active, setActive] = useState(agentOrder[0]!);
  const spec = circuit.agents[active];
  const detail = copy.agents[active];
  const name = (id: string) => copy.nodes[id]?.label ?? id;
  return (
    <>
      <p className={s.lead}>{t.inspect.agentsLead}</p>
      <div className={s.agents}>
        <ul className={s.agentList}>
          {agentOrder.map((id) => (
            <li key={id}>
              <button type="button" aria-pressed={id === active} onClick={() => setActive(id)} className={s.agentBtn}>
                {name(id)}
              </button>
            </li>
          ))}
        </ul>
        {spec && detail && (
          <dl className={s.contract} aria-live="polite">
            <div><dt>{copy.inspector.responsibility}</dt><dd>{detail.responsibility}</dd></div>
            <div><dt>{copy.inspector.inputs}</dt><dd>{detail.inputs}</dd></div>
            <div><dt>{copy.inspector.tools}</dt><dd>{spec.tools.map(name).join(" · ")}</dd></div>
            <div><dt>{copy.inspector.models}</dt><dd>{spec.models.map(name).join(" · ")}</dd></div>
            <div><dt>{copy.inspector.output}</dt><dd>{detail.output}</dd></div>
            <div><dt>{copy.inspector.checkpoint}</dt><dd>{name(spec.validation)}</dd></div>
          </dl>
        )}
      </div>
      <Portal href={localizedPath(locale, "ai-native")} label={t.inspect.links.agents} onNavigate={onNavigate} />
    </>
  );
}

function Prototype({ locale, t, onNavigate }: Omit<Props, "surface">) {
  return (
    <>
      <div className={s.device} aria-hidden>
        <span className={s.deviceHead} />
        <span className={s.deviceLine} />
        <span className={s.deviceLine} style={{ width: "64%" }} />
        <span className={s.deviceBlock} />
        <span className={s.deviceBtn} />
      </div>
      <p className={s.lead}>{t.inspect.prototype}</p>
      <Portal href={localizedPath(locale, "projects")} label={t.inspect.links.prototype} onNavigate={onNavigate} />
    </>
  );
}

export default function InspectorContent({ surface, ...rest }: Props) {
  switch (surface) {
    case "architecture":
      return <Architecture {...rest} />;
    case "python":
      return <Python {...rest} />;
    case "terminal":
      return <Terminal {...rest} />;
    case "pipeline":
      return <Pipeline {...rest} />;
    case "agents":
      return <Agents {...rest} />;
    case "prototype":
      return <Prototype {...rest} />;
  }
}
