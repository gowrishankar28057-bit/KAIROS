import { BookOpen, BrainCircuit, ExternalLink, FlaskConical, ShieldCheck, Dna } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";

interface Ref {
  n: number;
  doi: string;
  journal: string;
}

const GROUPS: { title: string; icon: typeof BookOpen; refs: Ref[] }[] = [
  {
    title: "Bioprocess Intelligence",
    icon: FlaskConical,
    refs: [
      { n: 1, doi: "10.1016/j.biotechadv.2024.108378", journal: "Biotechnology Advances" },
      { n: 2, doi: "10.3390/fermentation11060323", journal: "Fermentation" },
      { n: 3, doi: "10.1007/10_2012_173", journal: "Adv. Biochem. Eng./Biotechnol." },
      { n: 4, doi: "10.1016/j.snb.2005.07.059", journal: "Sensors and Actuators B" },
    ],
  },
  {
    title: "AI & Digital Twin",
    icon: BrainCircuit,
    refs: [
      { n: 5, doi: "10.1016/j.procbio.2025.05.023", journal: "Process Biochemistry" },
      { n: 6, doi: "10.1016/j.copbio.2025.103392", journal: "Current Opinion in Biotechnology" },
      { n: 7, doi: "10.1016/j.copbio.2026.103516", journal: "Current Opinion in Biotechnology" },
    ],
  },
  {
    title: "Biomarker & BioDiscovery",
    icon: Dna,
    refs: [
      { n: 9, doi: "10.1016/j.cels.2021.06.006", journal: "Cell Systems" },
      { n: 10, doi: "10.1016/j.annonc.2023.10.125", journal: "Annals of Oncology" },
      { n: 11, doi: "10.1038/s41392-026-02946-4", journal: "Signal Transduct. Target. Ther." },
    ],
  },
  {
    title: "Cyberbiosecurity",
    icon: ShieldCheck,
    refs: [
      { n: 8, doi: "10.1042/ETLS20243003", journal: "Emerging Topics in Life Sciences" },
      { n: 12, doi: "10.3389/fbioe.2018.00039", journal: "Front. Bioeng. Biotechnol." },
      { n: 13, doi: "10.1109/COMST.2019.2914094", journal: "IEEE Commun. Surveys & Tutorials" },
      { n: 14, doi: "10.1109/ACCESS.2021.3109886", journal: "IEEE Access" },
      { n: 15, doi: "10.1109/JIOT.2021.3062630", journal: "IEEE Internet of Things Journal" },
    ],
  },
];

export function ResearchReferences() {
  return (
    <Section id="research">
      <SectionHeader
        eyebrow="10 · Research foundation"
        title="Built on Peer-Reviewed Science"
        subtitle="Selected peer-reviewed literature informing the KAIROS concept. Each reference opens at its DOI in a new tab."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {GROUPS.map((g) => (
          <Card key={g.title} className="flex flex-col p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sci-50 text-sci-600">
                <g.icon className="h-5 w-5" />
              </span>
              <h3 className="font-bold leading-tight text-navy-900">{g.title}</h3>
            </div>
            <ul className="space-y-2">
              {g.refs.map((r) => (
                <li key={r.doi}>
                  <a
                    href={`https://doi.org/${r.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 rounded-xl border border-slate-100 p-2.5 transition-colors hover:border-sci-300 hover:bg-sci-50/60"
                  >
                    <span className="mt-0.5 font-mono text-[11px] font-bold text-sci-500">[{r.n}]</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-navy-900">{r.journal}</span>
                      <span className="block break-all font-mono text-[10.5px] text-slate-500">doi:{r.doi}</span>
                    </span>
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-sci-500" aria-label="opens in new tab" />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
