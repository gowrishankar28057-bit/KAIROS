"use client";

import { useSimulation } from "@/components/SimulationProvider";
import { SENSOR_COLORS, STATUS_DOT } from "@/lib/sensor-ui";
import { formatValue, SENSORS, statusOf, type SensorId } from "@/lib/simulation";

const CX = 245;
const PROBES: { id: SensorId; x: number; side: "left" | "right"; tagY: number; depth: number }[] = [
  { id: "ph", x: 172, side: "left", tagY: 120, depth: 330 },
  { id: "temp", x: 197, side: "left", tagY: 215, depth: 350 },
  { id: "do", x: 220, side: "left", tagY: 310, depth: 340 },
  { id: "biomass", x: 272, side: "right", tagY: 120, depth: 345 },
  { id: "co2", x: 296, side: "right", tagY: 215, depth: 250 },
  { id: "voc", x: 318, side: "right", tagY: 310, depth: 240 },
];

const ARCH = [
  { label: "ESP32", sub: "Sensor node", y: 40 },
  { label: "Raspberry Pi", sub: "Edge gateway", y: 128 },
  { label: "Secure API", sub: "TLS · FastAPI", y: 216 },
  { label: "Database", sub: "Neon PostgreSQL", y: 304 },
  { label: "AI Engine", sub: "BioFingerprint", y: 392 },
];

const AX = 570;
const AW = 170;
const AH = 62;

/**
 * Semi-3D interactive bioreactor with clickable sensor probes and
 * the downstream data architecture.
 */
