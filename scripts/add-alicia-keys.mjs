// One-off: adds the new Alicia Keys - Santa Baby Album Roll Out project.
// Hero image is the cover/first gallery image per Rahul's instruction;
// videos are left empty for him to add separately via the CMS later.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SLUG = "alicia-keys-santa-baby-rollout";
const SRC_DIR = "/Users/rahulb/Downloads/WEBSITE/Alicia Keys - Santa Baby Roll Out";
const OUT_DIR = `/Users/rahulb/Sites/rahul-website/public/images/uploads/${SLUG}`;
const CONTENT_PATH = "/Users/rahulb/Sites/rahul-website/content/projects.json";
const MAX_DIM = 2400;

const ORDER = ["hero image.jpg", "Alicia Halloween.jpg"];

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

const gallery = [];
for (let i = 0; i < ORDER.length; i++) {
  const outName = `${String(i + 1).padStart(2, "0")}.jpg`;
  await sharp(path.join(SRC_DIR, ORDER[i]), { failOn: "none" })
    .rotate()
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT_DIR, outName));
  gallery.push({ image: `/images/uploads/${SLUG}/${outName}`, caption: "", focalPoint: "center" });
  console.log(`  ${ORDER[i]} -> ${outName}`);
}

const data = JSON.parse(await readFile(CONTENT_PATH, "utf8"));
const maxOrder = Math.max(...data.projects.map((p) => p.order));

data.projects.push({
  slug: SLUG,
  title: "Alicia Keys",
  subtitle: "Santa Baby Album Roll Out",
  description: "",
  categories: ["campaigns", "photo"],
  accent: "#c6982f",
  featured: false,
  hero: false,
  order: maxOrder + 1,
  placeholderCount: 6,
  featuredImage: gallery[0].image,
  heroImage: gallery[0].image,
  featuredFocalPoint: "center",
  gallery,
  videos: [],
  client: "",
  location: "",
  year: "",
  externalUrl: "",
  seoTitle: "",
  seoDescription: "",
});

await writeFile(CONTENT_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`✓ Added ${SLUG} at order ${maxOrder + 1}`);
