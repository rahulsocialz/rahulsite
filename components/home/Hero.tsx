import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { Tape, CircledNumber, Sprockets } from "@/components/analog/Analog";
import { focalPosition } from "@/lib/focal";
import { heroProjects, projects, featuredProjects, type Project } from "@/data/projects";
import { site } from "@/data/site";

const collage = (heroProjects.length ? heroProjects : projects).slice(0, 4);
const cover = (p: Project) => p.heroImage || p.featuredImage || "";

/* Artist / project / year / arrow — the caption block that sits with each
   module in the collage. Optional fields simply don't render. */
function Caption({ p, tone = "light" }: { p: Project; tone?: "light" | "dark" }) {
  const muted = tone === "light" ? "opacity-70" : "text-[var(--muted)]";
  return (
    <>
      <p className="meta font-medium">{p.title}</p>
      {p.subtitle && <p className={`meta mt-1.5 ${muted}`}>{p.subtitle}</p>}
      {p.year && <p className={`meta mt-0.5 ${muted}`}>{p.year}</p>}
      <span
        aria-hidden
        className="mt-3 block text-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      >
        ↗
      </span>
    </>
  );
}

/* A photograph with its caption set in a black bar beneath it. */
function StackModule({
  p,
  className = "",
  mobileAspect = "aspect-[16/10]",
  sizes,
  priority = false,
}: {
  p: Project;
  className?: string;
  mobileAspect?: string;
  sizes: string;
  priority?: boolean;
}) {
  const src = cover(p);
  return (
    <Link
      href={`/projects/${p.slug}`}
      className={`group flex flex-col bg-[var(--surface)] text-[#ebe6da] ${className}`}
    >
      <span className={`relative w-full ${mobileAspect} sm:aspect-auto sm:min-h-[14rem] sm:flex-1`}>
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
      <div className="shrink-0 p-5">
        <Caption p={p} />
      </div>
    </Link>
  );
}

/* A photograph with its caption set over the bottom of the frame — used
   where the tile should read as one continuous image rather than a boxed
   card. */
function OverlayModule({
  p,
  className = "",
  sizes,
  priority = false,
  caption = true,
}: {
  p: Project;
  className?: string;
  sizes: string;
  priority?: boolean;
  caption?: boolean;
}) {
  const src = cover(p);
  return (
    <Link href={`/projects/${p.slug}`} className={`group relative block overflow-hidden ${className}`}>
      {/* Absolutely positioned so the frame fills a parent sized by
          aspect-ratio or min-height — a percentage height would collapse. */}
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
          <span className="block h-full w-full bg-[var(--surface)]" />
        )}
      </span>
      {caption && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent"
          />
          <span className="absolute inset-x-0 bottom-0 p-5 text-[#ebe6da]">
            <Caption p={p} />
          </span>
        </>
      )}
    </Link>
  );
}

export function Hero() {
  const [a, b, c, d] = collage;
  // Contact-sheet strip below the collage — the next frames on the roll.
  const strip = featuredProjects
    .flatMap((p) => (p.gallery ?? []).slice(0, 1).map((g) => ({ src: g.image, p })))
    .slice(0, 5);

  return (
    <section className="border-b border-[var(--line-soft)]">
      <div className="shell grid gap-px lg:grid-cols-[minmax(0,22rem)_1fr]">
        {/* Editorial rail */}
        <div className="flex flex-col justify-between py-10 pr-0 lg:py-14 lg:pr-10">
          <div>
            {/* Sized to the rail so the longest word never runs past it */}
            <h1 className="display text-[clamp(1.9rem,3.4vw,3.15rem)] leading-[1.14]">
              {site.hero.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <span aria-hidden className="mt-8 block h-px w-12 bg-[var(--ink)]" />

            <p className="mt-6 max-w-[26ch] leading-relaxed text-[var(--ink)]">
              {site.hero.supporting}
            </p>

            <Link href="/projects" className="ul-link label mt-10 inline-flex items-center gap-3">
              {site.hero.cta}
              <span aria-hidden>↗</span>
            </Link>
          </div>

          <p className="label mt-12 hidden text-[var(--muted)] lg:block">
            Scroll
            <span aria-hidden className="mt-2 block">
              ↓
            </span>
          </p>
        </div>

        {/* Interlocking collage */}
        <div className="relative pb-8 lg:py-8">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-12">
            {a && (
              <OverlayModule
                p={a}
                priority
                sizes="(min-width:1024px) 40vw, 100vw"
                className="aspect-[4/5] sm:col-span-6 sm:row-span-2 sm:aspect-auto sm:min-h-[30rem]"
              />
            )}

            {b && (
              <StackModule
                p={b}
                sizes="(min-width:1024px) 32vw, 100vw"
                className="sm:col-span-5 sm:row-span-2"
              />
            )}

            {/* Film rail with the picked frame circled in grease pencil */}
            <div className="relative hidden bg-[#0c0c0a] text-[#cfcabc] sm:col-span-1 sm:row-span-2 sm:block">
              <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 [writing-mode:vertical-rl] py-4 text-[0.4375rem] tracking-[0.25em] uppercase opacity-70">
                400 · 36 EXP · SAFETY FILM
              </span>
              <span className="absolute left-1/2 top-1/3 -translate-x-1/2">
                <CircledNumber value={46} className="h-9 w-16" />
              </span>
              <Tape className="-right-8 top-1/2 hidden lg:block" rotate={-14} />
            </div>

            {c && (
              <OverlayModule
                p={c}
                caption={false}
                sizes="(min-width:1024px) 34vw, 100vw"
                className="aspect-[16/9] sm:col-span-6"
              />
            )}

            {/* Cream metadata block — Camila's own caption, paired with her
                photo above so the two tiles read as one connected pair. */}
            {c && (
              <Link
                href={`/projects/${c.slug}`}
                className="group hidden flex-col justify-center border border-[var(--line-soft)] bg-[var(--paper-2)] p-4 sm:col-span-3 sm:flex"
              >
                <Caption p={c} tone="dark" />
              </Link>
            )}

            {d && (
              <OverlayModule
                p={d}
                sizes="(min-width:1024px) 30vw, 100vw"
                className="aspect-[4/3] sm:col-span-3 sm:aspect-auto"
              />
            )}
          </div>

          {/* Contact-sheet strip */}
          {strip.length > 0 && (
            <div className="mt-1.5 bg-[#0c0c0a]">
              <Sprockets />
              <div className="grid grid-cols-3 gap-px sm:grid-cols-5">
                {strip.map(({ src, p }, i) => (
                  <Link
                    key={`${p.slug}-${i}`}
                    href={`/projects/${p.slug}`}
                    className="group relative block"
                    aria-label={p.title}
                  >
                    <Media
                      src={src}
                      alt={p.title}
                      sizes="20vw"
                      className="aspect-[4/3] w-full opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span className="absolute bottom-1 left-1.5 font-mono text-[0.5rem] tracking-[0.1em] text-[#cfcabc]/80">
                      {String(41 + i).padStart(2, "0")}
                    </span>
                  </Link>
                ))}
              </div>
              <Sprockets />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
