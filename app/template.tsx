"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/lib/motion";

/* Page transition: opacity + a whisper of scale (100 → 99 → 100). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  );
}
