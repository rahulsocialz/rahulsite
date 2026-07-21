"use client";

/* Page transition: a plain fade-up, CSS-driven so it costs nothing and is
   disabled automatically under prefers-reduced-motion. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="fade-up">{children}</div>;
}
