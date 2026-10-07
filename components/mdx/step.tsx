"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import GithubSlugger from "github-slugger";
import { usePathname } from "next/navigation";
import { normalizePath, setDone } from "@/lib/progress";
import { useProgress } from "../use-progress";

/** Numbered step with a "done" checkbox that is remembered in this browser. */
export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = normalizePath(usePathname() ?? "");
  const id = new GithubSlugger().slug(title);
  const key = `${pathname}#${id}`;
  const done = useProgress().has(key);

  return (
    <section className={clsx("step", done && "step-done")} aria-labelledby={id}>
      <div className="step-rail" aria-hidden>
        <span className="step-num" />
      </div>
      <div className="step-main">
        <div className="step-head">
          <h3 id={id} className="step-title">
            {title}
            <a href={`#${id}`} className="heading-anchor" aria-label="Link to this step">
              #
            </a>
          </h3>
          <button
            type="button"
            onClick={() => setDone(key, !done)}
            aria-pressed={done}
            className={clsx("step-check", done && "step-check-on")}
            title={done ? "Mark as not done" : "Mark as done"}
          >
            <Check size={13} aria-hidden />
            <span>{done ? "Done" : "Mark done"}</span>
          </button>
        </div>
        <div className="step-body">{children}</div>
      </div>
    </section>
  );
}
