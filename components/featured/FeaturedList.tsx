"use client";

import { useState } from "react";
import { press } from "@/data/press";
import { PublicationMark } from "@/components/ui/PublicationMark";

const PAGE = 8;

/* Editorial list of press features with Load More once it grows past a batch. */
export function FeaturedList() {
  const [visible, setVisible] = useState(PAGE);
  const shown = press.slice(0, visible);

  return (
    <>
      <ul className="border-t hairline">
        {shown.map((p) => {
          const external = Boolean(p.url);
          return (
            <li key={`${p.publication}-${p.title}`} className="border-b hairline">
              <a
                href={p.url ?? "#"}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group grid grid-cols-[7.5rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[12rem_1fr_7rem_auto] sm:gap-8"
              >
                <span className="text-fg opacity-85 transition-opacity group-hover:opacity-100">
                  <PublicationMark name={p.publication} className="text-base" />
                </span>
                <span className="text-[0.95rem] leading-snug">{p.title}</span>
                <span className="hidden text-caption text-muted sm:block">{p.date}</span>
                <span
                  aria-hidden
                  className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                >
                  ↗
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {shown.length < press.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE)}
            className="rounded-pill border border-line-strong px-10 py-4 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-[transform,border-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-px hover:border-fg"
          >
            View All Articles
          </button>
        </div>
      )}
    </>
  );
}
