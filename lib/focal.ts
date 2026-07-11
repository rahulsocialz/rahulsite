// Maps a friendly crop-bias label to a CSS object-position value, so a
// portrait photo forced into a squarer/landscape tile can be nudged to keep
// a head or subject in frame instead of center-cropping through it.
export type FocalPoint = "top" | "center" | "bottom";

const POSITIONS: Record<FocalPoint, string> = {
  top: "50% 20%",
  center: "50% 50%",
  bottom: "50% 80%",
};

export function focalPosition(fp?: string): string {
  return POSITIONS[fp as FocalPoint] ?? POSITIONS.center;
}
