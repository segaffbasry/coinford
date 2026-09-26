// Refreshes every piece of content this demo shows from the live coinford.co.uk.
// Run: npm run scrape   (downloads images into public/media and writes content/*.json)
//
// Sources
//  - WordPress REST API for the three custom post types: services (cpt_services), projects (cpt_portfolio), team (cpt_team)
//  - Rendered pages for everything built with Elementor: home, about, plant & machinery, HSQE, leadership, careers, vacancies, contact
// The 42 blog posts in post-sitemap.xml are the Edifice theme's demo articles (lorem ipsum, never linked from the menu),
// so they are deliberately not scraped. See README "Content".
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { SITE, blocks, get, original, tidy } from "./lib-blocks.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const MEDIA = path.join(ROOT, "public", "media");
const CONTENT = path.join(ROOT, "content");
const report = [];

const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const text = (html) => tidy(cheerio.load(`<i>${html}</i>`)("i").text());

/* Elementor crops images into /elementor/thumbs/<name>-<hash>.jpg. Ask the media library for the uploaded original. */
const thumbCache = new Map();
async function resolve(src) {
  if (!src) return src;
  const m = src.match(/elementor\/thumbs\/(.+?)-[a-z0-9]{30,}\.(\w+)$/);
  if (!m) return src;
  if (thumbCache.has(src)) return thumbCache.get(src);
  const base = m[1].replace(/-scaled$/, "").replace(/-e\d{10}$/, "").replace(/-scaled$/, "");
  const found = await get(`${SITE}/wp-json/wp/v2/media?search=${encodeURIComponent(base)}&_fields=source_url&per_page=20`, "json").catch(() => []);
  const hit = found.find((f) => f.source_url.includes(m[1].replace(/-e\d{10}$/, ""))) ?? found.find((f) => f.source_url.includes(base)) ?? found[0];
  const url = hit?.source_url ?? src;
  thumbCache.set(src, url);
  return url;
}

/* Downloads once, caps photographs at 2000px and re-encodes JPEG at quality 78 so the repo stays light. Logos and PNGs are kept as served. */
async function media(src, folder, name) {
  if (!src) return null;
  const url = await resolve(src);
  const ext = (path.extname(new URL(url).pathname) || ".jpg").toLowerCase().replace(".jpeg", ".jpg");
  const file = `${name ?? slugify(path.basename(new URL(url).pathname, path.extname(url)))}${ext}`;
  const dir = path.join(MEDIA, folder);
  mkdirSync(dir, { recursive: true });
  const out = path.join(dir, file);
  if (!existsSync(out)) {
    writeFileSync(out, await get(url, "buffer"));
    if (ext === ".jpg") execFileSync("sips", ["-Z", "2000", "-s", "format", "jpeg", "-s", "formatOptions", "78", out, "--out", out], { stdio: "ignore" });
  }
  let width = 0, height = 0;
  if (ext !== ".svg") {
    const info = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", out]).toString();
    width = +(info.match(/pixelWidth: (\d+)/)?.[1] ?? 0); height = +(info.match(/pixelHeight: (\d+)/)?.[1] ?? 0);
  }
  return { src: `/media/${folder}/${file}`, width, height, source: url };
}

const featured = async (id) => (id ? (await get(`${SITE}/wp-json/wp/v2/media/${id}?_fields=source_url`, "json").catch(() => null))?.source_url : null);
const sitemap = async (name) => [...(await get(`${SITE}/${name}-sitemap.xml`)).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !u.includes("/wp-content/"));

/* ---------- Services ---------- */
async function services() {
  const rest = await get(`${SITE}/wp-json/wp/v2/cpt_services?per_page=50`, "json");
  // Order and short labels follow the live "Our Expertise" block on the homepage.
  const order = ["infrastructure", "earthworks", "groundworks", "rc-frame", "preconstruction"];
  const items = [];
  for (const slug of order) {
    const post = rest.find((p) => p.slug === slug);
    const $ = cheerio.load(post.content.rendered);
    const lede = tidy($("h5").first().text()) || null;
    const paragraphs = $("p").map((_, p) => tidy($(p).text())).get().filter(Boolean);
    const list = $("li").map((_, li) => tidy($(li).text())).get().filter(Boolean);
    const images = [];
    for (const img of $("img").toArray()) images.push(await media(original($(img).attr("src")), `services/${slug}`));
    const cover = await media(await featured(post.featured_media), `services/${slug}`, "cover");
    items.push({ slug, title: text(post.title.rendered), liveUrl: post.link, lede, paragraphs, list, cover, images: images.filter(Boolean) });
  }
  const live = (await sitemap("cpt_services")).filter((u) => u.split("/").filter(Boolean).length > 3);
  report.push(["Services", items.length, live.length]);
  return items;
}

