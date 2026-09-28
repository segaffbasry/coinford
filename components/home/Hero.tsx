"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { CropButton, reducedMotion } from "@/components/ui";
import { pages } from "@/lib/content";
import { logoParts, logoSize } from "@/lib/logo";
import { splitWords } from "@/lib/split";

const home = pages.home;
const offer = pages.about.offer;

/* hauze.pt's opening layout: small line and headline on the left, copy and button on the right, then a wide media band.
   Coinford's hero film takes the place of Hauze's image strip, and the live stats sit under it as a credibility strip. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const manual = useRef(false);

  /* Entrance: waits for the preloader's intro:done, so the loader exit and this move overlap. */
  useEffect(() => {
    const el = root.current; if (!el) return;
    const reveal = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (reducedMotion()) { reveal.forEach((r) => r.setAttribute("data-shown", "")); return; }
    const lines = el.querySelectorAll(".hero-line > span");
    const split = splitWords(el.querySelector<HTMLElement>(".hero-copy .lede")!);
    gsap.set(lines, { yPercent: 108 });
    gsap.set(split.inner, { yPercent: 105 });
    gsap.set(el.querySelectorAll(".hero [data-reveal='label']"), { opacity: 0, y: 8 });
    gsap.set(el.querySelector(".hero-film"), { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(el.querySelector(".hero-film video, .hero-film img"), { scale: 1.12 });
    gsap.set(el.querySelectorAll(".stat"), { opacity: 0, y: 12 });
    reveal.forEach((r) => r.setAttribute("data-shown", ""));

    let tl: gsap.core.Timeline | null = null;
    const play = () => {
      tl = gsap.timeline({ defaults: { ease: "coinford" } })
        .to(el.querySelectorAll(".hero [data-reveal='label']"), { opacity: 1, y: 0, duration: .5, stagger: .08 }, 0)
        .to(lines, { yPercent: 0, duration: .9, stagger: .07 }, .05)
        .to(split.inner, { yPercent: 0, duration: .7, stagger: Math.min(.01, .4 / split.inner.length) }, .3)
        .to(el.querySelector(".hero-film"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1 }, .35)
        .to(el.querySelector(".hero-film video, .hero-film img"), { scale: 1, duration: 1.5 }, .35)
        .to(el.querySelectorAll(".stat"), { opacity: 1, y: 0, duration: .6, stagger: .08, clearProps: "transform" }, .7);
    };
    if (document.documentElement.dataset.intro === "done") play();
    else document.addEventListener("intro:done", play, { once: true });
    return () => { document.removeEventListener("intro:done", play); tl?.kill(); split.revert(); };
  }, []);

  /* The film: muted, paused off-screen, and it never autoplays with reduced motion. Phones get the 960px encode. */
  useEffect(() => {
    setSrc(window.innerWidth < 800 ? "/media/film/hero-720.mp4" : "/media/film/hero.mp4");
  }, []);
  useEffect(() => {
    const v = video.current; if (!v || !src) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) v.pause();
      else if (!manual.current && !reducedMotion()) v.play().catch(() => setPlaying(false));
    }, { threshold: .15 });
    observer.observe(v);
    return () => observer.disconnect();
  }, [src]);
  const toggle = () => {
    const v = video.current; if (!v) return;
    if (v.paused) { manual.current = false; v.play().catch(() => {}); } else { manual.current = true; v.pause(); }
  };

  return <section className="hero" ref={root} data-hero aria-labelledby="hero-title">
    {/* A navy opening (client review, 28 Sep) with the shield and lion drawn large behind the headline. */}
    <div className="hero-stage" data-tone="dark">
      <svg className="hero-mark" viewBox={`0 0 ${logoSize.markWidth} ${logoSize.height}`} aria-hidden="true">
        <path d={logoParts.shield.d} fillRule="evenodd" /><path d={logoParts.lion.d} fillRule="evenodd" />
      </svg>
      <div className="wrap">
        <div className="hero-top">
          <div className="hero-heading">
            <p className="eyebrow" data-reveal="label">{home.eyebrow}</p>
            <h1 className="display hero-title" id="hero-title">
              {home.headline!.split(" • ").map((part, i, all) => <span className="hero-line" key={part}><span>{part}{i < all.length - 1 && <i aria-hidden="true"> •</i>}</span></span>)}
            </h1>
          </div>
          <div className="hero-copy">
            <p className="lede" data-reveal="text">{offer.lead} {offer.range}</p>
            <div className="hero-actions">
              <CropButton href="/services" dark>Our expertise</CropButton>
              <CropButton href="/contact" dark>Send brief</CropButton>
            </div>
          </div>
        </div>
        <figure className="photo hero-film" data-reveal="image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/film/hero-poster.jpg" alt="" className="hero-poster" />
          {src && <video ref={video} src={src} muted playsInline loop preload="metadata" poster="/media/film/hero-poster.jpg"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Coinford site film: drone footage of earthworks and groundworks" />}
          <button className="film-toggle label" onClick={toggle} aria-pressed={!playing}>
            <span className="film-icon" aria-hidden="true">{playing ? <><i /><i /></> : <b />}</span>{playing ? "Pause film" : "Play film"}
          </button>
        </figure>
      </div>
    </div>
    <div className="wrap">
    <dl className="stats">
      {home.stats.map((stat) => <div className="stat" key={stat.label} data-reveal="card">
        <dt className="label">{stat.label.replace(/^£\s*/, "").replace(/^\w/, (c) => c.toUpperCase())}</dt>
        <dd className="display num">{stat.label.startsWith("£") ? "£" : ""}{stat.value.toLocaleString("en-GB")}{stat.suffix}</dd>
      </div>)}
    </dl>
    </div>
  </section>;
}
