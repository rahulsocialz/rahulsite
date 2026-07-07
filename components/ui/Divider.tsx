/* A single thin hairline. The quiet workhorse of the layout. */
export function Divider({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t hairline ${className}`} />;
}
