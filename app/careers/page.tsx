import type { Metadata } from "next";
import { StoryArchive } from "@/components/archive/Archives";
import { PageHead } from "@/components/page";
import { CropButton, Label } from "@/components/ui";
import { pages, stories, storyCard } from "@/lib/content";

export const metadata: Metadata = { title: "Careers" };
const { careers, vacancies } = pages;

export default function CareersPage() {
  const groups = Array.from(new Set(vacancies.roles.map((r) => r.group)));
  const boards = careers.jobBoards.filter((b, i, all) => all.findIndex((x) => x.href === b.href) === i);
  return <>
    <PageHead label="Careers" title={careers.title} lede={careers.intro} />
    <section className="section archive" aria-label="Staff stories"><div className="wrap"><StoryArchive items={stories.map(storyCard)} /></div></section>
    <section className="section band" id="vacancies" aria-labelledby="vacancies-title" data-late>
      <div className="wrap">
        <div className="head-row">
          <div className="section-head"><Label>Jobs At Coinford</Label><h2 className="h2" id="vacancies-title" data-reveal="heading">Current Vacancies</h2></div>
          <div className="head-row-side">{boards.map((b) => <CropButton key={b.href} href={b.href}>{b.label}</CropButton>)}</div>
        </div>
        {groups.map((g) => <div className="vacancy-group" key={g}>
          <h3 className="label" data-reveal="label">{g}</h3>
          <ul className="vacancies">{vacancies.roles.filter((r) => r.group === g).map((r) => <li key={r.title} data-reveal="card">
            <h4 className="h4">{r.title}</h4><p className="body">{r.description}</p>
            <a className="text-link label" href={`mailto:${r.email}?subject=${encodeURIComponent(`${r.title} (${g})`)}`}>Email your CV</a>
          </li>)}</ul>
        </div>)}
      </div>
    </section>
  </>;
}
