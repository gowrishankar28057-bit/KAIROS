import type { SamplePoint, SensorId, SensorStatus } from "@/lib/simulation";

export const SENSOR_COLORS: Record<SensorId, string> = {
  ph: "#7c3aed",
  temp: "#f97316",
  do: "#2479f2",
  biomass: "#059669",
  co2: "#475569",
  voc: "#0d9488",
};

export const STATUS_LABEL: Record<SensorStatus, string> = {
  normal: "Normal",
  warning: "Warning",
  critical: "Critical",
};

export const STATUS_DOT: Record<SensorStatus, string> = {
  normal: "#10b981",
  warning: "#f59e0b",
  critical: "#ef4444",
};

export type Trend = "up" | "down" | "flat";

/** Trend from the slope over the last few samples, relative to the sensor's normal span. */
export function trendOf(history: SamplePoint[], id: SensorId, span: number): Trend {
  const pts = history.slice(-6);
  if (pts.length < 2) return "flat";
  const delta = pts[pts.length - 1][id] - pts[0][id];
  if (Math.abs(delta) < span * 0.02) return "flat";
  return delta > 0 ? "up" : "down";
}
