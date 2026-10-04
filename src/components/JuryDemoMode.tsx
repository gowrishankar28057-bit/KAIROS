"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Presentation, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CORRECTIVE_PRESET, TWIN_PRESET_EVENT } from "@/components/sections/DigitalTwin";
import { SECURITY_SCAN_EVENT } from "@/components/sections/SecurityLayer";
import { useSimulation } from "@/components/SimulationProvider";
import { Button } from "@/components/ui/button";

interface DemoStep {
  title: string;
  body: string;
  target: string;
  duration: number; // seconds
}

const STEPS: DemoStep[] = [
  {
    title: "The virtual bioreactor",
    body: "A mini bioreactor instrumented with six probes — pH, temperature, dissolved oxygen, biomass, CO₂ and VOC. Every value you see is a prototype simulation.",
    target: "lab-reactor",
    duration: 9,
  },
  {
    title: "Live sensor streams",
    body: "Signals travel ESP32 → Raspberry Pi → secure API every second. Values follow smooth process models rather than random noise.",
    target: "sensor-cards",
    duration: 9,
  },
  {
    title: "Simulated anomaly injected",
    body: "We now gradually introduce oxygen limitation. Watch dissolved oxygen drift from ~68% towards ~37% until KAIROS raises a flag.",
    target: "anomaly-panel",
    duration: 14,
  },
  {
    title: "BioFingerprint deviation",
    body: "Instead of judging DO alone, KAIROS compares the combined process pattern with the learned normal fingerprint. Similarity drops and the driving axes are identified.",
    target: "similarity-card",
    duration: 10,
  },
  {
    title: "Opening the Digital Twin",
    body: "Before touching the real culture, the operator can test adjustments on a virtual replica of the process.",
    target: "twin-reactor",
    duration: 7,
  },
  {
    title: "Corrected scenario",
    body: "The twin evaluates higher aeration and agitation, projects DO recovery over the next 12 h, and the correction is applied to the live simulation.",
    target: "twin-results",
    duration: 12,
  },
  {
    title: "Secure data pipeline",
    body: "Device authentication, TLS encryption, protected storage and an active audit trail — security built into the biological data path.",
    target: "security-shield",
    duration: 9,
  },
  {
    title: "KAIROS insight",
    body: "Observed a deviation, understood it multivariately, predicted the effect of a correction and supported a secure, human-in-the-loop decision.",
    target: "closing",
    duration: 10,
  },
];

const TOTAL = STEPS.reduce((a, s) => a + s.duration, 0);

export function JuryDemoMode() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const { injectAnomaly, clearAnomaly, applyCorrection, anomalyActive, anomaly, readings } = useSimulation();
  const highlighted = useRef<HTMLElement | null>(null);
  const timers = useRef<number[]>([]);
  const anomalyRef = useRef(anomalyActive);
  anomalyRef.current = anomalyActive;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const unhighlight = () => {
    highlighted.current?.classList.remove("demo-highlight");
    highlighted.current = null;
  };

  const enterStep = useCallback(
    (i: number) => {
      clearTimers();
      unhighlight();
      setElapsed(0);
      const s = STEPS[i];
      const el = document.getElementById(s.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if (s.target !== "closing") {
          el.classList.add("demo-highlight");
          highlighted.current = el;
        }
      }
      if (i <= 1) clearAnomaly();
      if (i === 2) injectAnomaly();
      if (i === 3 && !anomalyRef.current) injectAnomaly();
      if (i === 5) {
        if (!anomalyRef.current) injectAnomaly();
        window.dispatchEvent(new CustomEvent(TWIN_PRESET_EVENT, { detail: CORRECTIVE_PRESET }));
        timers.current.push(window.setTimeout(() => applyCorrection(), 1800));
      }
      if (i === 6) timers.current.push(window.setTimeout(() => window.dispatchEvent(new Event(SECURITY_SCAN_EVENT)), 600));
    },
    [applyCorrection, clearAnomaly, injectAnomaly],
  );

  const start = () => {
    setStep(0);
    setPlaying(true);
    setActive(true);
  };

  const exit = useCallback(() => {
    clearTimers();
    unhighlight();
    setActive(false);
    clearAnomaly();
  }, [clearAnomaly]);

  const go = useCallback((i: number) => setStep(Math.max(0, Math.min(STEPS.length - 1, i))), []);

  // run step side-effects when the step changes
  useEffect(() => {
    if (active) enterStep(step);
  }, [active, step, enterStep]);

  // auto-advance
  useEffect(() => {
    if (!active || !playing) return;
    const id = window.setInterval(() => setElapsed((e) => e + 0.25), 250);
    return () => window.clearInterval(id);
  }, [active, playing]);

  useEffect(() => {
    if (!active || elapsed < STEPS[step].duration) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else setPlaying(false);
  }, [active, elapsed, step]);

  // keyboard shortcuts
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
      if (e.key === "ArrowRight") go(step + 1);
      if (e.key === "ArrowLeft") go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, step, exit, go]);

  useEffect(() => () => clearTimers(), []);

  const s = STEPS[step];
  const doneBefore = STEPS.slice(0, step).reduce((a, x) => a + x.duration, 0);
  const overall = Math.min(1, (doneBefore + Math.min(elapsed, s.duration)) / TOTAL);

  return (
    <>
      {!active && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={start}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-navy-900/30 ring-4 ring-teal-glow/20 transition hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-teal-glow"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-glow opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-glow" />
          </span>
          <Presentation className="h-4 w-4" /> Jury Demo Mode
        </motion.button>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="Jury demo guided tour"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-navy-900/95 text-white shadow-2xl backdrop-blur md:bottom-5"
          >
            <div className="h-1 bg-white/10">
              <div className="h-full bg-gradient-to-r from-sci-400 to-teal-glow transition-[width] duration-200" style={{ width: `${overall * 100}%` }} />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal-glow">
                    Jury demo · Step {step + 1} / {STEPS.length}
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                      <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-sci-100">{s.body}</p>
                    </motion.div>
                  </AnimatePresence>
                  {step >= 2 && step <= 5 && (
                    <p className="mt-2 font-mono text-xs text-sci-200">
                      Live: DO {readings.do.toFixed(0)}% ·{" "}
                      <span className={anomaly.detected ? "text-red-300" : "text-emerald-300"}>
                        {anomaly.detected ? `ANOMALY (${anomaly.confidence}% conceptual confidence)` : "within envelope"}
                      </span>{" "}
                      · prototype simulation
                    </p>
                  )}
                  {step === STEPS.length - 1 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                      {["Observe", "Understand", "Predict", "Decide"].map((w) => (
                        <span key={w} className="rounded-lg bg-white/10 px-2 py-1.5 text-center font-semibold uppercase tracking-wider">
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={exit} className="rounded-lg p-1.5 text-sci-200 hover:bg-white/10 hover:text-white" aria-label="Exit demo">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex gap-1" aria-hidden>
                  {STEPS.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-teal-glow" : i < step ? "w-1.5 bg-sci-400" : "w-1.5 bg-white/20"}`} />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={() => go(step - 1)} disabled={step === 0}>
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? "Pause auto-play" : "Resume auto-play"}
                  >
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  {step < STEPS.length - 1 ? (
                    <Button size="sm" variant="teal" onClick={() => go(step + 1)}>
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="teal" onClick={exit}>
                      Exit Demo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
