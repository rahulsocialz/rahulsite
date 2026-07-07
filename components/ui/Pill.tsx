"use client";

/* Two related controls:
   - Pill: a static category tag shown on project cards.
   - FilterTab: a text filter whose underline animates in when active. */

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-pill border hairline px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.12em] text-muted">
      {children}
    </span>
  );
}

export function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative pb-1.5 text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
        active ? "text-fg" : "text-muted hover:text-fg"
      }`}
    >
      {children}
      <span
        className={`absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--accent)] transition-transform duration-500 ease-[var(--ease-out)] ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </button>
  );
}
