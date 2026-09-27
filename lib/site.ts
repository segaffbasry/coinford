import type { BrandIcon } from "@/lib/brand-icons";
import { projects, services } from "@/lib/content";

/* Every destination in the header, menu and footer. Sections rebuilt in this demo link inside the site;
   everything else goes to the live URL, checked against coinford.co.uk's sitemaps (see README). */
export const live = "https://www.coinford.co.uk";

export const contact = {
  phone: "+44 (0)1342 840800",
  tel: "tel:+441342840800",
  email: "info@coinford.co.uk",
  mailto: "mailto:info@coinford.co.uk",
};

export type Link = { label: string; href: string; external?: boolean };

export type MenuGroup = { id: string; label: string; intro: string; href: string; links: Link[] };

export const menu: MenuGroup[] = [
  {
    id: "expertise", label: "Expertise", href: "/services",
    intro: "Infrastructure, earthworks, groundworks and RC frames, from early cost advice to handover.",
    links: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
  },
  {
    id: "company", label: "Company", href: "/about",
    intro: "A family business established in 1990, working across London and the South East.",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Leadership Team", href: "/team" },
      { label: "Plant & Machinery", href: "/plant-machinery" },
      { label: "HSQE", href: "/hsqe" },
      { label: "Social Media", href: `${live}/social-media/`, external: true },
    ],
  },
  {
    id: "projects", label: "Projects", href: "/projects",
    intro: "Groundworks, infrastructure and RC frame packages from £2.1 million to £20 million.",
    links: projects.slice(0, 6).map((p) => ({ label: p.title, href: `/projects/${p.slug}` })),
  },
  {
    id: "careers", label: "Careers", href: "/careers",
    intro: "Apprentices to directors: read how our people have grown with the business.",
    links: [
      { label: "Careers at Coinford", href: "/careers" },
      { label: "Current Vacancies", href: "/careers#vacancies" },
      { label: "Job board", href: "https://jobboards.adlogic.com.au/coinford/", external: true },
    ],
  },
];

export const socials: { name: string; icon: BrandIcon; href: string }[] = [
  { name: "Facebook", icon: "facebook", href: "https://www.facebook.com/CoinfordLtd/?locale=en_GB" },
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/coinfordltd/" },
  { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/channel/UCz669RctT14pYdF9TnsfSBg" },
  { name: "X", icon: "x", href: "https://x.com/CoinfordUK" },
  { name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/coinford-ltd/" },
];

export const policies: Link[] = [
  { label: "Quality Policy", href: `${live}/wp-content/uploads/2025/09/Quality-Policy-Statement.pdf`, external: true },
  { label: "Environmental Policy", href: `${live}/wp-content/uploads/2025/09/Environmental-Policy-Statement.pdf`, external: true },
  { label: "Economic Crime Policy", href: `${live}/wp-content/uploads/2025/08/Economic-Crime-Policy-.pdf`, external: true },
  { label: "General Statement of Intent", href: `${live}/wp-content/uploads/2025/08/P01-General-policy-2025.pdf`, external: true },
  { label: "Modern Slavery Statement", href: `${live}/wp-content/uploads/2025/08/Modern-Slavery-Statement.pdf`, external: true },
];

export const footerLinks: Link[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Leadership Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: `${live}/privacy/`, external: true },
];
