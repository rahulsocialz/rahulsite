import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsGrid } from "@/components/project/ProjectsGrid";

export const metadata: Metadata = {
  title: "Work / Archive",
  description: "Campaigns, social, photo, video and art direction by Rahul Bhatt.",
};

export default function ProjectsPage() {
  return (
    <Suspense>
      <ProjectsGrid />
    </Suspense>
  );
}
