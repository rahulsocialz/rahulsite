import { Divider } from "@/components/ui/Divider";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer>
      <Divider />
      <div className="shell flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="eyebrow">© {new Date().getFullYear()} {site.name}</p>
        <div className="flex items-center gap-8">
          <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="eyebrow link">
            Instagram
          </a>
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="eyebrow link">
            rahulb.me
          </a>
        </div>
      </div>
    </footer>
  );
}
