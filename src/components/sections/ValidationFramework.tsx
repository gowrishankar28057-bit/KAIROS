"use client";

import { BarChart3, ClipboardCheck, Microscope, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Term } from "@/components/ui/tooltip";

const T = {
  MAE: "MAE — Mean Absolute Error between sensor and reference values.",
  RMSE: "RMSE — Root Mean Square Error; penalises large deviations.",
  "R²": "R² — Coefficient of determination; agreement with the reference.",
  Sensitivity: "Sensitivity — true positive rate.",
  Specificity: "Specificity — true negative rate.",
  LoD: "LoD — Limit of Detection; lowest reliably detectable level.",
  Precision: "Precision — share of flagged anomalies that are real.",
  Recall: "Recall — share of real anomalies that are flagged.",
  F1: "F1 — harmonic mean of precision and recall.",
  Latency: "Latency — time from measurement to dashboard / alert.",
  Uptime: "Uptime — share of time the system is operational.",
} as const;

const M = ({ k }: { k: keyof typeof T }) => (
  <span className="rounded-md bg-sci-50 px-2 py-0.5 font-mono text-xs font-semibold text-navy-800">
    <Term tip={T[k]}>{k}</Term>
  </span>
);

export function ValidationFramework() {
  return (
    <Section id="validation" className="bg-gradient-to-b from-white to-sci-50/60">
      <SectionHeader
        eyebrow="09 · Validation & verification"
        title="Planned Validation Framework"
        subtitle="How KAIROS is intended to be verified as it moves from virtual prototype to physical system. No performance results are claimed yet."
      />
      <Badge tone="warning" className="mb-6">Planned · no achieved scores reported</Badge>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-6">
          <Microscope className="h-6 w-6 text-sci-500" />
          <h3 className="mt-3 font-bold text-navy-900">Ground Truth</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Reference assay / calibrated instrument</li>
            <li>Positive &amp; negative controls</li>
            <li>Baseline process records</li>
          </ul>
        </Card>
        <Card className="p-6">
          <ClipboardCheck className="h-6 w-6 text-sci-500" />
          <h3 className="mt-3 font-bold text-navy-900">Validation Techniques</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Sensor-to-reference comparison</li>
            <li>Calibration curve &amp; linearity</li>
            <li>Controlled pilot testing</li>
          </ul>
        </Card>
        <Card className="p-6">
          <BarChart3 className="h-6 w-6 text-sci-500" />
          <h3 className="mt-3 font-bold text-navy-900">Benchmarks &amp; Metrics</h3>
          <dl className="mt-3 space-y-2.5 text-sm">
            {(
              [
                ["Sensor", ["MAE", "RMSE", "R²"]],
                ["Biomarker", ["Sensitivity", "Specificity", "LoD"]],
                ["AI", ["Precision", "Recall", "F1"]],
                ["System", ["Latency", "Uptime"]],
              ] as const
            ).map(([g, ms]) => (
              <div key={g}>
                <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{g}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {ms.map((m) => (
                    <M key={m} k={m} />
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card className="p-6">
          <Repeat className="h-6 w-6 text-sci-500" />
          <h3 className="mt-3 font-bold text-navy-900">Reliability &amp; Traceability</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Repeatability</li>
            <li>Replicates</li>
            <li>Sensor drift detection</li>
            <li>Fault detection</li>
            <li>Audit trail</li>
            <li>Data integrity</li>
          </ul>
        </Card>
      </div>
    </Section>
  );
}
