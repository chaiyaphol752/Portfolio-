import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routing";
import { operatorContent } from "@/content/operator";
import { OperatorFigure } from "./OperatorFigure";
import { ScrollDirector } from "./ScrollDirector";
import { InspectorProvider, ScreenTrigger, type SurfaceId } from "./Inspector";
import { VisorButton } from "./VisorButton";
import {
  AgentScreen,
  ArchitectureScreen,
  CodeScreen,
  DiagnosticScreen,
  MaterialRow,
  PipelineScreen,
  PrototypeScreen,
  PythonScreen,
  TerminalScreen,
  materialRows,
} from "./screens";
import s from "./operator.module.css";

const ROOT_ID = "operator-root";
const chain = ["Intent", "Orchestrator", "Agents", "Models", "Tools", "Production"];
const corridorLabels = ["orchestrator", "routing", "local inference", "python toolchain", "agent state", "build verified", "human checkpoint", "production", "system ready", "deploy", "planner", "model router", "n8n workflow", "validation", "release", "context"];

/** The signature: one horizontal aperture of light. Used at the threshold and again at the end. */
function Signal({ withCaret = true }: { withCaret?: boolean }) {
  return (
    <div className={s.signalWrap} aria-hidden>
      <span className={s.signal} />
      {withCaret && <span className={s.caret} />}
    </div>
  );
}

const sceneStyle = (rest: number) => ({ "--rest": rest }) as React.CSSProperties;

