// One-off seed: writes the CMS-editable content JSON. Safe to delete after
// running. The CMS (Decap) manages these files from then on.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const CONTENT = path.join(process.cwd(), "content");

const P = (o) => ({
  slug: o.slug,
  title: o.title,
  subtitle: o.subtitle,
  description: o.description,
  categories: o.categories,
  accent: o.accent,
  featured: !!o.featured,
  hero: !!o.hero,
  order: o.order,
  placeholderCount: o.placeholderCount ?? 6,
  // Image fields filled via the CMS (empty = neutral placeholder renders).
  featuredImage: "",
  heroImage: "",
  gallery: [],
  // Optional — only shown where present.
  client: "",
  location: "",
  year: "",
  externalUrl: "",
  seoTitle: "",
  seoDescription: "",
});

const projects = [
  P({ slug: "coldplay", title: "Coldplay", subtitle: "Music of the Spheres World Tour", description: "Photographing Coldplay across multiple continents, capturing the scale of the production and the energy of the crowd.", categories: ["photo", "video"], accent: "#3f6fe0", featured: true, hero: true, order: 1, placeholderCount: 7 }),
  P({ slug: "olivia-rodrigo", title: "Olivia Rodrigo", subtitle: "GUTS World Tour", description: "Tour photography following the GUTS World Tour.", categories: ["photo", "social"], accent: "#6e4fc0", featured: true, hero: true, order: 2, placeholderCount: 6 }),
  P({ slug: "nike-fcrb", title: "Nike x F.C. Real Bristol", subtitle: "Campaign", description: "A campaign shot for the Nike x F.C. Real Bristol collaboration.", categories: ["campaigns", "photo"], accent: "#c6982f", featured: true, hero: false, order: 3, placeholderCount: 8 }),
  P({ slug: "jon-batiste", title: "Jon Batiste", subtitle: "Portrait Session", description: "A portrait session with Jon Batiste.", categories: ["photo"], accent: "#d98a3d", featured: true, hero: false, order: 4, placeholderCount: 5 }),
  P({ slug: "the-weeknd", title: "The Weeknd", subtitle: "After Hours Til Dawn Tour", description: "Art direction and stage photography for the After Hours Til Dawn Tour.", categories: ["art-direction", "photo"], accent: "#4b4fb0", featured: true, hero: true, order: 5, placeholderCount: 7 }),
  P({ slug: "grammy-next", title: "GRAMMY Next", subtitle: "Class of 2024", description: "A campaign for the GRAMMY Next Class of 2024.", categories: ["photo", "video", "campaigns"], accent: "#e06a50", featured: true, hero: true, order: 6, placeholderCount: 6 }),
  P({ slug: "camila-cabello", title: "Camila Cabello", subtitle: "Family Session", description: "An intimate family session with Camila Cabello.", categories: ["art-direction", "photo"], accent: "#d98a3d", featured: false, hero: false, order: 7, placeholderCount: 5 }),
  P({ slug: "youtube-artist", title: "YouTube x Artist", subtitle: "Campaign", description: "A social-first campaign produced with YouTube.", categories: ["social", "video"], accent: "#3f6fe0", featured: false, hero: false, order: 8, placeholderCount: 6 }),
  P({ slug: "levis-global", title: "Levi's", subtitle: "Global Campaign", description: "A global campaign for Levi's spanning photo and motion.", categories: ["campaigns", "art-direction", "video"], accent: "#c6982f", featured: false, hero: false, order: 9, placeholderCount: 8 }),
  P({ slug: "jungkook", title: "Jungkook", subtitle: "GOLDEN Live On Stage", description: "Stage photography for Jungkook's GOLDEN live shows.", categories: ["photo", "video"], accent: "#6e4fc0", featured: false, hero: false, order: 10, placeholderCount: 7 }),
  P({ slug: "spotify-billions", title: "Spotify", subtitle: "Billions Club", description: "A social campaign celebrating the Spotify Billions Club.", categories: ["campaigns", "social"], accent: "#3f9e6e", featured: false, hero: false, order: 11, placeholderCount: 6 }),
  P({ slug: "nicki-minaj", title: "Nicki Minaj", subtitle: "Pink Friday 2 Tour", description: "Tour photography for the Pink Friday 2 Tour.", categories: ["photo"], accent: "#d24f9e", featured: false, hero: false, order: 12, placeholderCount: 8 }),
  P({ slug: "little-mix", title: "Little Mix", subtitle: "Confetti Tour", description: "Live photography for the Confetti Tour.", categories: ["photo", "social"], accent: "#e06a50", featured: false, hero: false, order: 13, placeholderCount: 6 }),
  P({ slug: "labrinth", title: "Labrinth", subtitle: "Studio Session", description: "An editorial studio session with Labrinth.", categories: ["art-direction", "photo"], accent: "#4b57b0", featured: false, hero: false, order: 14, placeholderCount: 5 }),
];

