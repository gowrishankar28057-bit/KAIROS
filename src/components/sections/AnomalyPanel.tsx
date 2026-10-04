"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, AlertTriangle, RotateCcw, ShieldCheck, Zap } from "lucide-react";
import { useSimulation } from "@/components/SimulationProvider";
import { Button } from "@/components/ui/button";
import { SimTag } from "@/components/ui/section";
import { Term } from "@/components/ui/tooltip";

export function AnomalyPanel() {
  const { anomaly, anomalyActive, anomalyLevel, correctionActive, injectAnomaly, clearAnomaly, readings } = useSimulation();
  const developing = anomalyActive && !anomaly.detected && !correctionActive;

  return (
    <div id="anomaly-panel" className="flex h-full flex-col rounded-2xl border border-sci-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">Anomaly detection</p>
        <SimTag label="Simulated decision support" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="danger" onClick={injectAnomaly} disabled={anomalyActive && !correctionActive}>
          <Zap className="h-4 w-4" /> Inject Anomaly
        </Button>
        <Button variant="outline" onClick={clearAnomaly} disabled={!anomalyActive}>
          <RotateCcw className="h-4 w-4" /> Restore Normal
        </Button>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden>
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-500 transition-all duration-700"
          style={{ width: `${Math.round(anomalyLevel * 100)}%` }}
        />
      </div>
      <p className="mt-1 font-mono text-[10px] text-slate-400">Simulated deviation intensity: {Math.round(anomalyLevel * 100)}%</p>

      <div className="mt-4 flex-1" aria-live="assertive">
        <AnimatePresence mode="wait">
          {anomaly.detected ? (
            <motion.div
              key="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <p className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider text-red-700">
                <AlertTriangle className="h-4 w-4 animate-pulse-soft" /> ANOMALY DETECTED
              </p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-slate-500">Parameter</dt>
                <dd className="font-semibold text-navy-900">
                  <Term tip="DO — Dissolved Oxygen">{anomaly.parameter}</Term>
                </dd>
                <dt className="text-slate-500">Deviation</dt>
                <dd className="font-mono font-semibold text-red-700">{anomaly.deviation}% (vs. 68% baseline)</dd>
                <dt className="text-slate-500">Confidence</dt>
                <dd className="font-mono font-semibold text-navy-900">
                  {anomaly.confidence}% <span className="font-sans text-xs font-normal text-slate-500">(conceptual model)</span>
                </dd>
                <dt className="text-slate-500">Potential risk</dt>
                <dd className="font-semibold text-navy-900">{anomaly.risk}</dd>
                <dt className="text-slate-500">Investigate</dt>
                <dd className="font-semibold text-navy-900">{anomaly.investigation}</dd>
                <dt className="text-slate-500">Flagged at</dt>
                <dd className="font-mono text-navy-900">{anomaly.since ?? "—"}</dd>
              </dl>
              <p className="mt-3 text-[11px] leading-snug text-slate-500">
                Simulated decision support only. Requires confirmation by a qualified operator and reference measurement.
              </p>
            </motion.div>
          ) : developing ? (
            <motion.div key="dev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                <Activity className="h-4 w-4 animate-pulse-soft" /> Deviation developing…
              </p>
              <p className="mt-2 text-sm text-amber-900/80">
                Simulated DO drifting down ({readings.do.toFixed(0)}%). KAIROS is comparing the multivariate pattern against the
                learned BioFingerprint.
              </p>
            </motion.div>
          ) : (
            <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <ShieldCheck className="h-4 w-4" /> {correctionActive ? "Recovering after virtual correction" : "Process within learned envelope"}
              </p>
              <p className="mt-2 text-sm text-emerald-900/80">
                Press <strong>Inject Anomaly</strong> to gradually simulate oxygen limitation (DO ~68% → ~37%).
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
