// Site-wide content — managed by the CMS in content/settings.json and
// content/home.json. Multi-line fields are stored as text and split here.
import settings from "@/content/settings.json";
import home from "@/content/home.json";

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const paras = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export const site = {
  name: settings.name,
  role: settings.role,
  email: settings.email,
  instagramHandle: settings.instagramHandle,
  instagramUrl: settings.instagramUrl,
  instagramFeedUrl: settings.instagramFeedUrl || "",
  url: settings.url,
  web3formsAccessKey: settings.web3formsAccessKey || "",
  seo: {
    title: settings.seoTitle,
    description: settings.seoDescription,
    image: settings.seoImage || "",
  },
  hero: {
    headline: lines(home.hero.headline),
    supporting: home.hero.supporting,
    cta: home.hero.cta,
  },
  about: {
    heading: lines(home.about.heading),
    body: paras(home.about.body),
    image: home.about.image || "",
  },
  instagram: {
    images: (home.instagram?.images as string[]) ?? [],
  },
};
