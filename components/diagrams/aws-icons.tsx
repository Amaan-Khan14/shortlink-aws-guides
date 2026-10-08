/**
 * Simple AWS-style service icons: a rounded square in the AWS category colour with a white glyph.
 * They are drawn for this site and follow the look of the AWS architecture icons; they are not the
 * official icon files. Colours: compute orange, storage green, database magenta, networking purple,
 * management pink-red, and a neutral grey for end users.
 */
export type IconKind = "users" | "s3" | "elb" | "ec2" | "rds" | "nat" | "igw" | "endpoint" | "ssm";

const COLORS: Record<IconKind, string> = {
  users: "#5f6b7a",
  s3: "#7aa116",
  elb: "#8c4fff",
  ec2: "#ed7100",
  rds: "#c925d1",
  nat: "#8c4fff",
  igw: "#8c4fff",
  endpoint: "#8c4fff",
  ssm: "#e7157b",
};

function Glyph({ kind }: { kind: IconKind }) {
  switch (kind) {
    case "users":
      return (
        <>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </>
      );
    case "s3":
      return (
        <>
          <ellipse cx="12" cy="7" rx="7" ry="2.4" />
          <path d="M5 7.4 6.6 19a1.2 1.2 0 0 0 1.2 1h8.4a1.2 1.2 0 0 0 1.2-1L19 7.4" />
        </>
      );
    case "elb":
      return (
        <>
          <circle cx="12" cy="12" r="2.6" />
          <circle cx="5" cy="5.5" r="1.8" />
          <circle cx="5" cy="18.5" r="1.8" />
          <circle cx="19.5" cy="12" r="1.8" />
          <path d="M10 10.2 6.4 6.8M10 13.8l-3.6 3.4M14.6 12h3.1" />
        </>
      );
    case "ec2":
      return (
        <>
          <rect x="6.5" y="6.5" width="11" height="11" rx="1.6" />
          <rect x="10" y="10" width="4" height="4" />
          <path d="M9.5 3.8v2.7M14.5 3.8v2.7M9.5 17.5v2.7M14.5 17.5v2.7M3.8 9.5h2.7M3.8 14.5h2.7M17.5 9.5h2.7M17.5 14.5h2.7" />
        </>
      );
    case "rds":
      return (
        <>
          <ellipse cx="12" cy="6" rx="7" ry="2.6" />
          <path d="M5 6v12c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6V6M5 12c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6" />
        </>
      );
    case "nat":
      return (
        <>
          <path d="M5.5 20.5V11a6.5 6.5 0 0 1 13 0v9.5" />
          <path d="M12 18v-6.5M9.2 14.2 12 11.4l2.8 2.8" />
        </>
      );
    case "igw":
      return (
        <>
          <path d="M5.5 20.5V11a6.5 6.5 0 0 1 13 0v9.5" />
          <path d="M8.5 15.5h7M13 13l2.5 2.5L13 18" />
        </>
      );
    case "endpoint":
      return (
        <>
          <circle cx="15" cy="12" r="3.6" />
          <path d="M3.5 12h7.9M9 9.5l2.5 2.5L9 14.5" />
        </>
      );
    case "ssm":
      return (
        <>
          <rect x="3.5" y="5" width="17" height="14" rx="2" />
          <path d="m7.5 9.5 3 2.5-3 2.5M12.5 15h4" />
        </>
      );
  }
}

/** 48x48 icon centred on (cx, cy). */
export function AwsIcon({ kind, cx, cy }: { kind: IconKind; cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx - 24} ${cy - 24})`}>
      <rect width="48" height="48" rx="7" fill={COLORS[kind]} />
      <g
        transform="translate(6 6) scale(1.5)"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Glyph kind={kind} />
      </g>
    </g>
  );
}
