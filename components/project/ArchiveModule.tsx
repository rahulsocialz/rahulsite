import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { CircledNumber, FilmEdge } from "@/components/analog/Analog";
import { focalPosition } from "@/lib/focal";
import { categoryLabel, type Project } from "@/data/projects";

export type ModuleVariant = "film" | "black" | "bar" | "paper";

/* The archive is deliberately uneven: each project lands in one of four
   module shapes on a repeating two-row cycle, so the page interlocks rather
   than tiling. Every module is a real link carrying the same project data. */
export const CYCLE: { span: string; aspect: string; variant: ModuleVariant }[] = [
  { span: "sm:col-span-5", aspect: "aspect-[4/5]", variant: "bar" },
  { span: "sm:col-span-4", aspect: "aspect-[3/4]", variant: "black" },
  { span: "sm:col-span-3", aspect: "aspect-[3/4]", variant: "film" },
  { span: "sm:col-span-5", aspect: "aspect-[16/10]", variant: "film" },
  { span: "sm:col-span-3", aspect: "", variant: "paper" },
  { span: "sm:col-span-4", aspect: "aspect-[16/10]", variant: "black" },
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
  aspect,
  priority = false,
}: {
  p: Project;
  index: number;
  variant: ModuleVariant;
  aspect: string;
  priority?: boolean;
}) {
  const src = p.featuredImage || p.heroImage || "";
  const href = `/projects/${p.slug}`;
  const frame = String(21 + (index % 26));
  const sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw";

  const photo = src ? (
    <Media
      src={src}
      alt={`${p.title} — ${p.subtitle}`}
      sizes={sizes}
      priority={priority}
      focal={focalPosition(p.featuredFocalPoint)}
      className={`w-full ${aspect || "aspect-[4/3]"}`}
      imgClassName="transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.02]"
    />
  ) : (
    <span className={`block w-full bg-[#141412] ${aspect || "aspect-[4/3]"}`} />
  );

  // Paper: a cream caption card with crop marks and no photograph.
  if (variant === "paper") {
    return (
      <Link
        href={href}
        className="group relative flex min-h-[13rem] flex-col justify-center border border-[var(--line-soft)] bg-[var(--paper-2)] p-6 crop-marks"
      >
        <Meta p={p} />
      </Link>
    );
  }

  // Bar: photograph with the caption set in a black bar beneath it.
  if (variant === "bar") {
    return (
      <Link href={href} className="group block">
        {photo}
        <div className="bg-[var(--surface)] p-5 text-[var(--surface-ink)]">
          <Meta p={p} />
        </div>
      </Link>
    );
  }

  // Black: photograph and caption stacked inside one dark module.
  if (variant === "black") {
    return (
      <Link href={href} className="group flex flex-col bg-[var(--surface)] text-[var(--surface-ink)]">
        {photo}
        <div className="p-5">
          <Meta p={p} />
        </div>
      </Link>
    );
  }

  // Film: the photograph mounted in a carrier, edge markings and frame number.
  return (
    <Link href={href} className="film group relative block">
      <FilmEdge side="l" text={`${frame} · 400`} />
      <FilmEdge side="r" text="400 · 36 EXP" />
      <div className="px-[1.375rem] py-[1.375rem]">
        {photo}
        <div className="pt-4 text-[#cfcabc]">
          <Meta p={p} />
        </div>
      </div>
      {index % 6 === 2 && (
        <span className="absolute right-7 top-7">
          <CircledNumber value={frame} className="h-9 w-16 text-[#cfcabc]" />
        </span>
      )}
    </Link>
  );
}
