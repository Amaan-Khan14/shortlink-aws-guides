import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { GUIDES } from "./guides";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ChapterMeta = {
  guide: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  minutes: number;
  href: string;
  file: string;
};

export type Chapter = ChapterMeta & { source: string };

export type TocItem = { id: string; title: string; level: 2 | 3 };

function parseFile(guide: string, file: string): Chapter {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, guide, file), "utf8");
  const { data, content } = matter(raw);
  const m = /^(\d+)-(.+)\.mdx$/.exec(file);
  if (!m) throw new Error(`Bad chapter file name: ${guide}/${file} (expected NN-slug.mdx)`);
  return {
    guide,
    slug: m[2],
    order: Number(m[1]),
    title: String(data.title ?? m[2]),
    description: String(data.description ?? ""),
    minutes: Number(data.minutes ?? 0),
    href: `/guides/${guide}/${m[2]}/`,
    file,
    source: content,
  };
}

export function getChapters(guide: string): ChapterMeta[] {
  const dir = path.join(CONTENT_DIR, guide);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((f) => {
      const { source: _source, ...meta } = parseFile(guide, f);
      void _source;
      return meta;
    });
}

export function getChapter(guide: string, slug: string): Chapter | undefined {
  const dir = path.join(CONTENT_DIR, guide);
  if (!fs.existsSync(dir)) return undefined;
  const file = fs.readdirSync(dir).find((f) => f.endsWith(`-${slug}.mdx`));
  return file ? parseFile(guide, file) : undefined;
}

export function getAllChapterRefs(): { guide: string; slug: string }[] {
  return GUIDES.flatMap((g) => getChapters(g.slug).map((c) => ({ guide: g.slug, slug: c.slug })));
}

/** Previous and next chapter inside the same guide (and the next guide at the very end). */
export function getNeighbors(guide: string, slug: string) {
  const chapters = getChapters(guide);
  const i = chapters.findIndex((c) => c.slug === slug);
  const prev = i > 0 ? chapters[i - 1] : null;
  const next = i >= 0 && i < chapters.length - 1 ? chapters[i + 1] : null;
  let nextGuide: { title: string; href: string } | null = null;
  if (!next) {
    const gi = GUIDES.findIndex((g) => g.slug === guide);
    const ng = GUIDES[gi + 1];
    const first = ng ? getChapters(ng.slug)[0] : undefined;
    if (ng && first) nextGuide = { title: `Guide ${ng.number}: ${ng.title}`, href: first.href };
  }
  return { prev, next, nextGuide };
}

/**
 * Table of contents: `##` headings, `###` headings and `<Step title="…">` blocks.
 * Code fences are skipped. Ids match rehype-slug and the Step component.
 */
export function getToc(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const h = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (h) {
      const title = stripInline(h[2]);
      items.push({ id: slugger.slug(title), title, level: h[1].length as 2 | 3 });
      continue;
    }
    const s = /<Step\s+title="([^"]+)"/.exec(line);
    if (s) items.push({ id: slugger.slug(s[1]), title: s[1], level: 3 });
  }
  return items;
}

function stripInline(text: string): string {
  return text.replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
}

export function readingMinutes(source: string): number {
  const words = source.replace(/```[\s\S]*?```/g, " ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
