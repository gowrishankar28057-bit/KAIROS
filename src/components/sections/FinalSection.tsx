import { DnaStrand, MolecularNetwork } from "@/components/BackgroundDecor";
import { KairosLogo } from "@/components/Navbar";

export function FinalSection() {
  return (
    <section id="closing" className="relative overflow-hidden bg-navy-950 py-28 text-white">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
      <DnaStrand className="pointer-events-none absolute right-10 top-0 hidden h-full w-28 opacity-50 lg:block" />
      <MolecularNetwork className="pointer-events-none absolute -left-10 bottom-0 h-64 w-72 opacity-40" />
      <div className="relative mx-auto max-w-[1320px] px-5 text-center md:px-8">
        <p className="text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
          <span className="block text-sci-200">Observe.</span>
          <span className="block text-sci-100">Understand.</span>
          <span className="block text-white">Predict.</span>
          <span className="block bg-gradient-to-r from-sci-400 to-teal-glow bg-clip-text text-transparent">Decide.</span>
        </p>
        <div className="mt-12 flex items-center justify-center gap-3">
          <KairosLogo className="h-10 w-10" />
          <span className="text-2xl font-bold tracking-[0.3em]">KAIROS</span>
        </div>
        <p className="mt-2 text-sci-200">Adaptive Biological Intelligence Platform</p>
        <p className="mx-auto mt-6 max-w-xl text-lg text-sci-100">Connecting biological systems with secure predictive intelligence.</p>
        <p className="mt-2 text-sm italic text-teal-glow">BioInsights Today for a Healthier Tomorrow</p>
      </div>
      <footer className="relative mx-auto mt-20 max-w-[1320px] border-t border-white/10 px-5 pt-6 text-center text-xs text-sci-200/70 md:px-8">
        KAIROS virtual prototype · All sensor values, scores and predictions shown are prototype simulations, not experimental or
        clinical data. Decision-support concept only.
      </footer>
    </section>
  );
}
