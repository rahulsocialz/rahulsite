// One-off migration: gallery moves from a plain string[] of image paths to
// an array of { image, caption, focalPoint } objects, so each photo can
// carry an optional hover caption and a crop-bias nudge (top/center/bottom)
// for when a fixed-aspect tile would otherwise cut off a head. Also sets
// featuredFocalPoint per project for the same reason on cover/hero images.
import { readFile, writeFile } from "node:fs/promises";

const PATH = "/Users/rahulb/Sites/rahul-website/content/projects.json";

// Projects whose cover/gallery photos are tight portraits that were getting
// cropped through the head in the fixed-aspect tiles — bias the crop upward.
const TOP_FOCAL_SLUGS = new Set(["summer-walker-album-spend-it"]);

const data = JSON.parse(await readFile(PATH, "utf8"));

for (const p of data.projects) {
  const topFocal = TOP_FOCAL_SLUGS.has(p.slug);
  if (topFocal) p.featuredFocalPoint = "top";

  if (!Array.isArray(p.gallery)) continue;
  p.gallery = p.gallery.map((entry) => {
    const image = typeof entry === "string" ? entry : entry.image;
    return {
      image,
      caption: typeof entry === "object" && entry.caption ? entry.caption : "",
      focalPoint: topFocal ? "top" : (typeof entry === "object" && entry.focalPoint) || "center",
    };
  });
}

await writeFile(PATH, JSON.stringify(data, null, 2) + "\n");
console.log("✓ migrated gallery schema for", data.projects.length, "projects");
