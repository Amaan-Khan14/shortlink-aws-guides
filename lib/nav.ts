import { GUIDES } from "./guides";
import { getChapters } from "./content";

export type NavGuide = {
  slug: string;
  number: number;
  title: string;
  short: string;
  chapters: { slug: string; title: string; href: string; order: number }[];
};

export function getNav(): NavGuide[] {
  return GUIDES.map((g) => ({
    slug: g.slug,
    number: g.number,
    title: g.title,
    short: g.short,
    chapters: getChapters(g.slug).map((c) => ({ slug: c.slug, title: c.title, href: c.href, order: c.order })),
  }));
}
