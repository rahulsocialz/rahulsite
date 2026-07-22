import type { Metadata } from "next";
import { FeaturedList } from "@/components/featured/FeaturedList";

export const metadata: Metadata = {
  title: "Featured In",
  description: "Press, interviews and features.",
};

export default function FeaturedInPage() {
  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12 lg:py-14">
      <div className="lg:sticky lg:top-20 lg:self-start">
        <h1 className="d1">Featured In.</h1>
        <span aria-hidden className="mt-6 block h-px w-12 bg-[var(--ink)]" />
        <p className="meta mt-6 text-[var(--muted)]">Press, interviews, features</p>
        <p className="label mt-10 hidden text-[var(--muted)] lg:block">
          Scroll
          <span aria-hidden className="mt-2 block">
            ↓
          </span>
        </p>
      </div>

      <FeaturedList />
    </div>
  );
}
