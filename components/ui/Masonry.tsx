"use client";

import { useEffect, useState } from "react";

/* Reliable masonry: items are distributed left-to-right into a fixed number
   of equal columns, so column tops always align (no CSS multi-column gap).
   Varied item heights give the staggered, "uneven but perfect" grid. */
function useColumns(base: number, sm: number, lg: number) {
  const [cols, setCols] = useState(lg);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setCols(w >= 1024 ? lg : w >= 640 ? sm : base);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [base, sm, lg]);
  return cols;
}

export function Masonry<T>({
  items,
  render,
  gap = "gap-4 lg:gap-5",
  columns = { base: 1, sm: 2, lg: 3 },
}: {
  items: T[];
  render: (item: T, index: number) => React.ReactNode;
  gap?: string;
  columns?: { base: number; sm: number; lg: number };
}) {
  const cols = useColumns(columns.base, columns.sm, columns.lg);
  const buckets: { item: T; index: number }[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, index) => buckets[index % cols].push({ item, index }));

  return (
    <div className={`flex ${gap}`}>
      {buckets.map((col, c) => (
        <div key={c} className={`flex flex-1 flex-col ${gap}`}>
          {col.map(({ item, index }) => (
            <div key={index}>{render(item, index)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
