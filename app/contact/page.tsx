import type { Metadata } from "next";
import { PageHead } from "@/components/page";
import { CropButton, Label, SocialIcon } from "@/components/ui";
import { pages } from "@/lib/content";
import { contact, socials } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };
const c = pages.contact;
const maps = (lines: string[]) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lines.join(", "))}`;

export default function ContactPage() {
  return <>
    <PageHead label={c.eyebrow} title={c.title} lede={c.intro} />
    <section className="section" aria-label="Contact details">
      <div className="wrap contact-grid">
        <div className="contact-card" data-reveal="card">
          <Label>Contact Details</Label>
          <a className="h3 contact-big" href={contact.tel}>{contact.phone}</a>
          <a className="h3 contact-big" href={contact.mailto}>{contact.email}</a>
          <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} target="_blank" rel="noreferrer" aria-label={`Coinford on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
        </div>
        {c.offices.map((o) => <div className="contact-card" key={o.name} data-reveal="card">
          <Label>{o.name}</Label>
          <address className="h5">{o.lines.map((l) => <span key={l}>{l}</span>)}</address>
          <CropButton href={maps(o.lines)}>Open in maps</CropButton>
        </div>)}
      </div>
    </section>
  </>;
}
