import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery, PageHead, Related } from "@/components/page";
import { Arrow, CropButton, Label, Photo } from "@/components/ui";
import sizes from "@/content/client-logos.json";
import { projects, related } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p?.title };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug); if (!project) notFound();
  const logo = project.client?.logo ? project.client.logo.src.split("/").pop()! : null;
  const [lw, lh] = logo ? (sizes as Record<string, number[]>)[logo] ?? [200, 100] : [0, 0];
  return <>
    <PageHead label={project.group} title={project.title} lede={project.summary[0]} media={project.cover} crumbs={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }]}>
      <dl className="facts" data-reveal="card">
        {project.location && <div><dt className="label">Location</dt><dd>{project.location}</dd></div>}
        {project.value && <div><dt className="label">Contract value</dt><dd>{project.value}</dd></div>}
        {project.client && <div><dt className="label">Client</dt><dd>{logo ? <Image className="fact-logo" src={`/media/clients/mono/${logo}`} alt={project.client.name} width={lw} height={lh} /> : project.client.name}</dd></div>}
      </dl>
    </PageHead>
    <section className="section" aria-labelledby="scope-title">
      <div className="wrap split-1-2">
        <div className="section-head"><Label>{project.title}</Label><h2 className="h2" id="scope-title" data-reveal="heading">Scope of Works</h2></div>
        <div className="prose">
          <ul className="bullets">{project.scope.map((item) => <li key={item} data-reveal="card">{item}</li>)}</ul>
          {project.summary.slice(1).map((p) => <p key={p} className="body" data-reveal="text">{p}</p>)}
          {project.pdf && <div className="prose-cta"><CropButton href={project.pdf}>Download case study (PDF)</CropButton></div>}
        </div>
      </div>
    </section>
    <Gallery images={project.images} title={`${project.title} photography`} />
    <Related title="More projects" href="/projects" cta="All projects">
      <ul className="grid-3">{related(projects, slug).map((p) => <li key={p.slug} data-reveal="card">
        <Link href={`/projects/${p.slug}`} className="card"><Photo media={p.cover} sizes="(max-width: 900px) 50vw, 33vw" reveal={false} />
          <p className="card-title"><span>{p.title}</span><Arrow /></p><p className="card-meta">{p.location && <span>{p.location}</span>}{p.value && <span>{p.value}</span>}</p></Link>
      </li>)}</ul>
    </Related>
  </>;
}
