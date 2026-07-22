import Link from "next/link";
import { press } from "@/data/press";
import { PublicationMark } from "@/components/ui/PublicationMark";

/* Exactly three features on the homepage; the full archive lives on the
   Featured In page. Each clipping is publication, headline and date, with
   an external-link mark. Items without a URL render as plain clippings. */
export function PressPreview() {
  const items = press.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className="shell border-b border-[var(--line-soft)] py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="d3">Featured In</h2>
        <Link href="/featured-in" className="ul-link label inline-flex items-center gap-2">
          View All Features <span aria-hidden>↗</span>
        </Link>
      </div>

      <div className="mt-8 grid gap-px border border-[var(--line-soft)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => {
          const external = Boolean(p.url);
          const inner = (
            <>
              <span className="block text-[var(--ink)]">
                <PublicationMark name={p.publication} className="text-lg" />
              </span>
              <span className="mt-4 block leading-snug">{p.title}</span>
              <span className="mt-5 flex items-center justify-between">
                {p.date && <span className="meta text-[var(--muted)]">{p.date}</span>}
                {external && (
                  <span
                    aria-hidden
                    className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                )}
              </span>
            </>
          );
          const cls = `group block p-6 outline outline-1 outline-[var(--line-soft)] transition-colors duration-300 ${
            i === 1 ? "bg-[var(--surface)] text-[var(--surface-ink)]" : "hover:bg-[var(--paper-2)]"
          }`;
          return external ? (
            <a key={`${p.publication}-${i}`} href={p.url} target="_blank" rel="noopener noreferrer" className={cls}>
              {inner}
            </a>
          ) : (
            <div key={`${p.publication}-${i}`} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
