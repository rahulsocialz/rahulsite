// Projects — managed by the CMS in content/projects.json.
import projectsData from "@/content/projects.json";

export type CategoryKey = "campaigns" | "social" | "photo" | "video" | "art-direction";

export const categories: { key: CategoryKey | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "campaigns", label: "Campaigns" },
  { key: "social", label: "Social" },
  { key: "photo", label: "Photo" },
  { key: "video", label: "Video" },
  { key: "art-direction", label: "Art Direction" },
];

const categoryLabels: Record<CategoryKey, string> = {
  campaigns: "Campaigns",
  social: "Social",
  photo: "Photo",
  video: "Video",
  "art-direction": "Art Direction",
};

export function categoryLabel(key: string) {
  return categoryLabels[key as CategoryKey] ?? key;
}

// A single entry in a project's media sequence — either a photo or a video,
// in whatever order they were dragged into in the CMS. Replaces the old
// separate gallery/videos lists (which always forced every video ahead of
// every photo) so the two can be freely interleaved.
export type MediaItem =
  | { type: "image"; image: string; caption?: string; focalPoint?: string }
  | { type: "video"; url: string; caption?: string };

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  categories: CategoryKey[];
  accent: string;
  featured: boolean;
  hero: boolean;
  order: number;
  placeholderCount: number;
  // Images (empty until added in the CMS — a placeholder renders meanwhile).
  featuredImage?: string;
  heroImage?: string;
  featuredFocalPoint?: string;
  media?: MediaItem[];
  // Optional — only rendered where present.
  client?: string;
  location?: string;
  year?: string;
  externalUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  // Independent from `order` (which drives the /projects archive) so the
  // homepage hero collage and featured strip can be arranged on their own.
  heroOrder?: number;
  featuredOrder?: number;
}

// Drop empty strings so "only render if present" checks stay simple.
function clean(p: Record<string, unknown>): Project {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v === "" || (Array.isArray(v) && v.length === 0)) continue;
    out[k] = v;
  }
  return out as unknown as Project;
}

export const projects: Project[] = (projectsData.projects as Record<string, unknown>[])
  .map(clean)
  .sort((a, b) => a.order - b.order);

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const sorted = projects;
export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => (a.featuredOrder ?? a.order) - (b.featuredOrder ?? b.order));
export const heroProjects = projects
  .filter((p) => p.hero)
  .sort((a, b) => (a.heroOrder ?? a.order) - (b.heroOrder ?? b.order));
