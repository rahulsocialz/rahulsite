import Link from "next/link";
import { site } from "@/data/site";

/* The black quad-band that closes every page: four routes out, then a thin
   colophon rule. Always the dark surface regardless of theme — it's the
   back cover of the book. */
const cards = [
  { label: "About Rahul", detail: "Story, approach, background", href: "/#about" },
  { label: "Featured In", detail: "Press, interviews, features", href: "/featured-in" },
  { label: "Instagram", detail: site.instagramHandle, href: site.instagramUrl, external: true },
  { label: "Let's Work Together", detail: "Start a project", href: "/#contact" },
];

const columns = [
  {
    title: "Work",
    items: [
      { label: "All Projects", href: "/projects" },
      { label: "Campaigns", href: "/projects" },
      { label: "Photo", href: "/projects" },
      { label: "Video", href: "/projects" },
      { label: "Art Direction", href: "/projects" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "Story", href: "/#about" },
      { label: "Approach", href: "/#about" },
    ],
  },
  {
    title: "Featured In",
    items: [
      { label: "Press", href: "/featured-in" },
      { label: "Features", href: "/featured-in" },
    ],
  },
];

export function Footer() {
  return (
    <footer>
      <div className="bg-[var(--surface)] text-[var(--surface-ink)]">
        <div className="shell grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => {
            const inner = (
              <>
                <span className="label">{c.label}</span>
                <span className="meta mt-2 block opacity-60">{c.detail}</span>
                <span
                  aria-hidden
                  className="mt-5 block text-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </>
            );
            const cls = `group block py-9 lg:py-11 ${
              i > 0 ? "lg:border-l lg:border-[rgba(235,230,218,0.16)] lg:pl-8" : ""
            } ${i < cards.length - 1 ? "border-b border-[rgba(235,230,218,0.16)] lg:border-b-0" : ""}`;
            return c.external ? (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={c.label} href={c.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="label">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="meta mt-2 text-[var(--muted)]">All rights reserved</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="label mb-3">{col.title}</p>
            <ul className="space-y-1.5">
              {col.items.map((it) => (
                <li key={it.label}>
                  <Link
                    href={it.href}
                    className="meta text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
