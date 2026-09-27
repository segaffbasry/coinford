import type { Metadata } from "next";
import { ProjectArchive } from "@/components/archive/Archives";
import { PageHead } from "@/components/page";
import { projectCard, projects } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <>
    <PageHead label="Projects" title="Solid Solutions for Groundwork and Concrete Frames" lede="Groundworks, infrastructure and RC frame packages across London and the South East, from £2.1 million to £20 million." />
    <section className="section archive" aria-label="All projects"><div className="wrap"><ProjectArchive items={projects.map(projectCard)} /></div></section>
  </>;
}
