import pagesData from "@/content/pages.json";
import projectsData from "@/content/projects.json";
import servicesData from "@/content/services.json";
import teamData from "@/content/team.json";

/* Typed access to the scraped content (content/*.json, written by scripts/scrape.mjs).
   Listing pages receive the small card shapes built here, never full bodies. */

export type Media = { src: string; width: number; height: number; source?: string };

export type Service = {
  slug: string; title: string; liveUrl: string; lede: string | null;
  paragraphs: string[]; list: string[]; cover: Media | null; images: Media[];
};

export type Project = {
  slug: string; title: string; liveUrl: string; group: string; date: string;
  location: string | null; value: string | null; summary: string[]; scope: string[];
  pdf: string | null; cover: Media | null; images: Media[]; client: { name: string; logo: Media | null } | null;
};

export type Person = { slug: string; name: string; role: string; bio: string[]; photo: Media | null; liveUrl: string };

export type Story = { slug: string; name: string; story: string[] };

export const services = servicesData as Service[];
export const projects = projectsData as Project[];
export const team = teamData as Person[];
export const pages = pagesData;
export const stories = pagesData.careers.stories as Story[];

/* Short descriptions for the expertise list. The live service pages have no intro, so the first scope lines stand in. */
export const serviceSummary = (service: Service) => service.lede ?? service.list.slice(0, 3).join(" · ");

/* ---------- Listing cards ---------- */

export type ProjectCard = { slug: string; title: string; location: string | null; value: string | null; group: string; cover: Media | null; search: string };
export const projectCard = (p: Project): ProjectCard => ({
  slug: p.slug, title: p.title, location: p.location, value: p.value, group: p.group, cover: p.cover,
  search: [p.title, p.location, p.group, p.client?.name, ...p.scope].filter(Boolean).join(" ").toLowerCase(),
});

export type PersonCard = { slug: string; name: string; role: string; photo: Media | null; board: string; search: string };
/* The leadership page has no groups, so the filter splits the board (chairs and C-suite) from the functional directors. */
export const board = (role: string) => (/chair|chief|CEO|CFO/i.test(role) ? "Board" : "Directors");
export const personCard = (p: Person): PersonCard => ({ slug: p.slug, name: p.name, role: p.role, photo: p.photo, board: board(p.role), search: `${p.name} ${p.role}`.toLowerCase() });

export type StoryCard = { slug: string; name: string; excerpt: string; theme: string; search: string };
/* Stories carry no role field. Each person's department is read by hand from their own story
   (e.g. Kieran Fielding: "Breakdown Controller" in the workshop office; Karen Bridger: "Plant Hire Office Manager"). */
const departments: Record<string, string> = {
  "louie-corne": "Engineering", "ben-reynolds": "Engineering", "keioni-whitworth": "Engineering",
  "conor-power": "Site management", "guy-conyers": "Site management", "james-robinson": "Site management",
  "jason-white": "Plant & workshop", "karen-bridger": "Plant & workshop", "kieran-fielding": "Plant & workshop",
  "clarice-mooney": "Health & safety", "kirsty-summers": "Finance",
};
export const storyTheme = (story: Story) => departments[story.slug] ?? "Coinford";
export const storyCard = (s: Story): StoryCard => {
  const first = s.story[0] ?? "";
  const excerpt = first.length > 180 ? `${first.slice(0, first.lastIndexOf(" ", 176))}…` : first;
  return { slug: s.slug, name: s.name, excerpt, theme: storyTheme(s), search: `${s.name} ${s.story.join(" ")}`.toLowerCase() };
};

export const related = <T extends { slug: string }>(list: T[], slug: string, count = 3) => {
  const index = list.findIndex((item) => item.slug === slug);
  return Array.from({ length: Math.min(count, list.length - 1) }, (_, i) => list[(index + i + 1) % list.length]);
};
