"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, categoryLabel, sorted, type CategoryKey } from "@/data/projects";
import { ArchiveModule, CYCLE } from "./ArchiveModule";
import { Tape } from "@/components/analog/Analog";

const PAGE = 12;

export function ProjectsGrid() {
  const router = useRouter();
  const params = useSearchParams();

  // The active category lives in the URL, so filtered views are linkable
  // and survive a refresh or a back button.
  const raw = params.get("category");
  const valid = categories.some((c) => c.key === raw);
  const filter: CategoryKey | "all" = valid && raw ? (raw as CategoryKey | "all") : "all";

  const [visible, setVisible] = useState(PAGE);
  useEffect(() => setVisible(PAGE), [filter]);

  const setFilter = (key: CategoryKey | "all") => {
    router.replace(key === "all" ? "/projects" : `/projects?category=${key}`, { scroll: false });
  };

  const filtered = filter === "all" ? sorted : sorted.filter((p) => p.categories.includes(filter));
  const shown = filtered.slice(0, visible);
  const hasMore = shown.length < filtered.length;

  // Append the next page as the sentinel comes into view.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setVisible((v) => v + PAGE),
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  const counts = categories.map((c) => ({
    key: c.key,
    label: c.key === "all" ? "All Projects" : categoryLabel(c.key),
    count: c.key === "all" ? sorted.length : sorted.filter((p) => p.categories.includes(c.key as CategoryKey)).length,
  }));

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12 lg:py-14">
      {/* Editorial rail: title, note, filter index */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <h1 className="d1">
          Work /<br />
          Archive
        </h1>
        <span aria-hidden className="mt-6 block h-px w-12 bg-[var(--ink)]" />
        <p className="mt-6 max-w-[30ch] leading-relaxed">
          A selection of campaigns, shoots, and directions across music and culture.
        </p>

        {/* Wraps on mobile, becomes a set index on desktop */}
        <ul className="no-scrollbar mt-8 flex gap-x-5 gap-y-1 overflow-x-auto lg:block lg:max-w-xs lg:overflow-visible">
          {counts.map(({ key, label, count }) => {
            const active = filter === key;
            return (
              <li key={key} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setFilter(key as CategoryKey | "all")}
                  aria-pressed={active}
                  className={`flex min-h-11 w-full items-center justify-between gap-5 whitespace-nowrap border-b py-2 transition-colors lg:gap-6 ${
                    active ? "border-[var(--ink)] text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)] lg:border-[var(--line-soft)]"
                  }`}
                >
                  <span className="meta">{label}</span>
                  <span className="hidden items-center gap-5 lg:flex">
                    <span className="meta tabular-nums opacity-70">({count})</span>
                    <span aria-hidden>{active ? "−" : "+"}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="label mt-10 hidden text-[var(--muted)] lg:block">
          Scroll
          <span aria-hidden className="mt-2 block">
            ↓
          </span>
        </p>
      </div>

      {/* The archive */}
      <div className="relative">
        <Tape className="-right-4 top-24 hidden xl:block" rotate={-18} />

        {shown.length === 0 ? (
          <p className="meta text-[var(--muted)]">No projects in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-12">
            {shown.map((p, i) => {
              const slot = CYCLE[i % CYCLE.length];
              // Tall and short rows alternate; every module in a row
              // stretches to the same height, so the archive lines up.
              const height = slot.tall
                ? "min-h-[22rem] sm:min-h-[26rem]"
                : "min-h-[18rem] sm:min-h-[20rem]";
              return (
                <div key={p.slug} className={`${slot.span} ${height}`}>
                  <ArchiveModule p={p} index={i} variant={slot.variant} priority={i < 2} />
                </div>
              );
            })}
          </div>
        )}

        {hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
      </div>
    </div>
  );
}
