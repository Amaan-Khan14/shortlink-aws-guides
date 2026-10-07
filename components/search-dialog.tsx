"use client";

import clsx from "clsx";
import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SearchDoc } from "@/lib/search-index";

type Hit = { doc: SearchDoc; score: number; heading?: { id: string; title: string }; snippet: string };

function runSearch(docs: SearchDoc[], query: string): Hit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hits: Hit[] = [];
  for (const doc of docs) {
    const title = doc.title.toLowerCase();
    const text = doc.text.toLowerCase();
    let score = 0;
    let ok = true;
    let bestHeading: { id: string; title: string } | undefined;
    let bestHeadingScore = 0;
    for (const t of terms) {
      const inTitle = title.includes(t);
      const headingMatches = doc.headings.filter((h) => h.title.toLowerCase().includes(t));
      const textCount = text.split(t).length - 1;
      if (!inTitle && !headingMatches.length && !textCount) {
        ok = false;
        break;
      }
      score += (inTitle ? 12 : 0) + headingMatches.length * 6 + Math.min(textCount, 6);
      for (const h of headingMatches) {
        const hs = terms.filter((x) => h.title.toLowerCase().includes(x)).length;
        if (hs > bestHeadingScore) {
          bestHeadingScore = hs;
          bestHeading = h;
        }
      }
    }
    if (!ok) continue;
    const at = text.indexOf(terms[0]);
    const from = Math.max(0, at - 50);
    const snippet = at >= 0 ? (from > 0 ? "…" : "") + doc.text.slice(from, from + 150) + "…" : doc.text.slice(0, 150) + "…";
    hits.push({ doc, score, heading: bestHeading, snippet });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 10);
}

export function SearchButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-sm text-muted hover:text-text"
        aria-label="Search the guides"
      >
        <Search size={16} aria-hidden />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-border bg-bg px-1.5 text-[0.7rem] md:inline">⌘K</kbd>
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    fetch(`${base}/search-index.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: SearchDoc[]) => setDocs(d))
      .catch(() => setError(true));
  }, []);

  const hits = useMemo(() => (docs ? runSearch(docs, query) : []), [docs, query]);

  const go = useCallback(
    (h: Hit) => {
      onClose();
      router.push(h.heading ? `${h.doc.href}#${h.heading.id}` : h.doc.href);
    },
    [onClose, router],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && hits[cursor]) go(hits[cursor]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={onKeyDown}>
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close search" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search size={17} className="text-muted" aria-hidden />
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Search commands, errors, services…"
            className="h-12 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
            aria-label="Search query"
            spellCheck={false}
          />
          <kbd className="rounded border border-border bg-surface px-1.5 text-[0.7rem] text-muted">esc</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {error && <p className="p-4 text-sm text-muted">Search index failed to load. Reload the page and try again.</p>}
          {!error && !docs && <p className="p-4 text-sm text-muted">Loading…</p>}
          {docs && !query && <p className="p-4 text-sm text-muted">Try “security group”, “AccessDenied”, “CORS”, “appspec” or “buildspec”.</p>}
          {docs && query && !hits.length && <p className="p-4 text-sm text-muted">No results for “{query}”.</p>}
          <ul role="listbox">
            {hits.map((h, i) => (
              <li key={h.doc.id} role="option" aria-selected={i === cursor}>
                <button
                  type="button"
                  onClick={() => go(h)}
                  onMouseMove={() => setCursor(i)}
                  className={clsx("block w-full rounded-lg px-3 py-2.5 text-left", i === cursor ? "bg-accent-soft" : "hover:bg-surface")}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-sm font-medium">
                      {h.doc.title}
                      {h.heading && <span className="font-normal text-muted"> › {h.heading.title}</span>}
                    </span>
                    {i === cursor && <CornerDownLeft size={14} className="shrink-0 text-muted" aria-hidden />}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">{h.doc.guideTitle}</span>
                  <span className="mt-1 line-clamp-2 block text-xs text-muted">{h.snippet}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
