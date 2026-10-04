"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BrainCircuit,
  ChevronRight,
  Cpu,
  Database,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  Lightbulb,
  Lock,
  Radio,
  Server,
  Boxes,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const STAGES = [
  { icon: FlaskConical, label: "Biological Sample", layer: "Biology", text: "Cell culture or biological sample inside the mini bioreactor — the system being observed." },
  { icon: Gauge, label: "Sensors", layer: "Sensing", text: "pH, temperature, dissolved oxygen, biomass/turbidity, CO₂ and VOC probes convert biological state into electrical signals." },
  { icon: Cpu, label: "ESP32", layer: "Edge", text: "Collects sensor signals from the biological process, digitises them and timestamps each reading." },
  { icon: Server, label: "Raspberry Pi", layer: "Edge", text: "Edge gateway responsible for preprocessing, communication and local system control on a hardened Linux OS." },
  { icon: Lock, label: "Secure MQTT / REST", layer: "Transport", text: "TLS-encrypted MQTT / REST channels with device credentials carry data from the gateway to the backend." },
  { icon: Boxes, label: "FastAPI", layer: "Backend", text: "Secure application layer connecting sensor streams, analytics and dashboard services." },
  { icon: Database, label: "Neon PostgreSQL", layer: "Storage", text: "Stores biological process records, sensor time series and analysis results." },
  { icon: BrainCircuit, label: "AI Analytics", layer: "Intelligence", text: "BioFingerprint engine learns multivariate process behaviour and scores deviations from the learned envelope." },
  { icon: Radio, label: "Digital Twin", layer: "Prediction", text: "Virtual process model used to evaluate adjustments and project their likely effect before acting." },
  { icon: LayoutDashboard, label: "Dashboard", layer: "Interface", text: "Real-time visualisation of sensor streams, fingerprints, alerts and scenario outcomes." },
  { icon: Lightbulb, label: "Decision Support", layer: "Decision", text: "Alerts and recommendations for a qualified operator — the human stays in control of the process." },
];

export function ArchitectureFlow() {
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setPulse((p) => (p + 1) % STAGES.length), 700);
    return () => window.clearInterval(id);
  }, []);

  const stage = STAGES[active];

  return (
    <Section id="workflow" className="bg-navy-950 text-white">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative">
        <SectionHeader
          eyebrow="07 · System workflow"
          title={<span className="text-white">From Biological Sample to Decision</span>}
          subtitle={<span className="text-sci-200">Click any stage to see its role in the proposed KAIROS architecture.</span>}
        />
        <div className="-mx-5 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
          <ol className="flex min-w-max items-stretch gap-1 xl:min-w-0" aria-label="KAIROS data pipeline">
            {STAGES.map((s, i) => (
              <li key={s.label} className="flex items-center gap-1 xl:flex-1">
                <button
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={cn(
                    "group flex w-[104px] flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-center transition-all xl:w-full",
                    active === i
                      ? "border-teal-glow bg-teal-glow/10 shadow-[0_0_24px_rgba(20,198,192,0.25)]"
                      : "border-white/10 bg-white/[0.03] hover:border-sci-400/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      pulse === i ? "bg-teal-glow text-navy-950" : active === i ? "bg-teal-glow/20 text-teal-glow" : "bg-white/5 text-sci-200",
                    )}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-white">{s.label}</span>
                </button>
                {i < STAGES.length - 1 && (
                  <ChevronRight className={cn("h-4 w-4 shrink-0 transition-colors", pulse === i ? "text-teal-glow" : "text-white/25")} aria-hidden />
                )}
              </li>
            ))}
          </ol>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:grid-cols-[auto_1fr]"
            aria-live="polite"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-glow/15 text-teal-glow">
              <stage.icon className="h-7 w-7" />
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sci-400">
                Stage {String(active + 1).padStart(2, "0")} · {stage.layer}
              </p>
              <h3 className="mt-1 text-xl font-bold">{stage.label}</h3>
              <p className="mt-2 max-w-3xl text-sci-100">{stage.text}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
