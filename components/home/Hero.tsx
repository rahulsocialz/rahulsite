"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
import { Headline } from "@/components/ui/Headline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { useAccent } from "@/components/layout/Providers";
import { heroProjects, projects } from "@/data/projects";
import { site } from "@/data/site";
import { focalPosition } from "@/lib/focal";

const slides = (heroProjects.length ? heroProjects : projects).slice(0, 4);
const PANELS = 6;
const ROTATE_MS = 7000;

const heroSrc = (p: (typeof slides)[number]) => p.heroImage || p.featuredImage;

/* Full-bleed hero photograph, or a tinted placeholder until one is added.
   Slightly oversized (scale 1.15) so every photo has real crop margin on
   all sides — without it, a photo narrower than the hero's own aspect
   ratio only ever crops top/bottom, leaving the focal point's left/right
   setting with nothing to actually shift. */
function Frame({ index, priority }: { index: number; priority?: boolean }) {
  const p = slides[index];
  const src = heroSrc(p);
  if (src) {
    return (
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={`${p.title} — ${p.subtitle}`}
          fill
          priority={priority}
          sizes="100vw"
          style={{
            objectPosition: focalPosition(p.featuredFocalPoint),
            transform: "scale(1.15)",
            transformOrigin: focalPosition(p.featuredFocalPoint),
          }}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 bg-surface">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(130% 100% at 62% 32%, ${p.accent}3a, transparent 64%)`,
        }}
      />
    </div>
  );
}

function Dots({
  active,
  onSelect,
  className = "",
}: {
  active: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {slides.map((s, i) => (
        <button
          key={s.slug}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Show ${s.title}`}
          aria-current={i === active}
          className={`h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-out)] ${
            i === active ? "w-7 bg-[var(--accent)]" : "w-1.5 bg-fg/30 hover:bg-fg/60"
          }`}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const [display, setDisplay] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const idx = useRef(0);
  const busy = useRef(false);
  const { setColor, setFromImage } = useAccent();

  const applyAccent = useCallback(
    (i: number) => {
      const src = heroSrc(slides[i]);
      if (src) setFromImage(src);
      else setColor(slides[i].accent);
    },
    [setColor, setFromImage]
  );

  const goTo = useCallback(
    (next: number) => {
      if (busy.current || next === idx.current) return;
      busy.current = true;
      setIncoming(next);
      applyAccent(next);
      // Deterministic settle after the panel reveal finishes (max delay + duration).
      window.setTimeout(() => {
        idx.current = next;
        setDisplay(next);
        setIncoming(null);
        busy.current = false;
      }, 1000);
    },
    [applyAccent]
  );

  // Set the opening accent once.
  useEffect(() => {
    applyAccent(0);
  }, [applyAccent]);

  // Auto-advance: (re)scheduled after each slide settles, so a manual dot
  // click resets the timer rather than fighting it.
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setTimeout(() => goTo((idx.current + 1) % slides.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [display, goTo]);

  // Highlight/caption the target slide immediately, even mid-transition.
  const activeIndex = incoming ?? display;
  const current = slides[activeIndex];

  return (
    <section className="relative w-full">
      <div className="relative h-[90svh] min-h-[600px] w-full overflow-hidden">
        {/* Rotating full-bleed image with vertical-panel reveal */}
        <div className="absolute inset-0 overflow-hidden">
          <Frame index={display} priority />
          {incoming !== null &&
            Array.from({ length: PANELS }, (_, i) => (
              <motion.div
                key={`${incoming}-${i}`}
                className="absolute inset-y-0 overflow-hidden"
                style={{ left: `${i * (100 / PANELS)}%`, width: `${100 / PANELS + 0.2}%` }}
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease }}
              >
                <div className="absolute inset-y-0" style={{ width: `${PANELS * 100}%`, left: `${-i * 100}%` }}>
                  <div className="relative h-full w-full">
                    <Frame index={incoming} />
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Scrim for legibility (bottom + left for text, faint top for nav).
            Always dark, regardless of site theme — a light-mode scrim here
            reads as a hazy white wash over the photo rather than a vignette. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #090909 1%, transparent 60%), linear-gradient(100deg, #090909 5%, transparent 52%), linear-gradient(to bottom, #090909 0%, transparent 14%)",
          }}
        />

        {/* Text over the image — forced light regardless of site theme, to
            match the always-dark scrim above (a hero photo needs its own
            consistent contrast, independent of the page's light/dark mode). */}
        <div
          className="absolute inset-0 z-10 flex items-end"
          style={{ "--text": "#f2f0ea", "--text-secondary": "rgba(242,240,234,0.75)" } as React.CSSProperties}
        >
          <div className="shell w-full pb-12 lg:pb-16">
            <div className="flex items-end justify-between gap-8">
              <div className="max-w-3xl">
                <Eyebrow>{site.role}</Eyebrow>
                <div className="mt-4">
                  <Headline
                    lines={site.hero.headline}
                    className="headline-multi font-medium leading-[1.0] tracking-[-0.03em] text-[clamp(2.1rem,5vw,4.6rem)]"
                  />
                </div>
                <p className="lead fade-in mt-5 max-w-md" style={{ animationDelay: "0.7s" }}>
                  {site.hero.supporting}
                </p>
                <div className="fade-in mt-7" style={{ animationDelay: "0.85s" }}>
                  <ButtonLink href="/projects" arrow>
                    {site.hero.cta}
                  </ButtonLink>
                </div>
              </div>

              {/* Slide caption + dots (desktop) */}
              <div className="hidden shrink-0 flex-col items-end gap-3 pb-1 lg:flex">
                <span className="eyebrow text-fg/70">{current.title}</span>
                <Dots active={activeIndex} onSelect={goTo} />
              </div>
            </div>

            {/* Slide dots (mobile) */}
            <Dots active={activeIndex} onSelect={goTo} className="mt-6 lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