export function VirtualBioreactor({
  selected,
  onSelect,
}: {
  selected: SensorId;
  onSelect: (id: SensorId) => void;
}) {
  const { readings, anomalyLevel, anomaly } = useSimulation();
  // aeration bubbles thin out as oxygen limitation develops
  const bubbleCount = Math.max(3, Math.round(12 - anomalyLevel * 9));
  const liquidTop = anomaly.detected ? "#7fb3d9" : "#5cc8e8";
  const liquidBottom = anomaly.detected ? "#3d6fb0" : "#2479f2";

  return (
    <svg viewBox="0 0 760 500" className="h-auto w-full" role="group" aria-label="Interactive virtual bioreactor. Select a sensor probe to inspect it.">
      <defs>
        <linearGradient id="vl-liquid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={liquidTop} stopOpacity="0.8" />
          <stop offset="1" stopColor={liquidBottom} stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="vl-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#dbeafe" stopOpacity="0.9" />
          <stop offset="0.25" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="0.7" stopColor="#eff6ff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#bfdbfe" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="vl-jacket" x1="0" x2="1">
          <stop offset="0" stopColor="#94a3b8" />
          <stop offset="0.5" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
        <clipPath id="vl-body">
          <path d={`M${CX - 102} 112 V 400 A 102 24 0 0 0 ${CX + 102} 400 V 112 Z`} />
        </clipPath>
        <filter id="vl-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0a1a3f" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* floor shadow */}
      <ellipse cx={CX} cy="452" rx="150" ry="20" fill="#0a1a3f" opacity="0.06" />
      {/* base / stand */}
      <path d={`M${CX - 125} 430 L ${CX + 125} 430 L ${CX + 110} 446 L ${CX - 110} 446 Z`} fill="#1a3570" />
      <rect x={CX - 125} y="418" width="250" height="14" rx="4" fill="#0a1a3f" />

      {/* ---------- vessel ---------- */}
      <g filter="url(#vl-shadow)">
        <path d={`M${CX - 105} 110 V 400 A 105 25 0 0 0 ${CX + 105} 400 V 110`} fill="url(#vl-glass)" stroke="#93c5fd" strokeWidth="2" />
        <g clipPath="url(#vl-body)">
          <rect x={CX - 110} y="190" width="220" height="240" fill="url(#vl-liquid)" />
          <ellipse cx={CX} cy="190" rx="102" ry="20" fill={liquidTop} opacity="0.9">
            <animate attributeName="ry" values="20;17;20" dur="4s" repeatCount="indefinite" />
          </ellipse>
          {/* sparger bubbles */}
          {Array.from({ length: bubbleCount }).map((_, i) => {
            const x = CX - 70 + ((i * 47) % 140);
            const dur = 2.4 + (i % 4) * 0.5;
            return (
              <circle key={i} cx={x} cy="395" r={2 + (i % 3)} fill="#fff" opacity="0.85">
                <animate attributeName="cy" values="398;200" dur={`${dur}s`} begin={`${(i * 0.37) % 2}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.9;0" dur={`${dur}s`} begin={`${(i * 0.37) % 2}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
          {/* cells */}
          {Array.from({ length: 14 }).map((_, i) => (
            <circle
              key={`c${i}`}
              cx={CX - 85 + ((i * 61) % 170)}
              cy={220 + ((i * 37) % 170)}
              r={4 + (i % 3)}
              fill="#fff"
              fillOpacity="0.25"
              stroke="#fff"
              strokeOpacity="0.5"
            >
              <animate attributeName="cx" values={`${CX - 85 + ((i * 61) % 170)};${CX - 80 + ((i * 61) % 170)};${CX - 85 + ((i * 61) % 170)}`} dur={`${5 + (i % 4)}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* impeller */}
          <line x1={CX} y1="100" x2={CX} y2="370" stroke="#334155" strokeWidth="4" />
          {[330, 370].map((y) => (
            <rect key={y} x={CX - 26} y={y - 3} width="52" height="6" rx="2" fill="#334155">
              <animateTransform attributeName="transform" type="scale" values="1 1;0.15 1;1 1" dur="0.8s" repeatCount="indefinite" additive="sum" />
            </rect>
          ))}
          {/* sparger ring */}
          <ellipse cx={CX} cy="398" rx="60" ry="6" fill="none" stroke="#1e293b" strokeWidth="3" />
          {/* glass highlight */}
          <rect x={CX - 90} y="120" width="10" height="270" rx="5" fill="#fff" opacity="0.35" />
        </g>
        {/* thermal jacket band */}
        <path d={`M${CX - 105} 360 V 384 A 105 25 0 0 0 ${CX + 105} 384 V 360 A 105 25 0 0 1 ${CX - 105} 360 Z`} fill="url(#vl-jacket)" opacity="0.7" />
        {/* head plate */}
        <ellipse cx={CX} cy="110" rx="112" ry="27" fill="#0a1a3f" />
        <ellipse cx={CX} cy="104" rx="112" ry="27" fill="#1a3570" />
        <ellipse cx={CX} cy="104" rx="100" ry="21" fill="none" stroke="#4f9dff" strokeOpacity="0.4" />
        {/* motor */}
        <rect x={CX - 16} y="56" width="32" height="44" rx="6" fill="#0a1a3f" />
        <rect x={CX - 12} y="62" width="24" height="5" rx="2" fill="#14c6c0" opacity="0.8" />
      </g>

      {/* ---------- probes + callouts ---------- */}
      {PROBES.map((p) => {
        const spec = SENSORS[p.id];
        const v = readings[p.id];
        const st = statusOf(p.id, v);
        const color = SENSOR_COLORS[p.id];
        const isSel = selected === p.id;
        const tagX = p.side === "left" ? 8 : 375;
        const tagW = 120;
        const anchorX = p.side === "left" ? tagX + tagW : tagX;
        return (
          <g
            key={p.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`${spec.name}: ${formatValue(p.id, v)} ${spec.unit}, status ${st}. Prototype simulation.`}
            onClick={() => onSelect(p.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(p.id);
              }
            }}
            className="cursor-pointer outline-none [&:focus-visible_.tag]:stroke-sci-500"
          >
            {/* probe rod */}
            <line x1={p.x} y1="72" x2={p.x} y2={p.depth} stroke={isSel ? color : "#64748b"} strokeWidth={isSel ? 6 : 5} strokeLinecap="round" />
            <rect x={p.x - 7} y="62" width="14" height="20" rx="4" fill={color} />
            <circle cx={p.x} cy={p.depth} r="4" fill={color} />
            {/* leader */}
            <path
              d={`M${p.x} 64 Q ${p.x} 40, ${(p.x + anchorX) / 2} ${Math.min(50, p.tagY)} T ${anchorX} ${p.tagY + 22}`}
              fill="none"
              stroke={color}
              strokeOpacity={isSel ? 0.9 : 0.35}
              strokeWidth={isSel ? 1.8 : 1.2}
              strokeDasharray="3 4"
            />
            {/* callout tag */}
            <rect
              className="tag"
              x={tagX}
              y={p.tagY}
              width={tagW}
              height="46"
              rx="10"
              fill={isSel ? "#0a1a3f" : "#ffffff"}
              stroke={isSel ? color : "#bcdcff"}
              strokeWidth={isSel ? 2 : 1.2}
            />
            <circle cx={tagX + 13} cy={p.tagY + 15} r="4" fill={STATUS_DOT[st]}>
              {st !== "normal" && <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />}
            </circle>
            <text x={tagX + 23} y={p.tagY + 18.5} fontSize="10" fontWeight="600" fill={isSel ? "#bcdcff" : "#475569"}>
              {spec.short}
            </text>
            <text x={tagX + 12} y={p.tagY + 37} fontSize="15" fontWeight="700" fontFamily="monospace" fill={isSel ? "#ffffff" : "#0a1a3f"}>
              {formatValue(p.id, v)}
              <tspan fontSize="10" fontWeight="500" fill={isSel ? "#bcdcff" : "#64748b"}>
                {" "}
                {spec.unit}
              </tspan>
            </text>
          </g>
        );
      })}

      {/* ---------- architecture column ---------- */}
      <path d={`M${CX + 16} 70 C ${CX + 60} 10, ${AX - 80} 10, ${AX} ${ARCH[0].y + AH / 2}`} fill="none" stroke="#bcdcff" strokeWidth="3" />
      <path id="vl-cable" d={`M${CX + 16} 70 C ${CX + 60} 10, ${AX - 80} 10, ${AX} ${ARCH[0].y + AH / 2}`} fill="none" stroke="#2479f2" strokeWidth="1.6" className="flow-line" />
      {[0, 0.8, 1.6].map((d) => (
        <circle key={d} r="3.5" fill="#14c6c0">
          <animateMotion dur="2.4s" begin={`${d}s`} repeatCount="indefinite" path={`M${CX + 16} 70 C ${CX + 60} 10, ${AX - 80} 10, ${AX} ${ARCH[0].y + AH / 2}`} />
        </circle>
      ))}
      {ARCH.map((n, i) => (
        <g key={n.label}>
          {i < ARCH.length - 1 && (
            <>
              <line x1={AX + AW / 2} y1={n.y + AH} x2={AX + AW / 2} y2={ARCH[i + 1].y} stroke="#bcdcff" strokeWidth="3" />
              <line x1={AX + AW / 2} y1={n.y + AH} x2={AX + AW / 2} y2={ARCH[i + 1].y} stroke="#2479f2" strokeWidth="1.6" className="flow-line" />
              <circle r="3.5" fill={anomaly.detected && i >= 2 ? "#ef4444" : "#14c6c0"}>
                <animateMotion dur="1.2s" begin={`${i * 0.25}s`} repeatCount="indefinite" path={`M${AX + AW / 2} ${n.y + AH} L ${AX + AW / 2} ${ARCH[i + 1].y}`} />
              </circle>
            </>
          )}
          <rect x={AX} y={n.y} width={AW} height={AH} rx="12" fill={i === ARCH.length - 1 ? "#0a1a3f" : "#ffffff"} stroke="#bcdcff" strokeWidth="1.5" />
          <rect x={AX + 12} y={n.y + 16} width="30" height="30" rx="8" fill={i === ARCH.length - 1 ? "#14c6c0" : "#e0efff"} />
          <text x={AX + 27} y={n.y + 36} textAnchor="middle" fontSize="12" fontWeight="700" fill={i === ARCH.length - 1 ? "#0a1a3f" : "#2479f2"}>
            {i + 1}
          </text>
          <text x={AX + 52} y={n.y + 28} fontSize="13" fontWeight="700" fill={i === ARCH.length - 1 ? "#ffffff" : "#0a1a3f"}>
            {n.label}
          </text>
          <text x={AX + 52} y={n.y + 45} fontSize="10" fontFamily="monospace" fill={i === ARCH.length - 1 ? "#bcdcff" : "#64748b"}>
            {n.sub}
          </text>
          {i === ARCH.length - 1 && (
            <circle cx={AX + AW - 16} cy={n.y + 16} r="4" fill={anomaly.detected ? "#ef4444" : "#22c55e"}>
              <animate attributeName="opacity" values="1;0.35;1" dur="1.4s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}
      <text x={CX} y="478" textAnchor="middle" fontSize="10" fontFamily="monospace" letterSpacing="1.5" fill="#64748b">
        MINI BIOREACTOR · PROTOTYPE SIMULATION
      </text>
    </svg>
  );
}
