import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

type Item = { title: string; href: string } | null;

export function Pager({ prev, next, nextGuide }: { prev: Item; next: Item; nextGuide: Item }) {
  const forward = next ?? nextGuide;
  return (
    <nav aria-label="Previous and next chapter" className="mt-12 grid gap-3 sm:grid-cols-2 print:hidden">
      {prev ? (
        <Link href={prev.href} className="group rounded-lg border border-border p-4 hover:border-accent hover:bg-surface">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <ArrowLeft size={13} aria-hidden /> Previous
          </span>
          <span className="mt-1 block font-medium group-hover:text-accent">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {forward && (
        <Link href={forward.href} className="group rounded-lg border border-border p-4 text-right hover:border-accent hover:bg-surface sm:col-start-2">
          <span className="flex items-center justify-end gap-1.5 text-xs text-muted">
            {next ? "Next" : "Next guide"} <ArrowRight size={13} aria-hidden />
          </span>
          <span className="mt-1 block font-medium group-hover:text-accent">{forward.title}</span>
        </Link>
      )}
    </nav>
  );
}