export function OperatorExperience({ locale }: { locale: Locale }) {
  const t = operatorContent[locale];
  const trigger = (surface: SurfaceId, screen: React.ReactNode) => (
    <ScreenTrigger surface={surface} label={t.inspect.open.replace("{name}", t.inspect.names[surface])} cue={t.inspect.cue}>
      {screen}
    </ScreenTrigger>
  );
  return (
    <InspectorProvider locale={locale} t={t}>
    <div id={ROOT_ID} className={s.root}>
      <ScrollDirector rootId={ROOT_ID} />
      <h1 className="sr-only">{t.meta.title}</h1>

      {/* 00 — threshold: darkness and a single signal */}
      <section data-scene className={`${s.scene} ${s.threshold}`} style={sceneStyle(1)} aria-label={t.threshold.signal}>
        <div className={s.stage}>
          <p className={`${s.micro} ${s.cornerTL}`}>{t.threshold.signal}</p>
          <p className={`${s.micro} ${s.cornerTR}`}>operator</p>
          <Signal />
          <p className={s.thresholdLine}>{t.threshold.line}</p>
          <p className={`${s.micro} ${s.scrollHint}`} aria-hidden>{t.scroll}</p>
        </div>
      </section>

      {/* 01 — the operator, revealed through the aperture */}
      <section data-scene className={`${s.scene} ${s.reveal}`} style={sceneStyle(1)} aria-label={t.operator.label}>
        <div className={s.stage}>
          <div className={s.aperture}>
            <div className={s.backlight} aria-hidden />
            <div className={s.screenGlow} aria-hidden />
            <div className={s.heroFigureWrap}>
              <OperatorFigure uid="hero" className={s.heroFigure} title={t.figureAlt} />
              <VisorButton rootId={ROOT_ID} label={t.visor.label} message={t.visor.message} />
            </div>
            <div className={s.foreground} aria-hidden />
          </div>
          <span className={`${s.edge} ${s.edgeTop}`} aria-hidden />
          <span className={`${s.edge} ${s.edgeBottom}`} aria-hidden />
          <div className={s.revealCopy}>
            <p className={s.micro}>{t.operator.label}</p>
            <p className={s.statement}>{t.operator.line}</p>
          </div>
        </div>
      </section>

      {/* 02 — the screen field: different formats, one hierarchy */}
      <section data-scene className={`${s.scene} ${s.field}`} style={sceneStyle(1)} aria-label={t.field.label}>
        <div className={s.stage}>
          <p className={`${s.micro} ${s.cornerTL}`}>{t.field.label}</p>
          <div className={s.fieldSpace}>
            <OperatorFigure uid="field" className={s.fieldFigure} />
            <div className={s.slot} data-slot="log" style={{ "--at": 0.05 } as React.CSSProperties}>{trigger("pipeline", <PipelineScreen />)}</div>
            <div className={s.slot} data-slot="code" style={{ "--at": 0.1 } as React.CSSProperties}><CodeScreen /></div>
            <div className={s.slot} data-slot="wide" style={{ "--at": 0.2 } as React.CSSProperties}>{trigger("architecture", <ArchitectureScreen />)}</div>
            <div className={s.slot} data-slot="term" style={{ "--at": 0.28 } as React.CSSProperties}>{trigger("terminal", <TerminalScreen />)}</div>
            <div className={s.slot} data-slot="python" style={{ "--at": 0.36 } as React.CSSProperties}>{trigger("python", <PythonScreen />)}</div>
            <div className={s.slot} data-slot="diag" style={{ "--at": 0.44 } as React.CSSProperties}><DiagnosticScreen /></div>
            <div className={s.slot} data-slot="proto" style={{ "--at": 0.5 } as React.CSSProperties}>{trigger("prototype", <PrototypeScreen />)}</div>
            <div className={s.slot} data-slot="overlay" style={{ "--at": 0.58 } as React.CSSProperties}>{trigger("agents", <AgentScreen />)}</div>
          </div>
        </div>
        {/* Phones get one dominant screen at a time instead of eight at once. */}
        <div className={s.fieldMobile}>
          <OperatorFigure uid="fieldm" className={s.fieldMobileFigure} />
          {(
            [
              ["architecture", <ArchitectureScreen key="a" />],
              ["terminal", <TerminalScreen key="t" />],
              ["python", <PythonScreen key="p" />],
              ["pipeline", <PipelineScreen key="l" />],
              ["agents", <AgentScreen key="g" />],
            ] as [SurfaceId, React.ReactNode][]
          ).map(([surface, screen]) => (
            <div key={surface} data-reveal className={s.mobileScreen}>{trigger(surface, screen)}</div>
          ))}
        </div>
      </section>

      {/* 03 — orchestration core, distilled */}
      <section data-scene className={`${s.scene} ${s.core}`} style={sceneStyle(1)} aria-label={t.core.label}>
        <div className={s.stage}>
          <div className={s.coreMonitor}>
            <p className={s.micro}>{t.core.label}</p>
            <ol className={s.bus}>
              {chain.map((c, i) => (
                <li key={c} className={s.busNode} style={{ "--at": (i + 0.5) / chain.length } as React.CSSProperties} data-core={i === 1 ? "" : undefined}>
                  <span className={s.busDot} aria-hidden />
                  <span className={s.busLabel}>{c}</span>
                </li>
              ))}
            </ol>
            <div className={s.coreCopy}>
              <p className={s.statement}>{t.core.line}</p>
              <Link href={localizedPath(locale, "ai-native")} className={s.textLink}>
                {t.core.link} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — code as material */}
      <section data-scene className={`${s.scene} ${s.material}`} style={sceneStyle(0.5)} aria-label={t.code.label}>
        <div className={s.stage}>
          <p className={`${s.micro} ${s.cornerTL}`}>{t.code.label}</p>
          <div className={s.materialRows}>
            {materialRows.map((row, i) => (
              <MaterialRow key={i} row={row} />
            ))}
          </div>
          <p className={`${s.micro} ${s.cornerBL}`}>{t.code.caption}</p>
        </div>
      </section>

      {/* 05 — machine / human: the quiet scene */}
      <section data-scene className={`${s.scene} ${s.quiet}`} style={sceneStyle(0.5)} aria-label={t.quiet.line}>
        <div className={s.stage}>
          <OperatorFigure uid="quiet" className={s.quietFigure} />
          <p className={`${s.statement} ${s.quietLine}`}>{t.quiet.line}</p>
        </div>
      </section>

      {/* 06 — the continuous system: a corridor of frames that never reaches its end */}
      <section data-scene className={`${s.scene} ${s.loop}`} style={sceneStyle(0.35)} aria-label={t.loop.label}>
        <div className={s.stage}>
          <p className={`${s.micro} ${s.cornerTL}`}>{t.loop.label}</p>
          <div className={s.corridor} aria-hidden>
            {/* Hairline rails converge on the vanishing point, so the frames read as depth. */}
            <svg className={s.rails} viewBox="0 0 100 100" preserveAspectRatio="none">
              {[[0, 0], [100, 0], [0, 100], [100, 100], [25, 0], [75, 0], [25, 100], [75, 100]].map(([x, y]) => (
                <line key={`${x}-${y}`} x1={x} y1={y} x2="50" y2="46" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            {corridorLabels.map((label, i) => (
              <span key={label} className={s.frame} style={{ "--i": i } as React.CSSProperties}>
                <span className={s.frameLabel}>{label}</span>
              </span>
            ))}
            <span className={s.vanishing} />
          </div>
          <div className={s.band} aria-hidden>
            <div className={s.bandTrack}>
              {[0, 1].map((copy) => (
                <div key={copy} className={s.bandSet}>
                  <ArchitectureScreen className={s.bandScreen} />
                  <TerminalScreen className={s.bandScreen} />
                  <PythonScreen className={s.bandScreen} />
                  <DiagnosticScreen className={s.bandScreen} />
                  <CodeScreen className={s.bandScreen} />
                  <PipelineScreen className={s.bandScreen} />
                </div>
              ))}
            </div>
          </div>
          <p className={`${s.statement} ${s.loopLine}`}>{t.loop.line}</p>
        </div>
      </section>

      {/* 07 — signal collapse: the opening returns */}
      <section data-scene className={`${s.scene} ${s.collapse}`} style={sceneStyle(1)} aria-label={t.collapse.line}>
        <div className={s.stage}>
          <Signal />
          <p className={s.thresholdLine}>{t.collapse.line}</p>
        </div>
      </section>

      {/* 08 — exit */}
      <section className={s.exit}>
        <nav aria-label={t.meta.title} className={s.exitLinks}>
          <Link href={localizedPath(locale, "projects")}>{t.exit.work}<ArrowRight className="size-4" aria-hidden /></Link>
          <Link href={localizedPath(locale, "contact")}>{t.exit.project}<ArrowRight className="size-4" aria-hidden /></Link>
          <Link href={localizedPath(locale)}>{t.exit.back}<ArrowRight className="size-4" aria-hidden /></Link>
        </nav>
        <p className={s.exitNote}>{t.exit.note}</p>
      </section>
    </div>
    </InspectorProvider>
  );
}
