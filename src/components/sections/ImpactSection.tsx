import { Building2, Factory, HeartPulse, Microscope } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

const GROUPS = [
  { icon: Microscope, title: "Researchers & Biotechnologists", text: "Faster interpretation of complex biological process data." },
  { icon: Building2, title: "Biotech & Pharma", text: "Better process visibility and decision support." },
  { icon: HeartPulse, title: "Healthcare Research", text: "Supports biomarker investigation and biological data analysis." },
  { icon: Factory, title: "Biomanufacturing", text: "Improved monitoring, anomaly awareness and process optimization." },
];

export function ImpactSection() {
  return (
    <Section id="impact">
      <SectionHeader
        eyebrow="12 · Potential impact"
        title="Who KAIROS Is Designed For"
        subtitle="Intended benefits for research and process settings. KAIROS is not a clinical device and makes no clinical claims."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {GROUPS.map((g) => (
          <div key={g.title} className="relative overflow-hidden rounded-2xl border border-sci-100 bg-white p-6">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sci-50" aria-hidden />
            <g.icon className="relative h-7 w-7 text-sci-500" />
            <h3 className="relative mt-4 font-bold text-navy-900">{g.title}</h3>
            <p className="relative mt-2 text-sm text-slate-600">{g.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
