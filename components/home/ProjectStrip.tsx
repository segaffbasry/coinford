import Link from "next/link";
import { CropButton, Label, Photo } from "@/components/ui";
import { projects } from "@/lib/content";

/* hauze.pt's captioned image strip (one wide frame, four narrow ones, 10px gaps, 400px tall at 1440).
   The hovered frame widens; on phones the strip becomes a swipeable row. */
export default function ProjectStrip() {
  const featured = projects.slice(0, 5);
  return <section className="section project-strip" aria-labelledby="projects-title">
    <div className="wrap">
      <div className="head-row">
        <div className="section-head"><Label>Projects</Label><h2 className="h2" id="projects-title" data-reveal="heading">Solid Solutions for Groundwork and Concrete Frames</h2></div>
        <div className="head-row-side"><CropButton href="/projects">View all projects</CropButton></div>
      </div>
      <ul className="strip">
        {featured.map((p) => <li key={p.slug} data-reveal="card">
          <Link href={`/projects/${p.slug}`} className="strip-item">
            <Photo media={p.cover} sizes="(max-width: 900px) 80vw, 40vw" reveal={false} />
            <p className="caption">{p.title}<small>{p.location ?? p.value}</small></p>
          </Link>
        </li>)}
      </ul>
    </div>
  </section>;
}
