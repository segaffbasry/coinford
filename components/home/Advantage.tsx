"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Arrow, Label } from "@/components/ui";
import { pages } from "@/lib/content";

const { about, hsqe, plant, leadership } = pages;
const section = (title: string) => plant.sections.find((s) => s.title === title)?.body ?? "";

/* hauze.pt's "Advantage" block: a heading on the left, an accordion of ruled rows on the right.
   Every row is Coinford's own copy from the HSQE, Plant & Machinery and Leadership pages. */
const items = [
  { title: "Over 2,000,000 working hours without a RIDDOR reportable incident", body: hsqe.safety[0], href: "/hsqe", cta: "Health, safety, quality & environment" },
  { title: "Continuous investment in our own plant", body: section("Continuous Investment in Plant"), href: "/plant-machinery", cta: "Plant & machinery" },
  { title: "In-house training facilities", body: section("In-House Training Facilities"), href: "/plant-machinery", cta: "Plant & machinery" },
  { title: "Every project supervised by a Company Director", body: leadership.structure[0].split(". ").slice(2, 4).join(". "), href: "/team", cta: "Leadership team" },
  { title: "Certified to ISO 9001", body: hsqe.pillars.find((p) => p.title === "Focused on Quality")?.body ?? "", href: "/hsqe", cta: "Our quality commitment" },
];

export default function Advantage() {
  const [open, setOpen] = useState(0);
  const id = useId();
  return <section className="section band advantage" aria-labelledby="advantage-title" data-late>
    <div className="wrap split-1-2">
      <div className="section-head advantage-head">
        <Label>Why Coinford</Label>
        <h2 className="h2" id="advantage-title" data-reveal="heading">Delivering Quality, As promised, On time.</h2>
        <p className="body" data-reveal="text">{about.mission[0].replace(/, delivering Quality, As promised, On time\.$/, ".")}</p>
      </div>
      <div className="accordion">
        {items.map((item, i) => {
          const expanded = open === i;
          return <div className={`accordion-item${expanded ? " is-open" : ""}`} key={item.title} data-reveal="card">
            <h3 className="h5">
              <button id={`${id}-b${i}`} aria-expanded={expanded} aria-controls={`${id}-p${i}`} onClick={() => setOpen(expanded ? -1 : i)}>
                <span>{item.title}</span><Arrow />
              </button>
            </h3>
            <div className="accordion-panel" id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-b${i}`} inert={!expanded}>
              <div><p className="body">{item.body}</p><Link href={item.href} className="text-link label">{item.cta}</Link></div>
            </div>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
