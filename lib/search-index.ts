import { GUIDES } from "./guides";
import { getChapter, getChapters, getToc } from "./content";

export type SearchDoc = {
  id: string;
  guide: string;
  guideTitle: string;
  title: string;
  href: string;
  headings: { id: string; title: string }[];
  text: string;
};

/** Plain-text version of an MDX source, good enough for keyword search. */
function toPlain(source: string): string {
  return source
    .replace(/<[^>]+>/g, " ")
    .replace(/^(```|~~~).*$/gm, " ")
    .replace(/[|*_#>`]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const g of GUIDES) {
    for (const meta of getChapters(g.slug)) {
      const chapter = getChapter(g.slug, meta.slug);
      if (!chapter) continue;
      docs.push({
        id: `${g.slug}/${meta.slug}`,
        guide: g.slug,
        guideTitle: g.title,
        title: meta.title,
        href: meta.href,
        headings: getToc(chapter.source).map((t) => ({ id: t.id, title: t.title })),
        text: toPlain(chapter.source),
      });
    }
  }
  return docs;
}
