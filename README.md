# Coinford

A private prospect demo: coinford.co.uk rebuilt as a Next.js site. It uses Coinford's own logo, fonts, copy, photography and films with a new skin. The layout and palette logic follow hauze.pt. The scroll feel and reveal timing follow harrowservice.com.

_Recon note (phase 1). The build sections are added below as each phase lands._

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
| Stone | `#EEF0F3` | Hauze's light band, re-tinted cool so it sits beside navy |

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
