"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/projects", label: "Work", match: "/projects" },
  { href: "/", label: "Home", exact: true },
  { href: "/#awards", label: "Awards" },
  { href: "/featured-in", label: "Featured In", match: "/featured-in" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "border-b hairline bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-[68px] items-center justify-between">
        <Link
          href="/"
          className="text-[0.72rem] font-semibold uppercase tracking-[0.22em]"
        >
          Rahul Bhatt
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-6 sm:gap-9">
          {links.map((l) => {
            const active = l.exact ? pathname === l.href : l.match ? pathname.startsWith(l.match) : false;
            return (
              <Link
                key={l.label}
                href={l.href}
                className={`hidden text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-300 sm:block ${
                  active
                    ? "text-fg"
                    : "text-muted hover:text-fg"
                }`}
              >
                <span className={active ? "border-b border-[var(--accent)] pb-1" : ""}>
                  {l.label}
                </span>
              </Link>
            );
          })}
          <Link href="/projects" className="text-[0.72rem] uppercase tracking-[0.14em] text-muted sm:hidden">
            Work
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