/* ---------- Projects ---------- */
async function projects() {
  const rest = await get(`${SITE}/wp-json/wp/v2/cpt_portfolio?per_page=50`, "json");
  const groups = Object.fromEntries((await get(`${SITE}/wp-json/wp/v2/cpt_portfolio_group?per_page=50`, "json")).map((g) => [g.id, g.name]));
  // The live Projects page lists eight in this order; Royal Wells Park is published but only reachable from Next/Prev links, so it closes the list.
  const listing = cheerio.load(await get(`${SITE}/projects/`));
  const shown = listing(".sc_blogger_item_title a").map((_, a) => listing(a).attr("href")).get();
  const items = [];
  for (const post of rest) {
    const $ = cheerio.load(post.content.rendered);
    const title = text(post.title.rendered);
    const slug = slugify(title.replace(/,? Phase 3,? Bexleyheath/, " Bexleyheath").replace(/ Ph3$/, " Phase 3"));
    const nodes = $("body").children().toArray();
    let location = null, value = null, section = "intro";
    const summary = [], scope = [];
    for (const node of nodes) {
      const el = $(node); const tag = node.tagName;
      const t = tidy(el.text());
      if (tag === "h2" && /contract value/i.test(t)) { section = "value"; continue; }
      if (tag === "h2" && /scope of works/i.test(t)) { section = "scope"; continue; }
      if (tag === "ul") { el.find("li").each((_, li) => { tidy($(li).text()).split(/(?<=[a-z])\s(?=Installation of|Section 278)/).forEach((line) => line && scope.push(line.replace(/\.$/, ""))); }); continue; }
      if (tag !== "p" || !t || el.find("a").length) continue;
      if (section === "intro" && !location) { location = t; continue; }
      if (section === "value" && !value) { value = t; section = "summary"; continue; }
      summary.push(t);
    }
    // Two projects open straight on "Contract Value" (no address line); the first paragraph is then the value.
    if (location && /^£/.test(location)) { value = location; location = null; }
    const pdf = $("a[href$='.pdf']").attr("href") ?? null;
    // The client's logo is floated right inside the project body; everything else is site photography.
    const sources = $("img").map((_, img) => original($(img).attr("src"))).get();
    const logo = sources.find((src) => /logo/i.test(src));
    const images = [];
    for (const src of sources.filter((src) => src !== logo)) images.push(await media(src, `projects/${slug}`));
    const coverUrl = await featured(post.featured_media);
    const cover = coverUrl ? await media(coverUrl, `projects/${slug}`, "cover") : images[0];
    const client = logo ? { name: clientName(logo), logo: await media(logo, "clients") } : null;
    items.push({
      slug, title, liveUrl: post.link, group: groups[post.cpt_portfolio_group?.[0]] ?? "Construction", date: post.date.slice(0, 10),
      location: location ? location.replace(/\b([A-Z])([A-Z]+)\b/g, (w, a, b) => (w.length <= 3 ? w : a + b.toLowerCase())) : null,
      value, summary, scope, pdf, cover, images: images.filter(Boolean).filter((i) => i.src !== cover?.src), client,
      order: shown.includes(post.link) ? shown.indexOf(post.link) : 99,
    });
  }
  items.sort((a, b) => a.order - b.order);
  const live = (await sitemap("cpt_portfolio")).filter((u) => u.split("/").filter(Boolean).length > 3);
  report.push(["Projects", items.length, live.length]);
  return items.map(({ order, ...rest }) => rest);
}

