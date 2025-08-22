export default function PavementSchematic({ layers }) {
  if (!layers?.length) return null;

  const total = layers.reduce((s, l) => s + (l.thickness || 0), 0) || 1;
  const maxPx = 300;
  const scale = maxPx / total;
  const width = 360;
  let y = 0;

  const fillFor = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("surface")) return "#e0e0e0";
    if (n.includes("binder")) return "#cfd8dc";
    if (n.includes("base")) return "#b0bec5";
    if (n.includes("sub")) return "#a5d6a7";
    if (n.includes("cap")) return "#ffe082";
    if (n.includes("cbgm")) return "#d1c4e9";
    return "#dddddd";
  };

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${maxPx + 40}`} role="img" aria-label="Pavement layer schematic">
      {layers.map((l, idx) => {
        const h = Math.max(6, (l.thickness || 0) * scale);
        const rect = (
          <g key={idx}>
            <rect x="20" y={y} width={width - 40} height={h} fill={fillFor(l.name)} stroke="#444" />
            <text x={30} y={y + h / 2} dominantBaseline="middle" fontSize="12" fill="#222">
              {`${l.name} — ${l.thickness ?? "?"} mm`}
            </text>
          </g>
        );
        y += h;
        return rect;
      })}
      <rect x="20" y="0" width={width - 40} height={y} fill="none" stroke="#000" strokeWidth="1" />
      <text x="20" y={y + 20} fontSize="12" fill="#555">Total thickness ≈ {Math.round(total)} mm</text>
    </svg>
  );
}
