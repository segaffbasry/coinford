import type { Metadata } from "next";
import { TeamArchive } from "@/components/archive/Archives";
import { PageHead } from "@/components/page";
import { Label } from "@/components/ui";
import { pages, personCard, team } from "@/lib/content";

export const metadata: Metadata = { title: "Leadership Team" };
const l = pages.leadership;

export default function TeamPage() {
  return <>
    <PageHead label="Leadership Team" title="Our team" lede={l.intro[0]} />
    <section className="section archive" aria-label="Leadership team"><div className="wrap"><TeamArchive items={team.map(personCard)} /></div></section>
    <section className="section band" aria-labelledby="structure-title" data-late>
      <div className="wrap split-1-2">
        <div className="section-head"><Label>How we work</Label><h2 className="h2" id="structure-title" data-reveal="heading">Team Structure</h2></div>
        <div className="prose">{[l.intro[1], ...l.structure].map((p) => <p key={p} className="body" data-reveal="text">{p}</p>)}</div>
      </div>
    </section>
  </>;
}
