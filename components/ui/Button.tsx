"use client";

import Link from "next/link";
import { forwardRef } from "react";

type Variant = "primary" | "outline" | "ghost";
type Common = {
  variant?: Variant;
  arrow?: boolean;
  children: React.ReactNode;
  className?: string;
};

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-pill text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-[transform,background-color,border-color,color] duration-300 ease-[var(--ease-out)] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-[var(--accent-ink)] px-8 py-4",
  outline: "border border-line-strong text-fg px-8 py-4 hover:border-fg",
  ghost: "text-fg px-2 py-1",
};

function Inner({ children, arrow }: { children: React.ReactNode; arrow?: boolean }) {
  return (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden
          className="translate-y-px transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  Common & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button({ variant = "primary", arrow, className = "", children, ...rest }, ref) {
  return (
    <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
});

export function ButtonLink({
  href,
  variant = "primary",
  arrow,
  className = "",
  children,
  ...rest
}: Common & { href: string } & React.ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}
