/**
 * "Your values": things every participant has to fill in once (their account ID,
 * the ALB hostname, …). Chapters write them as <NAME> inside code blocks, or
 * <Var name="NAME" /> in prose, and the site swaps in what the reader typed.
 * Values live only in the browser's localStorage. Never ask for secrets here.
 */
export type VariableDef = {
  key: string;
  label: string;
  hint: string;
  example: string;
  /** Prefilled value that the reader can change. */
  fallback?: string;
};

export const VARIABLES: VariableDef[] = [
  {
    key: "AWS_ACCOUNT_ID",
    label: "AWS account ID",
    hint: "12 digits. Click your name at the top right of the AWS console.",
    example: "123456789012",
  },
  {
    key: "AWS_REGION",
    label: "AWS Region",
    hint: "Use one Region for everything. The guides were verified in ap-south-1 (Mumbai).",
    example: "ap-south-1",
    fallback: "ap-south-1",
  },
  {
    key: "GITHUB_USER",
    label: "Your GitHub username",
    hint: "The account that owns your fork.",
    example: "your-username",
  },
  {
    key: "REPO_NAME",
    label: "Your fork's repository name",
    hint: "Keep the default unless you renamed the fork.",
    example: "shortlink",
    fallback: "shortlink",
  },
  {
    key: "WEB_BUCKET",
    label: "Website bucket name",
    hint: "S3 bucket names are global. Leave blank to use the suggested name built from your account ID.",
    example: "shortlink-web-123456789012-ap-south-1",
  },
  {
    key: "ALB_DNS",
    label: "Load balancer DNS name",
    hint: "From EC2 → Load balancers → shortlink-alb. No http:// and no trailing slash.",
    example: "shortlink-alb-1234567890.ap-south-1.elb.amazonaws.com",
  },
  {
    key: "RDS_ENDPOINT",
    label: "RDS endpoint",
    hint: "From RDS → Databases → shortlink-db → Connectivity & security.",
    example: "shortlink-db.abcdefghij.ap-south-1.rds.amazonaws.com",
  },
  {
    key: "INSTANCE_ID",
    label: "API instance ID",
    hint: "From EC2 → Instances. Starts with i-.",
    example: "i-0123456789abcdef0",
  },
  {
    key: "ARTIFACT_BUCKET",
    label: "Pipeline artifact bucket",
    hint: "Created by CodePipeline. Starts with codepipeline-. Needed in guide 2.",
    example: "codepipeline-ap-south-1-0123456789ab-…",
  },
  {
    key: "CONNECTION_ARN",
    label: "GitHub connection ARN",
    hint: "Developer Tools → Connections. Needed in guides 2 and 3.",
    example: "arn:aws:codeconnections:ap-south-1:123456789012:connection/…",
  },
];

/** Names that are computed from other values and cannot be typed in. */
export const DERIVED_KEYS = ["API_URL", "WEB_URL", "AZ_A", "AZ_B", "SUGGESTED_WEB_BUCKET"] as const;

export const ALL_KEYS: string[] = [...VARIABLES.map((v) => v.key), ...DERIVED_KEYS];

export type RawValues = Record<string, string>;
export type ResolvedValues = Record<string, string | undefined>;

// Regions that still use the older "s3-website-<region>" endpoint style.
const DASH_WEBSITE_REGIONS = new Set([
  "us-east-1",
  "us-west-1",
  "us-west-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "eu-west-1",
  "sa-east-1",
]);

export function resolveValues(raw: RawValues): ResolvedValues {
  const out: ResolvedValues = {};
  for (const v of VARIABLES) {
    const typed = raw[v.key]?.trim();
    out[v.key] = typed || v.fallback;
  }
  const region = out.AWS_REGION;
  const acct = out.AWS_ACCOUNT_ID;

  out.SUGGESTED_WEB_BUCKET = acct && region ? `shortlink-web-${acct}-${region}` : undefined;
  out.WEB_BUCKET = out.WEB_BUCKET || out.SUGGESTED_WEB_BUCKET;
  out.AZ_A = region ? `${region}a` : undefined;
  out.AZ_B = region ? `${region}b` : undefined;
  out.API_URL = out.ALB_DNS ? `http://${out.ALB_DNS}` : undefined;
  if (out.WEB_BUCKET && region) {
    const sep = DASH_WEBSITE_REGIONS.has(region) ? "-" : ".";
    out.WEB_URL = `http://${out.WEB_BUCKET}.s3-website${sep}${region}.amazonaws.com`;
  }
  return out;
}

/** Only allow characters that can appear in the values above. */
export function sanitizeValue(input: string): string {
  return input.replace(/[^A-Za-z0-9._:/@-]/g, "").slice(0, 200);
}

export const SENTINEL_RE = /ZZ_([A-Z0-9_]+)_ZZ/g;
export const toSentinel = (name: string) => `ZZ_${name}_ZZ`;

/** Swap <NAME> for a sentinel that survives syntax highlighting as one token. */
export function protectPlaceholders(code: string): string {
  return code.replace(/<([A-Z][A-Z0-9_]*)>/g, (m, name: string) => (ALL_KEYS.includes(name) ? toSentinel(name) : m));
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
