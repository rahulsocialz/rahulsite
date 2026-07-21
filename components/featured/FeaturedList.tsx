"use client";

import { press } from "@/data/press";
import { PublicationMark } from "@/components/ui/PublicationMark";
import { Tape } from "@/components/analog/Analog";

/* The full press archive as editorial clippings. Modules alternate between
   cream paper and black stock on an uneven two-up rhythm, so it reads as a
   pinned-up wall of cuttings rather than a card grid. */
const CYCLE = [
  { span: "sm:col-span-7", dark: false },
  { span: "sm:col-span-5", dark: true },
  { span: "sm:col-span-5", dark: true },
  { span: "sm:col-span-7", dark: false },
];

export function FeaturedList() {
  if (press.length === 0) {
    return <p className="meta text-[var(--muted)]">No features yet.</p>;
  }

  return (
    <div className="relative grid grid-cols-1 gap-1.5 sm:grid-cols-12">
      <Tape className="-left-2 -top-3 z-10 hidden lg:block" rotate={-12} />

      {press.map((p, i) => {
        const slot = CYCLE[i % CYCLE.length];
        const external = Boolean(p.url);

        const inner = (
          <>
            <span className={slot.dark ? "opacity-80" : "text-[var(--muted)]"}>
              <PublicationMark name={p.publication} className="text-[0.75rem]" />
            </span>

            <span className="d3 mt-4 block max-w-[22ch] leading-[1.04]">{p.title}</span>

            <span className="mt-6 flex items-end justify-between gap-4">
              {p.date && (
                <span className={`meta ${slot.dark ? "opacity-60" : "text-[var(--muted)]"}`}>{p.date}</span>
              )}
              {external && (
                <span
                  aria-hidden
                  className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              )}
            </span>
          </>
        );

        // Every clipping carries a thin rule; in dark mode that rule is what
        // keeps the alternation legible once both fills go near-black.
        const cls = `group flex min-h-[15rem] flex-col justify-between border border-[var(--line-soft)] p-6 sm:p-8 transition-colors duration-300 ${
          slot.dark
            ? "bg-[var(--surface)] text-[var(--surface-ink)]"
            : "bg-[var(--paper-2)] hover:bg-[var(--paper)]"
        }`;

        return (
          <div key={`${p.publication}-${i}`} className={slot.span}>
            {external ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <div className={cls}>{inner}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
