/**
 * KAIROS lightweight frontend simulation engine.
 *
 * All values produced here are PROTOTYPE SIMULATION output. They are generated
 * from smooth mathematical models (baseline + slow oscillation + filtered noise)
 * and are NOT measurements from a real biological system.
 */

export type SensorId = "ph" | "temp" | "do" | "biomass" | "co2" | "voc";
export type SensorStatus = "normal" | "warning" | "critical";

export interface SensorSpec {
  id: SensorId;
  name: string;
  short: string;
  unit: string;
  decimals: number;
  /** Normal operating range (inclusive). */
  range: [number, number];
  /** Warning margin outside the normal range before it becomes critical. */
  warnMargin: number;
  description: string;
  tooltip: string;
}

export const SENSORS: Record<SensorId, SensorSpec> = {
  ph: {
    id: "ph",
    name: "pH Probe",
    short: "pH",
    unit: "",
    decimals: 2,
    range: [6.8, 7.4],
    warnMargin: 0.2,
    description: "Acidity / alkalinity of the culture medium.",
    tooltip: "pH — logarithmic measure of hydrogen-ion activity in the medium.",
  },
  temp: {
    id: "temp",
    name: "Temperature Probe",
    short: "Temperature",
    unit: "°C",
    decimals: 1,
    range: [36, 37.5],
    warnMargin: 0.8,
    description: "Culture temperature controlled by the thermal jacket.",
    tooltip: "Temperature of the culture broth, measured by an in-situ probe.",
  },
  do: {
    id: "do",
    name: "Dissolved Oxygen",
    short: "DO",
    unit: "%",
    decimals: 0,
    range: [55, 80],
    warnMargin: 10,
    description: "Oxygen available to cells, as % air saturation.",
    tooltip: "DO — Dissolved Oxygen, expressed as % of air saturation.",
  },
  biomass: {
    id: "biomass",
    name: "Biomass / Turbidity",
    short: "Biomass",
    unit: "OD",
    decimals: 2,
    range: [0.8, 3.5],
    warnMargin: 0.3,
    description: "Optical density proxy for cell concentration.",
    tooltip: "OD — Optical Density (turbidity), a proxy for biomass concentration.",
  },
  co2: {
    id: "co2",
    name: "CO₂ Sensor",
    short: "CO₂",
    unit: "%",
    decimals: 1,
    range: [3, 7],
    warnMargin: 1.5,
    description: "Off-gas CO₂ reflecting metabolic activity.",
    tooltip: "Off-gas carbon dioxide — an indicator of respiratory activity.",
  },
  voc: {
    id: "voc",
    name: "VOC / Gas Sensor",
    short: "VOC",
    unit: "idx",
    decimals: 0,
    range: [0, 35],
    warnMargin: 15,
    description: "Volatile organic compounds in the headspace.",
    tooltip: "VOC — Volatile Organic Compounds index from a headspace gas sensor.",
  },
};

export const SENSOR_ORDER: SensorId[] = ["ph", "temp", "do", "biomass", "co2", "voc"];

export type Readings = Record<SensorId, number>;

export interface SamplePoint extends Readings {
  t: number; // epoch ms
  label: string; // hh:mm:ss
}

export interface EngineState {
  tick: number;
  /** 0 → normal process, 1 → fully developed oxygen-limitation anomaly. */
  anomalyLevel: number;
  anomalyTarget: number;
  /** Low-pass filtered noise per sensor (keeps trajectories smooth). */
  noise: Readings;
  biomassBase: number;
  /** Correction applied by the Digital Twin scenario (0 → none, 1 → full). */
  correction: number;
  correctionTarget: number;
}

export const INITIAL_READINGS: Readings = {
  ph: 7.18,
  temp: 36.8,
  do: 68,
  biomass: 1.42,
  co2: 4.8,
  voc: 18,
};

export function createEngineState(): EngineState {
  return {
    tick: 0,
    anomalyLevel: 0,
    anomalyTarget: 0,
    noise: { ph: 0, temp: 0, do: 0, biomass: 0, co2: 0, voc: 0 },
    biomassBase: INITIAL_READINGS.biomass,
    correction: 0,
    correctionTarget: 0,
  };
}

