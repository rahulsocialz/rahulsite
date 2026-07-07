/* Symmetric laurel wreath — one branch drawn, then mirrored. */
export function Laurel({ className = "" }: { className?: string }) {
  const leaves: [number, number, number][] = [
    [16.5, 34, -42],
    [13.5, 28, -32],
    [12, 22, -22],
    [12, 16, -12],
    [13.5, 10.5, 2],
  ];
  return (
    <svg viewBox="0 0 48 48" width="22" height="22" aria-hidden className={`shrink-0 ${className}`}>
      {[1, -1].map((s) => (
        <g key={s} transform={s === 1 ? undefined : "translate(48 0) scale(-1 1)"}>
          <path
            d="M24 43 C 18 37, 13 29, 13.5 11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {leaves.map(([cx, cy, r], i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx="3.6"
              ry="1.8"
              fill="currentColor"
              transform={`rotate(${r} ${cx} ${cy})`}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
