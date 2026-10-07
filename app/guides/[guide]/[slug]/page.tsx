import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterProgress, MarkComplete } from "@/components/chapter-progress";
import { Pager } from "@/components/pager";
import { Toc } from "@/components/toc";
import { getAllChapterRefs, getChapter, getNeighbors, getToc, readingMinutes } from "@/lib/content";
import { SITE, getGuideMeta } from "@/lib/guides";
import { renderMdx } from "@/lib/mdx";

type Props = { params: Promise<{ guide: string; slug: string }> };

export function generateStaticParams() {
  return getAllChapterRefs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guide, slug } = await params;
  const chapter = getChapter(guide, slug);
  return { title: chapter?.title ?? "Chapter", description: chapter?.description };
}

export default async function ChapterPage({ params }: Props) {
  const { guide, slug } = await params;
  const chapter = getChapter(guide, slug);
  const meta = getGuideMeta(guide);
  if (!chapter || !meta) notFound();
  const body = await renderMdx(chapter.source);
  const toc = getToc(chapter.source);
  const stepTitles = [...chapter.source.matchAll(/<Step\s+title="([^"]+)"/g)].map((m) => m[1]);
  const { prev, next, nextGuide } = getNeighbors(guide, slug);
  const minutes = chapter.minutes || readingMinutes(chapter.source);

  return (
    <div className="flex gap-10 px-1 py-8 sm:px-6 lg:py-10">
      <article className="mx-auto min-w-0 max-w-3xl flex-1">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href={`/guides/${guide}/`} className="hover:text-text">
            Guide {meta.number}: {meta.title}
          </Link>
          <span aria-hidden> / </span>
          <span>Chapter {chapter.order}</span>
        </nav>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{chapter.title}</h1>
        {chapter.description && <p className="mt-3 text-lg text-muted">{chapter.description}</p>}
        <p className="mt-3 text-sm text-muted">
          About {minutes} min · Verified {SITE.verified}
        </p>
        <ChapterProgress stepTitles={stepTitles} />
        <div className="mt-8">
          <Toc items={toc} />
        </div>
        <div className="doc">{body}</div>
        <MarkComplete />
        <Pager prev={prev} next={next} nextGuide={nextGuide} />
        <p className="mt-8 text-sm text-muted print:hidden">
          Found a mistake?{" "}
          <a className="underline hover:text-text" href={`https://github.com/${SITE.repo}/edit/main/content/${guide}/${chapter.file}`} target="_blank" rel="noreferrer">
            Edit this page on GitHub
          </a>
          .
        </p>
      </article>
      <div className="hidden shrink-0 xl:block">
        <Toc items={toc} variant="rail" />
      </div>
    </div>
  );
}
