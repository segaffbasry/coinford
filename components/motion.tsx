"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { reducedMotion } from "@/components/ui";
import { EASE, timing } from "@/lib/ease";
import { getLenis, setLenis } from "@/lib/scroll";
import { splitWords } from "@/lib/split";

/* One small, fixed set of reveal moves, applied the same way on every page (table in README):
   label   – labels and buttons: 8px rise and fade (harrowservice.com's appear, 0.4s)
   heading – the whole phrase fades and rises 16px
   text    – paragraphs: each word slides up out of its own mask
   card    – cards, rows and logos: batched 12px rise and fade with a short stagger
   image   – photography clips open from the bottom edge; [data-parallax] adds ~10% scroll drift
   All play once, all use the Harrow curve, and inside [data-late] sections they run at 72% of the duration. */
export function usePageMotion() {
  const pathname = usePathname();

  /* Lenis lives for the whole visit. It is driven by the GSAP ticker so ScrollTrigger reads the same frame. */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create("coinford", EASE);
    if (reducedMotion()) return;
    // No reference value to copy (harrowservice.com uses native scroll); a firm lerp keeps the native feel with a light glide.
    const lenis = new Lenis({ lerp: .11, wheelMultiplier: 1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();
    const start = () => lenis.start();
    document.addEventListener("intro:done", start);

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href*='#']");
      if (!link || event.defaultPrevented) return;
      const url = new URL(link.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = url.hash === "#top" ? null : document.querySelector<HTMLElement>(url.hash);
      if (url.hash !== "#top" && !target) return;
      event.preventDefault();
      lenis.start();
      lenis.scrollTo(target ?? 0, { offset: target ? -24 : 0, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
      history.replaceState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("intro:done", start);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy(); setLenis(null);
    };
  }, []);

  /* Reveals are rebuilt for each route. */
  useEffect(() => {
    const reduced = reducedMotion();
    getLenis()?.scrollTo(location.hash ? document.querySelector<HTMLElement>(location.hash) ?? 0 : 0, { immediate: true, force: true });
    const splits: { revert: () => void }[] = [];
    const scale = (el: Element) => (el.closest("[data-late]") ? timing.late : 1);
    const ctx = gsap.context(() => {
      const all = (kind: string) => gsap.utils.toArray<HTMLElement>(`[data-reveal="${kind}"]:not([data-hero] [data-reveal])`);
      if (reduced) { document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-shown", "")); return; }

      all("label").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 8 });
        ScrollTrigger.create({ trigger: el, start: "top 94%", once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: timing.label * scale(el) * 1.25, ease: "coinford", delay: el.classList.contains("crop") ? .12 : 0, clearProps: "transform" }) });
      });

      all("heading").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 16 });
        ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: timing.heading * scale(el), ease: "coinford", clearProps: "transform" }) });
      });

      all("text").forEach((el) => {
        const split = splitWords(el);
        splits.push(split);
        gsap.set(split.inner, { yPercent: 105 });
        ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => gsap.to(split.inner, { yPercent: 0, duration: timing.text * scale(el), ease: "coinford", delay: .06, stagger: Math.min(.012, .45 / split.inner.length) }) });
      });

      const cards = all("card");
      gsap.set(cards, { opacity: 0, y: 12 });
      ScrollTrigger.batch(cards, { start: "top 94%", once: true, onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: timing.card * scale(batch[0]), ease: "coinford", stagger: .08, clearProps: "transform" }) });

      all("image").forEach((el) => {
        gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: timing.image * scale(el), ease: "coinford", clearProps: "clipPath" }) });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const media = el.querySelector("img, video"); if (!media) return;
        gsap.fromTo(media, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: el, scrub: true, start: "top bottom", end: "bottom top" } });
      });
      document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-shown", ""));
    });

    /* The header takes its colour from whichever section sits under it: [data-tone="dark"] sections flip it to white. */
    const root = document.documentElement;
    const darkSections = () => Array.from(document.querySelectorAll<HTMLElement>("main [data-tone='dark'], footer [data-tone='dark']"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = 40;
      const dark = darkSections().some((el) => { const r = el.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
      root.dataset.header = dark ? "dark" : "light";
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const fonts = document.fonts?.ready.then(refresh);
    void fonts;

    return () => {
      window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); window.removeEventListener("load", refresh);
      cancelAnimationFrame(frame);
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, [pathname]);
}

/* Traps focus inside an overlay, closes on Escape, pauses the page scroll and returns focus to the trigger. */
export function focusOverlay(container: HTMLElement, close: () => void, trigger?: HTMLElement | null) {
  const previous = trigger ?? (document.activeElement as HTMLElement);
  getLenis()?.stop();
  document.documentElement.classList.add("overlay-open");
  const focusable = () => Array.from(container.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex='0']")).filter((el) => el.offsetParent !== null);
  focusable()[0]?.focus({ preventScroll: true });
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key === "Tab") {
      const items = focusable(); const first = items[0]; const last = items[items.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener("keydown", handleKey);
  return () => {
    document.removeEventListener("keydown", handleKey);
    document.documentElement.classList.remove("overlay-open");
    getLenis()?.start();
    previous?.focus({ preventScroll: true });
  };
}