/** Deterministic-ish pseudo random in [-1, 1]. */
function rnd() {
  return Math.random() * 2 - 1;
}

const approach = (v: number, target: number, rate: number) => v + (target - v) * rate;

/**
 * Advance the simulation by one step (~1 s) and return new readings.
 * value = baseline + sin(time) * small_variation + filtered_noise
 */
export function stepEngine(s: EngineState): { state: EngineState; readings: Readings } {
  const tick = s.tick + 1;
  // anomaly develops gradually (~15 s to reach ~90 %), recovers gradually
  const anomalyLevel = approach(s.anomalyLevel, s.anomalyTarget, 0.14);
  const correction = approach(s.correction, s.correctionTarget, 0.12);
  // effective anomaly is reduced by the corrective scenario
  const a = Math.max(0, anomalyLevel * (1 - 0.85 * correction));

  const noise: Readings = { ...s.noise };
  const smooth = 0.25;
  noise.ph = noise.ph * (1 - smooth) + rnd() * 0.012 * smooth * 4;
  noise.temp = noise.temp * (1 - smooth) + rnd() * 0.05 * smooth * 4;
  noise.do = noise.do * (1 - smooth) + rnd() * 0.9 * smooth * 4;
  noise.biomass = noise.biomass * (1 - smooth) + rnd() * 0.004 * smooth * 4;
  noise.co2 = noise.co2 * (1 - smooth) + rnd() * 0.05 * smooth * 4;
  noise.voc = noise.voc * (1 - smooth) + rnd() * 0.6 * smooth * 4;

  // biomass grows slowly; growth slows under oxygen limitation
  const growth = 0.0016 * (1 - 0.8 * a);
  const biomassBase = Math.min(3.2, s.biomassBase + growth);

  const t = tick;
  const readings: Readings = {
    ph: 7.18 + Math.sin(t / 23) * 0.035 - 0.12 * a + noise.ph,
    temp: 36.8 + Math.sin(t / 37) * 0.12 + 0.15 * a + noise.temp,
    do: 68 + Math.sin(t / 17) * 2.2 - 31 * a + noise.do,
    biomass: biomassBase + Math.sin(t / 29) * 0.006 + noise.biomass,
    co2: 4.8 + (biomassBase - 1.42) * 0.9 + Math.sin(t / 19) * 0.12 + 1.6 * a + noise.co2,
    voc: 18 + Math.sin(t / 31) * 1.5 + 9 * a + noise.voc,
  };

  return {
    state: { ...s, tick, anomalyLevel, noise, biomassBase, correction },
    readings,
  };
}

export function statusOf(id: SensorId, v: number): SensorStatus {
  const { range, warnMargin } = SENSORS[id];
  if (v >= range[0] && v <= range[1]) return "normal";
  if (v >= range[0] - warnMargin && v <= range[1] + warnMargin) return "warning";
  return "critical";
}

export function formatValue(id: SensorId, v: number) {
  return v.toFixed(SENSORS[id].decimals);
}

export function timeLabel(d: Date) {
  return d.toLocaleTimeString("en-GB", { hour12: false });
}

/* ------------------------------------------------------------------ */
/* BioFingerprint — conceptual multivariate similarity                 */
/* ------------------------------------------------------------------ */

export const FINGERPRINT_AXES = [
  "pH stability",
  "Oxygen dynamics",
  "Temperature stability",
  "Biomass growth",
  "Gas profile",
  "Metabolic behaviour",
] as const;

