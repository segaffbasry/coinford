import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Related } from "@/components/page";
import { Arrow, CropButton, Label } from "@/components/ui";
import { related, stories, storyCard, storyTheme } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => stories.map((s) => ({ slug: s.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = stories.find((x) => x.slug === slug);
  return { title: s ? `${s.name}’s story` : undefined };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug); if (!story) notFound();
  return <>
    <section className="page-head wrap story" aria-labelledby="page-title">
      <nav className="crumbs label" aria-label="Breadcrumb" data-reveal="label"><ol><li><Link href="/">Home</Link></li><li><Link href="/careers">Careers</Link></li></ol></nav>
      <div className="split-1-2">
        <div><Label>{storyTheme(story)}</Label><h1 className="h1" id="page-title" data-reveal="heading">{story.name}</h1></div>
        <div className="prose">
          <p className="lede story-lede" data-reveal="text">{story.story[0]}</p>
          {story.story.slice(1).map((p) => <p key={p} className="body" data-reveal="text">{p}</p>)}
          <div className="prose-cta"><CropButton href="/careers#vacancies">Current vacancies</CropButton></div>
        </div>
      </div>
    </section>
    <Related title="More stories" href="/careers" cta="All stories">
      <ul className="grid-3">{related(stories, slug).map(storyCard).map((s) => <li key={s.slug} data-reveal="card">
        <Link href={`/careers/${s.slug}`} className="story-card"><p className="label">{s.theme}</p><p>{s.excerpt}</p><span className="h5">{s.name}<Arrow /></span></Link>
      </li>)}</ul>
    </Related>
  </>;
}
