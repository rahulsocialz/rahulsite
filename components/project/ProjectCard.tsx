"use client";

import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { Placeholder } from "@/components/ui/Placeholder";
import { Pill } from "@/components/ui/Pill";
import { useAccent } from "@/components/layout/Providers";

export interface ProjectCardData {
  slug: string;
  title: string;
  subtitle: string;
  image?: string;
  accent?: string;
  categories?: string[];
  blurDataURL?: string;
}

/* Reusable project card. On hover the image scales, the title lifts, the
   custom cursor reads "View", and the interface accent warms to the image
   (or the project's assigned colour while photography is still a placeholder). */
export function ProjectCard({
  project,
  sizes = "(min-width:1024px) 30vw, (min-width:640px) 45vw, 80vw",
  aspect = "aspect-[4/5]",
  priority = false,
}: {
  project: ProjectCardData;
  sizes?: string;
  aspect?: string;
  priority?: boolean;
}) {
  const { setFromImage, setColor, reset } = useAccent();

  const onEnter = () => {
    if (project.image) setFromImage(project.image);
    else if (project.accent) setColor(project.accent);
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor
      onMouseEnter={onEnter}
      onMouseLeave={reset}
      className="group block"
    >
      <div className="overflow-hidden">
        {project.image ? (
          <Media
            src={project.image}
            alt={`${project.title} — ${project.subtitle}`}
            sizes={sizes}
            priority={priority}
            blurDataURL={project.blurDataURL}
            className={aspect}
            imgClassName="transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : (
          <Placeholder
            label={project.title}
            className={`${aspect} transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.03]`}
          />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1">
        <div>
          <h3 className="text-[0.95rem] font-medium tracking-[-0.01em]">{project.title}</h3>
          <p className="mt-1 text-caption text-muted">{project.subtitle}</p>
        </div>
        {project.categories && project.categories.length > 0 && (
          <div className="hidden shrink-0 flex-wrap justify-end gap-1.5 sm:flex">
            {project.categories.slice(0, 2).map((c) => (
              <Pill key={c}>{c}</Pill>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
