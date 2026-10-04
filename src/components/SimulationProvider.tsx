"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  createEngineState,
  INITIAL_READINGS,
  stepEngine,
  timeLabel,
  type EngineState,
  type Readings,
  type SamplePoint,
} from "@/lib/simulation";

const HISTORY = 60;

export interface AnomalyInfo {
  detected: boolean;
  parameter: string;
  deviation: number; // percentage points vs. baseline
  confidence: number; // conceptual model confidence (%)
  risk: string;
  investigation: string;
  since: string | null;
}

interface SimulationContextValue {
  readings: Readings;
  history: SamplePoint[];
  anomalyActive: boolean;
  anomalyLevel: number;
  correctionActive: boolean;
  anomaly: AnomalyInfo;
  lastUpdate: string;
  paused: boolean;
  injectAnomaly: () => void;
  clearAnomaly: () => void;
  applyCorrection: () => void;
  resetSimulation: () => void;
  setPaused: (p: boolean) => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

function seedHistory(): { state: EngineState; history: SamplePoint[] } {
  let state = createEngineState();
  const now = Date.now();
  const history: SamplePoint[] = [];
  for (let i = HISTORY; i > 0; i--) {
    const res = stepEngine(state);
    state = res.state;
    const t = now - i * 1000;
    history.push({ ...res.readings, t, label: timeLabel(new Date(t)) });
  }
  return { state, history };
}

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const engine = useRef<EngineState>(createEngineState());
  const [history, setHistory] = useState<SamplePoint[]>([]);
  const [readings, setReadings] = useState<Readings>(INITIAL_READINGS);
  const [anomalyActive, setAnomalyActive] = useState(false);
  const [correctionActive, setCorrectionActive] = useState(false);
  const [anomalyLevel, setAnomalyLevel] = useState(0);
  const [since, setSince] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("--:--:--");

  // seed on the client only to avoid hydration mismatch
  useEffect(() => {
    const seeded = seedHistory();
    engine.current = seeded.state;
    setHistory(seeded.history);
    const last = seeded.history[seeded.history.length - 1];
    setReadings({ ph: last.ph, temp: last.temp, do: last.do, biomass: last.biomass, co2: last.co2, voc: last.voc });
    setLastUpdate(last.label);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      const { state, readings: r } = stepEngine(engine.current);
      engine.current = state;
      const now = new Date();
      const label = timeLabel(now);
      setReadings(r);
      setAnomalyLevel(state.anomalyLevel * (1 - 0.85 * state.correction));
      setLastUpdate(label);
      setHistory((h) => [...h.slice(-(HISTORY - 1)), { ...r, t: now.getTime(), label }]);
    }, 1000);
    return () => window.clearInterval(id);
  }, [paused]);

  const injectAnomaly = useCallback(() => {
    engine.current = { ...engine.current, anomalyTarget: 1, correctionTarget: 0 };
    setAnomalyActive(true);
    setCorrectionActive(false);
    setSince(null);
  }, []);

  const clearAnomaly = useCallback(() => {
    engine.current = { ...engine.current, anomalyTarget: 0, correctionTarget: 0 };
    setAnomalyActive(false);
    setCorrectionActive(false);
    setSince(null);
  }, []);

  const applyCorrection = useCallback(() => {
    engine.current = { ...engine.current, correctionTarget: 1 };
    setCorrectionActive(true);
  }, []);

  const resetSimulation = useCallback(() => {
    const seeded = seedHistory();
    engine.current = seeded.state;
    setHistory(seeded.history);
    setAnomalyActive(false);
    setCorrectionActive(false);
    setAnomalyLevel(0);
    setSince(null);
  }, []);

  const deviation = Math.round(readings.do - 68);
  const detected = anomalyLevel > 0.55 && readings.do < 52;

  useEffect(() => {
    if (detected && !since) setSince(lastUpdate);
    if (!detected && since) setSince(null);
  }, [detected, since, lastUpdate]);

  const anomaly: AnomalyInfo = useMemo(
    () => ({
      detected,
      parameter: "Dissolved Oxygen",
      deviation,
      confidence: Math.min(92, Math.round(58 + 36 * anomalyLevel)),
      risk: "Oxygen limitation",
      investigation: "Aeration / agitation / metabolic load",
      since,
    }),
    [detected, deviation, anomalyLevel, since],
  );

  const value = useMemo<SimulationContextValue>(
    () => ({
      readings,
      history,
      anomalyActive,
      anomalyLevel,
      correctionActive,
      anomaly,
      lastUpdate,
      paused,
      injectAnomaly,
      clearAnomaly,
      applyCorrection,
      resetSimulation,
      setPaused,
    }),
    [
      readings,
      history,
      anomalyActive,
      anomalyLevel,
      correctionActive,
      anomaly,
      lastUpdate,
      paused,
      injectAnomaly,
      clearAnomaly,
      applyCorrection,
      resetSimulation,
    ],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used inside <SimulationProvider>");
  return ctx;
}
