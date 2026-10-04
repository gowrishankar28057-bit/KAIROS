"use client";

import { Fingerprint, Layers } from "lucide-react";
import { useMemo } from "react";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useSimulation } from "@/components/SimulationProvider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section, SectionHeader, SimTag } from "@/components/ui/section";
import { computeFingerprint, fingerprintSimilarity } from "@/lib/simulation";
import { cn } from "@/lib/utils";

export function BioFingerprint() {
  const { readings, history, anomaly } = useSimulation();
  const fp = useMemo(() => computeFingerprint(readings, history), [readings, history]);
  const similarity = fingerprintSimilarity(fp);
  const tone = similarity >= 88 ? "normal" : similarity >= 78 ? "warning" : "critical";
  const largest = [...fp].sort((a, b) => Math.abs(b.reference - b.current) - Math.abs(a.reference - a.current))[0];

  return (
    <Section id="biofingerprint" className="bg-gradient-to-b from-white to-sci-50/50">
      <SectionHeader
        eyebrow="04 · AI BioFingerprint Engine"
        title="BioFingerprint Engine"
        subtitle="KAIROS does not examine individual sensor readings in isolation. It learns the combined behaviour of the biological process — its multivariate fingerprint."
      />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5 md:p-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <Fingerprint className="h-4 w-4 text-sci-500" /> Normal vs. current BioFingerprint
            </p>
            <SimTag label="Conceptual model · simulated" />
          </div>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={fp} outerRadius="72%">
                <PolarGrid stroke="#bcdcff" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: "#1a3570", fontWeight: 600 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Normal BioFingerprint" dataKey="reference" stroke="#14c6c0" fill="#14c6c0" fillOpacity={0.18} strokeWidth={2} isAnimationActive={false} />
                <Radar
                  name="Current BioFingerprint"
                  dataKey="current"
                  stroke={anomaly.detected ? "#ef4444" : "#2479f2"}
                  fill={anomaly.detected ? "#ef4444" : "#2479f2"}
                  fillOpacity={0.16}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  isAnimationActive={false}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card id="similarity-card" className={cn("p-6 transition-colors", tone === "critical" && "border-red-200 bg-red-50/40")}>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">Similarity score</p>
            <div className="mt-2 flex items-end gap-3">
              <span
                className={cn(
                  "font-mono text-6xl font-bold tracking-tight transition-colors",
                  tone === "normal" ? "text-navy-900" : tone === "warning" ? "text-amber-600" : "text-red-600",
                )}
              >
                {similarity}%
              </span>
              <Badge tone={tone} className="mb-3">
                {tone === "normal" ? "Matches learned pattern" : tone === "warning" ? "Drifting" : "Deviating"}
              </Badge>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full transition-all duration-700", tone === "normal" ? "bg-teal-500" : tone === "warning" ? "bg-amber-500" : "bg-red-500")}
                style={{ width: `${similarity}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Largest contributing axis: <strong className="text-navy-900">{largest.axis}</strong> ({largest.current} vs. {largest.reference} reference)
            </p>
            <SimTag className="mt-3" />
          </Card>

          <Card className="p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <Layers className="h-4 w-4 text-sci-500" /> How it works (conceptual)
            </p>
            <ol className="mt-3 space-y-2 text-sm text-slate-600">
              <li><strong className="text-navy-900">1.</strong> Learn a reference envelope from baseline process runs.</li>
              <li><strong className="text-navy-900">2.</strong> Convert live sensor streams into six behavioural features.</li>
              <li><strong className="text-navy-900">3.</strong> Compare the live shape to the reference fingerprint.</li>
              <li><strong className="text-navy-900">4.</strong> Flag low similarity and point to the axes driving it.</li>
            </ol>
            <p className="mt-4 rounded-xl bg-sci-50 p-3 text-sm italic text-navy-800">
              “Multivariate biological patterns can reveal deviations that may be difficult to identify from a single sensor.”
            </p>
            <p className="mt-2 text-[11px] text-slate-500">Illustrative scoring; performance has not been experimentally validated.</p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
