import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapters } from "@/lib/content";
import { GUIDES, getGuideMeta } from "@/lib/guides";

type Props = { params: Promise<{ guide: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ guide: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guide } = await params;
  const meta = getGuideMeta(guide);
  return { title: meta ? `Guide ${meta.number}: ${meta.title}` : "Guide" };
}

export default async function GuideIndex({ params }: Props) {
  const { guide } = await params;
  const meta = getGuideMeta(guide);
  if (!meta) notFound();
  const chapters = getChapters(guide);

  return (
    <div className="mx-auto max-w-3xl px-1 py-8 sm:px-6 lg:py-10">
      <p className="text-sm font-medium text-accent">Guide {meta.number}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{meta.title}</h1>
      <p className="mt-3 text-lg text-muted">{meta.summary}</p>
      <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt className="text-muted">Time</dt>
          <dd className="font-medium">{meta.duration}</dd>
        </div>
        <div>
          <dt className="text-muted">Level</dt>
          <dd className="font-medium">{meta.level}</dd>
        </div>
        <div>
          <dt className="text-muted">Before you start</dt>
          <dd className="font-medium">{meta.audience}</dd>
        </div>
      </dl>
      <ol className="mt-8 divide-y divide-border overflow-hidden rounded-lg border border-border">
        {chapters.map((c) => (
          <li key={c.slug}>
            <Link href={c.href} className="flex items-start gap-4 px-4 py-3.5 hover:bg-surface">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {c.order}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{c.title}</span>
                {c.description && <span className="block text-sm text-muted">{c.description}</span>}
              </span>
              {c.minutes > 0 && <span className="shrink-0 pt-0.5 text-xs text-muted">{c.minutes} min</span>}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
