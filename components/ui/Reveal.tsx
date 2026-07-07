"use client";

import { motion } from "framer-motion";
import { clipReveal } from "@/lib/motion";

/* Section reveal using a clipping mask + subtle opacity — not a generic
   fade-up. Plays once when scrolled into view. */
export function Reveal({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={clipReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </MotionTag>
  );
}
