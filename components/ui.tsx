"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { brandIcons, type BrandIcon } from "@/lib/brand-icons";
import type { Media } from "@/lib/content";
import { letterOrder, logoParts, logoSize } from "@/lib/logo";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/* The copied interaction: hauze.pt's Button/Secondary. Four crop-mark corners frame a hairline box; on hover a
   two-panel column (outline over solid) travels up by one panel plus its 10px gap on Hauze's spring (see --spring). */
export function CropButton({ href, children, dark, onClick, className = "", reveal = true, download }: {
  href: string; children: string; dark?: boolean; onClick?: () => void; className?: string; reveal?: boolean; download?: boolean;
}) {
  const inner = <>
    <i className="crop-c tl" /><i className="crop-c tr" /><i className="crop-c bl" /><i className="crop-c br" />
    <span className="crop-box">
      <span className="crop-size">{children}</span>
      <span className="crop-flip" aria-hidden="true"><span className="crop-one">{children}</span><span className="crop-two">{children}</span></span>
    </span>
  </>;
  const props = { className: `crop${dark ? " crop-dark" : ""} ${className}`.trim(), onClick, "data-reveal": reveal ? "label" : undefined };
  if (isExternal(href)) return <a href={href} {...props} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})} {...(download ? { download: "" } : {})}>{inner}</a>;
  return <Link href={href} {...props}>{inner}</Link>;
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`} data-reveal="label">{children}</p>;
}

/* Hauze's accordion and list arrow: a thin north-east arrow. */
export function Arrow({ className = "" }: { className?: string }) {
  return <svg className={`arrow ${className}`} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

export function Chevron({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

export function SocialIcon({ icon }: { icon: BrandIcon }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={brandIcons[icon]} /></svg>;
}

/* The logo drawn from its own vector parts (lib/logo.ts). Fills are CSS variables so the header can switch
   between the printed tile version (light backgrounds) and white line-art (dark backgrounds) without swapping files. */
export function Logo({ className = "", title = "Coinford", parts = false }: { className?: string; title?: string; parts?: boolean }) {
  const p = (name: keyof typeof logoParts, cls: string) => <path d={logoParts[name].d} className={cls} fillRule={logoParts[name].evenodd ? "evenodd" : undefined} data-part={parts ? name : undefined} />;
  return <svg className={`logo ${className}`} viewBox={`0 0 ${logoSize.width} ${logoSize.height}`} role="img" aria-label={title}>
    {p("markTile", "logo-tile")}
    <g className="logo-word" data-part={parts ? "word" : undefined}>{p("wordTile", "logo-tile")}{letterOrder.map((letter) => <path key={letter} d={logoParts[letter].d} className="logo-shape" data-part={parts ? "letter" : undefined} />)}</g>
    {p("shield", "logo-shape")}{p("lion", "logo-shape")}{p("eye", "logo-eye")}
  </svg>;
}

/* Photography stays inside the palette: every photo carries a navy layer in 'color' blend mode (hue and saturation
   from the navy, light from the photo), so drone greens and machine yellows read as navy-blue monochrome. */
export function Photo({ media, alt = "", sizes = "100vw", priority, parallax, reveal = true, className = "", style }: {
  media: Media | null; alt?: string; sizes?: string; priority?: boolean; parallax?: boolean; reveal?: boolean; className?: string; style?: CSSProperties;
}) {
  if (!media) return null;
  return <figure className={`photo ${className}`} style={style} data-reveal={reveal ? "image" : undefined} data-parallax={parallax ? "" : undefined}>
    <Image src={media.src} alt={alt} fill sizes={sizes} priority={priority} />
  </figure>;
}

/* harrowservice.com's ticker strips: the row repeats and drifts; it pauses off-screen, on hover and with reduced motion. */
export function Ticker({ children, className = "", seconds = 40, label }: { children: ReactNode; className?: string; seconds?: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => el.classList.toggle("is-running", entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div className={`ticker ${className}`} ref={ref} style={{ "--ticker": `${seconds}s` } as CSSProperties} role="region" aria-label={label}>
    <div className="ticker-track"><div className="ticker-row">{children}</div><div className="ticker-row" aria-hidden="true">{children}</div></div>
  </div>;
}

export function SectionHead({ label, title, children, className = "" }: { label: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return <div className={`section-head ${className}`}>
    <Label>{label}</Label>
    <h2 className="h2" data-reveal="heading">{title}</h2>
    {children}
  </div>;
}
