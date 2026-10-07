"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/content";

export function Toc({ items, variant = "inline" }: { items: TocItem[]; variant?: "inline" | "rail" }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (variant !== "rail") return;
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        if (visible.size) {
          const first = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0];
          setActive(first);
        }
      },
      { rootMargin: "-72px 0px -65% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items, variant]);

  if (items.length < 2) return null;

  const list = (
    <ul className="space-y-1 border-l border-border text-[0.82rem] leading-snug">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            aria-current={active === i.id ? "location" : undefined}
            className={clsx(
              "-ml-px block border-l py-1 pr-2 hover:text-text",
              i.level === 3 ? "pl-6" : "pl-3",
              active === i.id ? "border-accent font-medium text-accent" : "border-transparent text-muted",
            )}
          >
            {i.title}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "inline") {
    return (
      <details className="mb-6 rounded-lg border border-border bg-surface px-3 py-2 xl:hidden print:hidden">
        <summary className="cursor-pointer text-sm font-medium">On this page</summary>
        <div className="mt-2">{list}</div>
      </details>
    );
  }

  return (
    <aside className="sticky top-20 max-h-[calc(100vh-6rem)] w-60 shrink-0 overflow-y-auto pb-6 print:hidden" aria-label="On this page">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">On this page</p>
      {list}
    </aside>
  );
}
