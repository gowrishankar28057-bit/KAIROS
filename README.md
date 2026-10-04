# KAIROS — Adaptive Biological Intelligence Platform

> **BioInsights Today for a Healthier Tomorrow**

Interactive **virtual prototype** of KAIROS: a secure, AI-powered biological intelligence platform combining real-time bioprocess sensing, edge computing, BioFingerprint pattern analysis, anomaly detection, Digital Twin simulation, biomarker/BioDiscovery intelligence and a secure-by-design data pipeline.

> ⚠️ **Prototype simulation only.** Every sensor value, score, confidence and prediction on this site is generated in the browser by a mathematical simulation. Nothing shown is experimental, validated or clinical data. KAIROS is presented as a decision-support concept, not a diagnostic device.

---

## Quick start

Requirements: **Node.js 18.18+** (tested on Node 22) and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. After `npm install` the site works fully offline (only the DOI reference links need internet).

Other scripts:

| Command | Purpose |
|---|---|
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |

---

## Presenting to a jury (recommended flow)

1. Open the site full-screen on a 1920×1080 laptop/projector.
2. Click the floating **Jury Demo Mode** button (bottom-right).
3. The guided tour runs automatically (~80 s, 8 steps):
   1. Highlights the virtual bioreactor
   2. Shows live sensor streams
   3. Injects a simulated oxygen-limitation anomaly (DO ~68% → ~37%)
   4. Shows the BioFingerprint similarity drop
   5. Opens the Digital Twin
   6. Runs a corrective scenario (↑ aeration, ↑ agitation) and applies it to the live simulation
   7. Runs the secure-pipeline scan
   8. Displays the final KAIROS insight
4. Controls: **Next / Previous / Pause / Exit Demo**. Keyboard: `→`, `←`, `Esc`.

Manual demo: use **Inject Anomaly** in the Live Dashboard, inspect probes in the **Virtual Lab**, then try sliders → **Run Virtual Scenario** in the **Digital Twin**.

---

## What's on the page

| # | Section | Component |
|---|---|---|
| — | Hero + animated prototype architecture | `Hero`, `HeroIllustration` |
| 01 | Problem: current workflow vs. KAIROS | `Problem` |
| 02 | **KAIROS Virtual Lab** — clickable semi-3D bioreactor, 6 probes, ESP32 → Pi → API → DB → AI | `VirtualLab`, `VirtualBioreactor` |
| 03 | Live bioprocess dashboard, scrolling charts, anomaly injection | `LiveDashboard`, `SensorCard`, `LiveSensorChart`, `AnomalyPanel` |
| 04 | BioFingerprint radar (normal vs. current) + similarity score | `BioFingerprint` |
| 05 | Digital Twin with 5 process controls, current vs. simulated 12 h projection | `DigitalTwin` |
| 06 | BioDiscovery pipeline, molecular network, candidate biomarkers | `BioDiscovery` |
| 07 | Clickable 11-stage system workflow | `ArchitectureFlow` |
| 08 | Cyberbiosecurity shield + security scan | `SecurityLayer` |
| 09 | Planned validation framework (no achieved scores claimed) | `ValidationFramework` |
| 10 | Research foundation — 15 DOI links | `ResearchReferences` |
| 11 | Innovation & differentiation | `InnovationComparison` |
| 12 | Impact / target groups | `ImpactSection` |
| 13 | Roadmap (6 phases) | `Roadmap` |
| — | Closing statement | `FinalSection` |
| — | Guided tour | `JuryDemoMode` |

---

## Simulation engine

`src/lib/simulation.ts` — a lightweight, dependency-free model. Values are **not** independent random numbers:

```
value = baseline + sin(t / period) × small_variation + low-pass-filtered noise − anomaly_level × effect
```

| Sensor | Normal range | Behaviour |
|---|---|---|
| pH | 6.8 – 7.4 | Slow oscillation around 7.18 |
| Temperature | 36 – 37.5 °C | Slow oscillation around 36.8 °C |
| Dissolved O₂ | 55 – 80 % | Around 68 %; falls to ~37 % under anomaly |
| Biomass | gradually increasing (OD) | Slow growth, slowed by oxygen limitation |
| CO₂ | 3 – 7 % | Rises with biomass / metabolic activity |
| VOC | low baseline | ~18 index; rises under stress |

- **Anomaly injection** ramps an `anomalyLevel` 0 → 1 exponentially (~10–15 s), so deviations develop gradually.
- **BioFingerprint** maps readings to six behaviour axes (0–100) and computes an RMS-distance-based similarity to a reference fingerprint (conceptual, ~95% normal → ~75% under full anomaly).
- **Digital Twin** uses a simplified oxygen-transfer / demand model (kLa proxy from aeration & agitation; demand from feed & temperature) to project DO, biomass and CO₂ 12 h ahead. Illustrative only.
- All shared state lives in `SimulationProvider` (React context, 1 s tick), so the Virtual Lab, dashboard, fingerprint, twin and Jury Mode stay consistent.

---

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn-style UI primitives (`src/components/ui`) · Lucide icons · Framer Motion · Recharts · hand-built SVG for all hardware illustrations (no stock images).

```
src/
  app/                 layout, page, global styles, icon
  components/
    sections/          one component per page section
    ui/                Button, Badge, Card, Tooltip/Term, Section, Sparkline
    SimulationProvider.tsx
    JuryDemoMode.tsx
    Navbar.tsx
  lib/
    simulation.ts      simulation engine + fingerprint + twin model
    sensor-ui.ts       colours, status, trend helpers
```

---

## Scientific-integrity rules applied

- Every simulated value is labelled **Prototype Simulation** (or "Conceptual Prototype Simulation" / "Simulated decision support").
- Validation is shown as a **Planned Validation Framework** — no accuracy, sensitivity or other scores are claimed.
- Biomarker scores are labelled **conceptual**, with "Decision-support only — not a clinical diagnosis."
- No claims of clinical proof, disease detection or validated discovery.

## Note on references

The 15 references are shown by **journal + DOI** (journal inferred from the DOI prefix). Article titles and authors were intentionally not added because they could not be verified from the build environment. To add them, edit the `GROUPS` array in `src/components/sections/ResearchReferences.tsx`, and adjust the thematic grouping if needed.

## License

MIT — see [LICENSE](LICENSE).
