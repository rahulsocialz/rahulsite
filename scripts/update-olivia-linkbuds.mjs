// One-off: Rahul re-curated the Olivia Rodrigo LinkBuds photo set (swapped
// some photos, removed others). Re-resizes just this project's folder and
// replaces its gallery in content/projects.json, in this narrative order:
// hero shot -> close-ups -> real subway/OOH campaign placements -> flatlay.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SLUG = "olivia-rodrigo-linkbuds";
const SRC_DIR = "/Users/rahulb/Downloads/WEBSITE/01. Olivia Rodrigo Link Buds";
const OUT_DIR = `/Users/rahulb/Sites/rahul-website/public/images/uploads/${SLUG}`;
const CONTENT_PATH = "/Users/rahulb/Sites/rahul-website/content/projects.json";
const MAX_DIM = 2400;

const ORDER = [
  "01. FitKV 9504 x 6336.jpg",
  "04. SP1_FitCloseUp_1x1.jpg",
  "03.  .jpg",
  "05. SP2_FitWide_16x9.jpg",
  "CR522329.jpg",
  "3953696_Geffen Records_New York Subway_Brand Train__2024-10-21.jpg",
  "3953696__New York Subway_Wall Vinyls__2024-10-21 (1).jpg",
  "SP8_A7R04124-screen.jpg",
  "SP9_1x1.jpg",
];

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

const gallery = [];
for (let i = 0; i < ORDER.length; i++) {
  const srcFile = path.join(SRC_DIR, ORDER[i]);
  const outName = `${String(i + 1).padStart(2, "0")}.jpg`;
  await sharp(srcFile, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT_DIR, outName));
  gallery.push({ image: `/images/uploads/${SLUG}/${outName}`, caption: "", focalPoint: "center" });
  console.log(`  ${ORDER[i]} -> ${outName}`);
}

const data = JSON.parse(await readFile(CONTENT_PATH, "utf8"));
const project = data.projects.find((p) => p.slug === SLUG);
project.gallery = gallery;
project.featuredImage = gallery[0].image;
project.heroImage = gallery[0].image;
await writeFile(CONTENT_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`✓ Updated ${SLUG}: ${gallery.length} images`);
