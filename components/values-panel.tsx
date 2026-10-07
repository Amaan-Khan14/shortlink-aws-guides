"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VARIABLES } from "@/lib/variables";
import { useValues } from "./values-provider";

export function ValuesButton() {
  const [open, setOpen] = useState(false);
  const { raw, resolved } = useValues();
  const filled = VARIABLES.filter((v) => (raw[v.key] ?? "").trim()).length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-sm text-muted hover:text-text"
        aria-label="Open my values"
        title="Fill in your account ID, Region and other values once. Every command on the site updates."
      >
        <SlidersHorizontal size={16} aria-hidden />
        <span className="hidden sm:inline">My values</span>
        {filled > 0 && (
          <span className="rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-fg" aria-label={`${filled} filled`}>
            {filled}
          </span>
        )}
      </button>
      {open && <ValuesDialog onClose={() => setOpen(false)} resolvedWebUrl={resolved.WEB_URL} resolvedApiUrl={resolved.API_URL} />}
    </>
  );
}

function ValuesDialog({ onClose, resolvedWebUrl, resolvedApiUrl }: { onClose: () => void; resolvedWebUrl?: string; resolvedApiUrl?: string }) {
  const { raw, resolved, setValue, reset } = useValues();
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="values-title">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-[26rem] max-w-full flex-col border-l border-border bg-bg shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 id="values-title" className="text-lg font-semibold">
              My values
            </h2>
            <p className="mt-1 text-sm text-muted">
              Fill these in once. Every command and policy on the site switches from <span className="ph">&lt;PLACEHOLDER&gt;</span> to your real value, and the Copy buttons copy it.
            </p>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-surface" aria-label="Close">
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <p className="rounded-md border border-[var(--warn)] bg-[var(--warn-soft)] p-2.5 text-xs text-[var(--warn)]">
            Saved only in this browser. Never enter passwords, access keys or tokens here. The database password stays a placeholder on purpose.
          </p>
          {VARIABLES.map((v, i) => (
            <div key={v.key}>
              <label htmlFor={`val-${v.key}`} className="block text-sm font-medium">
                {v.label}
              </label>
              <input
                id={`val-${v.key}`}
                ref={i === 0 ? first : undefined}
                value={raw[v.key] ?? ""}
                onChange={(e) => setValue(v.key, e.target.value)}
                placeholder={v.key === "WEB_BUCKET" && resolved.SUGGESTED_WEB_BUCKET ? resolved.SUGGESTED_WEB_BUCKET : (v.fallback ?? v.example)}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                className="mt-1 w-full rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-sm placeholder:text-muted/60"
              />
              <p className="mt-1 text-xs text-muted">{v.hint}</p>
            </div>
          ))}
          <div className="rounded-md border border-border bg-surface p-3 text-xs text-muted">
            <p className="font-medium text-text">Worked out for you</p>
            <p className="mt-1 break-all">API URL: <code>{resolvedApiUrl ?? "—"}</code></p>
            <p className="mt-1 break-all">Website URL: <code>{resolvedWebUrl ?? "—"}</code></p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border p-3">
          <button type="button" onClick={reset} className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface hover:text-text">
            Clear all
          </button>
          <button type="button" onClick={onClose} className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
