/** Subtle scientific background motifs: DNA strand, cells and molecular network. */
export function DnaStrand({ className }: { className?: string }) {
  const rungs = Array.from({ length: 18 });
  return (
    <svg viewBox="0 0 120 600" className={className} aria-hidden>
      <path d="M30 0 C 90 50, 90 100, 30 150 S -30 250, 30 300 S 90 400, 30 450 S -30 550, 30 600" stroke="#4f9dff" strokeOpacity=".35" fill="none" strokeWidth="2" />
      <path d="M90 0 C 30 50, 30 100, 90 150 S 150 250, 90 300 S 30 400, 90 450 S 150 550, 90 600" stroke="#14c6c0" strokeOpacity=".35" fill="none" strokeWidth="2" />
      {rungs.map((_, i) => {
        const y = 15 + i * 33;
        const phase = Math.sin((y / 150) * Math.PI);
        const x1 = 60 - 30 * phase;
        const x2 = 60 + 30 * phase;
        return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="#2479f2" strokeOpacity=".18" strokeWidth="2" />;
      })}
    </svg>
  );
}

export function MolecularNetwork({ className }: { className?: string }) {
  const nodes = [
    [40, 60], [120, 30], [200, 80], [90, 140], [170, 170], [260, 140], [230, 230], [120, 230], [40, 190],
  ];
  const edges = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 5], [4, 5], [4, 6], [3, 7], [7, 8], [0, 8], [6, 7], [2, 4]];
  return (
    <svg viewBox="0 0 300 260" className={className} aria-hidden>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#2479f2" strokeOpacity=".2" />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 6 : 4} fill={i % 2 ? "#14c6c0" : "#4f9dff"} fillOpacity=".35" />
      ))}
    </svg>
  );
}

export function Cells({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {[
        [50, 60, 26],
        [120, 50, 18],
        [150, 120, 30],
        [70, 140, 20],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#14c6c0" fillOpacity=".06" stroke="#14c6c0" strokeOpacity=".25" />
          <circle cx={x + r * 0.2} cy={y - r * 0.1} r={r * 0.32} fill="#2479f2" fillOpacity=".15" />
        </g>
      ))}
    </svg>
  );
}
