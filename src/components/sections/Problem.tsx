"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

const CURRENT = [
  "Fragmented sensors",
  "Manual monitoring",
  "Delayed anomaly detection",
  "Separated software tools",
  "Limited predictive capability",
  "Biological and cyber risks handled separately",
];
const KAIROS = [
  "Continuous sensing",
  "Connected biological intelligence",
  "Predictive anomaly detection",
  "AI-assisted interpretation",
  "Digital Twin experimentation",
  "Secure-by-design data architecture",
];

export function Problem() {
  return (
    <Section id="problem">
      <SectionHeader
        eyebrow="01 · The problem"
        title={
          <>
            Biological Processes Generate Data.
            <br />
            <span className="text-slate-400">Most Systems Still React Too Late.</span>
          </>
        }
      />
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl border border-slate-200 bg-slate-50/70 p-7"
        >
          <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Current workflow</p>
          <ul className="space-y-3">
            {CURRENT.map((t) => (
              <li key={t} className="flex items-center gap-3 text-slate-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200">
                  <X className="h-3.5 w-3.5 text-slate-500" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Reactive · response after deviation becomes visible
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative overflow-hidden rounded-2xl border border-sci-200 bg-gradient-to-br from-navy-900 to-navy-700 p-7 text-white shadow-xl shadow-navy-900/20"
        >
          <div className="bg-grid absolute inset-0 opacity-30" />
          <div className="relative">
            <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-teal-glow">KAIROS</p>
            <ul className="space-y-3">
              {KAIROS.map((t) => (
                <li key={t} className="flex items-center gap-3 text-sci-50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-glow/20">
                    <Check className="h-3.5 w-3.5 text-teal-glow" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-sci-200">
              <span className="h-2 w-2 rounded-full bg-teal-glow" /> Predictive · proposed early-warning decision support
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
