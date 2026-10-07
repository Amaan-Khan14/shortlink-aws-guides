import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <main id="content" className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-semibold text-accent">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">That page does not exist</h1>
        <p className="mt-3 text-muted">The chapter may have been renamed. Try the search (press ⌘K or /), or start from the guides.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-fg hover:opacity-90">
          Back to the guides
        </Link>
      </main>
    </SiteShell>
  );
}
