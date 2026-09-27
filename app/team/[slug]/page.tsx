import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Related } from "@/components/page";
import { Arrow, Label, Photo } from "@/components/ui";
import { related, team } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => team.map((p) => ({ slug: p.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = team.find((x) => x.slug === slug);
  return { title: p ? `${p.name}, ${p.role}` : undefined };
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const person = team.find((p) => p.slug === slug); if (!person) notFound();
  return <>
    <section className="page-head wrap person" aria-labelledby="page-title">
      <nav className="crumbs label" aria-label="Breadcrumb" data-reveal="label"><ol><li><Link href="/">Home</Link></li><li><Link href="/team">Leadership Team</Link></li></ol></nav>
      <div className="person-grid">
        <Photo media={person.photo} alt={person.name} priority sizes="(max-width: 900px) 100vw, 40vw" className="person-photo" />
        <div className="person-body">
          <Label>{person.role}</Label>
          <h1 className="h1" id="page-title" data-reveal="heading">{person.name}</h1>
          <div className="prose">{person.bio.map((p) => <p key={p} className="lede" data-reveal="text">{p}</p>)}</div>
        </div>
      </div>
    </section>
    <Related title="More of the team" href="/team" cta="Leadership team">
      <ul className="grid-3">{related(team, slug).map((p) => <li key={p.slug} data-reveal="card">
        <Link href={`/team/${p.slug}`} className="card card-portrait"><Photo media={p.photo} alt={p.name} sizes="(max-width: 900px) 50vw, 33vw" reveal={false} />
          <p className="card-title"><span>{p.name}</span><Arrow /></p><p className="card-meta">{p.role}</p></Link>
      </li>)}</ul>
    </Related>
  </>;
}
