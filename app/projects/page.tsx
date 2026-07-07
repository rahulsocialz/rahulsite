import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/project/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Campaigns, social, photo, video and art direction by Rahul Bhatt.",
};

export default function ProjectsPage() {
  return (
    <div className="shell pt-28 lg:pt-32">
      <h1 className="h1 gradient-text mb-10 w-fit">Projects</h1>
      <ProjectsGrid />
      <div className="py-12" />
    </div>
  );
}
