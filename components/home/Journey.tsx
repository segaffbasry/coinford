import { Label } from "@/components/ui";
import { pages } from "@/lib/content";

/* The About page timeline, laid out as harrowservice.com's numbered process row. */
export default function Journey() {
  const { timeline, intro } = pages.about;
  return <section className="section journey" aria-labelledby="journey-title" data-late>
    <div className="wrap">
      <div className="head-row">
        <div className="section-head"><Label>Our journey</Label><h2 className="h2" id="journey-title" data-reveal="heading">Business started 1990</h2></div>
        <p className="body" data-reveal="text">{intro[2]}</p>
      </div>
    </div>
    <div className="journey-scroll" tabIndex={0} role="region" aria-label="Coinford milestones, scrollable" data-lenis-prevent-wheel>
      <ol className="journey-list wrap">
        {timeline.map((t, i) => <li key={`${t.year}-${i}`} data-reveal="card"><span className="display journey-year num">{t.year}</span><p>{t.label}</p></li>)}
      </ol>
    </div>
  </section>;
}
