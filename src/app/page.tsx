"use client";

import { JuryDemoMode } from "@/components/JuryDemoMode";
import { Navbar } from "@/components/Navbar";
import { ArchitectureFlow } from "@/components/sections/ArchitectureFlow";
import { BioDiscovery } from "@/components/sections/BioDiscovery";
import { BioFingerprint } from "@/components/sections/BioFingerprint";
import { DigitalTwin } from "@/components/sections/DigitalTwin";
import { FinalSection } from "@/components/sections/FinalSection";
import { Hero } from "@/components/sections/Hero";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { InnovationComparison } from "@/components/sections/InnovationComparison";
import { LiveDashboard } from "@/components/sections/LiveDashboard";
import { Problem } from "@/components/sections/Problem";
import { ResearchReferences } from "@/components/sections/ResearchReferences";
import { Roadmap } from "@/components/sections/Roadmap";
import { SecurityLayer } from "@/components/sections/SecurityLayer";
import { ValidationFramework } from "@/components/sections/ValidationFramework";
import { VirtualLab } from "@/components/sections/VirtualLab";
import { SimulationProvider } from "@/components/SimulationProvider";

export default function Home() {
  return (
    <SimulationProvider>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <VirtualLab />
        <LiveDashboard />
        <BioFingerprint />
        <DigitalTwin />
        <BioDiscovery />
        <ArchitectureFlow />
        <SecurityLayer />
        <ValidationFramework />
        <ResearchReferences />
        <InnovationComparison />
        <ImpactSection />
        <Roadmap />
        <FinalSection />
      </main>
      <JuryDemoMode />
    </SimulationProvider>
  );
}
