import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow, CropButton, Label, Photo } from "@/components/ui";
import type { Media } from "@/lib/content";

/* Inner-page opening in hauze.pt's hero arrangement: small line and title left, lede right, optional media band. */
export function PageHead({ label, title, lede, media, children, crumbs }: {
  label: string; title: string; lede?: ReactNode; media?: Media | null; children?: ReactNode; crumbs?: { label: string; href: string }[];
}) {
  return <section className="page-head wrap" aria-labelledby="page-title">
    {crumbs && <nav className="crumbs label" aria-label="Breadcrumb" data-reveal="label"><ol>{crumbs.map((c) => <li key={c.href}><Link href={c.href}>{c.label}</Link></li>)}</ol></nav>}
    <div className="page-head-top">
      <div><Label>{label}</Label><h1 className="h1" id="page-title" data-reveal="heading">{title}</h1></div>
      {(lede || children) && <div className="page-head-side">{lede && <p className="lede" data-reveal="text">{lede}</p>}{children}</div>}
    </div>
    {media && <Photo media={media} priority parallax sizes="100vw" className="page-head-media" />}
  </section>;
}

export function Gallery({ images, title = "Gallery" }: { images: Media[]; title?: string }) {
  if (!images.length) return null;
  return <section className="section gallery wrap" aria-label={title} data-late>
    <ul className={`gallery-grid count-${Math.min(images.length, 4)}`}>
      {images.map((img, i) => <li key={img.src} className={i === 0 && images.length % 2 === 1 ? "wide" : ""}><Photo media={img} sizes="(max-width: 900px) 100vw, 50vw" /></li>)}
    </ul>
  </section>;
}

/* Related items at the foot of every detail page. */
export function Related({ title, href, cta, children }: { title: string; href: string; cta: string; children: ReactNode }) {
  return <section className="section related" aria-labelledby="related-title" data-late>
    <div className="wrap">
      <div className="head-row">
        <div className="section-head"><h2 className="h2" id="related-title" data-reveal="heading">{title}</h2></div>
        <div className="head-row-side end"><CropButton href={href}>{cta}</CropButton></div>
      </div>
      {children}
    </div>
  </section>;
}

export function RowLink({ href, index, title, meta }: { href: string; index: string; title: string; meta?: string }) {
  return <Link href={href} className="row-link" data-reveal="card"><span className="label num">{index}</span><span className="h4">{title}</span>{meta && <span className="row-meta">{meta}</span>}<Arrow /></Link>;
}