/* ---------- Leadership team ---------- */
async function team() {
  const rest = await get(`${SITE}/wp-json/wp/v2/cpt_team?per_page=50`, "json");
  const page = cheerio.load(await get(`${SITE}/team-family/`));
  const people = [];
  // Each card on /team-family/ holds the photo, the full first-person bio, the name and the role, in page order.
  page(".sc_team_item").each((_, item) => {
    const card = page(item);
    const name = tidy(card.find(".sc_team_item_title").text());
    const role = tidy(card.find(".sc_team_item_subtitle").text());
    const bio = card.find(".sc_team_item_content p, .sc_team_item_text p").map((__, p) => tidy(page(p).text())).get().filter(Boolean);
    const bioText = bio.length ? bio : [tidy(card.find(".sc_team_item_content, .sc_team_item_text").text())].filter(Boolean);
    people.push({ name, role, bio: bioText });
  });
  const items = [];
  for (const person of people) {
    const post = rest.find((p) => text(p.title.rendered) === person.name);
    const slug = post?.slug ?? slugify(person.name);
    const photo = await media(await featured(post?.featured_media), "team", slug);
    // Detail pages carry the fullest bio (Paul Timlin's has a second paragraph the card omits); the card text is the fallback.
    const detail = blocks(await get(post?.link ?? `${SITE}/team/${slug}/`)).filter((x) => (x.kind === "text" || x.kind === "label"))
      .flatMap((x) => x.kind === "text" ? x.lines : [x.text]).filter((line) => line.length > 60);
    const bio = (detail.length ? detail : person.bio).map((p) => p.replace(/\s+/g, " ").trim());
    items.push({ slug, name: person.name, role: person.role, bio, photo, liveUrl: post?.link ?? `${SITE}/team/${slug}/` });
  }
  const live = (await sitemap("cpt_team")).filter((u) => u.split("/").filter(Boolean).length > 3);
  report.push(["Leadership team", items.length, live.length]);
  return items;
}

/* ---------- Page copy (Elementor pages) ---------- */
const byKind = (list, kind) => list.filter((b) => b.kind === kind);