const press = [
  { publication: "Billboard", title: "Inside Olivia Rodrigo's 'GUTS World Tour': Behind the Lens", date: "June 2024", url: "" },
  { publication: "Rolling Stone", title: "The Photographers Behind Music's Biggest Moments", date: "May 2024", url: "" },
  { publication: "Variety", title: "Grammy Next Class Spotlight: Rahul Bhatt", date: "March 2024", url: "" },
  { publication: "NME", title: "On Tour With Coldplay: A Visual Diary", date: "January 2024", url: "" },
  { publication: "Clash", title: "Meet the Photographer Capturing Today's Biggest Artists", date: "December 2023", url: "" },
  { publication: "Wonderland", title: "Backstage Pass: Rahul Bhatt", date: "November 2023", url: "" },
];

const awards = [
  { name: "GRAMMY® Next", detail: "Class of 2024" },
  { name: "One Show", detail: "Photography Winner" },
  { name: "Sony World Photography Awards", detail: "Shortlist" },
  { name: "International Music Photography Award", detail: "Nominee" },
  { name: "Los Angeles Center of Photography", detail: "Winner" },
];

const settings = {
  name: "Rahul Bhatt",
  role: "Photographer & Director",
  email: "rahul_bhatt@me.com",
  instagramHandle: "@rahulb91",
  instagramUrl: "https://www.instagram.com/rahulb91",
  url: "https://rahulb.me",
  seoTitle: "Rahul Bhatt — Photographer & Director",
  seoDescription:
    "Rahul Bhatt is a photographer and director capturing the energy behind the music.",
  seoImage: "",
};

const home = {
  hero: {
    headline: "Capturing the\nEnergy Behind\nthe Music.",
    supporting: "I photograph artists, moments and stories that move people.",
    cta: "View My Work",
  },
  about: {
    heading: "Born in Tanzania.\nRaised in England.\nNow based in Los Angeles.",
    body:
      "My journey has taken me from backstage to centre stage, working with some of the biggest names in music and photographing the moments that shape their stories.\n\nI shoot concerts, portraits, campaigns and behind the scenes content for artists, labels and brands.",
    image: "",
  },
  instagram: { images: [] },
};

await mkdir(CONTENT, { recursive: true });
await writeFile(path.join(CONTENT, "projects.json"), JSON.stringify({ projects }, null, 2) + "\n");
await writeFile(path.join(CONTENT, "press.json"), JSON.stringify({ press }, null, 2) + "\n");
await writeFile(path.join(CONTENT, "awards.json"), JSON.stringify({ awards }, null, 2) + "\n");
await writeFile(path.join(CONTENT, "settings.json"), JSON.stringify(settings, null, 2) + "\n");
await writeFile(path.join(CONTENT, "home.json"), JSON.stringify(home, null, 2) + "\n");
console.log("✓ wrote content/{projects,press,awards,settings,home}.json");
