const WIDTH = 320;
const HEIGHT = 150;
const PAD_X = 24;
const CHART_TOP = 22;
const CHART_BOTTOM = 108;
const CHART_H = CHART_BOTTOM - CHART_TOP;

function formatShort(n) {
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

export default function LineChart({ data }) {
  const values = data.map((d) => d.value);
  const max = Math.max(1, ...values);
  const n = data.length;
  const stepX = n > 1 ? (WIDTH - PAD_X * 2) / (n - 1) : 0;

  const points = data.map((d, i) => {
    const x = PAD_X + i * stepX;
    const y = CHART_BOTTOM - (d.value / max) * CHART_H;
    return { ...d, x, y };
  });

  const linePath = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath =
    `M${points[0].x},${CHART_BOTTOM} ` +
    points.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${points[points.length - 1].x},${CHART_BOTTOM} Z`;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="line-chart" role="img" aria-label="주간 지출 추이">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.22 }} />
          <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      <line
        x1={PAD_X}
        y1={CHART_BOTTOM}
        x2={WIDTH - PAD_X}
        y2={CHART_BOTTOM}
        style={{ stroke: "var(--border)" }}
        strokeWidth="1"
      />

      <path d={areaPath} fill="url(#lineFill)" />
      <polyline
        points={linePath}
        fill="none"
        style={{ stroke: "var(--accent)" }}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" style={{ fill: "var(--card-bg)", stroke: "var(--accent)" }} strokeWidth="2.5" />
          <text
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            style={{ fill: "var(--text)" }}
          >
            {formatShort(p.value)}
          </text>
          <text
            x={p.x}
            y={HEIGHT - 6}
            textAnchor="middle"
            fontSize="10"
            style={{ fill: "var(--text-muted)" }}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
