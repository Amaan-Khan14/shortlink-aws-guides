# ShortLink on AWS: workshop guides

Step-by-step guides for the **DevOps with AWS** workshop. They take a participant from an empty AWS account to the [ShortLink](https://github.com/Amaan-Khan14/shortlink) app running on AWS, and then to CI/CD pipelines that deploy every push from **their own fork**.

| Guide | What it covers |
|---|---|
| 1. Complete deployment | VPC, security groups, private RDS PostgreSQL, a private EC2 API behind an Application Load Balancer, and a public S3 website. Every console step, with verification and clean-up |
| 2. Backend CI/CD on EC2 | GitHub → CodePipeline → CodeBuild → CodeDeploy → the EC2 instance, with rollback and operations |
| 3. Frontend CI/CD to S3 | GitHub → CodePipeline → CodeBuild (build) → CodeBuild (sync to S3), including the bucket edit every fork needs |

The guides insist on **forking the app repository** and explain what breaks if you use the original (no way to authorize the GitHub connection, no way to push, and a deploy file that writes to the instructor's bucket).

## Features

- Light and dark themes (follows the system, with a manual toggle)
- Copy button on every command, with a badge saying **where** to run it (your computer, the EC2 instance, or the AWS console)
- **My values**: enter your account ID, Region, GitHub user, endpoints once and every command on the site fills itself in (stored only in the browser)
- Numbered steps with a persistent "done" checkbox, chapter progress and completion ticks
- Full-text search (⌘K or `/`), table of contents with scroll-spy, previous/next navigation
- Theme-aware architecture and pipeline diagrams (inline SVG)
- "You should see" result boxes, collapsible troubleshooting, callouts for notes, warnings and the fork problem
- Print-friendly, keyboard accessible, works on phones

## Run it locally

Requires Node.js 20.9 or newer (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # checks content, then writes the static site to ./out
npm run lint
npm run typecheck
```

`npm run build` first runs `scripts/check-content.mjs`, which fails on malformed front matter, unbalanced code fences or `<Step>` tags, duplicate heading ids in a chapter, and broken internal chapter links.

## Writing content

Chapters are MDX files in `content/<guide>/NN-slug.mdx`. The number sets the order and the file name sets the URL.

```mdx
---
title: Create the database
description: One sentence shown under the title and in search.
minutes: 25
---

<Step title="Create the subnet group">
Open <Ui>RDS → Subnet groups → Create DB subnet group</Ui>.

```bash title="Check it" env="laptop"
aws rds describe-db-subnet-groups --region <AWS_REGION>
```

<Result>One group named `shortlink-db-subnets`.</Result>
</Step>
```

| Component | Use |
|---|---|
| `<Step title="…">` | A numbered step with a "done" checkbox. Titles must be unique in a chapter |
| `<Callout type="note\|tip\|warning\|danger\|problem" title="…">` | Boxed notes. `problem` is for the fork warning |
| `<Result>` | What the reader should see after an action |
| `<Ui>A → B → C</Ui>` | A console navigation path |
| `<Details title="…">` | Collapsible help |
| `<Tabs><Tab label="…">` | Alternatives such as macOS/Linux vs Windows |
| `<Diagram name="architecture\|pipeline-api\|pipeline-web\|pipeline-full" />` | Built-in SVG diagrams |
| `<Var name="AWS_REGION" />` | An inline value from **My values** |
| `- [ ] item` | A checkbox the reader can tick |

Code fences take two optional attributes: `title="…"` and `env="laptop|ec2|console|output|file"`. Write placeholders as `<NAME>` in code. Names listed in `lib/variables.ts` are filled from **My values**; any other uppercase `<NAME>` is highlighted as "replace me".

Do not write `<NAME>` or `{curly braces}` in plain prose: MDX reads them as JSX. Put them in backticks or a code block.

## Deploying this site

It is a static export (`output: "export"`), so any static host works. Build with `npm run build` and publish `out/`.

- **S3 website or any web server:** upload `out/`.
- **GitHub Pages under a sub-path:** build with `NEXT_PUBLIC_BASE_PATH=/shortlink-aws-guides npm run build`.
- **Vercel or Netlify:** import the repository; no configuration is needed.

## Accuracy

The infrastructure settings, names, IAM policies and pipeline structure were checked against a live reference deployment with read-only AWS queries on 8 October 2026. The console click-paths describe the AWS console as of then; labels drift, so each step also lists the field values to match. If a screen has changed, open an issue or a pull request against the relevant chapter.

## Licence and credits

Workshop material. The ShortLink application itself lives in [Amaan-Khan14/shortlink](https://github.com/Amaan-Khan14/shortlink).
