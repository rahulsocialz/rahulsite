import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug, projects, sorted } from "@/data/projects";
import { ProjectShowcase } from "@/components/project/ProjectShowcase";
import { ProjectNav } from "@/components/project/ProjectNav";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) return {};
  return {
    title: project.seoTitle || `${project.title} — ${project.subtitle}`,
    description: project.seoDescription || project.description,
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) notFound();

  const index = sorted.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? sorted[index - 1] : sorted[sorted.length - 1];
  const next = index < sorted.length - 1 ? sorted[index + 1] : sorted[0];

  return (
    <div className="shell pt-28 lg:pt-32">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:text-fg"
      >
        <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        Back to Projects
      </Link>

      <header className="mb-8 mt-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="h1">{project.title}</h1>
          <p className="lead mt-2">{project.subtitle}</p>
        </div>
        {project.description && (
          <p className="lead max-w-md text-[1rem] md:text-right">{project.description}</p>
        )}
      </header>

      <ProjectShowcase
        images={project.gallery ?? []}
        placeholderCount={project.placeholderCount}
        accent={project.accent}
        title={project.title}
      />

      <ProjectNav
        prev={prev ? { slug: prev.slug, title: prev.title } : undefined}
        next={next ? { slug: next.slug, title: next.title } : undefined}
      />
      <div className="py-12" />
    </div>
  );
}
