/* Neutral placeholder frame shown wherever photography will go, until real
   images are added through the CMS. Deliberately quiet: a surface tone with a
   faint centred label. No generated imagery. */
export function Placeholder({
  label,
  className = "",
  labelClassName = "",
  accent,
}: {
  label?: string;
  className?: string;
  labelClassName?: string;
  accent?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border bg-surface hairline ${className}`}
      role="img"
      aria-label={label ? `${label} — image placeholder` : "Image placeholder"}
    >
      {accent && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(120% 90% at 50% 30%, ${accent}24, transparent 62%)` }}
          aria-hidden
        />
      )}
      {/* barely-there diagonal to read as an empty frame */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, var(--border) 0 1px, transparent 1px 22px)",
        }}
        aria-hidden
      />
      {label && (
        <div className="absolute inset-0 grid place-items-center p-4 text-center">
          <span className={`eyebrow text-muted/70 ${labelClassName}`}>{label}</span>
        </div>
      )}
    </div>
  );
}
