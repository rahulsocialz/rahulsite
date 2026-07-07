"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { Media } from "@/components/ui/Media";
import { Masonry } from "@/components/ui/Masonry";

// Varied aspect ratios for the "uneven but perfect" masonry below the hero.
const ASPECTS = [
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[1/1]",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[1/1]",
  "aspect-[4/5]",
];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      {dir === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

export function ProjectShowcase({
  images,
  placeholderCount,
  accent,
  title,
}: {
  images: string[];
  placeholderCount: number;
  accent: string;
  title: string;
}) {
  const hasImages = images.length > 0;
  const count = hasImages ? images.length : Math.max(placeholderCount, 1);
  const [active, setActive] = useState(0);
  const pad = (n: number) => String(n + 1).padStart(2, "0");
  const go = useCallback((delta: number) => setActive((a) => (a + delta + count) % count), [count]);

  // Hero shows the whole photo (contain) so vertical shots aren't cropped.
  const hero = hasImages ? (
    <Media
      src={images[active]}
      alt={`${title}, image ${pad(active)}`}
      sizes="(min-width:1024px) 80vw, 100vw"
      priority
      fit="contain"
      className="h-full w-full"
    />
  ) : (
    <Placeholder accent={accent} label={pad(active)} className="h-full w-full" />
  );

  const tile = (i: number, aspectClass: string) =>
    hasImages ? (
      <Media
        src={images[i]}
        alt={`${title}, image ${pad(i)}`}
        sizes="(min-width:1024px) 30vw, 50vw"
        className={aspectClass}
        imgClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
      />
    ) : (
      <Placeholder
        accent={accent}
        label={pad(i)}
        className={`${aspectClass} transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]`}
      />
    );

  const arrowBtn =
    "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-pill border border-line-strong bg-bg/60 text-fg backdrop-blur-md transition-[transform,background-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-px hover:bg-bg/80";

  return (
    <div>
      {/* Hero image with arrows */}
      <div className="relative h-[58vh] min-h-[400px] w-full overflow-hidden sm:h-[68vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {hero}
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 sm:px-6">
              <button className={arrowBtn} onClick={() => go(-1)} aria-label="Previous image">
                <Chevron dir="left" />
              </button>
              <button className={arrowBtn} onClick={() => go(1)} aria-label="Next image">
                <Chevron dir="right" />
              </button>
            </div>
            <div className="absolute bottom-4 right-5 font-mono text-[0.7rem] text-fg/70">
              {pad(active)} / {pad(count - 1)}
            </div>
          </>
        )}
      </div>

      {/* Scattered masonry below */}
      <div className="mt-4 lg:mt-5">
        <Masonry
          items={Array.from({ length: count }, (_, i) => i)}
          render={(i) => (
            <button
              onClick={() => {
                setActive(i);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label={`Show image ${pad(i)}`}
              className="group block w-full overflow-hidden"
            >
              {tile(i, ASPECTS[i % ASPECTS.length])}
            </button>
          )}
        />
      </div>
    </div>
  );
}
