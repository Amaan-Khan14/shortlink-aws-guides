"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavGuide } from "@/lib/nav";
import { LogoMark } from "./logo";
import { SidebarNav } from "./sidebar-nav";
import { ThemeToggle } from "./theme-toggle";

function GitHubMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function SiteHeader({ guides, repo, actions }: { guides: NavGuide[]; repo: string; actions?: React.ReactNode }) {
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawer]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur print:hidden">
        <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-2 px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted hover:text-text lg:hidden"
            onClick={() => setDrawer(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} aria-hidden />
          </button>

          <Link href="/" className="mr-2 flex items-center gap-2 font-semibold tracking-tight">
            <LogoMark />
            <span className="hidden sm:inline">ShortLink on AWS</span>
          </Link>

          <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 text-sm md:flex">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={g.chapters[0]?.href ?? "/"}
                className="rounded-md px-2.5 py-1.5 text-muted hover:bg-surface hover:text-text"
              >
                {g.short}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {actions}
            <a
              href={`https://github.com/${repo}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted hover:text-text"
              aria-label="View this site on GitHub"
            >
              <GitHubMark />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close navigation" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[19rem] max-w-[85vw] flex-col border-r border-border bg-bg p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold">Guides</span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface"
                aria-label="Close navigation"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <SidebarNav guides={guides} onNavigate={() => setDrawer(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
