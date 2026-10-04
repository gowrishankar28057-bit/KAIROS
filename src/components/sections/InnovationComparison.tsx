"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Dna, Fingerprint, ShieldCheck } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

const CARDS = [
  { icon: Fingerprint, title: "BioFingerprint", text: "Learns multivariate biological process behaviour." },
  { icon: BrainCircuit, title: "Digital Twin", text: "Evaluates potential process adjustments virtually." },
  { icon: ShieldCheck, title: "Secure Stack", text: "Protects biological data across device, API and storage layers." },
  { icon: Dna, title: "BioDiscovery", text: "Connects biological patterns with biomarker investigation." },
];
const SHIFTS = [
  ["Reactive", "Predictive"],
  ["Fragmented", "Connected"],
  ["Monitoring", "Decision Support"],
];

export function InnovationComparison() {
  return (
    <Section id="innovation" className="bg-gradient-to-b from-sci-50/60 to-white">
      <SectionHeader eyebrow="11 · Innovation" title="What Makes KAIROS Different" align="center" className="mx-auto" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-2xl border border-sci-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-sci-300 hover:shadow-xl hover:shadow-sci-500/10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sci-500 to-teal-glow text-white shadow-lg shadow-sci-500/25">
              <c.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold tracking-wide text-navy-900 uppercase">{c.title}</h3>
            <p className="mt-2 text-slate-600">{c.text}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {SHIFTS.map(([a, b]) => (
          <div key={a} className="flex items-center justify-center gap-4 rounded-2xl border border-sci-100 bg-navy-900 px-5 py-5 text-sm font-bold uppercase tracking-[0.15em]">
            <span className="text-slate-400">{a}</span>
            <ArrowRight className="h-5 w-5 text-teal-glow" />
            <span className="text-white">{b}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
