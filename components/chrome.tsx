"use client";

import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Arrow, CropButton, Logo, SocialIcon, isExternal, reducedMotion } from "@/components/ui";
import { pages, services } from "@/lib/content";
import { contact, footerLinks, menu, policies, socials, type Link as SiteLink } from "@/lib/site";

function SmartLink({ link, className, onClick, children }: { link: SiteLink; className?: string; onClick?: () => void; children?: ReactNode }) {
  const body = children ?? link.label;
  if (link.external || isExternal(link.href)) return <a href={link.href} className={className} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" onClick={onClick}>{body}</a>;
  return <Link href={link.href} className={className} onClick={onClick}>{body}</Link>;
}

/* Full-screen menu. In: a navy curtain drops from the top edge, then the group index and links rise into place.
   Out: the same timeline reversed, a little faster. Focus is trapped while open and returned to the trigger. */
function Menu({ open, tab, setTab, close, trigger }: { open: boolean; tab: number; setTab: (tab: number) => void; close: () => void; trigger: HTMLElement | null }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const group = menu[tab];

  useEffect(() => {
    const el = root.current; if (!el) return;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "coinford" }, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .7, ease: "power3.inOut" }, 0)
      .fromTo(el.querySelectorAll("[data-menu-in]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .5, stagger: .05 }, .38);
    timeline.current = tl;
    return () => { tl.kill(); timeline.current = null; };
  }, []);

  useEffect(() => {
    const el = root.current, tl = timeline.current; if (!el || !tl) return;
    if (open) {
      el.style.visibility = "visible";
      tl.timeScale(reducedMotion() ? 50 : 1).play();
      return focusOverlay(el, close, trigger);
    }
    if (tl.progress() > 0) tl.timeScale(reducedMotion() ? 50 : 1.4).reverse();
  }, [open, close, trigger]);

  /* Switching group only re-plays the right-hand links. */
  useEffect(() => {
    const el = root.current; if (!el || !open || reducedMotion()) return;
    gsap.fromTo(el.querySelectorAll("[data-menu-link]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, stagger: .035, ease: "coinford", overwrite: true });
  }, [tab, open]);

  return <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open} data-lenis-prevent data-tone="dark">
    <div className="menu-top wrap">
      <Link href="/" className="brand" onClick={close} aria-label="Coinford home"><Logo className="logo-on-dark" title="Coinford" /></Link>
      <button className="menu-close label" onClick={close}>Close <span aria-hidden="true">×</span></button>
    </div>
    <div className="menu-body wrap">
      <nav className="menu-index" aria-label="Menu sections">
        {menu.map((item, index) => <button key={item.id} className="menu-tab" data-menu-in aria-current={index === tab ? "true" : undefined} onClick={() => setTab(index)} onMouseEnter={() => setTab(index)} onFocus={() => setTab(index)}>
          <span className="label num">0{index + 1}</span><span className="menu-tab-name">{item.label}</span>
        </button>)}
        <Link href="/contact" className="menu-tab" data-menu-in onClick={close}><span className="label num">0{menu.length + 1}</span><span className="menu-tab-name">Contact</span></Link>
      </nav>
      <div className="menu-panel" key={group.id}>
        <p className="lede" data-menu-link>{group.intro}</p>
        <ul className="menu-links">{group.links.map((link) => <li key={link.href} data-menu-link><SmartLink link={link} onClick={link.external ? undefined : close}><span>{link.label}</span><Arrow /></SmartLink></li>)}</ul>
        <div data-menu-link><CropButton href={group.href} dark onClick={close} reveal={false}>{`View all ${group.label.toLowerCase()}`}</CropButton></div>
      </div>
    </div>
    <div className="menu-foot wrap" data-menu-in>
      <a href={contact.tel}>{contact.phone}</a><a href={contact.mailto}>{contact.email}</a>
      <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} target="_blank" rel="noreferrer" aria-label={`Coinford on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
    </div>
  </div>;
}

/* Frameless header: no bar or box. Its colour follows the section underneath (motion.tsx sets html[data-header]),
   it slides away on the way down and comes back on the way up. Nav items open the menu at their group. */
function Header() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const bar = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, delta = y - last;
      el.classList.toggle("is-scrolled", y > 20);
      if (y < 120) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      el.classList.toggle("is-hidden", delta > 0 && !document.documentElement.classList.contains("overlay-open"));
      last = y;
    };
    const reveal = () => el.classList.remove("is-hidden");
    el.addEventListener("focusin", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener("focusin", reveal); window.removeEventListener("scroll", onScroll); };
  }, []);

  const show = (index: number, target: HTMLElement) => { setTab(index); setTrigger(target); setOpen(true); };
  return <>
    <header className="site-header" ref={bar}>
      <div className="wrap site-header-inner">
        <Link href="/" className="brand" aria-label="Coinford home"><Logo title="Coinford" /></Link>
        <nav className="header-nav" aria-label="Main navigation">
          {menu.map((item, index) => <button key={item.id} className="label nav-item" aria-haspopup="dialog" aria-expanded={open && tab === index} aria-controls="site-menu" onClick={(e) => show(index, e.currentTarget)}>
            <span className="roll" data-text={item.label}><span>{item.label}</span></span>
          </button>)}
          <Link href="/contact" className="label nav-item" aria-current={pathname === "/contact" ? "page" : undefined}><span className="roll" data-text="Contact"><span>Contact</span></span></Link>
        </nav>
        <div className="header-actions">
          <CropButton href={contact.tel} className="header-call" reveal={false}>Call us</CropButton>
          <button className="menu-toggle label" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={(e) => show(tab, e.currentTarget)}>
            <span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span><span>Menu</span>
          </button>
        </div>
      </div>
    </header>
    <Menu open={open} tab={tab} setTab={setTab} close={close} trigger={trigger} />
  </>;
}

/* hauze.pt closes every page with a grey CTA band and a big-wordmark footer; the copy here is Coinford's own. */
function Footer() {
  const offices = pages.contact.offices;
  return <>
    <section className="cta-band band" aria-labelledby="cta-title" data-late>
      <div className="wrap cta-band-inner">
        <div>
          <h2 className="h2" id="cta-title" data-reveal="heading">Have questions? Get in touch!</h2>
          <p className="body" data-reveal="text">{pages.contact.intro}</p>
        </div>
        <div className="cta-band-side">
          <CropButton href="/contact">Send brief</CropButton>
          <a className="cta-phone h5" href={contact.tel} data-reveal="label">{contact.phone}</a>
        </div>
      </div>
    </section>
    <footer className="site-footer" data-late>
      <div className="wrap">
        <Link href="/" className="footer-mark" aria-label="Coinford home" data-reveal="image"><Logo className="logo-print" title="Coinford" /></Link>
        <div className="footer-cols">
          <div data-reveal="card"><h3 className="h5">Quick links</h3><ul>{footerLinks.map((l) => <li key={l.href}><SmartLink link={l} /></li>)}</ul></div>
          <div data-reveal="card"><h3 className="h5">Expertise</h3><ul>{services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.title}</Link></li>)}</ul></div>
          <div data-reveal="card"><h3 className="h5">Reach us</h3>
            {offices.map((o) => <address key={o.name}><strong>{o.name}</strong>{o.lines.map((line) => <span key={line}>{line}</span>)}</address>)}
            <p><a href={contact.mailto}>{contact.email}</a><br /><a href={contact.tel}>{contact.phone}</a></p>
          </div>
          <div data-reveal="card"><h3 className="h5">Policies</h3><ul>{policies.map((l) => <li key={l.href}><SmartLink link={l} /></li>)}</ul>
            <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} target="_blank" rel="noreferrer" aria-label={`Coinford on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
          </div>
        </div>
      </div>
      <div className="footer-bar" data-tone="dark">
        <div className="wrap footer-bar-inner"><p>© {new Date().getFullYear()} Coinford Ltd</p><p>Groundwork &amp; concrete frame specialists, London &amp; the South East</p></div>
      </div>
    </footer>
  </>;
}

/* Everything shared by every page: header and menu, footer, smooth scroll and reveals. */
export function Shell({ children }: { children: ReactNode }) {
  usePageMotion();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" />
    <Header />
    <main id="main" tabIndex={-1}>{children}</main>
    <Footer />
  </>;
}
