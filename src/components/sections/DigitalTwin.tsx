"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FlaskConical, Play, RotateCcw, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSimulation } from "@/components/SimulationProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section, SectionHeader, SimTag } from "@/components/ui/section";
import { Term } from "@/components/ui/tooltip";
import { DEFAULT_TWIN, simulateTwin, type TwinControls, type TwinPoint } from "@/lib/simulation";
import { cn } from "@/lib/utils";

export const TWIN_PRESET_EVENT = "kairos:twin-preset";
export const CORRECTIVE_PRESET: TwinControls = { temperature: 36.8, aeration: 1.6, agitation: 420, feedRate: 11, phSetpoint: 7.2 };

const CONTROLS: { key: keyof TwinControls; label: string; unit: string; min: number; max: number; step: number; tip: string }[] = [
  { key: "temperature", label: "Temperature", unit: "°C", min: 34, max: 39, step: 0.1, tip: "Culture temperature setpoint." },
  { key: "aeration", label: "Aeration", unit: "vvm", min: 0.3, max: 2.5, step: 0.1, tip: "vvm — gas volume per liquid volume per minute." },
  { key: "agitation", label: "Agitation", unit: "rpm", min: 100, max: 700, step: 10, tip: "Impeller speed; influences mixing and oxygen transfer (kLa)." },
  { key: "feedRate", label: "Feed Rate", unit: "mL/h", min: 0, max: 30, step: 1, tip: "Nutrient feed rate; higher feed can raise oxygen demand." },
  { key: "phSetpoint", label: "pH Setpoint", unit: "", min: 6.6, max: 7.8, step: 0.05, tip: "Target pH maintained by acid/base dosing." },
];

