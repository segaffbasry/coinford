// Shared helpers for scripts/scrape.mjs: fetch the live site politely and flatten Elementor markup
// into an ordered stream of blocks (heading, text, list, image, link, video) that page rules can pick from.
import * as cheerio from "cheerio";

export const SITE = "https://www.coinford.co.uk";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

export async function get(url, type = "text") {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: type === "json" ? "application/json" : "text/html,application/xhtml+xml,*/*", "Accept-Language": "en-GB,en" } });
    if (res.ok) return type === "json" ? res.json() : type === "buffer" ? Buffer.from(await res.arrayBuffer()) : res.text();
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
  }
  throw new Error(`GET ${url} failed`);
}

export const tidy = (s = "") => s.replace(/ /g, " ").replace(/[ \t\r\n]+/g, " ").replace(/\s+([,.;:])/g, "$1").trim();

// WordPress serves resized copies (-300x200, -scaled, elementor thumbs). Walk back to the uploaded original where we can.
export function original(src) {
  if (!src) return src;
  let url = src.startsWith("//") ? `https:${src}` : src;
  url = url.replace(/-\d{2,4}x\d{2,4}(\.\w+)$/, "$1");
  return url;
}

export function blocks(html) {
  const $ = cheerio.load(html);
  const root = $(".page_content_wrap").length ? $(".page_content_wrap") : $("body");
  root.find("script, style, noscript, svg, .elementor-widget-spacer").remove();
  const out = [];
  const seenImg = new Set();
  const walk = (el) => {
    $(el).children().each((_, child) => {
      const node = $(child);
      const tag = child.tagName?.toLowerCase();
      if (/^h[1-6]$/.test(tag)) { const text = tidy(node.text()); if (text) out.push({ kind: "heading", level: +tag[1], text }); return; }
      if (tag === "p") {
        const html = node.html() ?? "";
        const parts = html.split(/<br\s*\/?>/i).map((part) => tidy(cheerio.load(`<i>${part}</i>`)("i").text())).filter(Boolean);
        const bold = tidy(node.find("b, strong").text());
        if (parts.length) out.push({ kind: "text", lines: parts, bold: bold || undefined });
        node.find("img").each((__, img) => pushImg(img));
        return;
      }
      if (tag === "ul" || tag === "ol") {
        const items = node.children("li").map((__, li) => tidy($(li).text())).get().filter(Boolean);
        if (items.length) out.push({ kind: "list", items });
        return;
      }
      if (tag === "img") { pushImg(child); return; }
      if (tag === "video" || tag === "iframe") { out.push({ kind: "video", src: node.attr("src") }); return; }
      if (tag === "a") {
        const href = node.attr("href");
        const text = tidy(node.text());
        if (node.find("img").length) { node.find("img").each((__, img) => pushImg(img, href)); return; }
        if (href && href !== "#" && text) out.push({ kind: "link", text, href });
        return;
      }
      // Elementor keeps some text directly inside wrapper divs ("Who We Are" subtitles).
      const own = tidy(node.contents().filter((__, c) => c.type === "text").text());
      if (own && !["div", "section", "span"].includes(tag) === false) out.push({ kind: "label", text: own });
      const settings = node.attr("data-settings");
      if (settings && settings.includes("background_video_link")) {
        const m = settings.match(/"background_video_link":"([^"]+)"/); if (m) out.push({ kind: "video", src: m[1].replace(/\\\//g, "/") });
      }
      if (settings && settings.includes("background_image")) {
        const m = settings.match(/"background_image":\{"url":"([^"]+)"/); if (m) out.push({ kind: "image", src: original(m[1].replace(/\\\//g, "/")), background: true });
      }
      walk(child);
    });
  };
  const pushImg = (img, href) => {
    const $img = $(img);
    const src = $img.attr("data-src") || $img.attr("data-lazyload") || $img.attr("src");
    if (!src || src.includes("dummy.png") || src.startsWith("data:")) return;
    const key = src + (href ?? "");
    if (seenImg.has(key)) return; seenImg.add(key);
    out.push({ kind: "image", src: original(src), href, alt: tidy($img.attr("alt") ?? "") || undefined });
  };
  walk(root);
  return out;
}
