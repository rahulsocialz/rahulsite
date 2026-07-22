"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function Sun({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9" />
    </svg>
  );
}

function Moon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M20 14.4A8.5 8.5 0 0 1 9.6 4 8.6 8.6 0 1 0 20 14.4Z" />
    </svg>
  );
}

/* Sun / moon theme control. Square corners, thin rule, no chrome — reads as
   part of the interface furniture rather than a widget. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme === "dark";
  const btn =
    "flex h-8 w-8 items-center justify-center border transition-colors duration-300";

  return (
    <div
      className="flex items-center border border-[var(--line-soft)]"
      role="group"
      aria-label="Colour theme"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light theme"
        aria-pressed={mounted ? !dark : undefined}
        className={`${btn} ${
          mounted && !dark
            ? "border-transparent bg-[var(--ink)] text-[var(--paper)]"
            : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
        }`}
      >
        <Sun />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Dark theme"
        aria-pressed={mounted ? dark : undefined}
        className={`${btn} ${
          mounted && dark
            ? "border-transparent bg-[var(--ink)] text-[var(--paper)]"
            : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
        }`}
      >
        <Moon />
      </button>
    </div>
  );
}
