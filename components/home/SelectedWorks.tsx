import Link from "next/link";
import { featuredProjects, categoryLabel } from "@/data/projects";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Divider } from "@/components/ui/Divider";
import { focalPosition } from "@/lib/focal";

/* Six featured projects in a tight row. */
export function SelectedWorks() {
  const works = featuredProjects.slice(0, 6);
  return (
    <section className="py-7 lg:py-10">
      <Divider />
      <div className="shell mt-6 flex items-end justify-between">
        <Eyebrow as="h2">Selected Works</Eyebrow>
        <Link
          href="/projects"
          className="link text-[0.72rem] uppercase tracking-[0.14em] light:text-[var(--accent)]"
        >
          View All Projects
        </Link>
      </div>
      <div className="shell mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {works.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={{
              slug: p.slug,
              title: p.title,
              subtitle: p.subtitle,
              image: p.featuredImage,
              focal: focalPosition(p.featuredFocalPoint),
              accent: p.accent,
              categories: p.categories.slice(0, 1).map(categoryLabel),
            }}
            aspect="aspect-[4/5]"
            sizes="(min-width:1024px) 16vw, (min-width:640px) 33vw, 50vw"
            priority={i < 3}
          />
        ))}
      </div>
    </section>
  );
}
