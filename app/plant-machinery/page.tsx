import type { Metadata } from "next";
import { PageHead } from "@/components/page";
import { CropButton, Label, Photo } from "@/components/ui";
import { pages } from "@/lib/content";

export const metadata: Metadata = { title: "Plant & Machinery" };
const p = pages.plant;

export default function PlantPage() {
  return <>
    <PageHead label="Coinford" title="Plant & Machinery" lede={p.closing} media={p.images[2] ?? p.images[0]} />
    <section className="section" aria-label="How our plant operation works">
      <div className="wrap">
        <ol className="feature-grid">{p.sections.map((s, i) => <li key={s.title} data-reveal="card"><span className="label num">0{i + 1}</span><h2 className="h4">{s.title}</h2><p className="body">{s.body}</p></li>)}</ol>
      </div>
    </section>
    <section className="section" aria-label="Plant photography" data-late>
      <div className="wrap pair">{p.images.filter((_, i) => i !== 2).slice(0, 4).map((img) => <Photo key={img.src} media={img} sizes="(max-width: 900px) 100vw, 50vw" parallax />)}</div>
    </section>
    <section className="section band" aria-labelledby="fleet-title" data-late>
      <div className="wrap">
        <div className="head-row">
          <div className="section-head"><Label>{p.fleetLabel}</Label><h2 className="h2" id="fleet-title" data-reveal="heading">{p.fleetTitle}</h2></div>
          <div className="head-row-side"><p className="body" data-reveal="text">{p.fleetCopy}</p><CropButton href="/projects">Our portfolio of projects</CropButton></div>
        </div>
        <ul className="fleet">{p.fleet.map((img) => <li key={img.src} data-reveal="card"><Photo media={img} sizes="(max-width: 560px) 50vw, 25vw" reveal={false} /></li>)}</ul>
      </div>
    </section>
  </>;
}
