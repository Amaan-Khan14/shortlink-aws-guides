"use client";

import { CheckCircle2, Circle } from "lucide-react";
import GithubSlugger from "github-slugger";
import { usePathname } from "next/navigation";
import { normalizePath, setDone } from "@/lib/progress";
import { useProgress } from "./use-progress";

/** Thin progress bar for the steps of this chapter, shown under the title. */
export function ChapterProgress({ stepTitles }: { stepTitles: string[] }) {
  const pathname = normalizePath(usePathname() ?? "");
  const done = useProgress();
  if (!stepTitles.length) return null;
  const slugger = new GithubSlugger();
  const finished = stepTitles.filter((t) => done.has(`${pathname}#${slugger.slug(t)}`)).length;
  const pct = Math.round((finished / stepTitles.length) * 100);
  return (
    <div className="mt-5 print:hidden" aria-label={`${finished} of ${stepTitles.length} steps done`}>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          {finished} of {stepTitles.length} steps done
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Button at the end of a chapter; ticks the chapter in the sidebar. */
export function MarkComplete() {
  const pathname = normalizePath(usePathname() ?? "");
  const key = pathname;
  const done = useProgress().has(key);
  const Icon = done ? CheckCircle2 : Circle;
  return (
    <button
      type="button"
      onClick={() => setDone(key, !done)}
      aria-pressed={done}
      className={
        "mt-10 inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium print:hidden " +
        (done ? "border-[var(--tip)] bg-[var(--tip-soft)] text-[var(--tip)]" : "border-border bg-surface hover:border-accent")
      }
    >
      <Icon size={16} aria-hidden />
      {done ? "Chapter complete" : "Mark this chapter complete"}
    </button>
  );
}
