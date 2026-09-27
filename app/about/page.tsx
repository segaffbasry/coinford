import type { Metadata } from "next";
import Journey from "@/components/home/Journey";
import { PageHead } from "@/components/page";
import { CropButton, Label, Photo } from "@/components/ui";
import { pages } from "@/lib/content";

export const metadata: Metadata = { title: "About Us" };
const a = pages.about;

export default function AboutPage() {
  return <>
    <PageHead label={a.eyebrow} title={a.title} lede={a.intro[0]} media={a.hero} />
    <section className="section" aria-label="Our story">
      <div className="wrap split-1-2">
        <div />
        <div className="prose">{a.intro.slice(1).map((p) => <p key={p} className="lede" data-reveal="text">{p}</p>)}</div>
      </div>
    </section>
    <Journey />
    <section className="section navy-band mission" data-tone="dark" aria-labelledby="mission-title">
      <div className="wrap split-1-2">
        <div className="section-head"><Label>Mission &amp; Values</Label><h2 className="h2" id="mission-title" data-reveal="heading">Our mission statement</h2></div>
        <div>
          <ol className="mission-list">{a.mission.map((m, i) => <li key={m} data-reveal="card"><span className="display num">0{i + 1}</span><p>{m}</p></li>)}</ol>
          <div className="languages" data-reveal="label">
            <p className="label">Read our Mission &amp; Values in</p>
            <ul>{a.missionPdfs.map((pdf) => <li key={pdf.href}><a href={pdf.href} target="_blank" rel="noreferrer" className="text-link">{pdf.language}</a></li>)}</ul>
          </div>
        </div>
      </div>
    </section>
    <section className="section" aria-labelledby="offer-title" data-late>
      <div className="wrap split">
        <div className="section-head"><Label>{a.offer.eyebrow}</Label><h2 className="h2" id="offer-title" data-reveal="heading">{a.offer.title} {a.offer.rotating[0]}</h2><p className="body" data-reveal="text">{a.offer.lead}</p></div>
        <div><ul className="bullets">{a.offer.items.map((i) => <li key={i} data-reveal="card">{i}</li>)}</ul><p className="body excel-range" data-reveal="text">{a.offer.range}</p>
          <div className="prose-cta"><CropButton href="/projects">Projects</CropButton></div></div>
      </div>
    </section>
    {a.coverage && <section className="section" aria-labelledby="coverage-title" data-late>
      <div className="wrap"><h2 className="h3 coverage-title" id="coverage-title" data-reveal="heading">Where we work: London and the South East</h2>
        <Photo media={a.coverage} alt="Map of Coinford project coverage across London and the South East" sizes="100vw" className="coverage" /></div>
    </section>}
  </>;
}
