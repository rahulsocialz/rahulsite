import Link from "next/link";
import { categories, categoryLabel, projects } from "@/data/projects";

/* Selected Work — a set index rather than a gallery. Each category is a
   line with its live count; the whole list is the table of contents for
   the archive. Counts come straight from the project data. */
const counts = categories.map((c) => ({
  key: c.key,
  label: c.key === "all" ? "All Projects" : categoryLabel(c.key),
  count:
    c.key === "all"
      ? projects.length
      : projects.filter((p) => p.categories.includes(c.key as never)).length,
}));

export function SelectedWorks() {
  return (
    <section className="shell border-b border-[var(--line-soft)] py-10 lg:py-14">
      <h2 className="d3">Selected Work</h2>
      <span aria-hidden className="mt-5 block h-px w-12 bg-[var(--ink)]" />

      <ul className="mt-8 max-w-xl">
        {counts.map(({ key, label, count }) => (
          <li key={key}>
            <Link
              href={key === "all" ? "/projects" : `/projects?category=${key}`}
              className="group flex min-h-11 items-center justify-between gap-6 border-b border-[var(--line-soft)] py-3 transition-colors hover:border-[var(--ink)]"
            >
              <span className="meta transition-opacity group-hover:opacity-60">{label}</span>
              <span className="flex items-center gap-6">
                <span className="meta tabular-nums text-[var(--muted)]">({count})</span>
                <span aria-hidden className="text-[var(--muted)] transition-transform duration-300 group-hover:rotate-90">
                  +
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
