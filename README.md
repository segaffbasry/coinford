# Coinford

A private prospect demo: coinford.co.uk rebuilt as a Next.js site. It uses Coinford's own logo, fonts, copy, photography and films with a new skin. The layout and palette logic follow hauze.pt. The scroll feel and reveal timing follow harrowservice.com.

## Recon

### Sitemaps (Yoast, `/sitemap_index.xml`)

| Sitemap | URLs | What they are | Decision |
| --- | --- | --- | --- |
| `page` | 12 | Home, About, Services (theme demo), Plant & Machinery, HSQE, Leadership Team, Projects, Careers, Current Vacancies, Social Media, Contact, Privacy | Real pages are rebuilt here. Privacy and Social Media link out. `/our-services/` is untouched Edifice demo copy ("Welcome to Edifice!") and is not linked from the live menu, so it is skipped. |
| `cpt_services` | 5 (+ archive) | Infrastructure, Earthworks, Groundworks, RC Frames, Preconstruction | All scraped |
| `cpt_portfolio` | 9 (+ archive) | The real projects. The WordPress slugs are left over from the theme (`bridge-construction` is Blackwall Reach) | All scraped. Clean slugs are generated from the titles |
| `cpt_team` | 10 (+ archive) | Leadership team | All scraped |
| `post` | 42 | Edifice theme demo articles (lorem ipsum, author "admin", March 2023). None are linked from the menu | **Not scraped.** They are not Coinford content |
| `cpt_layouts`, `category`, `post_tag`, `*_group`, `author` | 43 | Theme layout parts and taxonomies | Not content |

The Careers page adds 11 staff stories, which are an Elementor loop, not a sitemap type. Current Vacancies lists 6 roles in two groups. Both are scraped.

### Brand

