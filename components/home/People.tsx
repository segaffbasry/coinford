import Link from "next/link";
import { CropButton, Label, Photo } from "@/components/ui";
import { pages, team } from "@/lib/content";

/* Leadership preview: four portraits in hauze.pt's card rhythm, with the Leadership Team page's own introduction. */
export default function People() {
  return <section className="section people" aria-labelledby="people-title" data-late>
    <div className="wrap">
      <div className="head-row">
        <div className="section-head"><Label>Leadership Team</Label><h2 className="h2" id="people-title" data-reveal="heading">At Coinford, our strength lies in our people.</h2></div>
        <div className="head-row-side"><p className="body" data-reveal="text">{pages.leadership.intro[0]}</p><CropButton href="/team">Meet the team</CropButton></div>
      </div>
      <ul className="grid-4">
        {team.slice(0, 4).map((p) => <li key={p.slug} data-reveal="card">
          <Link href={`/team/${p.slug}`} className="card card-portrait">
            <Photo media={p.photo} alt={p.name} sizes="(max-width: 560px) 100vw, (max-width: 1100px) 33vw, 25vw" reveal={false} />
            <p className="card-title"><span>{p.name}</span></p><p className="card-meta">{p.role}</p>
          </Link>
        </li>)}
      </ul>
    </div>
  </section>;
}
