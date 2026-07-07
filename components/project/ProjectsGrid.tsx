"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categories, categoryLabel, sorted, type CategoryKey } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { FilterTab } from "@/components/ui/Pill";
import { Masonry } from "@/components/ui/Masonry";

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

      {shown.length < filtered.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE)}
            className="group inline-flex items-center gap-2.5 rounded-pill border border-line-strong px-10 py-4 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-[transform,border-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-px hover:border-fg"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
