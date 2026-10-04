"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight, Clock, MousePointerClick } from "lucide-react";
import { useState } from "react";
import { useSimulation } from "@/components/SimulationProvider";
import { VirtualBioreactor } from "@/components/sections/VirtualBioreactor";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section, SectionHeader, SimTag } from "@/components/ui/section";
import { Sparkline } from "@/components/ui/sparkline";
import { Term } from "@/components/ui/tooltip";
import { SENSOR_COLORS, STATUS_LABEL, trendOf } from "@/lib/sensor-ui";
import { formatValue, SENSOR_ORDER, SENSORS, statusOf, type SensorId } from "@/lib/simulation";

const TREND_ICON = { up: ArrowUpRight, down: ArrowDownRight, flat: ArrowRight };
const TREND_TEXT = { up: "Rising", down: "Falling", flat: "Stable" };

export function VirtualLab() {
  const [selected, setSelected] = useState<SensorId>("do");
  const { readings, history, lastUpdate } = useSimulation();
  const spec = SENSORS[selected];
  const v = readings[selected];
  const st = statusOf(selected, v);
  const span = spec.range[1] - spec.range[0];
  const trend = trendOf(history, selected, span);
  const TrendIcon = TREND_ICON[trend];

  return (
    <Section id="virtual-lab" className="bg-gradient-to-b from-white via-sci-50/60 to-white">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative">
        <SectionHeader
          eyebrow="02 · Interactive prototype"
          title="KAIROS Virtual Lab"
          subtitle="Interactive simulation of the proposed biological intelligence platform. Select any sensor probe on the bioreactor to inspect its live simulated signal."
        />

        <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
          <Card id="lab-reactor" className="relative overflow-hidden p-4 md:p-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <MousePointerClick className="h-4 w-4 text-sci-500" /> Click a probe or its label
              </span>
              <SimTag />
            </div>
            <VirtualBioreactor selected={selected} onSelect={setSelected} />
          </Card>

          <div className="flex flex-col gap-4">
            <Card className="p-6" aria-live="polite">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">Selected sensor</p>
                  <h3 className="mt-1 text-xl font-bold text-navy-900">
                    <Term tip={spec.tooltip}>{spec.name}</Term>
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{spec.description}</p>
                </div>
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: SENSOR_COLORS[selected] }} />
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="font-mono text-5xl font-bold tracking-tight text-navy-900">{formatValue(selected, v)}</span>
                <span className="mb-1.5 text-lg text-slate-500">{spec.unit}</span>
              </div>
              <SimTag className="mt-2" />

              <Sparkline
                values={history.slice(-40).map((p) => p[selected])}
                color={SENSOR_COLORS[selected]}
                width={320}
                height={56}
                className="mt-4 h-14 w-full"
              />

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Normal operating range</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-navy-900">
                    {selected === "biomass" ? "Gradually increasing" : `${spec.range[0]}–${spec.range[1]} ${spec.unit}`}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Status</dt>
                  <dd className="mt-0.5">
                    <Badge tone={st}>{STATUS_LABEL[st]}</Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Trend</dt>
                  <dd className="mt-0.5 flex items-center gap-1 font-semibold text-navy-900">
                    <TrendIcon className="h-4 w-4 text-sci-500" /> {TREND_TEXT[trend]}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Last update</dt>
                  <dd className="mt-0.5 flex items-center gap-1 font-mono font-semibold text-navy-900">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> {lastUpdate}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-4">
              <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">All probes</p>
              <div className="grid grid-cols-3 gap-2">
                {SENSOR_ORDER.map((id) => {
                  const s = statusOf(id, readings[id]);
                  return (
                    <button
                      key={id}
                      onClick={() => setSelected(id)}
                      aria-pressed={selected === id}
                      className={`rounded-xl border px-2 py-2 text-left transition-colors ${
                        selected === id ? "border-sci-400 bg-sci-50" : "border-slate-100 hover:border-sci-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${s === "normal" ? "bg-emerald-500" : s === "warning" ? "bg-amber-500" : "bg-red-500"}`}
                        />
                        {SENSORS[id].short}
                      </span>
                      <span className="font-mono text-sm font-bold text-navy-900">
                        {formatValue(id, readings[id])}
                        <span className="text-[10px] font-medium text-slate-400"> {SENSORS[id].unit}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}
