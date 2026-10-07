import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { GUIDES } from "@/lib/guides";

export default function Home() {
  return (
    <SiteShell>
      <main id="content" className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight">ShortLink on AWS</h1>
        <ul className="mt-8 space-y-3">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}/`} className="font-medium text-accent underline">
                Guide {g.number}: {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </SiteShell>
  );
}
