"use client";

import { useSimulation } from "@/components/SimulationProvider";

const PATHS = {
  reactorToEsp: "M188 250 C 210 250, 215 330, 240 330",
  espToPi: "M285 300 L 285 222",
  piToCloud: "M335 170 C 370 170, 380 110, 405 95",
  cloudToAi: "M462 118 L 462 192",
  aiToDash: "M462 282 L 462 340",
};

function Particle({ path, dur, delay = 0, color = "#14c6c0" }: { path: string; dur: number; delay?: number; color?: string }) {
  return (
    <circle r="3.2" fill={color}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
      <animate attributeName="opacity" values="0;1;1;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="fill-slate-500 font-mono" fontSize="10" letterSpacing="1.2">
      {children}
    </text>
  );
}

/** Animated SVG illustration of the KAIROS physical prototype chain. */
export function HeroIllustration() {
  const { readings, anomaly } = useSimulation();
  const alert = anomaly.detected;
  return (
    <svg viewBox="0 0 560 500" className="h-auto w-full" role="img" aria-labelledby="hero-ill-title">
      <title id="hero-ill-title">
        KAIROS prototype chain: bioreactor, sensor probes, ESP32, Raspberry Pi gateway, secure backend, AI core and dashboard
      </title>
      <defs>
        <linearGradient id="h-liquid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#5cc8e8" stopOpacity="0.75" />
          <stop offset="1" stopColor="#2479f2" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="h-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#e8f3ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="h-ai" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#14c6c0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2479f2" stopOpacity="0.05" />
        </radialGradient>
        <clipPath id="h-vessel">
          <rect x="62" y="152" width="122" height="226" rx="22" />
        </clipPath>
      </defs>

      {/* connection lines */}
      {Object.values(PATHS).map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke="#bcdcff" strokeWidth="3" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#2479f2" strokeWidth="1.6" className="flow-line" strokeLinecap="round" />
        </g>
      ))}

      {/* ---------- Bioreactor ---------- */}
      <g>
        <rect x="60" y="150" width="126" height="230" rx="24" fill="url(#h-glass)" stroke="#9cc6f5" strokeWidth="2" />
        <g clipPath="url(#h-vessel)">
          <path d="M40 230 Q 80 220 120 230 T 200 230 V 400 H 40 Z" fill="url(#h-liquid)">
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="M40 230 Q 80 220 120 230 T 200 230 V 400 H 40 Z;M40 230 Q 80 240 120 230 T 200 230 V 400 H 40 Z;M40 230 Q 80 220 120 230 T 200 230 V 400 H 40 Z"
            />
          </path>
          {[80, 100, 140, 160, 120].map((x, i) => (
            <circle key={x} cx={x} cy="370" r={2 + (i % 3)} fill="#fff" opacity="0.8">
              <animate attributeName="cy" values="372;240" dur={`${2.6 + i * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.9;0" dur={`${2.6 + i * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* cells */}
          {[
            [85, 290],
            [130, 320],
            [155, 270],
            [105, 345],
            [150, 350],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#ffffff" fillOpacity="0.35" stroke="#ffffff" strokeOpacity="0.6" />
          ))}
        </g>
        {/* headplate */}
        <rect x="50" y="138" width="146" height="18" rx="6" fill="#0a1a3f" />
        {/* probes */}
        {[
          { x: 82, c: "#7c3aed" },
          { x: 104, c: "#f97316" },
          { x: 142, c: "#2479f2" },
          { x: 164, c: "#059669" },
        ].map((p) => (
          <g key={p.x}>
            <line x1={p.x} y1="112" x2={p.x} y2="320" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <rect x={p.x - 6} y="104" width="12" height="16" rx="3" fill={p.c} />
          </g>
        ))}
        {/* stirrer */}
        <line x1="123" y1="100" x2="123" y2="352" stroke="#334155" strokeWidth="3" />
        <rect x="104" y="350" width="38" height="5" rx="2" fill="#334155">
          <animateTransform attributeName="transform" type="scale" values="1 1;0.2 1;1 1" dur="0.9s" repeatCount="indefinite" additive="sum" />
        </rect>
        <rect x="113" y="88" width="20" height="14" rx="3" fill="#1a3570" />
        <Label x={123} y={402}>MINI BIOREACTOR</Label>
      </g>

      {/* ---------- ESP32 ---------- */}
      <g>
        <rect x="240" y="300" width="92" height="62" rx="8" fill="#0a1a3f" />
        <rect x="262" y="314" width="48" height="34" rx="3" fill="#1e3a6e" stroke="#4f9dff" strokeWidth="1" />
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i}>
            <rect x={246 + i * 12} y="294" width="4" height="6" fill="#94a3b8" />
            <rect x={246 + i * 12} y="362" width="4" height="6" fill="#94a3b8" />
          </g>
        ))}
        <circle cx="322" cy="310" r="3" fill="#14c6c0" className="animate-pulse-soft" />
        <Label x={286} y={386}>ESP32 NODE</Label>
      </g>

      {/* ---------- Raspberry Pi ---------- */}
      <g>
        <rect x="235" y="150" width="100" height="72" rx="8" fill="#0f5132" />
        <rect x="248" y="162" width="30" height="30" rx="3" fill="#cbd5e1" />
        <rect x="290" y="160" width="34" height="14" rx="2" fill="#94a3b8" />
        <rect x="290" y="180" width="34" height="14" rx="2" fill="#94a3b8" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={244 + i * 9} y="206" width="4" height="8" fill="#fbbf24" opacity="0.9" />
        ))}
        <circle cx="326" cy="210" r="3" fill="#22c55e" className="animate-pulse-soft" />
        <Label x={285} y={140}>RASPBERRY PI GATEWAY</Label>
      </g>

      {/* ---------- Cloud / backend ---------- */}
      <g>
        <path
          d="M420 112 h90 a26 26 0 0 0 -6 -51 a34 34 0 0 0 -62 -6 a24 24 0 0 0 -22 57 z"
          fill="#ffffff"
          stroke="#4f9dff"
          strokeWidth="2"
        />
        <text x="462" y="94" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-navy-900">
          FastAPI · DB
        </text>
        <path d="M455 66 v-6 a7 7 0 0 1 14 0 v6" fill="none" stroke="#14c6c0" strokeWidth="2" />
        <rect x="451" y="66" width="22" height="13" rx="3" fill="#14c6c0" />
        <Label x={462} y={30}>SECURE BACKEND</Label>
      </g>

      {/* ---------- AI core ---------- */}
      <g>
        <circle cx="462" cy="237" r="58" fill="url(#h-ai)" />
        <circle cx="462" cy="237" r="40" fill="#0a1a3f" />
        <circle cx="462" cy="237" r="40" fill="none" stroke="#14c6c0" strokeWidth="1.5" strokeDasharray="4 6">
          <animateTransform attributeName="transform" type="rotate" from="0 462 237" to="360 462 237" dur="18s" repeatCount="indefinite" />
        </circle>
        {[
          [445, 222],
          [478, 222],
          [462, 238],
          [445, 254],
          [478, 254],
        ].map(([x, y], i, arr) => (
          <g key={i}>
            {arr.slice(i + 1).map(([x2, y2]) => (
              <line key={`${x2}-${y2}`} x1={x} y1={y} x2={x2} y2={y2} stroke="#4f9dff" strokeOpacity="0.5" />
            ))}
            <circle cx={x} cy={y} r="4" fill="#14c6c0" />
          </g>
        ))}
        <Label x={530} y={206}>AI</Label>
        <Label x={530} y={219}>CORE</Label>
      </g>

      {/* ---------- Dashboard ---------- */}
      <g>
        <rect x="380" y="340" width="164" height="112" rx="10" fill="#ffffff" stroke="#bcdcff" strokeWidth="2" />
        <rect x="380" y="340" width="164" height="18" rx="10" fill="#0a1a3f" />
        <circle cx="392" cy="349" r="3" fill={alert ? "#ef4444" : "#22c55e"} />
        <text x="402" y="352.5" fontSize="8" fill="#fff" fontFamily="monospace">
          KAIROS · LIVE SIM
        </text>
        <polyline
          points="390,420 405,410 420,414 435,398 450,402 465,390 480,394 495,382 510,388 530,376"
          fill="none"
          stroke="#2479f2"
          strokeWidth="2"
        />
        <polyline
          points="390,436 405,432 420,434 435,428 450,430 465,426 480,429 495,424 510,427 530,422"
          fill="none"
          stroke="#14c6c0"
          strokeWidth="2"
        />
        <text x="390" y="375" fontSize="9" fill="#475569" fontFamily="monospace">
          DO {readings.do.toFixed(0)}% · pH {readings.ph.toFixed(2)}
        </text>
        <Label x={462} y={472}>DASHBOARD</Label>
      </g>

      {/* particles */}
      <Particle path={PATHS.reactorToEsp} dur={2.2} />
      <Particle path={PATHS.reactorToEsp} dur={2.2} delay={1.1} color="#2479f2" />
      <Particle path={PATHS.espToPi} dur={1.6} />
      <Particle path={PATHS.piToCloud} dur={2} color="#2479f2" />
      <Particle path={PATHS.piToCloud} dur={2} delay={1} />
      <Particle path={PATHS.cloudToAi} dur={1.4} />
      <Particle path={PATHS.aiToDash} dur={1.4} delay={0.4} color={alert ? "#ef4444" : "#2479f2"} />
    </svg>
  );
}
