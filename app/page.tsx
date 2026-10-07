import { ArrowRight, Clipboard, GitFork, ListChecks, MoonStar, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { ArchitectureDiagram } from "@/components/diagrams/architecture";
import { Callout } from "@/components/mdx/callout";
import { getChapters } from "@/lib/content";
import { GUIDES, SITE } from "@/lib/guides";

const FEATURES = [
  { icon: Clipboard, title: "Copy-ready commands", text: "Every command and policy has a Copy button. Blocks say where to run them: your computer, the EC2 instance, or the AWS console." },
  { icon: SlidersHorizontal, title: "My values", text: "Enter your account ID, Region and endpoints once. Every command on the site fills itself in." },
  { icon: ListChecks, title: "Progress you keep", text: "Tick off steps and chapters. They are remembered in your browser, so you can come back after a break." },
  { icon: Search, title: "Instant search", text: "Press ⌘K or / to find a command, a service or an error message across all three guides." },
  { icon: MoonStar, title: "Light and dark", text: "Follows your system setting, or switch it yourself. Code, diagrams and callouts adapt." },
  { icon: GitFork, title: "Built for your fork", text: "Every step assumes your own fork and your own AWS account, never the instructor's." },
];

export default function Home() {
  return (
    <SiteShell>
      <main id="content" className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <section>
          <p className="text-sm font-semibold text-accent">DevOps with AWS workshop</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Deploy ShortLink on AWS, then ship it with CI/CD</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Three step-by-step guides take you from an empty AWS account to a running full-stack app with a private database, and then to a pipeline that deploys every push from your own GitHub fork.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/guides/deployment/start-here/" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-fg hover:opacity-90">
              Start guide 1 <ArrowRight size={16} aria-hidden />
            </Link>
            <a href={`https://github.com/${SITE.appRepo}/fork`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 font-medium hover:border-accent">
              <GitFork size={16} aria-hidden /> Fork the app repo
            </a>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="fork-first">
          <Callout type="problem" title="Fork the repo first. Do not use the original.">
            <p id="fork-first">
              Your pipeline has to read <strong>your</strong> repository and your buildspec has to write to <strong>your</strong> bucket. With the original <code>{SITE.appRepo}</code> you cannot authorize AWS to read it, you cannot push to trigger a build, and its frontend deploy file points at the instructor&apos;s S3 bucket in a different AWS account, so it fails with <code>AccessDenied</code>.{" "}
              <Link href="/guides/deployment/fork-the-repo/">Read the full explanation</Link>.
            </p>
          </Callout>
        </section>

        <section className="mt-12" aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="text-2xl font-semibold tracking-tight">
            The three guides
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {GUIDES.map((g) => {
              const chapters = getChapters(g.slug);
              return (
                <Link key={g.slug} href={`/guides/${g.slug}/`} className="group flex flex-col rounded-xl border border-border bg-surface p-5 hover:border-accent">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-sm font-bold text-accent">{g.number}</span>
                  <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-accent">{g.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{g.summary}</p>
                  <dl className="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted">
                    <div className="flex justify-between"><dt>Time</dt><dd className="font-medium text-text">{g.duration}</dd></div>
                    <div className="flex justify-between"><dt>Chapters</dt><dd className="font-medium text-text">{chapters.length}</dd></div>
                    <div className="flex justify-between"><dt>Level</dt><dd className="font-medium text-text">{g.level}</dd></div>
                  </dl>
                </Link>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted">
            Do them in order. Guides 2 and 3 are independent of each other: do either one, or both, once guide 1 is running.
          </p>
        </section>

        <section className="mt-14" aria-labelledby="what-heading">
          <h2 id="what-heading" className="text-2xl font-semibold tracking-tight">
            What you will build
          </h2>
          <p className="mt-2 max-w-2xl text-muted">A React frontend on S3, a Node.js API on a private EC2 instance behind a load balancer, and PostgreSQL on RDS, all inside your own VPC.</p>
          <div className="mt-4">
            <ArchitectureDiagram />
          </div>
        </section>

        <section className="mt-14" aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl font-semibold tracking-tight">
            Made to be followed, not just read
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title} className="rounded-xl border border-border p-4">
                <f.icon size={20} className="text-accent" aria-hidden />
                <h3 className="mt-2 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-14 text-sm text-muted">
          Verified against a live reference deployment on {SITE.verified}. AWS console screens change; where a label differs slightly, match it by meaning and check the field values in each table.
        </p>
      </main>
    </SiteShell>
  );
}
