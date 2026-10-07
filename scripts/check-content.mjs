// Fails the build when a chapter is malformed. Cheap guard rails for authors:
//  - file names are NN-slug.mdx and unique per guide
//  - front matter has title + description + minutes
//  - code fences are balanced
//  - heading / <Step> ids are unique inside a chapter (anchors and the TOC rely on it)
//  - <Step> and </Step> are balanced
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const root = path.join(process.cwd(), "content");
const errors = [];
let chapters = 0;
const known = new Set(); // "/guides/<guide>/<slug>/"
const links = []; // [where, href]

for (const guide of fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const seen = new Set();
  for (const file of fs.readdirSync(path.join(root, guide.name)).sort()) {
    if (!file.endsWith(".mdx")) continue;
    chapters++;
    const where = `${guide.name}/${file}`;
    const m = /^(\d+)-([a-z0-9-]+)\.mdx$/.exec(file);
    if (!m) {
      errors.push(`${where}: file name must look like 01-some-slug.mdx`);
      continue;
    }
    if (seen.has(m[2])) errors.push(`${where}: duplicate slug "${m[2]}" in guide`);
    seen.add(m[2]);
    known.add(`/guides/${guide.name}/${m[2]}/`);

    const { data, content } = matter(fs.readFileSync(path.join(root, guide.name, file), "utf8"));
    for (const key of ["title", "description", "minutes"]) {
      if (data[key] === undefined || data[key] === "") errors.push(`${where}: missing front matter "${key}"`);
    }

    const slugger = new GithubSlugger();
    const ids = new Map();
    let inFence = false;
    let fenceMarks = 0;
    let open = 0;
    let close = 0;
    content.split("\n").forEach((line, i) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        fenceMarks++;
        return;
      }
      if (inFence) return;
      const h = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
      const s = /<Step\s+title="([^"]+)"/.exec(line);
      const title = h ? h[2].replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1") : s ? s[1] : null;
      if (title) {
        const id = slugger.slug(title);
        if (ids.has(id)) errors.push(`${where}:${i + 1}: duplicate heading id "${id}" (first at line ${ids.get(id)}) — make the titles unique`);
        ids.set(id, i + 1);
      }
      if (/<Step[\s>]/.test(line)) open++;
      if (/<\/Step>/.test(line)) close++;
    });
    for (const l of content.matchAll(/\]\((\/guides\/[^)#\s]+)(#[^)\s]*)?\)/g)) links.push([where, l[1]]);
    if (fenceMarks % 2) errors.push(`${where}: unbalanced code fence`);
    if (open !== close) errors.push(`${where}: ${open} <Step> opened but ${close} closed`);
  }
}

for (const [where, href] of links) {
  const normalized = href.endsWith("/") ? href : `${href}/`;
  const guideIndex = /^\/guides\/[^/]+\/$/.test(normalized);
  if (!known.has(normalized) && !guideIndex) errors.push(`${where}: broken internal link ${href}`);
}

if (errors.length) {
  console.error(`\nContent check failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join("\n") + "\n");
  process.exit(1);
}
console.log(`Content check passed: ${chapters} chapters.`);
