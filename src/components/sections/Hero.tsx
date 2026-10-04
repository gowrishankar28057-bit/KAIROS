"use client";

import { motion } from "framer-motion";
import { ArrowRight, Workflow } from "lucide-react";
import { Cells, DnaStrand, MolecularNetwork } from "@/components/BackgroundDecor";
import { HeroIllustration } from "@/components/sections/HeroIllustration";
import { buttonVariants } from "@/components/ui/button";
import { SimTag } from "@/components/ui/section";

const CHIPS = ["Real-time sensing", "AI BioFingerprint", "Digital Twin", "Cyberbiosecurity"];
const STORY = ["Biological system", "Data", "Intelligence", "Prediction", "Decision"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-lab pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <DnaStrand className="pointer-events-none absolute -left-6 top-10 hidden h-[560px] w-24 opacity-70 lg:block" />
      <MolecularNetwork className="pointer-events-none absolute right-6 bottom-6 h-48 w-56 opacity-60" />
      <Cells className="pointer-events-none absolute left-1/3 top-20 h-40 w-40 opacity-60 animate-float" />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold tracking-[0.35em] text-navy-900">KAIROS</span>
            <span className="h-4 w-px bg-sci-200" />
            <span className="text-sm font-medium text-sci-600">Adaptive Biological Intelligence Platform</span>
          </div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-navy-900 md:text-6xl">
            Turning Biological Signals Into{" "}
            <span className="bg-gradient-to-r from-sci-500 to-teal-glow bg-clip-text text-transparent">Predictive Intelligence</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            KAIROS combines real-time biological sensing, AI-driven pattern analysis, digital-twin simulation and secure
            decision support in a unified biotechnology intelligence platform.
          </p>
          <p className="mt-3 text-sm font-medium italic text-teal-700">“BioInsights Today for a Healthier Tomorrow”</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#virtual-lab" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Explore Virtual Prototype <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#workflow" className={buttonVariants({ variant: "outline", size: "lg" })}>
              <Workflow className="h-4 w-4" /> View System Workflow
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <li
                key={c}
                className="rounded-full border border-sci-200 bg-white/80 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-navy-800"
              >
                {c}
              </li>
            ))}
          </ul>

          <ol className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-semibold uppercase tracking-wider text-slate-500" aria-label="KAIROS story">
            {STORY.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className={i === STORY.length - 1 ? "text-teal-700" : ""}>{s}</span>
                {i < STORY.length - 1 && <ArrowRight className="h-3 w-3 text-sci-400" aria-hidden />}
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative rounded-3xl border border-sci-100 bg-white/70 p-4 shadow-2xl shadow-sci-500/10 backdrop-blur md:p-6"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">Prototype architecture</span>
            <SimTag />
          </div>
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}
