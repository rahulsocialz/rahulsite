import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { CircledNumber } from "@/components/analog/Analog";
import { focalPosition } from "@/lib/focal";
import { categoryLabel, type Project } from "@/data/projects";

export type ModuleVariant = "film" | "black" | "bar" | "paper";

/* The archive interlocks rather than tiles, but it still has to sit on a
   grid. Each cycle is a set of whole rows whose spans add up to 12, and the
   rows alternate tall and short — so modules line up edge to edge while the
   scale keeps oscillating. Every module stretches to its row height, so
   neighbours always share a baseline. */
export const CYCLE: { span: string; tall: boolean; variant: ModuleVariant }[] = [
  // row — 7 + 5
  { span: "sm:col-span-7", tall: true, variant: "film" },
  { span: "sm:col-span-5", tall: true, variant: "black" },
  // row — 4 + 4 + 4
  { span: "sm:col-span-4", tall: false, variant: "black" },
  { span: "sm:col-span-4", tall: false, variant: "paper" },
  { span: "sm:col-span-4", tall: false, variant: "bar" },
  // row — 5 + 7
  { span: "sm:col-span-5", tall: true, variant: "black" },
  { span: "sm:col-span-7", tall: true, variant: "film" },
];

const roleLine = (p: Project) => p.categories.map(categoryLabel).join(", ");

function Meta({ p, className = "" }: { p: Project; className?: string }) {
  return (
    <div className={className}>
      <p className="meta font-medium">{p.title}</p>
      {p.subtitle && <p className="meta mt-1.5 opacity-70">{p.subtitle}</p>}
      {p.year && <p className="meta mt-0.5 opacity-70">{p.year}</p>}
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="meta max-w-[18ch] leading-snug opacity-70">{roleLine(p)}</p>
        <span
          aria-hidden
          className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          ↗
        </span>
      </div>
    </div>
  );
}

export function ArchiveModule({
  p,
  index,
  variant,
  priority = false,
}: {
  p: Project;
  index: number;
  variant: ModuleVariant;
  priority?: boolean;
}) {
  const src = p.featuredImage || p.heroImage || "";
  const href = `/projects/${p.slug}`;
  const frame = String(21 + (index % 26));
  const sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw";

  /* The photograph fills whatever height the row gives it. Absolute inside a
     flex-1 box, because a percentage height against an auto-height parent
     collapses to nothing. */
  const photo = (
    <span className="relative block min-h-[9rem] flex-1">
      <span className="absolute inset-0">
        {src ? (
          <Media
            src={src}
            alt={`${p.title} — ${p.subtitle}`}
            sizes={sizes}
            priority={priority}
            focal={focalPosition(p.featuredFocalPoint)}
            className="h-full w-full"
            imgClassName="transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.02]"
          />
        ) : (
          <span className="block h-full w-full bg-[#141412]" />
        )}
      </span>
    </span>
  );

  // Paper: photograph above, caption set on cream stock with crop marks.
  if (variant === "paper") {
    return (
      <Link
        href={href}
        className="crop-marks group flex h-full flex-col border border-[var(--line-soft)] bg-[var(--paper-2)]"
      >
        {photo}
        <div className="shrink-0 p-6">
          <Meta p={p} />
        </div>
      </Link>
    );
  }

  // Bar: photograph with the caption set in a black bar beneath it.
  if (variant === "bar") {
    return (
      <Link href={href} className="group flex h-full flex-col">
        {photo}
        <div className="shrink-0 bg-[var(--surface)] p-5 text-[var(--surface-ink)]">
          <Meta p={p} />
        </div>
      </Link>
    );
  }

  // Black: photograph and caption stacked inside one dark module.
  if (variant === "black") {
    return (
      <Link
        href={href}
        className="group flex h-full flex-col bg-[var(--surface)] text-[var(--surface-ink)]"
      >
        {photo}
        <div className="shrink-0 p-5">
          <Meta p={p} />
        </div>
      </Link>
    );
  }

  // Plate: a clean full-bleed photograph, caption set below on paper — no
  // black carrier. Closest to the previous site's plain project card. Every
  // few frames carries the grease-pencil circle, the one analog mark that
  // survives directly on the photo.
  return (
    <Link href={href} className="group relative flex h-full flex-col">
      {photo}
      <div className="shrink-0 pt-4">
        <Meta p={p} />
      </div>
      {index % 7 === 0 && (
        <span className="absolute right-3 top-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <CircledNumber value={frame} className="h-9 w-16" />
        </span>
      )}
    </Link>
  );
}
