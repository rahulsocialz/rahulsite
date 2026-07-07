/* Editorial headline where each line rises once on load. CSS-driven so the
   text is guaranteed to end visible regardless of JS. Pass an array of lines
   so each animates independently behind its own mask. */
export function Headline({
  lines,
  className = "display",
  as: Tag = "h1",
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <span
            className="line-rise block whitespace-nowrap"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
