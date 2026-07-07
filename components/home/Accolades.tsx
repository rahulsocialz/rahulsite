"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { stagger, fadeItem } from "@/lib/motion";
import { awards } from "@/data/awards";
import { press } from "@/data/press";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Divider } from "@/components/ui/Divider";
import { Laurel } from "@/components/ui/Laurel";
import { PublicationMark } from "@/components/ui/PublicationMark";

/* Compact two-column band: Awards (laurels, fading in one by one) and
   Featured In (wordmarks that reveal their article title on hover). */
export function Accolades() {
  return (
    <section className="py-7 lg:py-10">
      <Divider />
      <div className="shell mt-6 grid gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow as="h2" className="mb-6">Awards</Eyebrow>
          <motion.ul
            className="space-y-4"
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15%" }}
          >
            {awards.map((a) => (
              <motion.li key={`${a.name}-${a.detail}`} variants={fadeItem} className="flex items-start gap-4">
                <Laurel className="mt-0.5 opacity-70" />
                <div>
                  <p className="text-[0.95rem] font-medium">{a.name}</p>
                  <p className="mt-0.5 text-caption text-muted">{a.detail}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div>
          <Eyebrow as="h2" className="mb-6">Featured In</Eyebrow>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
            {press.map((p) => (
              <li key={p.publication}>
                <a
                  href={p.url ?? "#"}
                  target={p.url ? "_blank" : undefined}
                  rel={p.url ? "noopener noreferrer" : undefined}
                  className="group block"
                >
                  <span className="block text-fg opacity-80 transition-opacity group-hover:opacity-100">
                    <PublicationMark name={p.publication} className="text-base" />
                  </span>
                  <span className="mt-2 block max-h-0 overflow-hidden text-caption leading-snug text-muted opacity-0 transition-all duration-500 ease-[var(--ease-out)] group-hover:max-h-16 group-hover:opacity-100">
                    {p.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <Link href="/featured-in" className="link mt-8 inline-block text-[0.72rem] uppercase tracking-[0.14em] light:text-[var(--accent)]">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
