import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page";
import { Arrow, Label, Photo } from "@/components/ui";
import { pages, serviceSummary, services } from "@/lib/content";

export const metadata: Metadata = { title: "Our Expertise" };
const offer = pages.about.offer;

export default function ServicesPage() {
  return <>
    <PageHead label="What we do" title="Our Expertise" lede={`${offer.lead} ${offer.range}`} />
    <section className="section" aria-label="Services">
      <ul className="wrap service-cards">
        {services.map((s, i) => <li key={s.slug} data-reveal="card">
          <Link href={`/services/${s.slug}`} className="card">
            <Photo media={s.cover} sizes="(max-width: 900px) 100vw, 33vw" reveal={false} />
            <p className="label num card-index">0{i + 1}</p>
            <p className="card-title h3"><span>{s.title}</span><Arrow /></p>
            <p className="card-meta">{serviceSummary(s)}</p>
          </Link>
        </li>)}
      </ul>
    </section>
    <section className="section band" aria-labelledby="excel-title" data-late>
      <div className="wrap split">
        <div className="section-head"><Label>{offer.eyebrow}</Label><h2 className="h2" id="excel-title" data-reveal="heading">{offer.title} {offer.rotating.join(", ").replace(/, ([^,]*)$/, " and $1")}</h2></div>
        <div><ul className="bullets">{offer.items.map((item) => <li key={item} data-reveal="card">{item}</li>)}</ul><p className="body excel-range" data-reveal="text">{offer.range}</p></div>
      </div>
    </section>
  </>;
}
