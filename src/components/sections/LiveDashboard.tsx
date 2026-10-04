"use client";

import { Pause, Play } from "lucide-react";
import { useSimulation } from "@/components/SimulationProvider";
import { AnomalyPanel } from "@/components/sections/AnomalyPanel";
import { LiveSensorChart } from "@/components/sections/LiveSensorChart";
import { SensorCard } from "@/components/sections/SensorCard";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader, SimTag } from "@/components/ui/section";
import { SENSOR_ORDER } from "@/lib/simulation";

export function LiveDashboard() {
  const { paused, setPaused, lastUpdate } = useSimulation();
  return (
    <Section id="dashboard">
      <SectionHeader
        eyebrow="03 · Live bioprocess dashboard"
        title="Real-Time Bioprocess Monitoring"
        subtitle="Six simulated sensor streams update every second using smooth process models. Inject an anomaly to watch KAIROS flag it."
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SimTag />
          <span className="font-mono text-xs text-slate-500">Updated {lastUpdate}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {paused ? "Resume stream" : "Pause stream"}
        </Button>
      </div>

      <div id="sensor-cards" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {SENSOR_ORDER.map((id) => (
          <SensorCard key={id} id={id} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div id="live-charts" className="grid gap-4 md:grid-cols-2">
          <LiveSensorChart id="do" />
          <LiveSensorChart id="ph" />
          <LiveSensorChart id="temp" />
          <LiveSensorChart id="biomass" />
        </div>
        <AnomalyPanel />
      </div>
    </Section>
  );
}
