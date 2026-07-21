/* Type-only wordmarks for publications, set to evoke the real logotype
   without using trademarked artwork. Anything not listed falls back to the
   condensed display face, so new publications look intentional too. */
const marks: Record<string, { text: string; className: string }> = {
  Billboard: { text: "billboard", className: "wm-billboard" },
  "Rolling Stone": { text: "RollingStone", className: "wm-rollingstone" },
  "Rolling Stone UK": { text: "RollingStone UK", className: "wm-rollingstone" },
  Variety: { text: "Variety", className: "wm-variety" },
  NME: { text: "NME", className: "wm-nme" },
  Clash: { text: "CLASH", className: "wm-clash" },
  Wonderland: { text: "Wonderland.", className: "wm-wonderland" },
  Vogue: { text: "VOGUE", className: "wm-vogue" },
  VOGUE: { text: "VOGUE", className: "wm-vogue" },
  "Vogue Magazine": { text: "VOGUE", className: "wm-vogue" },
};

export function PublicationMark({
  name,
  className = "text-lg",
}: {
  name: string;
  className?: string;
}) {
  const m = marks[name] ?? { text: name, className: "wm-generic" };
  return <span className={`wm ${m.className} ${className}`}>{m.text}</span>;
}
