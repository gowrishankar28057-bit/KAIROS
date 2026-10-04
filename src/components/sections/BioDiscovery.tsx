"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Dna, FlaskRound, ListOrdered, ScanSearch } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section, SectionHeader, SimTag } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const PIPELINE = [
  { icon: FlaskRound, label: "Biological Sample" },
  { icon: ScanSearch, label: "Feature Extraction" },
  { icon: Dna, label: "Biomarker Pattern" },
  { icon: BrainCircuit, label: "AI Analysis" },
  { icon: ListOrdered, label: "Candidate Prioritization" },
];

const CANDIDATES = [
  { id: "Marker-A", relevance: 82, consistency: 76, evidence: 64, node: 0 },
  { id: "Marker-B", relevance: 71, consistency: 81, evidence: 58, node: 1 },
  { id: "Marker-C", relevance: 63, consistency: 59, evidence: 47, node: 2 },
  { id: "Marker-D", relevance: 48, consistency: 52, evidence: 33, node: 3 },
];

// molecular network: first 4 nodes are candidate markers, rest are context features
const NODES: [number, number][] = [
  [180, 120], [300, 90], [260, 210], [130, 230],
  [70, 120], [220, 40], [380, 150], [360, 250], [200, 300], [60, 300], [420, 60], [110, 50],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [2, 6], [2, 7], [2, 8], [3, 8], [3, 9], [4, 11], [5, 11], [6, 10], [1, 10], [7, 8], [4, 9],
];
const NODE_COLORS = ["#2479f2", "#14c6c0", "#7c3aed", "#f97316"];

export function BioDiscovery() {
  const [active, setActive] = useState(0);
  return (
    <Section id="biodiscovery" className="bg-gradient-to-b from-sci-50/50 to-white">
      <SectionHeader
        eyebrow="06 · BioDiscovery intelligence"
        title="From Biological Data to Discovery"
        subtitle="KAIROS is designed to support scientists in prioritizing biological patterns for further investigation — turning complex multi-parameter data into a ranked shortlist of candidates."
      />

      {/* pipeline */}
      <ol className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:items-center">
        {PIPELINE.map((s, i) => (
          <li key={s.label} className="flex flex-1 items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-1 items-center gap-3 rounded-xl border border-sci-100 bg-white px-3 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sci-50 text-sci-600">
                <s.icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm font-semibold leading-tight text-navy-900">{s.label}</span>
            </motion.div>
            {i < PIPELINE.length - 1 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-sci-400 lg:block" aria-hidden />}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-navy-900">Molecular interaction network</p>
            <SimTag label="Illustrative" />
          </div>
          <svg viewBox="0 0 480 340" className="h-auto w-full" role="img" aria-label="Conceptual molecular network with four highlighted candidate biomarkers">
            {EDGES.map(([a, b], i) => {
              const hot = a === active || b === active;
              return (
                <line
                  key={i}
                  x1={NODES[a][0]}
                  y1={NODES[a][1]}
                  x2={NODES[b][0]}
                  y2={NODES[b][1]}
                  stroke={hot ? NODE_COLORS[active] : "#bcdcff"}
                  strokeWidth={hot ? 2.2 : 1.2}
                  className={hot ? "flow-line" : ""}
                />
              );
            })}
            {NODES.map(([x, y], i) => {
              const isCand = i < 4;
              const isActive = i === active;
              return (
                <g key={i}>
                  {isActive && (
                    <circle cx={x} cy={y} r="26" fill={NODE_COLORS[i]} opacity="0.15">
                      <animate attributeName="r" values="20;30;20" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isCand ? 13 : 6}
                    fill={isCand ? NODE_COLORS[i] : "#e0efff"}
                    stroke={isCand ? "#fff" : "#93c5fd"}
                    strokeWidth="2"
                    className={isCand ? "cursor-pointer" : ""}
                    onClick={isCand ? () => setActive(i) : undefined}
                  />
                  {isCand && (
                    <text x={x} y={y + 30} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0a1a3f">
                      {CANDIDATES[i].id}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-navy-900">Candidate Biomarkers</p>
            <Badge tone="neutral">Conceptual scores · not measured</Badge>
          </div>
          <div className="space-y-3">
            {CANDIDATES.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cn(
                  "w-full rounded-xl border p-3 text-left transition-colors",
                  active === i ? "border-sci-300 bg-sci-50/60" : "border-slate-100 hover:border-sci-200",
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-navy-900">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_COLORS[i] }} />
                    {c.id}
                  </span>
                  <span className="font-mono text-xs text-slate-500">Priority #{i + 1}</span>
                </div>
                {(
                  [
                    ["Pattern relevance", c.relevance],
                    ["Signal consistency", c.consistency],
                    ["Evidence strength", c.evidence],
                  ] as const
                ).map(([label, v]) => (
                  <div key={label} className="mb-1 grid grid-cols-[130px_1fr_34px] items-center gap-2 text-xs">
                    <span className="text-slate-500">{label}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <motion.span
                        className="block h-full rounded-full"
                        style={{ background: NODE_COLORS[i] }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${v}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                      />
                    </span>
                    <span className="text-right font-mono text-slate-600">{v}</span>
                  </div>
                ))}
              </button>
            ))}
          </div>
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            Decision-support only — not a clinical diagnosis. Candidates require independent experimental validation.
          </p>
        </Card>
      </div>
    </Section>
  );
}
