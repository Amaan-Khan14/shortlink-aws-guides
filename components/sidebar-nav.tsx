"use client";

import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavGuide } from "@/lib/nav";

export function SidebarNav({ guides, onNavigate }: { guides: NavGuide[]; onNavigate?: () => void }) {
  const pathname = usePathname() ?? "";
  const activeGuide = guides.find((g) => pathname.startsWith(`/guides/${g.slug}/`))?.slug;
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <nav aria-label="Guides" className="text-sm">
      <ul className="space-y-1">
        {guides.map((g) => {
          const expanded = open[g.slug] ?? g.slug === activeGuide;
          return (
            <li key={g.slug}>
              <button
                type="button"
                onClick={() => setOpen((s) => ({ ...s, [g.slug]: !expanded }))}
                aria-expanded={expanded}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left font-medium hover:bg-surface"
              >
                <ChevronRight size={14} className={clsx("shrink-0 text-muted transition-transform", expanded && "rotate-90")} aria-hidden />
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent-soft text-xs font-semibold text-accent">
                  {g.number}
                </span>
                <span className="leading-snug">{g.title}</span>
              </button>
              {expanded && (
                <ol className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                  {g.chapters.map((c) => {
                    const active = pathname === c.href || pathname === c.href.replace(/\/$/, "");
                    return (
                      <li key={c.slug}>
                        <Link
                          href={c.href}
                          onClick={onNavigate}
                          aria-current={active ? "page" : undefined}
                          className={clsx(
                            "block rounded-md px-2 py-1.5 leading-snug",
                            active ? "bg-accent-soft font-medium text-accent" : "text-muted hover:bg-surface hover:text-text",
                          )}
                        >
                          {c.title}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
