import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllChapterRefs, getChapter } from "@/lib/content";
import { getGuideMeta } from "@/lib/guides";
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

  return (
    <article className="mx-auto max-w-3xl px-1 py-8 sm:px-6 lg:py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href={`/guides/${guide}/`} className="hover:text-text">
          Guide {meta.number}: {meta.title}
        </Link>
        <span aria-hidden> / </span>
        <span>Chapter {chapter.order}</span>
      </nav>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{chapter.title}</h1>
      {chapter.description && <p className="mt-3 text-lg text-muted">{chapter.description}</p>}
      <div className="doc mt-8">{body}</div>
    </article>
  );
}
