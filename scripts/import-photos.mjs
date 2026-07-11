// One-off import: resizes Rahul's raw project photos from ~/Downloads/WEBSITE
// into public/images/uploads/<slug>/ and writes content/projects.json.
// Safe to re-run — it overwrites the output folders and projects.json.
import { mkdir, readdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_ROOT = "/Users/rahulb/Downloads/WEBSITE";
const UPLOADS = "/Users/rahulb/Sites/rahul-website/public/images/uploads";
const CONTENT = "/Users/rahulb/Sites/rahul-website/content/projects.json";

const IMAGE_EXT = /\.(jpe?g|png|webp|heic)$/i;
const MAX_DIM = 2400;

const ACCENTS = [
  "#3f6fe0", "#6e4fc0", "#c6982f", "#d98a3d", "#4b4fb0", "#e06a50",
  "#3f9e6e", "#d24f9e", "#4b57b0", "#8a5fd6", "#2f9bd6", "#c65f3f",
];

// Manually curated per folder — folder names don't split cleanly enough
// to parse automatically (dashes missing, typos, inconsistent casing).
const PROJECTS = [
  { n: 1, folder: "01. Olivia Rodrigo Link Buds", slug: "olivia-rodrigo-linkbuds", title: "Olivia Rodrigo", subtitle: "LinkBuds Campaign", categories: ["campaigns", "photo"] },
  { n: 2, folder: "02. KATSEYE Beautful Chaos Tour", slug: "katseye-beautiful-chaos-tour", title: "KATSEYE", subtitle: "Beautiful Chaos Tour", categories: ["photo"] },
  { n: 3, folder: "03. Camila Cabello - C,XOXO Album Campaign", slug: "camila-cabello-cxoxo-campaign", title: "Camila Cabello", subtitle: "C,XOXO Album Campaign", categories: ["campaigns", "photo"] },
  { n: 4, folder: "04. Jon Batiste - World Music Radio Campaign", slug: "jon-batiste-world-music-radio", title: "Jon Batiste", subtitle: "World Music Radio Campaign", categories: ["campaigns"] },
  { n: 5, folder: "05. KATSEYE - Gap x Complex", slug: "katseye-gap-x-complex", title: "KATSEYE", subtitle: "Gap x Complex", categories: ["campaigns", "photo"] },
  { n: 6, folder: "06. Summer Walker - Album and Spend It", slug: "summer-walker-album-spend-it", title: "Summer Walker", subtitle: "Album Artwork & “Spend It”", categories: ["art-direction", "photo"] },
  { n: 7, folder: "07. Olivia Rodrigo Guts Tour Photo Book", slug: "olivia-rodrigo-guts-tour-photo-book", title: "Olivia Rodrigo", subtitle: "GUTS Tour Photo Book", categories: ["photo"] },
  { n: 8, folder: "08. Camila Cabello - Yours, C Tour", slug: "camila-cabello-yours-c-tour", title: "Camila Cabello", subtitle: "Yours, C Tour", categories: ["photo"] },
  { n: 9, folder: "09. Renee Rapp - Bite Me", slug: "renee-rapp-bite-me", title: "Renee Rapp", subtitle: "Bite Me", categories: ["photo", "video"] },
  { n: 10, folder: "10. Dream Academy", slug: "dream-academy", title: "Dream Academy", subtitle: "", categories: ["photo"] },
  { n: 11, folder: "11. Coldplay", slug: "coldplay", title: "Coldplay", subtitle: "", categories: ["photo"] },
  { n: 12, folder: "12. Billie Eilish - Hit Me Hard and Soft 3D Movie", slug: "billie-eilish-hit-me-hard-and-soft-3d-film", title: "Billie Eilish", subtitle: "Hit Me Hard and Soft — 3D Film", categories: ["art-direction"] },
  { n: 13, folder: "13. KATSEYE - Director - Music Videos", slug: "katseye-director-music-videos", title: "KATSEYE", subtitle: "Director, Music Videos", categories: ["video"] },
  { n: 14, folder: "14. Jungkook - 3D Single", slug: "jungkook-3d-single", title: "Jungkook", subtitle: "3D Single", categories: ["video"] },
  { n: 15, folder: "15. KATSEYE - Gnarly Campaign", slug: "katseye-gnarly-campaign", title: "KATSEYE", subtitle: "Gnarly Campaign", categories: ["campaigns", "art-direction"] },
  { n: 16, folder: "16. Camila Cabello - Havana Music Video", slug: "camila-cabello-havana", title: "Camila Cabello", subtitle: "Havana — Music Video", categories: ["video", "photo"] },
  { n: 17, folder: "17. KATSEYE - Pinky Up Music VIdeo", slug: "katseye-pinky-up", title: "KATSEYE", subtitle: "Pinky Up — Music Video", categories: ["video"] },
  { n: 18, folder: "18. Olivia Rodrigo - L'ancome", slug: "olivia-rodrigo-lancome", title: "Olivia Rodrigo", subtitle: "Lancôme", categories: ["campaigns"] },
  { n: 19, folder: "19. Camila Cabello - Over the Years", slug: "camila-cabello-over-the-years", title: "Camila Cabello", subtitle: "Over the Years", categories: ["photo"] },
  { n: 20, folder: "20. KATSEYE - Gabriela Music VIdeo", slug: "katseye-gabriela", title: "KATSEYE", subtitle: "Gabriela — Music Video", categories: ["video"] },
  { n: 21, folder: "21. James Arthur - Creative Direction", slug: "james-arthur-creative-direction", title: "James Arthur", subtitle: "Creative Direction", categories: ["art-direction", "photo"] },
  { n: 22, folder: "22. Fifth Harmony - Over The Years", slug: "fifth-harmony-over-the-years", title: "Fifth Harmony", subtitle: "Over the Years", categories: ["photo"] },
  { n: 23, folder: "23. Little Mix - Over the Years", slug: "little-mix-over-the-years", title: "Little Mix", subtitle: "Over the Years", categories: ["photo"] },
  { n: 24, folder: "24. Posters", slug: "posters", title: "Posters", subtitle: "Campaign Artwork", categories: ["art-direction"] },
  { n: 25, folder: "25. boygenius - The Film", slug: "boygenius-the-film", title: "boygenius", subtitle: "The Film", categories: ["video"] },
  { n: 26, folder: "26. Camila Cabello - Familia Campaign", slug: "camila-cabello-familia-campaign", title: "Camila Cabello", subtitle: "Familia Campaign", categories: ["campaigns", "photo"] },
  { n: 27, folder: "27. One Direction - Over the Years", slug: "one-direction-over-the-years", title: "One Direction", subtitle: "Over the Years", categories: ["photo"] },
  { n: 28, folder: "28. KATSEYE - On the Road", slug: "katseye-on-the-road", title: "KATSEYE", subtitle: "On the Road", categories: ["photo", "social"] },
  { n: 29, folder: "29. Ben Platt - Cherry On Top Video", slug: "ben-platt-cherry-on-top", title: "Ben Platt", subtitle: "Cherry On Top — Music Video", categories: ["video"] },
  { n: 30, folder: "30. Camila x UEFA", slug: "camila-cabello-uefa", title: "Camila Cabello", subtitle: "x UEFA", categories: ["campaigns"] },
  { n: 31, folder: "31. KATSEYE - Debut Music Video", slug: "katseye-debut-music-video", title: "KATSEYE", subtitle: "Debut — Music Video", categories: ["video"] },
  { n: 32, folder: "32. Camila Cabello - Never Be The Same Tour", slug: "camila-cabello-never-be-the-same-tour", title: "Camila Cabello", subtitle: "Never Be The Same Tour", categories: ["photo"] },
  { n: 33, folder: "33. Syco", slug: "syco", title: "Syco", subtitle: "", categories: ["photo"] },
];

// Bubble hero/cover/group shots to the front; sink poster/artwork/press-kit
// style assets to the back so real photography leads each gallery.
function sortKey(filename) {
  const f = filename.toLowerCase();
  let score = 0;
  if (/(cover|hero|main|group)/.test(f)) score -= 10;
  if (/^0?1[._ -]/.test(f) || /^01\b/.test(f)) score -= 5;
  if (/(poster|artwork|press)/.test(f)) score += 10;
  return score;
}

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && IMAGE_EXT.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => sortKey(a) - sortKey(b) || a.localeCompare(b));
}

