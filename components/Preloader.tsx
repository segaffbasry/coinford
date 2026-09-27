"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo, reducedMotion } from "@/components/ui";

/* The company signing its name, built from the logo's own vector shapes (lib/logo.ts).
   Build (0.1–0.9s): the navy mark tile lands, the shield ring and lion rise into it one after another, then the
   wordmark tile wipes open left to right while the letters C·o·i·n·f·o·r·d rise inside it.
   Hold (to 1.15s). Exit (1.15–1.7s): the whole lock-up travels and shrinks into the header logo while the white
   ground fades onto the white hero, so there is no colour change at handover. One GSAP timeline, 1.7s in all. */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    let handed = false;
    const handover = () => {
      if (handed) return; handed = true;
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    // The header logo stays hidden (is-landing) until the travelling logo arrives, then the two swap in one frame.
    const finish = () => { handover(); root.classList.remove("is-landing"); el.style.display = "none"; };
    delete root.dataset.intro;
    if (reducedMotion()) { finish(); return; }
    root.classList.add("is-loading", "is-landing");

    const q = (part: string) => el.querySelectorAll(`[data-part="${part}"]`);
    const logo = el.querySelector<SVGSVGElement>(".logo")!;
    const target = document.querySelector<HTMLElement>(".site-header .brand .logo");
    const tl = gsap.timeline({ defaults: { ease: "coinford" }, onComplete: finish });

    tl.set(el.querySelector(".preloader-sign"), { autoAlpha: 1 })
      .fromTo(q("markTile"), { scale: .6, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: .32 }, .1)
      .fromTo(q("shield"), { scale: .82, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: .3 }, .24)
      .fromTo([...q("lion"), ...q("eye")], { y: 3, opacity: 0 }, { y: 0, opacity: 1, duration: .3 }, .36)
      .fromTo(q("word"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .42, ease: "power2.inOut" }, .46)
      .fromTo(q("letter"), { y: 4, opacity: 0 }, { y: 0, opacity: 1, duration: .28, stagger: .03 }, .54)
      .addLabel("exit", 1.15)
      .add(() => {
        // Measured at exit time so a late web-font or resize cannot misplace the landing.
        if (!target) return;
        const from = logo.getBoundingClientRect(), to = target.getBoundingClientRect();
        gsap.to(logo, { x: to.left - from.left + (to.width - from.width) / 2, y: to.top - from.top + (to.height - from.height) / 2, scale: to.width / from.width, duration: .55, ease: "coinford" });
      }, "exit")
      .to(el, { backgroundColor: "rgba(255,255,255,0)", duration: .45, ease: "coinford" }, "exit+=.1")
      // The hero starts its entrance as the logo lands, so the two moves overlap into one.
      .add(handover, "exit+=.2")
      .set({}, {}, "exit+=.55");

    // Never hold the page beyond ~2s, even if a frame stalls.
    const failsafe = window.setTimeout(finish, 2400);
    return () => { window.clearTimeout(failsafe); tl.kill(); gsap.killTweensOf(logo); root.classList.remove("is-loading", "is-landing"); };
  }, []);

  return <div className="preloader" ref={ref} aria-hidden="true">
    {/* Set before first paint so the header logo and hero are held back while the sign is on screen. */}
    <script dangerouslySetInnerHTML={{ __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('is-loading','is-landing')" }} />
    <div className="preloader-sign"><Logo parts title="" /></div>
  </div>;
}
