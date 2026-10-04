"use client";

import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSimulation } from "@/components/SimulationProvider";
import { SENSOR_COLORS } from "@/lib/sensor-ui";
import { SENSORS, type SensorId } from "@/lib/simulation";

const DOMAINS: Partial<Record<SensorId, [number, number]>> = {
  ph: [6.7, 7.5],
  temp: [35.6, 37.8],
  do: [25, 90],
};

/** Scrolling real-time chart for one parameter, with its normal range shaded. */
export function LiveSensorChart({ id }: { id: SensorId }) {
  const { history } = useSimulation();
  const spec = SENSORS[id];
  const color = SENSOR_COLORS[id];
  const domain = DOMAINS[id] ?? (["auto", "auto"] as const);
  return (
    <div className="rounded-2xl border border-sci-100 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-navy-900">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
          {spec.short} {spec.unit && <span className="font-normal text-slate-500">({spec.unit})</span>}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Last 60 s · simulated</span>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
            <CartesianGrid stroke="#e0efff" strokeDasharray="3 3" />
            {id !== "biomass" && (
              <ReferenceArea y1={spec.range[0]} y2={spec.range[1]} fill="#10b981" fillOpacity={0.06} ifOverflow="extendDomain" />
            )}
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#64748b" }} interval={14} tickLine={false} axisLine={{ stroke: "#bcdcff" }} />
            <YAxis
              domain={domain as [number, number]}
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(v: number) => v.toFixed(spec.decimals === 0 ? 0 : spec.decimals === 1 ? 1 : 2)}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #bcdcff", fontSize: 12 }}
              formatter={(v: number) => [`${v.toFixed(spec.decimals)} ${spec.unit}`, `${spec.short} (simulated)`]}
            />
            <Line type="monotone" dataKey={id} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