async function home() {
  const b = blocks(await get(`${SITE}/`));
  const $ = cheerio.load(await get(`${SITE}/`));
  const stats = $(".sc_skills_column").map((_, col) => {
    const total = $(col).find(".sc_skills_total");
    return { value: +total.attr("data-stop"), suffix: tidy(total.attr("data-ed") ?? ""), label: tidy($(col).find(".sc_skills_item_title").text()) };
  }).get();
  const clients = [];
  for (const img of byKind(b, "image").filter((i) => /uploads\/2024\/12\//.test(i.src))) clients.push({ name: clientName(img.src), logo: await media(img.src, "clients") });
  const poster = await media(b.find((x) => x.kind === "image" && x.src.includes("revslider/video-media"))?.src, "home", "hero-poster");
  const expertise = await media(b.find((x) => x.kind === "image" && x.src.includes("858B01B7"))?.src, "home", "expertise");
  return {
    eyebrow: b.find((x) => x.kind === "heading" && x.level === 5)?.text ?? "What we do",
    headline: b.find((x) => x.kind === "heading" && x.text.includes("•"))?.text,
    film: b.find((x) => x.kind === "video" && x.src?.includes("2025/06"))?.src,
    closingFilm: b.find((x) => x.kind === "video" && x.src?.includes("2024/07"))?.src,
    poster, expertise, stats, clients,
    contactHeading: b.find((x) => x.kind === "heading" && /questions/i.test(x.text))?.text,
  };
}

function clientName(src) {
  const key = path.basename(src).toLowerCase();
  const names = { barrett: "Barratt Redrow", vistry: "Vistry Group", londonsquare: "London Square", placesforpeople: "Places for People", mclaren: "McLaren", lovell: "Lovell", keepmoat: "Keepmoat", higgings: "Higgins Homes", bellway: "Bellway", crestnicholson: "Crest Nicholson", thakeham: "Thakeham", redow: "Redrow", dandara: "Dandara", barratthomes: "Barratt Homes", countrysidepartnerships: "Countryside Partnerships", countrysideplaces: "Countryside Places", berkley: "Berkeley Group", hill: "Hill" };
  const hit = Object.keys(names).sort((a, b) => b.length - a.length).find((k) => key.includes(k));
  return hit ? names[hit] : key;
}

async function about() {
  const html = await get(`${SITE}/about/`);
  const b = blocks(html);
  const $ = cheerio.load(html);
  const intro = b.filter((x) => x.kind === "text").slice(0, 3).flatMap((x) => x.lines);
  const timeline = $(".elementor-widget-be-timeline li h5").map((_, h) => tidy($(h).text())).get().map((line) => {
    const m = line.match(/(\d{4})/);
    const year = m ? m[1] : "";
    let label = line.replace(year, "").trim();
    label = label.charAt(0).toUpperCase() + label.slice(1);
    return { year, label: label.replace(/\bLArge\b/, "large").replace(/^dartford/i, "Dartford").replace(/\bdartford\b/, "Dartford").replace(/ value (\d+) million/, " (value £$1 million)") };
  });
  const missionBlock = b.find((x) => x.kind === "text" && x.lines[0]?.startsWith("To be the contractor"));
  const missionPdfs = byKind(b, "image").filter((i) => i.href?.endsWith(".pdf")).map((i, index) => ({ language: ["Irish", "English", "Indian (Hindi)", "Romanian", "Lithuanian", "Albanian"][index], href: i.href }));
  const offer = b.find((x) => x.kind === "text" && x.lines[0]?.startsWith("We work together"));
  const rotating = JSON.parse($("[data-strings]").attr("data-strings") ?? "[]").filter(Boolean);
  const hero = await media(byKind(b, "image")[0]?.src, "about", "who-we-are");
  const coverage = await media(byKind(b, "image").find((i) => i.src.includes("Coverage-Map"))?.src, "about", "coverage-map");
  const film = b.find((x) => x.kind === "video")?.src ?? null;
  return {
    eyebrow: "Who We Are", title: "Building Strong Foundations Together", intro, timeline,
    mission: missionBlock?.lines ?? [], missionEmphasis: missionBlock?.bold ?? null, missionPdfs,
    offer: { eyebrow: "What we offer", title: "We Excel in", rotating, lead: offer?.lines[0], items: offer?.lines.slice(1, -1) ?? [], range: offer?.lines.at(-1) },
    hero, coverage, film,
  };
}

async function plant() {
  const html = await get(`${SITE}/plant-machinery/`);
  const b = blocks(html);
  const $ = cheerio.load(html);
  const sections = [];
  b.forEach((x, i) => { if (x.kind === "heading" && x.text.endsWith(":")) sections.push({ title: x.text.replace(/:$/, ""), body: b[i + 1]?.lines?.join(" ") ?? "" }); });
  const images = [];
  for (const img of byKind(b, "image")) images.push(await media(img.src, "plant"));
  const fleet = [];
  for (const a of $(".elementor-widget-gallery a.e-gallery-item").toArray()) fleet.push(await media($(a).attr("href"), "plant/fleet"));
  const closing = b.find((x) => x.kind === "text" && x.lines[0]?.startsWith("At Coinford, we are dedicated"))?.lines.join(" ");
  const fleetCopy = b.find((x) => x.kind === "text" && x.lines[0]?.startsWith("At Coinford, we pride"))?.lines.join(" ");
  return { sections, closing, fleetLabel: "Our Machinery Showcase", fleetTitle: "Our Fleet of Machinery", fleetCopy, images: images.filter(Boolean), fleet: fleet.filter(Boolean) };
}

async function hsqe() {
  const b = blocks(await get(`${SITE}/health-safety/`));
  const texts = byKind(b, "text");
  const images = [];
  for (const img of byKind(b, "image").filter((i) => !i.src.includes("quality-logo"))) images.push(await media(img.src, "hsqe"));
  const iso = await media(byKind(b, "image").find((i) => i.src.includes("quality-logo"))?.src, "hsqe", "iso-9001");
  const find = (start) => texts.find((t) => t.lines[0]?.startsWith(start));
  return {
    eyebrow: "Health Safety Quality Environment",
    // The live heading ("We build affordable comfort for you") is left over from the theme demo, so the page title is used instead.
    safety: texts.slice(0, 2).map((t) => t.lines.join(" ")),
    training: find("Our internal training")?.lines.join(" "),
    behaviour: find("Coinford is proud")?.lines.join(" "),
    culture: find("All of the above")?.lines.join(" "),
    environmentTitle: "Environmental & Quality Performance",
    environmentIntro: find("We take pride")?.lines.join(" "),
    pillars: [find("Looking After"), find("Focused on Quality")].filter(Boolean).map((t) => ({ title: t.lines[0], body: t.lines.slice(1).join(" ") })),
    images: images.filter(Boolean), iso, film: b.find((x) => x.kind === "video")?.src ?? null,
  };
}

async function leadership() {
  const b = blocks(await get(`${SITE}/team-family/`));
  const texts = byKind(b, "text");
  const structureIndex = b.findIndex((x) => x.kind === "heading" && /Team Structure/i.test(x.text));
  return {
    eyebrow: "who we are", title: "Our team",
    intro: texts.slice(0, 2).map((t) => t.lines.join(" ")),
    structureTitle: "Team Structure Layout",
    structure: b.slice(structureIndex + 1).filter((x) => x.kind === "text").map((t) => t.lines.join(" ")),
  };
}

async function careers() {
  const html = await get(`${SITE}/careers/`);
  const b = blocks(html);
  const $ = cheerio.load(html);
  const start = b.findIndex((x) => x.kind === "text" && x.lines[0]?.startsWith("Read below"));
  // Each story is an Elementor loop item: the post body, then its title (the person's name).
  const stories = $(".e-loop-item").map((_, item) => {
    const name = tidy($(item).find(".elementor-widget-theme-post-title").text());
    const story = $(item).find(".elementor-widget-theme-post-content p").map((__, p) => tidy($(p).text()).replace(/”$/, "").replace(/^“/, "")).get().filter(Boolean);
    return { slug: slugify(name), name, story };
  }).get();
  const links = byKind(b, "link").filter((l) => l.href.includes("jobboards"));
  const clients = [];
  for (const img of byKind(b, "image").filter((i) => /uploads\/2024\/08\//.test(i.src))) clients.push({ name: clientName(img.src), logo: await media(img.src, "clients") });
  const withStory = stories.filter((s) => s.story.length);
  report.push(["Career stories", withStory.length, stories.length]);
  return {
    title: "Discover Our Team’s Journeys at Coinford",
    intro: b[start]?.lines[0],
    stories: withStory, emptyStories: stories.filter((s) => !s.story.length).map((s) => s.name),
    jobBoards: links.map((l) => ({ label: l.text, href: l.href })),
    clients,
  };
}

async function vacancies() {
  const b = blocks(await get(`${SITE}/current-vacancies/`));
  const roles = [];
  let group = null;
  b.forEach((x, i) => {
    if (x.kind === "heading" && x.level === 1 && x.text === x.text.toUpperCase() && x.text.length > 3 && !/SOLID/.test(x.text)) { group = x.text; return; }
    const next = b[i + 1];
    if (x.kind === "heading" && x.level === 1 && group && next && (next.kind === "text" || next.kind === "label")) {
      const description = next.kind === "text" ? next.lines.filter((l) => l !== "Job Description:").join(" ") : next.text;
      const email = b.slice(i, i + 8).find((y) => y.kind === "link" && y.href.startsWith("mailto:"))?.href.replace("mailto:", "") ?? "info@coinford.co.uk";
      roles.push({ group: group.charAt(0) + group.slice(1).toLowerCase(), title: x.text, description, email });
    }
  });
  report.push(["Vacancies", roles.length, roles.length]);
  return { roles };
}

async function contact() {
  const b = blocks(await get(`${SITE}/contact/`));
  const intro = b.find((x) => x.kind === "text" && x.lines[0]?.startsWith("Please contact"))?.lines.join(" ");
  // Address lines are loose text nodes under each office heading.
  const office = (name) => { const i = b.findIndex((x) => x.kind === "heading" && x.text === name); const lines = []; for (const x of b.slice(i + 1)) { if (x.kind !== "label") break; lines.push(x.text); } return lines; };
  const addressLines = (lines) => lines.map((l) => l.replace(/,$/, "").trim()).filter(Boolean);
  return {
    eyebrow: "Contact Us", title: "Get in touch", intro,
    offices: [{ name: "Head Office", lines: addressLines(office("Head Office")) }, { name: "Luton Office", lines: addressLines(office("Luton Office")) }],
    email: "info@coinford.co.uk", phone: "+44 (0)1342 840800", tel: "+441342840800",
  };
}

/* ---------- Run ---------- */
mkdirSync(CONTENT, { recursive: true });
const write = (name, data) => writeFileSync(path.join(CONTENT, `${name}.json`), JSON.stringify(data, null, 2) + "\n");

write("services", await services());
write("projects", await projects());
write("team", await team());
write("pages", {
  home: await home(), about: await about(), plant: await plant(), hsqe: await hsqe(),
  leadership: await leadership(), careers: await careers(), vacancies: await vacancies(), contact: await contact(),
});

console.log("\nScraped vs live");
for (const [type, scraped, live] of report) console.log(`  ${type.padEnd(18)} ${String(scraped).padStart(3)} / ${live}`);
