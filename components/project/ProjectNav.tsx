import Link from "next/link";

/* Previous / next project links at the foot of a project page. */
export function ProjectNav({
  prev,
  next,
}: {
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}) {
  return (
    <nav className="mt-16 grid grid-cols-2 border-t hairline" aria-label="Project navigation">
      <div className="border-r hairline">
        {prev && (
          <Link href={`/projects/${prev.slug}`} className="group flex flex-col gap-2 py-8 pr-4">
            <span className="eyebrow inline-flex items-center gap-2">
              <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              Previous
            </span>
            <span className="h3 transition-colors duration-300 group-hover:text-[var(--accent)]">
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link href={`/projects/${next.slug}`} className="group flex flex-col items-end gap-2 py-8 pl-4">
            <span className="eyebrow inline-flex items-center gap-2">
              Next
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <span className="h3 transition-colors duration-300 group-hover:text-[var(--accent)]">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
