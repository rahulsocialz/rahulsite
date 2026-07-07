import Link from "next/link";

/* Inline link with an underline that grows from the left. Set `accent` to
   have it warm to the active image colour on hover. */
export function TextLink({
  href,
  children,
  accent = false,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  accent?: boolean;
  external?: boolean;
  className?: string;
}) {
  const cls = `link ${accent ? "link-accent" : ""} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
