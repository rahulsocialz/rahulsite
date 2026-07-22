import { site } from "@/data/site";

/* A single thin colophon rule closes every page: copyright left,
   Instagram and site links right. Nothing else. */
export function Footer() {
  return (
    <footer className="border-t border-[var(--line-soft)]">
      <div className="shell flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="label text-[var(--muted)]">
          © {new Date().getFullYear()} {site.name} — All rights reserved
        </p>

        <div className="flex items-center gap-8">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ul-link label"
          >
            Instagram
          </a>
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="ul-link label">
            {site.url.replace(/^https?:\/\//, "")}
          </a>
        </div>
      </div>
    </footer>
  );
}
