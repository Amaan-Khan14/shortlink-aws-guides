export type GuideMeta = {
  slug: string;
  number: number;
  title: string;
  short: string;
  summary: string;
  audience: string;
  duration: string;
  level: string;
  /** Guides the reader should finish first. */
  requires: string[];
};

export const GUIDES: GuideMeta[] = [
  {
    slug: "deployment",
    number: 1,
    title: "Complete deployment guide",
    short: "Provision everything",
    summary:
      "Provision the whole stack by hand in the AWS console: VPC, security groups, private RDS PostgreSQL, a private EC2 API behind an Application Load Balancer, and a public S3 website for the React frontend.",
    audience: "Everyone. Start here.",
    duration: "2–3 hours",
    level: "Beginner friendly",
    requires: [],
  },
  {
    slug: "backend-cicd",
    number: 2,
    title: "Backend CI/CD on EC2",
    short: "API pipeline",
    summary:
      "Push to your fork and have the API tested, packaged and deployed to the private EC2 instance automatically with CodePipeline, CodeBuild and CodeDeploy.",
    audience: "After guide 1 (chapters 1–9).",
    duration: "60–90 minutes",
    level: "Intermediate",
    requires: ["deployment"],
  },
  {
    slug: "frontend-cicd",
    number: 3,
    title: "Frontend CI/CD to S3",
    short: "Website pipeline",
    summary:
      "Push to your fork and have the React app tested, built with the right API URL baked in, and synced to the S3 website bucket automatically.",
    audience: "After guide 1 (chapters 1–10).",
    duration: "45–60 minutes",
    level: "Intermediate",
    requires: ["deployment"],
  },
];

export function getGuideMeta(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const SITE = {
  name: "ShortLink on AWS",
  repo: "Amaan-Khan14/shortlink-aws-guides",
  appRepo: "Amaan-Khan14/shortlink",
  verified: "8 October 2026",
};
