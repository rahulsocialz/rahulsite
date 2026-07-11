"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categories, categoryLabel, sorted, type CategoryKey } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { FilterTab } from "@/components/ui/Pill";
import { Masonry } from "@/components/ui/Masonry";
import { focalPosition } from "@/lib/focal";

const PAGE = 9;

// Varied aspect ratios give the grid an editorial, non-uniform rhythm.
// Literal class names so Tailwind generates them.
const ASPECTS = [
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[1/1]",
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[1/1]",
  "aspect-[4/5]",
];

export function ProjectsGrid() {
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const [visible, setVisible] = useState(PAGE);

  const filtered =
    filter === "all" ? sorted : sorted.filter((p) => p.categories.includes(filter));
  const shown = filtered.slice(0, visible);
  const hasMore = shown.length < filtered.length;

  // Auto-load the next page as the sentinel scrolls into view, instead of
  // waiting for a manual click. rootMargin fires it a little early so the
  // next batch is ready before the user hits the true bottom.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible((v) => v + PAGE);
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div>
      <div className="flex flex-wrap gap-x-7 gap-y-3 border-b hairline pb-4">
        {categories.map((c) => (
          <FilterTab
            key={c.key}
            active={filter === c.key}
            onClick={() => {
              setFilter(c.key);
              setVisible(PAGE);
            }}
          >
            {c.label}
          </FilterTab>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10"
        >
          <Masonry
            items={shown}
            render={(p, i) => (
              <ProjectCard
                project={{
                  slug: p.slug,
                  title: p.title,
                  subtitle: p.subtitle,
                  image: p.featuredImage,
                  focal: focalPosition(p.featuredFocalPoint),
                  accent: p.accent,
                  categories: p.categories.map(categoryLabel),
                }}
                aspect={ASPECTS[i % ASPECTS.length]}
                priority={i < 3}
              />
            )}
          />
        </motion.div>
      </AnimatePresence>

      {hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
    </div>
  );
}
