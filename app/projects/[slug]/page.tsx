import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug, categoryLabel, projects, sorted } from "@/data/projects";
import { ProjectShowcase } from "@/components/project/ProjectShowcase";

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

/* A metadata line in the editorial rail. Renders nothing when the CMS field
   is empty, so optional fields never leave a gap. */
function Spec({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="label text-[var(--muted)]">{label}</p>
      <p className="meta mt-1.5">{value}</p>
    </div>
  );
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
  const services = project.categories.map(categoryLabel).join(", ");

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12 lg:py-14">
      {/* Editorial rail */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <h1 className="d1">{project.title}</h1>
        {project.subtitle && <p className="meta mt-4">{project.subtitle}</p>}
        {project.year && <p className="meta mt-1">{project.year}</p>}

        <span aria-hidden className="mt-6 block h-px w-12 bg-[var(--ink)]" />

        <div className="mt-6 space-y-5">
          <Spec label="Client" value={project.client} />
          <Spec label="Role" value={services} />
          <Spec label="Location" value={project.location} />
          <Spec label="Year" value={project.year} />
        </div>

        {project.description && (
          <>
            <span aria-hidden className="mt-6 block h-px w-20 bg-[var(--line-soft)]" />
            <p className="mt-6 max-w-[32ch] leading-relaxed">{project.description}</p>
          </>
        )}

        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ul-link label mt-8 inline-flex min-h-11 items-center gap-2"
          >
            Visit <span aria-hidden>↗</span>
          </a>
        )}

        {/* Previous / next project */}
        <nav className="mt-10 border-t border-[var(--line-soft)] pt-6" aria-label="Project navigation">
          {prev && (
            <Link href={`/projects/${prev.slug}`} className="group block">
              <span className="label text-[var(--muted)]">Prev Project</span>
              <span className="meta mt-1.5 block transition-opacity group-hover:opacity-60">{prev.title}</span>
              <span aria-hidden className="mt-2 block transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
            </Link>
          )}
          {next && (
            <Link href={`/projects/${next.slug}`} className="group mt-6 block">
              <span className="label text-[var(--muted)]">Next Project</span>
              <span className="meta mt-1.5 block transition-opacity group-hover:opacity-60">{next.title}</span>
              <span aria-hidden className="mt-2 block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}
        </nav>
      </div>

      {/* Media sequence */}
      <div>
        <ProjectShowcase
          images={project.gallery ?? []}
          videos={project.videos ?? []}
          title={project.title}
          subtitle={project.subtitle}
          year={project.year}
        />
      </div>
    </div>
  );
}
