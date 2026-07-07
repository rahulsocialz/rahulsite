/* Type-only wordmarks for publications, styled to evoke the real logos
   without using trademarked artwork. */
const marks: Record<string, { text: string; className: string }> = {
  Billboard: { text: "billboard", className: "wm-billboard" },
  "Rolling Stone": { text: "RollingStone", className: "wm-rollingstone" },
  Variety: { text: "Variety", className: "wm-variety" },
  NME: { text: "NME", className: "wm-nme" },
  Clash: { text: "CLASH", className: "wm-clash" },
  Wonderland: { text: "Wonderland.", className: "wm-wonderland" },
};

export function PublicationMark({
  name,
  className = "text-lg",
}: {
  name: string;
  className?: string;
}) {
  const m = marks[name] ?? { text: name, className: "font-semibold" };
  return <span className={`wm gradient-text ${m.className} ${className}`}>{m.text}</span>;
}
