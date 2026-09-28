import Link from "next/link";
import { Arrow, CropButton, Label } from "@/components/ui";
import { stories } from "@/lib/content";

/* coinford.co.uk publishes no client testimonials: its testimonial post type holds the staff career stories.
   Three lines quoted verbatim from those stories, with the role each person gives in their own words. */
const picks = [
  { slug: "ben-reynolds", role: "Senior Engineer", find: "It has been a privilege working at Coinford" },
  { slug: "guy-conyers", role: "Project Manager", find: "The company invests heavily in plant" },
  { slug: "james-robinson", role: "Site Manager", find: "Coinford has always been a great company to work for" },
];

const quote = (text: string, start: string) => {
  const from = text.indexOf(start);
  const end = text.indexOf(".", from);
  return text.slice(from, end + 1);
};

export default function Testimonials() {
  const items = picks.map((p) => {
    const story = stories.find((s) => s.slug === p.slug)!;
    return { ...p, name: story.name, text: quote(story.story.join(" "), p.find) };
  });
  return <section className="section testimonials" aria-labelledby="testimonials-title">
    <div className="wrap">
      <div className="head-row">
        <div className="section-head"><Label>Testimonials</Label><h2 className="h2" id="testimonials-title" data-reveal="heading">In our people’s words</h2></div>
        <div className="head-row-side end"><CropButton href="/careers">Read their stories</CropButton></div>
      </div>
      <ul className="quotes">
        {items.map((q) => <li key={q.slug} data-reveal="card">
          <Link href={`/careers/${q.slug}`} className="quote">
            <span className="quote-mark display" aria-hidden="true">“</span>
            <blockquote className="h5">{q.text}</blockquote>
            <span className="quote-by"><span><strong>{q.name}</strong>{q.role}</span><Arrow /></span>
          </Link>
        </li>)}
      </ul>
    </div>
  </section>;
}
