"use client";

import Link from "next/link";
import { useState } from "react";
import { Arrow, CropButton, Label, Photo } from "@/components/ui";
import { pages, serviceSummary, services } from "@/lib/content";

/* harrowservice.com's numbered service rows (a navy fill rises behind the hovered row on its 0.2s hover curve),
   beside a photograph that follows the row in focus. */
export default function Expertise() {
  const [active, setActive] = useState(0);
  return <section className="section expertise" aria-labelledby="expertise-title">
    <div className="wrap">
      <div className="head-row">
        <div className="section-head"><Label>What we do</Label><h2 className="h2" id="expertise-title" data-reveal="heading">Our Expertise</h2></div>
        <p className="body" data-reveal="text">{pages.about.offer.lead} {pages.about.offer.range}</p>
      </div>
      <div className="expertise-grid">
        <div className="expertise-media" aria-hidden="true">
          {services.map((s, i) => <Photo key={s.slug} media={s.cover} sizes="(max-width: 900px) 100vw, 40vw" reveal={i === 0} className={i === active ? "is-active" : ""} />)}
        </div>
        <ol className="expertise-list">
          {services.map((s, i) => <li key={s.slug} data-reveal="card">
            <Link href={`/services/${s.slug}`} className="expertise-row" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <span className="label num">0{i + 1}</span>
              <span className="expertise-name h3">{s.title}</span>
              <span className="expertise-summary">{serviceSummary(s)}</span>
              <Arrow />
            </Link>
          </li>)}
        </ol>
      </div>
      <div className="expertise-foot"><CropButton href="/services">All expertise</CropButton></div>
    </div>
  </section>;
}
