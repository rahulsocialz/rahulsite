/* Analog artifacts — the small physical details that make the archive feel
   handled rather than designed. Deliberately plain and reusable: a film
   carrier, a torn strip of masking tape, a grease-pencil circle, sprocket
   rails. Use sparingly; photography is always the hero. */

/* Neutral edge markings printed along a film carrier. No brand names —
   just the stock speed and frame data a working negative actually carries. */
export function FilmEdge({
  side,
  text,
}: {
  side: "l" | "r";
  text: string;
}) {
  return (
    <div className={`film__edge film__edge--${side}`} aria-hidden>
      <span>{text}</span>
    </div>
  );
}

/* A photograph mounted in a black film carrier with edge markings. */
export function FilmFrame({
  children,
  frame,
  stock = "400 · 36 EXP",
  className = "",
  edges = true,
}: {
  children: React.ReactNode;
  frame?: string;
  stock?: string;
  className?: string;
  edges?: boolean;
}) {
  return (
    <div className={`film relative ${className}`}>
      {edges && (
        <>
          <FilmEdge side="l" text={frame ? `${frame}` : stock} />
          <FilmEdge side="r" text={stock} />
        </>
      )}
      <div className={edges ? "px-[1.375rem]" : ""}>{children}</div>
    </div>
  );
}

/* Torn strip of masking tape. Beige in both themes — it's a real material,
   so it never inverts. Rotation and placement are set by the caller. */
export function Tape({
  className = "",
  rotate = -8,
  style,
}: {
  className?: string;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`tape ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    />
  );
}

/* Grease-pencil circle — the mark an editor makes on a contact sheet when
   they pick a frame. Hand-drawn, so the ellipse is deliberately imperfect.
   Always relative; wrap it in a positioned element to place it. */
export function CircledNumber({
  value,
  className = "",
}: {
  value: string | number;
  className?: string;
}) {
  return (
    <span className={`relative grid place-items-center ${className}`} aria-hidden>
      <svg
        viewBox="0 0 92 54"
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M60 4.5C77 5.6 89.5 14.2 89.5 25.3c0 12.6-16.4 23.2-38.6 24.1C28 50.3 6.4 41.6 3.2 29.6 0.3 18.7 14.6 7.6 36.4 5.1c4.2-.5 8.5-.7 12.6-.6" />
        <path d="M49 4.5c5.4.1 10.6.6 15.4 1.6" opacity="0.55" />
      </svg>
      <span className="relative font-mono text-[0.8125rem] tracking-[0.04em]">{value}</span>
    </span>
  );
}

/* Sprocket rail used above/below a contact sheet or filmstrip. */
export function Sprockets({ className = "" }: { className?: string }) {
  return <div className={`sprockets ${className}`} aria-hidden />;
}

/* Two-digit frame number, as printed on the negative. */
export const frameNo = (i: number) => String(i + 1).padStart(2, "0");