export interface FingerprintPoint {
  axis: (typeof FINGERPRINT_AXES)[number];
  reference: number;
  current: number;
}

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/** Map current readings to a 0–100 "behaviour score" per fingerprint axis. */
export function computeFingerprint(r: Readings, history: SamplePoint[]): FingerprintPoint[] {
  const recent = history.slice(-12);
  const growthRate =
    recent.length > 2 ? (recent[recent.length - 1].biomass - recent[0].biomass) / recent.length : 0.0016;

  const reference = [88, 86, 90, 82, 84, 85];
  const current = [
    clamp(100 - Math.abs(r.ph - 7.18) * 220),
    clamp(100 - Math.abs(r.do - 68) * 1.6),
    clamp(100 - Math.abs(r.temp - 36.8) * 25),
    clamp(52 + growthRate * 18000),
    clamp(100 - Math.abs(r.co2 - (4.8 + (r.biomass - 1.42) * 0.9)) * 18),
    clamp(100 - Math.abs(r.voc - 18) * 3),
  ];
  return FINGERPRINT_AXES.map((axis, i) => ({ axis, reference: reference[i], current: Math.round(current[i]) }));
}

/** Cosine-like similarity between reference and current fingerprint, scaled to %. */
export function fingerprintSimilarity(fp: FingerprintPoint[]): number {
  const dist = Math.sqrt(fp.reduce((acc, p) => acc + (p.reference - p.current) ** 2, 0) / fp.length);
  return Math.round(clamp(100 - dist * 1.05, 0, 99));
}

/* ------------------------------------------------------------------ */
/* Digital Twin — conceptual response model                            */
/* ------------------------------------------------------------------ */

export interface TwinControls {
  temperature: number; // °C
  aeration: number; // vvm
  agitation: number; // rpm
  feedRate: number; // mL/h
  phSetpoint: number;
}

export const DEFAULT_TWIN: TwinControls = {
  temperature: 36.8,
  aeration: 1.0,
  agitation: 300,
  feedRate: 12,
  phSetpoint: 7.2,
};

export interface TwinPoint {
  h: number; // hours ahead
  doCurrent: number;
  doSim: number;
  biomassCurrent: number;
  biomassSim: number;
  co2Current: number;
  co2Sim: number;
}

/**
 * Very simplified conceptual model of how process adjustments may influence
 * DO, biomass and CO₂ over the next 12 h. For illustration only.
 */
export function simulateTwin(c: TwinControls, startDo: number, startBiomass: number): TwinPoint[] {
  const base = DEFAULT_TWIN;
  // oxygen transfer improves with aeration and agitation (kLa proxy)
  const kla = (c.aeration / base.aeration) ** 0.5 * (c.agitation / base.agitation) ** 0.7;
  // oxygen demand increases with feed and temperature
  const demand = (c.feedRate / base.feedRate) ** 0.6 * (1 + (c.temperature - base.temperature) * 0.06);
  const phPenalty = 1 - Math.min(0.5, Math.abs(c.phSetpoint - 7.2) * 0.9);
  const tempPenalty = 1 - Math.min(0.5, Math.abs(c.temperature - 37) * 0.12);

  // equilibrium relative to the present state: unchanged controls keep DO where it is
  const doEq = clamp((startDo * kla) / demand, 5, 98);
  const muBase = 0.045;

  const pts: TwinPoint[] = [];
  let doC = startDo;
  let doS = startDo;
  let xC = startBiomass;
  let xS = startBiomass;
  for (let h = 0; h <= 12; h++) {
    if (h > 0) {
      // current trajectory: keep present conditions
      doC = doC + (startDo - doC) * 0.3;
      const limC = Math.min(1, doC / 45);
      xC = xC * (1 + muBase * limC);
      // simulated trajectory
      doS = doS + (doEq - doS) * 0.35;
      const limS = Math.min(1, doS / 45);
      const feedBoost = Math.min(1.35, (c.feedRate / base.feedRate) ** 0.4);
      xS = xS * (1 + muBase * limS * phPenalty * tempPenalty * feedBoost);
    }
    pts.push({
      h,
      doCurrent: +doC.toFixed(1),
      doSim: +doS.toFixed(1),
      biomassCurrent: +xC.toFixed(2),
      biomassSim: +xS.toFixed(2),
      co2Current: +(4.8 + (xC - 1.42) * 0.9).toFixed(2),
      co2Sim: +(4.8 + (xS - 1.42) * 0.9 * demand * (1 / Math.max(0.7, kla ** 0.3))).toFixed(2),
    });
  }
  return pts;
}