- **Logo.** The site only serves a white 376×82 PNG. The Blackwall Reach case study PDF, however, contains the logo as real vector artwork. `scripts/logo.py` pulls those shapes out: the navy mark tile, the navy wordmark tile, the shield ring, the lion (with its eye) and the eight letters C·o·i·n·f·o·r·d. It writes `public/brand/logo-tile.svg` (as printed), `logo-white.svg` and `logo-navy.svg` (transparent), `mark.svg` / `app/icon.svg`, and `lib/logo.ts`, which holds each shape separately for the preloader.
- **Favicon.** `cropped-coinford-192x192.jpg` is a navy square with the white shield and lion. Its navy (#1E2C51) is the digital brand navy.
- **Fonts** (from the live Google Fonts request): Bebas Neue and Roboto. Both are open source and self-hosted in `public/fonts`.
- **Brand films.** The homepage hero is a 4K, 42.6s drone film (134 MB). There is also a 61s portrait HSQE training film. `scripts/films.sh` transcodes both for the web.

### Palette (proposed and applied)

| Token | Hex | Source |
| --- | --- | --- |
| Navy | `#1E2C51` | Favicon ground; the logo tile (CMYK 100/72/0/49 in the PDF) |
| Blue | `#0987C7` | The live "Call us" button, rgb(9,135,199); the digital match for the print blue (CMYK 100/20/0/0) |
| White | `#FFFFFF` | Page ground |
| Stone | `#E8EAEF` | Hauze's CTA band rgb(230,230,232), re-tinted towards navy |

The live theme also uses orange `#EC3D08` and a stock Elementor light blue `#6EC1E4`. They come from theme defaults, not the brand, so they are left out.

### Structure

- **Main menu:** Expertise (Infrastructure, Earthworks, Groundworks, RC Frames, Preconstruction), About Us, Plant & Machinery, HSQE, Leadership Team, Projects, Careers, Social Media, Contact. There is also a "Call us" button (+44 (0)1342 840800).
- **Footer:** contact (phone, email), quick links (Home, About Us, Contact, Privacy Policy), socials (Facebook, Instagram, YouTube, X, LinkedIn) and policies (Quality, Environmental, Economic Crime, General Statement of Intent, Modern Slavery; all PDFs).
- **Socials:** facebook.com/CoinfordLtd, instagram.com/coinfordltd, x.com/CoinfordUK, the YouTube channel UCz669RctT14pYdF9TnsfSBg, linkedin.com/company/coinford-ltd. The Social Media page also lists TikTok but gives no URL.
- **Offices:** Head Office at Redeham Hall, Burstow, Surrey RH6 9RJ, and the Luton Office at Hatton Place, LU2 0BL.

### References

- **hauze.pt (look and layout, Framer).** White ground with near-black type and one light grey band. A split hero: a large headline on the left, copy and a button on the right, then a strip of captioned images. Titillium Web 600 headings at 55/42/32/24/20 px on a 1.2 line height. Archivo 500 12px uppercase labels. Accordion lists with arrows. A grey CTA band, then a big-wordmark footer.
- **harrowservice.com (motion and scroll, Framer).** Appear animations rise 8px and fade over 0.4s on `cubic-bezier(.35,0,.25,1)`, with 0.4s steps between groups. Hovers take 0.2s. A service list with a hover background, and ticker strips. There is no smooth-scroll library and no scroll recolouring.
- **Copied interaction: Hauze's crop-mark button** (`Button/Secondary`). It is an outer link with 10px padding, four 11×11 corner squares whose inner borders form crop marks, and a 1px bordered inner box at 40% opacity. On hover, a two-panel "flip" column (transparent over solid) moves from `top:0` to `bottom:0` on a Framer spring (stiffness 500, damping 60, mass 1). That spring is recreated in CSS as `linear()`.

## Run locally

Run `npm install`, then `npm run dev` (http://127.0.0.1:3022). `npm run build` then `npm start` serves production. `npm run typecheck` checks TypeScript.

To refresh the content, run `npm run scrape`, then `python3 scripts/clients.py`. `npm run logo` and `scripts/films.sh` rebuild the logo and films. The Python scripts need `pymupdf` and Pillow; the films need `ffmpeg`.

## Routes (47 static pages)

| Route | What it is |
| --- | --- |
| `/` | Preloader, hero with brand film and stats, client ticker, Our Expertise, About, project strip, staff testimonials, Why Coinford accordion |
| `/services`, `/services/[slug]` | The 5 services: scope list, preconstruction copy, photography, other services |
| `/projects`, `/projects/[slug]` | The 9 projects. The archive has search, a Construction/Infrastructure filter and load more (6 at a time). Detail pages show location, contract value, client logo, scope, case study PDF, gallery and 3 related projects |
| `/team`, `/team/[slug]` | The 10 leaders. The archive has search, a Board/Directors filter and load more (8 at a time), plus the Team Structure copy. Detail pages show portrait, role, full bio and 3 related people |
| `/careers`, `/careers/[slug]` | The 11 staff stories. The archive has search, a department filter and load more (6 at a time). Also the 6 current vacancies (`#vacancies`) and the three live job-board links. Story pages include 3 related stories |
| `/about` | Who we are, the 13-milestone timeline, the mission statement (plus the 6 translated PDFs), what we offer, coverage map |
| `/plant-machinery` | The six plant operation sections, photography, and the 21-photo fleet gallery |
| `/hsqe` | Safety record, the training film (plays on request), training copy, environment and quality pillars, ISO 9001 mark |
| `/contact` | Phone, email, socials, and both offices with map links |

## Content

| Type | Scraped | Live | Notes |
| --- | --- | --- | --- |
| Services | 5 | 5 | REST `cpt_services`. The live service pages have no intro text; listings use the first scope lines as the summary |
| Projects | 9 | 9 | REST `cpt_portfolio`. The live Projects page shows 8; Royal Wells Park is published but only reachable through Next/Prev, so it is listed last. Kingsbrook and Eastside have no address or description on the live site, so none is shown |
| Leadership team | 10 | 10 | Names, roles and photos from the Leadership page; bios from each person's detail page (Paul Timlin, Rick Santana, Panos Panayiotou and Craig Moorcroft have more there than on the card) |
| Career stories | 11 | 11 | Elementor loop on `/careers/`. Departments for the filter were read by hand from each story (`lib/content.ts`). James Robinson's story was pasted without breaks; the scraper splits it where a full stop runs into a capital |
| Vacancies | 6 | 6 | Two groups (Head office, Site) × three roles |
| Blog posts | 0 | 42 | Edifice theme demo articles (lorem ipsum), not Coinford content |

- `content/*.json` is written by `scripts/scrape.mjs`. `lib/content.ts` types it and builds the small card shapes, so listing pages never ship full bodies.
- All images are downloaded to `public/media/…` and capped at 2000px. Thumbnails that Elementor cropped are resolved back to their originals through the media API.
- **Links.** Everything rebuilt here links inside the site. Privacy Policy, Social Media, the policy PDFs, the case study PDFs, the mission PDFs and the adlogic job boards go to their live URLs. All 29 external URLs returned 200 when checked. There are no `#` placeholders; the only hash link is "Skip to content".
- **Icons.** Social icons use Simple Icons paths (`lib/brand-icons.ts`, v16.32.0). LinkedIn uses the last published path (v10.4.0), because it was withdrawn from later versions.

## Decisions (brief brackets left open)

- **Look:** hauze.pt. **Motion:** harrowservice.com. They were listed in that order.
- **Copied interaction:** Hauze's crop-mark secondary button (see "Buttons" below).
- **Palette:** navy / blue / white / stone, as above. Blue is only used where contrast allows: large Bebas numerals, bullets, the focus ring and link underlines on hover. White on #0987C7 is 3.9:1, too low for small text.
- **Typography:** UI and body in Roboto; display in Bebas Neue (hero headline, stats, milestone years, mission numbers). Both are Coinford's own fonts.
- **Preloader frequency:** it plays on every homepage visit, the brief's default.
- **PostHog key:** the Regen EU project key, overridable with `NEXT_PUBLIC_POSTHOG_KEY`.
- **Scroll recolouring:** Harrow does not recolour on scroll, so there is no scene backdrop. Sections use flat white, stone and navy grounds (Hauze's rhythm), and the header reads the section beneath it.
- **Smooth scroll:** Harrow uses native scroll, so there is no value to copy. Lenis uses `lerp: .11`, which stays close to native.
- **The About page film and the homepage's second film** (2024/07, portrait, 42–147 MB) were not used. The hero film already covers that footage.

## How it works

### Preloader (`components/Preloader.tsx`)

It is built from the logo's own vector parts (`lib/logo.ts`). The logo is two navy tiles with white shapes knocked out, so the build follows how it is printed:

| Time | Move |
| --- | --- |
| 0.10–0.42s | Mark tile scales up from 0.6 and fades in |
| 0.24–0.54s | Shield ring scales in from 0.82 |
| 0.36–0.66s | Lion and eye rise 3px into the shield |
| 0.46–0.88s | Wordmark tile clip-wipes open left to right |
| 0.54–1.03s | Letters C·o·i·n·f·o·r·d rise inside it, 30ms apart |
| 1.03–1.15s | Hold |
| 1.15–1.70s | Exit: the whole lock-up travels and shrinks into the header logo position, measured at exit time. The white ground fades onto the white hero, so there is no colour jump |

- Everything runs on one GSAP timeline.
- At 1.35s (`exit+=.2`), the handover removes `is-loading`, sets `data-intro="done"` and dispatches `intro:done`. The hero entrance starts then, overlapping the landing.
- The header logo stays hidden (`is-landing`) until the travelling logo arrives at 1.70s; the two swap in one frame.
- Lenis is stopped until handover.
- An inline script sets the classes before first paint, so neither the page nor the hero flashes.
- A 2.4s failsafe ends the preloader even if a frame stalls.
- `<noscript>` hides it, reduced motion skips it, and it is `aria-hidden`.
- The timeline and classes are cleaned up on unmount.

### Motion system (`components/motion.tsx`, `lib/ease.ts`)

Everything uses Harrow's appear curve, `cubic-bezier(.35,0,.25,1)` (GSAP `coinford`, CSS `--ease`). Hovers use Harrow's `cubic-bezier(.44,0,.56,1)` over 0.2s (`--ease-hover`).

| Target | Attribute | Move | Duration |
| --- | --- | --- | --- |
| Labels and buttons | `data-reveal="label"` | Fade and 8px rise (Harrow's appear) | 0.5s |
| Headings | `data-reveal="heading"` | The whole phrase fades and rises 16px | 0.7s |
| Paragraphs | `data-reveal="text"` | Each word slides up out of its own mask, ≤12ms stagger | 0.6s |
| Cards, rows, logos | `data-reveal="card"` | Batched fade and 12px rise, 80ms stagger. Archive cards use the same move as a CSS animation, so load-more batches animate too | 0.6s |
| Images | `data-reveal="image"` | Clip opens from the bottom edge | 1.0s |
| Image parallax | `data-parallax` | ±5% drift (a 10% range) while in view | scrubbed |

- Every move plays once. Sections marked `data-late` run at 72% of these durations.
- The hero (`components/home/Hero.tsx`) is the only place with heavier motion: headline lines rise from masks, and the film clips open while scaling from 1.12.
- Until an element is marked, `html.js [data-reveal]` starts hidden; the `js` class is only set when motion is allowed. A CSS animation reveals everything after 3s if scripts fail.
- **Smooth scroll:** Lenis is driven by the GSAP ticker and feeds ScrollTrigger. Same-page anchor links go through Lenis. The menu and the preloader stop it.
- **Header** (`components/chrome.tsx`): no bar or box. Sections marked `data-tone="dark"` (the hero film, the mission band, the footer bar) turn it white. It hides on the way down after 120px, returns on the way up, and reappears on focus.
- **Menu:** each nav item opens the full-screen menu at its group. A navy curtain drops (0.7s), then the index and links rise. Closing reverses the same timeline at 1.4× speed. Focus is trapped, Escape closes it, and focus returns to the item that opened it.
- **Reduced motion:** no preloader, no Lenis, no reveals and no film autoplay. Tickers become static rows and transitions are clamped.

### Buttons: the copied interaction (`.crop` in `styles/ui.css`, `CropButton` in `components/ui.tsx`)

Rebuilt from Hauze's Framer component `Button/Secondary` (bundle `shared-lib.D4-WUCZ4.mjs`, class `framer-W8kCv`):

- **Structure:** the outer link has 10px padding. Four 11×11 corner squares carry 1px inner borders that form the crop marks. The inner box has 14px/27px padding and a 1px border at 40% navy. The flip column holds two panels (outline label, then a solid navy panel) with a 10px gap.
- **Hover:** Framer animates the column from `top:0` to `bottom:0` on `{ type: "spring", stiffness: 500, damping: 60, mass: 1 }`. That spring has a damping ratio of 1.34, so it never overshoots. It is solved analytically and sampled into 21 points of CSS `linear()` over its 0.49s visual settle (`--spring`, `--spring-duration`).
- **Measured side by side at 1440px:**

| | Hauze | Coinford |
| --- | --- | --- |
| Button height | 62px | 62.4px |
| Inner box height | 42px | 42.4px |
| Flip column height | 95px | 94.8px |
| Hover travel | 52.4px | 52.4px |

- `.crop-dark` inverts it for navy grounds.

### Other systems

- **Photography** (`Photo`): Coinford's photographs and films are shown in full colour, as requested in review. A stone fill shows while each image loads.
- **Client logos:** turned into navy silhouettes by `scripts/clients.py`.
- **Films:** the hero film is muted and loops. It pauses off-screen, has a Play/Pause control, never autoplays with reduced motion, and phones get the 960px encode. The local poster (`hero-poster.jpg`) shows until it plays. The training film loads nothing until someone presses play.
- **Tickers:** Harrow-style. They pause off-screen and on hover or focus.
- **Code layout:**
  - `components/chrome.tsx`: header, menu, CTA band, footer
  - `components/home/*`: one file per homepage section
  - `components/archive/*`: shared search, filter and load-more hook, plus three archives
  - `components/page.tsx`: page head, gallery, related
  - `styles/*.css`: `ui`, `chrome`, `home`, `pages`, with tokens in `app/globals.css`

## Private demo settings

- `robots: noindex, nofollow` in `app/layout.tsx` applies to every route. There is no sitemap or robots file.
- PostHog EU (`lib/posthog.ts`, injected in `<head>`):
  - `defaults: "2026-05-30"`
  - pageview, pageleave and autocapture on; session recording on; surveys disabled
  - registers `site` and any `utm_*` values
  - fires `scroll_depth` once each at 25/50/75/100%
  - key overridable with `NEXT_PUBLIC_POSTHOG_KEY`
- No visible tracking UI and no Regen branding.

## Where the images came from

All from coinford.co.uk:

- project featured images and galleries
- service page galleries
- Leadership portraits
- About drone photograph and coverage map
- Plant & Machinery photographs and fleet gallery
- HSQE photographs and ISO 9001 mark
- client logos from the Client Base carousels
- the hero film and its poster (the 2025/06 revslider film)
- the training film (2024/09)

The logo vectors come from the Blackwall Reach case study PDF.

## Verification (this build)

- `npm run typecheck` and `npm run build` pass: 47 static pages.
- **Layout at 375, 768 and 1440px:** home, one archive and one detail page for every type, plus About, Plant, HSQE and Contact. No horizontal scroll, no broken images, no console errors.
- **Archive:** load more (6 → 9), filter (Infrastructure → 4), search ("berkeley" → 2), and the empty state all work.
- **Keyboard:** Enter on "Expertise" opens the menu with focus inside. Tab and Shift+Tab wrap. Escape closes it and returns focus to "Expertise".
- **Preloader:** its stages were captured in screenshots. `intro:done` and the preloader's removal were logged at 2.08s after navigation start, about 1.7s after mount. Lenis is stopped (`lenis-stopped`) during the preloader.
- **Reduced motion** (`matchMedia` stubbed): the preloader is skipped instantly and `data-intro="done"`. 78 of 78 reveal targets are marked shown, and the film is paused.
- **The one internal route without the robots meta** is Next's built-in `_global-error` page.
- **Caveat:** the preview pane was hidden during testing, which pauses `requestAnimationFrame`. Wall-clock animation timing was therefore read from the logged events and the timeline definitions, not watched frame by frame.

## Review changes (28 Sep)

From the client feedback in ClickUp:

- **Photography in colour.** The navy colour layer was removed from every photo and from the hero film. The film's Play/Pause control now sits on a small navy chip instead of relying on a darkened image.
- **"What we do" follows the header, with the client logos between.** The homepage order is now: hero, Client Base ticker, Our Expertise, About, projects, testimonials, Why Coinford.
- **Removed from the homepage:** the leadership preview ("people") and the Our journey milestones. The milestones remain on `/about`.
- **Spacing:** the section rhythm is tightened from 72–140px to 64–112px, and the client strip is a compact band under the hero.
- **Cleaner Get in touch:** the grey band and long paragraph are replaced by a heading on the left and phone, email and a single "Send brief" button on the right.
- **Footer logo:** the banner-sized tile logo is gone. The footer opens with a header-sized line-art logo, a one-line description and the socials, followed by the link columns. The navy bottom strip is now a light rule, so the page no longer ends on a dark block.
- **Testimonials:** coinford.co.uk publishes no client testimonials. Its testimonial post type (`cpt_testimonials`, 11 posts) holds the same staff career stories. The homepage quotes three of them verbatim, each linking to the full story: Ben Reynolds, Senior Engineer; Guy Conyers, Project Manager; James Robinson, Site Manager.
