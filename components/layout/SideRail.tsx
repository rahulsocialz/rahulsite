/* Fixed editorial side rail — the thin vertical margin running down the
   left of every page on large screens, carrying the locality set. */
export function SideRail() {
  return (
    <div className="side-rail" aria-hidden>
      <span className="side-rail__text">Los Angeles, CA &nbsp;·&nbsp; Worldwide</span>
    </div>
  );
}