function TwinReactor({ c, running }: { c: TwinControls; running: boolean }) {
  const bubbles = Math.round(4 + c.aeration * 6);
  const spin = Math.max(0.25, 1.4 - c.agitation / 600);
  return (
    <svg viewBox="0 0 220 300" className="mx-auto h-72 w-auto" role="img" aria-label="Virtual bioreactor reflecting the scenario settings">
      <defs>
        <linearGradient id="tw-liq" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" stopOpacity="0.75" />
          <stop offset="1" stopColor="#14c6c0" stopOpacity="0.85" />
        </linearGradient>
        <clipPath id="tw-clip">
          <path d="M42 60 V 250 A 68 16 0 0 0 178 250 V 60 Z" />
        </clipPath>
      </defs>
      <path d="M40 60 V 250 A 70 17 0 0 0 180 250 V 60" fill="#f0f7ff" stroke="#93c5fd" strokeWidth="2" strokeDasharray={running ? "0" : "5 4"} />
      <g clipPath="url(#tw-clip)">
        <rect x="30" y="110" width="160" height="170" fill="url(#tw-liq)" />
        <ellipse cx="110" cy="110" rx="68" ry="13" fill="#7dd3fc" />
        {Array.from({ length: bubbles }).map((_, i) => (
          <circle key={`${i}-${bubbles}`} cx={60 + ((i * 29) % 100)} cy="250" r={2 + (i % 2)} fill="#fff">
            <animate attributeName="cy" values="250;115" dur={`${2.2 + (i % 3) * 0.4}s`} begin={`${(i * 0.3) % 1.8}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur={`${2.2 + (i % 3) * 0.4}s`} begin={`${(i * 0.3) % 1.8}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <line x1="110" y1="40" x2="110" y2="235" stroke="#334155" strokeWidth="3" />
        <rect x="88" y="222" width="44" height="5" rx="2" fill="#334155">
          <animateTransform attributeName="transform" type="scale" values="1 1;0.15 1;1 1" dur={`${spin}s`} repeatCount="indefinite" additive="sum" />
        </rect>
      </g>
      <ellipse cx="110" cy="60" rx="76" ry="18" fill="#1a3570" />
      <rect x="98" y="22" width="24" height="30" rx="5" fill="#0a1a3f" />
      <text x="110" y="290" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#64748b" letterSpacing="1.2">
        DIGITAL TWIN · VIRTUAL
      </text>
    </svg>
  );
}

function Delta({ label, now, sim, unit, digits = 1 }: { label: string; now: number; sim: number; unit: string; digits?: number }) {
  const d = sim - now;
  const up = d > 0.001;
  const flat = Math.abs(d) < Math.pow(10, -digits);
  return (
    <div className="rounded-xl border border-sci-100 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label} @ +12 h</p>
      <p className="mt-1 font-mono text-sm text-slate-500">
        {now.toFixed(digits)} → <span className="font-bold text-navy-900">{sim.toFixed(digits)}</span> {unit}
      </p>
      <p className={cn("font-mono text-lg font-bold", flat ? "text-slate-400" : up ? "text-emerald-600" : "text-amber-600")}>
        {flat ? "≈ 0" : `${up ? "▲ +" : "▼ "}${d.toFixed(digits)}`} {unit}
      </p>
    </div>
  );
}

export function DigitalTwin() {
  const { readings, applyCorrection, anomalyActive, correctionActive } = useSimulation();
  const [controls, setControls] = useState<TwinControls>(DEFAULT_TWIN);
  const [result, setResult] = useState<TwinPoint[] | null>(null);
  const [running, setRunning] = useState(false);
  const [ranAt, setRanAt] = useState<string | null>(null);

  const run = useCallback(
    (c: TwinControls) => {
      setRunning(true);
      window.setTimeout(() => {
        setResult(simulateTwin(c, readings.do, readings.biomass));
        setRanAt(new Date().toLocaleTimeString("en-GB", { hour12: false }));
        setRunning(false);
      }, 900);
    },
    [readings.do, readings.biomass],
  );

  // Jury Demo Mode can push a corrective preset into the twin
  useEffect(() => {
    const handler = (e: Event) => {
      const preset = (e as CustomEvent<TwinControls>).detail ?? CORRECTIVE_PRESET;
      setControls(preset);
      run(preset);
    };
    window.addEventListener(TWIN_PRESET_EVENT, handler);
    return () => window.removeEventListener(TWIN_PRESET_EVENT, handler);
  }, [run]);

  const last = result?.[result.length - 1];

  return (
    <Section id="digital-twin">
      <SectionHeader
        eyebrow="05 · Digital Twin"
        title="Test Before Touching the Biological Process"
        subtitle={
          <>
            The <Term tip="Digital Twin — virtual representation of the biological process used for simulation and analysis.">Digital Twin</Term>{" "}
            provides a virtual environment for evaluating process adjustments before applying them to the biological system.
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr_1.4fr]">
        <Card id="twin-reactor" className="flex flex-col items-center justify-center p-5">
          <SimTag label="Conceptual Prototype Simulation" className="mb-3" />
          <TwinReactor c={controls} running={!!result} />
          <div className="mt-2 grid w-full grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-sci-50 p-2">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Live DO</p>
              <p className="font-mono text-sm font-bold text-navy-900">{readings.do.toFixed(0)}%</p>
            </div>
            <div className="rounded-lg bg-sci-50 p-2">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Live biomass</p>
              <p className="font-mono text-sm font-bold text-navy-900">{readings.biomass.toFixed(2)} OD</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-navy-900">
            <FlaskConical className="h-4 w-4 text-sci-500" /> Scenario controls
          </p>
          <div className="space-y-4">
            {CONTROLS.map((ctl) => (
              <div key={ctl.key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <label htmlFor={`twin-${ctl.key}`} className="font-medium text-slate-700">
                    <Term tip={ctl.tip}>{ctl.label}</Term>
                  </label>
                  <span className="font-mono text-xs font-semibold text-navy-900">
                    {controls[ctl.key].toFixed(ctl.step < 1 ? (ctl.step < 0.1 ? 2 : 1) : 0)} {ctl.unit}
                  </span>
                </div>
                <input
                  id={`twin-${ctl.key}`}
                  type="range"
                  min={ctl.min}
                  max={ctl.max}
                  step={ctl.step}
                  value={controls[ctl.key]}
                  onChange={(e) => setControls((c) => ({ ...c, [ctl.key]: Number(e.target.value) }))}
                  className="w-full accent-sci-500"
                />
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="accent" onClick={() => run(controls)} disabled={running}>
              <Play className="h-4 w-4" /> {running ? "Simulating…" : "Run Virtual Scenario"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setControls(DEFAULT_TWIN);
                setResult(null);
              }}
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
          <button
            type="button"
            className="mt-3 text-xs font-semibold text-sci-600 underline-offset-2 hover:underline"
            onClick={() => setControls(CORRECTIVE_PRESET)}
          >
            Load suggested corrective scenario (↑ aeration, ↑ agitation)
          </button>
        </Card>

        <Card id="twin-results" className="p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-navy-900">
              Current state <span className="text-slate-400">vs</span> simulated state
            </p>
            <SimTag label="Conceptual Prototype Simulation" />
          </div>
          {!result ? (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-sci-200 bg-sci-50/40 text-center text-sm text-slate-500">
              <FlaskConical className="mb-2 h-8 w-8 text-sci-300" />
              Adjust controls and press <strong className="text-navy-900">Run Virtual Scenario</strong>
              <span className="mt-1 text-xs">The twin projects the next 12 h from the live simulated state.</span>
            </div>
          ) : (
            <motion.div key={ranAt} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid gap-3 md:grid-cols-2">
                {(
                  [
                    { title: "Dissolved Oxygen (%)", a: "doCurrent", b: "doSim" },
                    { title: "Biomass (OD)", a: "biomassCurrent", b: "biomassSim" },
                  ] as const
                ).map((ch) => (
                  <div key={ch.title} className="h-48">
                    <p className="mb-1 text-xs font-semibold text-slate-600">{ch.title}</p>
                    <ResponsiveContainer width="100%" height="88%">
                      <LineChart data={result} margin={{ top: 4, right: 6, bottom: 0, left: -18 }}>
                        <CartesianGrid stroke="#e0efff" strokeDasharray="3 3" />
                        <XAxis dataKey="h" tick={{ fontSize: 10 }} tickFormatter={(h: number) => `+${h}h`} interval={3} />
                        <YAxis tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                        <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} labelFormatter={(h) => `+${h} h (simulated)`} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Line name="Current" dataKey={ch.a} stroke="#94a3b8" strokeDasharray="4 3" dot={false} strokeWidth={2} />
                        <Line name="Simulated" dataKey={ch.b} stroke="#14c6c0" dot={false} strokeWidth={2.4} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
              {last && (
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <Delta label="DO" now={last.doCurrent} sim={last.doSim} unit="%" digits={0} />
                  <Delta label="Biomass" now={last.biomassCurrent} sim={last.biomassSim} unit="OD" digits={2} />
                  <Delta label="CO₂" now={last.co2Current} sim={last.co2Sim} unit="%" digits={1} />
                </div>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-slate-400">Scenario run {ranAt} · conceptual response model</span>
                {anomalyActive && (
                  <Button variant="teal" size="sm" onClick={applyCorrection} disabled={correctionActive}>
                    {correctionActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                    {correctionActive ? "Applied to live simulation" : "Apply to live simulation"}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </Section>
  );
}
