// Maps a friendly crop-bias label to a CSS object-position value, so a
// photo forced into a tile/frame that doesn't match its own aspect ratio
// can be nudged to keep a head or subject in view instead of center-
// cropping through it — or, for the homepage hero, shifted away from the
// headline text overlaid on the left side of the image.
export type FocalPoint =
  | "top-left" | "top" | "top-right"
  | "left" | "center" | "right"
  | "bottom-left" | "bottom" | "bottom-right";

const POSITIONS: Record<FocalPoint, string> = {
  "top-left": "20% 20%",
  top: "50% 20%",
  "top-right": "80% 20%",
  left: "20% 50%",
  center: "50% 50%",
  right: "80% 50%",
  "bottom-left": "20% 80%",
  bottom: "50% 80%",
  "bottom-right": "80% 80%",
};

// A handful of photos need a crop bias none of the nine presets hit exactly
// (e.g. subjects sitting low in a portrait shot forced into a short row) —
// for those, the CMS field can carry a raw "X% Y%" position instead of a
// preset name, and it passes straight through.
const RAW_POSITION = /^\d{1,3}%\s+\d{1,3}%$/;

// Default bias is "top" rather than dead-center: most of these frames are
// people, and a center crop through a short/wide box clips heads far more
// often than it clips feet.
export function focalPosition(fp?: string): string {
  if (fp && RAW_POSITION.test(fp)) return fp;
  if (!fp || fp === "center") return POSITIONS.top;
  return POSITIONS[fp as FocalPoint] ?? POSITIONS.top;
}
