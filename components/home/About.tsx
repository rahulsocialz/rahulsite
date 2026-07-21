import { site } from "@/data/site";
import { Media } from "@/components/ui/Media";
import { awards } from "@/data/awards";
import Link from "next/link";

/* About lives on the homepage only. One portrait, set copy, and the award
   record kept as a plain typographic list so those credits (and their links
   through to the work) survive the redesign. */
export function About() {
  return (
    <section id="about" className="shell scroll-mt-16 border-b border-[var(--line-soft)] py-10 lg:py-14">
      <h2 className="d3">About</h2>
      <span aria-hidden className="mt-5 block h-px w-12 bg-[var(--ink)]" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,34ch)_1fr] lg:gap-14">
        <div className="relative max-w-sm">
          {site.about.image ? (
            <Media
              src={site.about.image}
              alt={site.name}
              sizes="(min-width:1024px) 20rem, 80vw"
              className="aspect-[4/5] w-full"
            />
          ) : (
            <span className="block aspect-[4/5] w-full bg-[var(--paper-2)]" />
          )}
        </div>

        <div>
          {site.about.heading.length > 0 && (
            <h3 className="display mb-6 text-[clamp(1.4rem,2.2vw,2rem)]">
              {site.about.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
          )}
          <div className="space-y-4">
            {site.about.body.map((p) => (
              <p key={p} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>

        {awards.length > 0 && (
          <div>
            <p className="label text-[var(--muted)]">Awards</p>
            <ul className="mt-4 space-y-3">
              {awards.map((a) => {
                const body = (
                  <>
                    <span className="meta block font-medium">{a.name}</span>
                    <span className="meta mt-0.5 block text-[var(--muted)]">{a.detail}</span>
                  </>
                );
                return (
                  <li key={`${a.name}-${a.detail}`} className="border-b border-[var(--line-soft)] pb-3 last:border-0">
                    {a.link ? (
                      a.link.startsWith("http") ? (
                        <a href={a.link} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-60">
                          {body}
                        </a>
                      ) : (
                        <Link href={a.link} className="block transition-opacity hover:opacity-60">
                          {body}
                        </Link>
                      )
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
