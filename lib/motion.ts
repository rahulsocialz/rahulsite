import type { Variants, Transition } from "framer-motion";

/* Motion principles: invisible, never bouncy, never overshoots.
   One easing, a small set of durations. Everything composes from these. */

export const ease = [0.22, 1, 0.36, 1] as const; // easeOut, no overshoot
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const duration = {
  fast: 0.3,
  base: 0.5,
  slow: 0.8,
} as const;

// Page transitions: opacity + a whisper of scale (100 → 99 → 100).
export const pageTransition = {
  initial: { opacity: 0, scale: 0.99 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: duration.fast, ease },
} satisfies { initial: object; animate: object; transition: Transition };

// Headline lines: each rises once, never repeats.
export const lineReveal: Variants = {
  hidden: { y: "115%" },
  show: (i: number = 0) => ({
    y: "0%",
    transition: { duration: duration.slow, ease, delay: 0.1 + i * 0.08 },
  }),
};

// Section reveal via clipping mask + subtle opacity (not a generic fade-up).
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(12% 0% 0% 0%)", opacity: 0 },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: { duration: duration.slow, ease },
  },
};

// Quiet stagger for lists (awards, thumbnails).
export const stagger = (gap = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});

export const fadeItem: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease } },
};
