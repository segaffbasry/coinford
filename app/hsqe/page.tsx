import type { Metadata } from "next";
import TrainingFilm from "@/components/TrainingFilm";
import { PageHead } from "@/components/page";
import { CropButton, Label, Photo } from "@/components/ui";
import { pages } from "@/lib/content";

export const metadata: Metadata = { title: "Health, Safety, Quality & Environment" };
const h = pages.hsqe;

export default function HsqePage() {
  return <>
    <PageHead label="HSQE" title={h.eyebrow} lede={h.safety[0]} media={h.images[0]} />
    <section className="section" aria-labelledby="training-title">
      <div className="wrap split">
        <TrainingFilm />
        <div className="prose">
          <Label>Training</Label>
          <h2 className="h2" id="training-title" data-reveal="heading">{h.culture}</h2>
          {[h.safety[1], h.training, h.behaviour].filter(Boolean).map((t) => <p key={t} className="body" data-reveal="text">{t}</p>)}
        </div>
      </div>
    </section>
    <section className="section" aria-label="Safety photography" data-late>
      <div className="wrap fleet fleet-5">{h.images.slice(1).map((img) => <Photo key={img.src} media={img} sizes="(max-width: 900px) 50vw, 20vw" />)}</div>
    </section>
    <section className="section band" aria-labelledby="env-title" data-late>
      <div className="wrap split-1-2">
        <div className="section-head"><Label>Environment &amp; quality</Label><h2 className="h2" id="env-title" data-reveal="heading">{h.environmentTitle}</h2>
          {h.iso && <Photo media={h.iso} alt="ISO 9001 certification mark" className="iso" sizes="200px" />}</div>
        <div className="prose">
          <p className="lede" data-reveal="text">{h.environmentIntro}</p>
          <div className="pillars">{h.pillars.map((p) => <div key={p.title} data-reveal="card"><h3 className="h4">{p.title}</h3><p className="body">{p.body}</p></div>)}</div>
          <div className="prose-cta"><CropButton href="/projects">Our portfolio</CropButton></div>
        </div>
      </div>
    </section>
  </>;
}
