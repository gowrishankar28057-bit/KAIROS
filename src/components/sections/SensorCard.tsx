"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { useSimulation } from "@/components/SimulationProvider";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/ui/sparkline";
import { Term } from "@/components/ui/tooltip";
import { SENSOR_COLORS, STATUS_LABEL, trendOf } from "@/lib/sensor-ui";
import { formatValue, SENSORS, statusOf, type SensorId } from "@/lib/simulation";
import { cn } from "@/lib/utils";

const ICON = { up: ArrowUpRight, down: ArrowDownRight, flat: ArrowRight };

export function SensorCard({ id }: { id: SensorId }) {
  const { readings, history } = useSimulation();
  const spec = SENSORS[id];
  const v = readings[id];
  const st = statusOf(id, v);
  const trend = trendOf(history, id, spec.range[1] - spec.range[0]);
  const Icon = ICON[trend];
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-4 transition-colors",
        st === "normal" && "border-sci-100",
        st === "warning" && "border-amber-300 bg-amber-50/40",
        st === "critical" && "border-red-300 bg-red-50/50",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <span className="text-xs font-semibold text-slate-500">
          <Term tip={spec.tooltip}>{spec.short}</Term>
        </span>
        <Badge tone={st}>{STATUS_LABEL[st]}</Badge>
      </div>
      <div className="mt-2 flex items-end gap-1.5">
        <span className="font-mono text-3xl font-bold text-navy-900">{formatValue(id, v)}</span>
        <span className="mb-1 text-xs text-slate-500">{spec.unit}</span>
        <Icon
          className={cn("mb-1.5 ml-auto h-5 w-5", trend === "flat" ? "text-slate-400" : st === "normal" ? "text-sci-500" : "text-red-500")}
          aria-label={`Trend ${trend}`}
        />
      </div>
      <Sparkline values={history.slice(-30).map((p) => p[id])} color={SENSOR_COLORS[id]} width={200} height={34} className="mt-2 h-9 w-full" />
      <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-400">Prototype Simulation</p>
    </div>
  );
}
