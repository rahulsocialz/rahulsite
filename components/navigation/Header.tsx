"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/data/site";

/* Work and Featured In are real pages; About, Contact and Instagram are
   sections of the homepage, so they resolve to anchors from anywhere. */
const links = [
  { href: "/projects", label: "Work", match: "/projects" },
  { href: "/#about", label: "About" },
  { href: "/featured-in", label: "Featured In", match: "/featured-in" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the panel on route change, and lock scroll while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line-soft)] bg-[var(--paper)]/92 backdrop-blur-sm">
      <div className="shell flex h-14 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span aria-hidden className="block h-2.5 w-2.5 rounded-full bg-[var(--ink)]" />
          <span className="label font-medium">{site.name}</span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-8">
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {links.map((l) => {
              const active = l.match ? pathname.startsWith(l.match) : false;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  data-active={active}
                  className="ul-link label text-[var(--muted)] transition-colors duration-300 hover:text-[var(--ink)] data-[active=true]:text-[var(--ink)]"
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center -mr-3 text-[var(--ink)]"
          >
            <span className="flex w-5 flex-col gap-[5px]">
              <span
                className={`block h-px w-full bg-current transition-transform duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span className={`block h-px w-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span
                className={`block h-px w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Full menu — the only place Instagram appears in navigation. */}
      {open && (
        <div id="menu-panel" className="border-t border-[var(--line-soft)] bg-[var(--paper)]">
          <nav className="shell flex flex-col py-2" aria-label="Menu">
            {[...links, { href: site.instagramUrl, label: "Instagram", external: true }].map((l) => {
              const external = "external" in l && l.external;
              const cls =
                "d3 flex min-h-11 items-center border-b border-[var(--line-soft)] py-3 last:border-0 transition-opacity hover:opacity-60";
              return external ? (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} href={l.href} className={cls}>
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
