"use client";

import Link from "next/link";
import { Cards, Controls, More } from "@/components/archive/Controls";
import { useArchive } from "@/components/archive/useArchive";
import { Arrow, Photo } from "@/components/ui";
import type { PersonCard, ProjectCard, StoryCard } from "@/lib/content";

const byGroup = (p: ProjectCard) => p.group;
const byBoard = (p: PersonCard) => p.board;
const byTheme = (s: StoryCard) => s.theme;
const delay = (i: number, size: number) => ({ animationDelay: `${(i % size) * 80}ms` });

export function ProjectArchive({ items }: { items: ProjectCard[] }) {
  const a = useArchive(items, byGroup, 6);
  return <>
    <Controls label="projects" noun={["project", "projects"]} query={a.query} setQuery={a.setQuery} filters={a.filters} filter={a.filter} setFilter={a.setFilter} count={a.results.length} />
    <Cards className="grid-3">{a.visible.map((p, i) => <li key={p.slug} className="card-in" style={delay(i, 6)}>
      <Link href={`/projects/${p.slug}`} className="card">
        <Photo media={p.cover} alt="" sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw" reveal={false} />
        <p className="card-title"><span>{p.title}</span><Arrow /></p>
        <p className="card-meta">{p.location && <span>{p.location}</span>}{p.value && <span>{p.value}</span>}</p>
      </Link>
    </li>)}</Cards>
    <More more={a.more} onMore={a.loadMore} empty={!a.results.length} />
  </>;
}

export function TeamArchive({ items }: { items: PersonCard[] }) {
  const a = useArchive(items, byBoard, 8);
  return <>
    <Controls label="the team" noun={["person", "people"]} query={a.query} setQuery={a.setQuery} filters={a.filters} filter={a.filter} setFilter={a.setFilter} count={a.results.length} />
    <Cards className="grid-4">{a.visible.map((p, i) => <li key={p.slug} className="card-in" style={delay(i, 8)}>
      <Link href={`/team/${p.slug}`} className="card card-portrait">
        <Photo media={p.photo} alt={p.name} sizes="(max-width: 560px) 100vw, (max-width: 1100px) 33vw, 25vw" reveal={false} />
        <p className="card-title"><span>{p.name}</span><Arrow /></p><p className="card-meta">{p.role}</p>
      </Link>
    </li>)}</Cards>
    <More more={a.more} onMore={a.loadMore} empty={!a.results.length} />
  </>;
}

export function StoryArchive({ items }: { items: StoryCard[] }) {
  const a = useArchive(items, byTheme, 6);
  return <>
    <Controls label="stories" noun={["story", "stories"]} query={a.query} setQuery={a.setQuery} filters={a.filters} filter={a.filter} setFilter={a.setFilter} count={a.results.length} />
    <Cards className="grid-3">{a.visible.map((s, i) => <li key={s.slug} className="card-in" style={delay(i, 6)}>
      <Link href={`/careers/${s.slug}`} className="story-card">
        <p className="label">{s.theme}</p><p>{s.excerpt}</p><span className="h5">{s.name}<Arrow /></span>
      </Link>
    </li>)}</Cards>
    <More more={a.more} onMore={a.loadMore} empty={!a.results.length} />
  </>;
}