async function processProject(p, accent) {
  const srcDir = path.join(SRC_ROOT, p.folder);
  const outDir = path.join(UPLOADS, p.slug);
  const files = await listImages(srcDir);

  if (files.length === 0) {
    return {
      slug: p.slug, title: p.title, subtitle: p.subtitle, description: "",
      categories: p.categories, accent, featured: false, hero: false,
      order: p.n, placeholderCount: 6, featuredImage: "", heroImage: "",
      gallery: [], client: "", location: "", year: "", externalUrl: "",
      seoTitle: "", seoDescription: "", videos: [],
    };
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const gallery = [];
  for (let i = 0; i < files.length; i++) {
    const srcFile = path.join(srcDir, files[i]);
    const outName = `${String(i + 1).padStart(2, "0")}.jpg`;
    const outFile = path.join(outDir, outName);
    await sharp(srcFile, { failOn: "none" })
      .rotate() // respects EXIF orientation
      .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outFile);
    gallery.push(`/images/uploads/${p.slug}/${outName}`);
  }

  return {
    slug: p.slug, title: p.title, subtitle: p.subtitle, description: "",
    categories: p.categories, accent, featured: false, hero: false,
    order: p.n, placeholderCount: 6,
    featuredImage: gallery[0], heroImage: gallery[0],
    gallery, client: "", location: "", year: "", externalUrl: "",
    seoTitle: "", seoDescription: "", videos: [],
  };
}

const results = [];
for (const p of PROJECTS) {
  const accent = ACCENTS[(p.n - 1) % ACCENTS.length];
  process.stdout.write(`Processing ${p.n}. ${p.title}${p.subtitle ? " — " + p.subtitle : ""}... `);
  const project = await processProject(p, accent);
  console.log(`${project.gallery.length} images`);
  results.push(project);
}

await writeFile(CONTENT, JSON.stringify({ projects: results }, null, 2) + "\n");
console.log(`\n✓ Wrote ${results.length} projects to content/projects.json`);
