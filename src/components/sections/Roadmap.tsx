"use client";

import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const PHASES = [
  "Virtual Prototype",
  "Sensor-Integrated Mini Bioreactor",
  "AI Model Validation",
  "Digital Twin Integration",
  "Pilot Laboratory Deployment",
  "Scalable Biological Intelligence Platform",
];

export function Roadmap() {
  return (
    <Section id="roadmap" className="bg-gradient-to-b from-white to-sci-50/60">
      <SectionHeader eyebrow="13 · Future physical deployment" title="Roadmap to a Physical System" />
      <ol className="relative grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="absolute left-0 right-0 top-[22px] hidden h-0.5 bg-gradient-to-r from-teal-glow via-sci-400 to-sci-100 xl:block" aria-hidden />
        {PHASES.map((p, i) => (
          <motion.li
            key={p}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative"
          >
            <span
              className={cn(
                "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 font-mono text-sm font-bold",
                i === 0 ? "border-teal-glow bg-teal-glow text-white shadow-lg shadow-teal-glow/30" : "border-sci-200 bg-white text-sci-600",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className={cn("mt-4 rounded-2xl border p-4", i === 0 ? "border-teal-200 bg-white" : "border-sci-100 bg-white/70")}>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">Phase {String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 font-bold leading-snug text-navy-900">{p}</p>
              {i === 0 && <p className="mt-2 text-xs font-semibold text-teal-700">● Current stage — this demonstrator</p>}
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
