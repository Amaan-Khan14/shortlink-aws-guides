import { AwsIcon, type IconKind } from "./aws-icons";
import { Arrow, Figure } from "./primitives";

const M = "dg-arrow-aws";

function Box({ x, y, w, h, className, label, lx, ly }: { x: number; y: number; w: number; h: number; className: string; label?: string; lx?: number; ly?: number }) {
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={h} rx={10} />
      {label && (
        <text x={lx ?? x + 12} y={ly ?? y + 20} className="dg-zone-label">
          {label}
        </text>
      )}
    </g>
  );
}

/** An icon with a name and a small description. `align` places the text under or to the right of the icon. */
function Service({ kind, cx, cy, title, sub, side }: { kind: IconKind; cx: number; cy: number; title: string; sub?: string; side?: "right" | "left" }) {
  const under = !side;
  const tx = side === "right" ? cx + 34 : side === "left" ? cx - 34 : cx;
  const anchor = side === "right" ? "start" : side === "left" ? "end" : "middle";
  const ty = under ? cy + 42 : cy - 2;
  return (
    <g>
      <AwsIcon kind={kind} cx={cx} cy={cy} />
      <text x={tx} y={ty} textAnchor={anchor} className="dg-title dg-lg">
        {title}
      </text>
      {sub && (
        <text x={tx} y={ty + 19} textAnchor={anchor} className="dg-sub dg-lg">
          {sub}
        </text>
      )}
    </g>
  );
}

function SecurityGroup({ x, y, w, h, name }: { x: number; y: number; w: number; h: number; name: string }) {
  return (
    <g className="dg-sg">
      <rect x={x} y={y} width={w} height={h} rx={9} />
      <text x={x + w / 2} y={y + h - 8} textAnchor="middle">
        {name}
      </text>
    </g>
  );
}

export function AwsArchitectureDiagram() {
  return (
    <Figure
      title="ShortLink on AWS: resources, subnets and security groups"
      viewBox="0 0 1080 730"
      markerId={M}
      className="dg-wide"
      caption="Two Availability Zones, each with a public and a private subnet. The load balancer is the only public entry point. The API server and the database sit in private subnets behind security groups that only allow the previous tier."
    >
      {/* Boundaries */}
      <Box x={112} y={10} w={958} h={712} className="dg-cloud" label="AWS Cloud · one Region" lx={128} ly={34} />
      <Box x={270} y={130} w={785} h={575} className="dg-vpc" label="VPC · shortlink-vpc · 10.0.0.0/16" lx={286} ly={152} />
      <Box x={295} y={168} w={350} h={500} className="dg-az" label="Availability Zone a" lx={309} ly={188} />
      <Box x={680} y={168} w={350} h={500} className="dg-az" label="Availability Zone b" lx={694} ly={188} />
      <Box x={310} y={200} w={320} h={172} className="dg-public" label="Public subnet · 10.0.1.0/24" lx={324} ly={360} />
      <Box x={695} y={200} w={320} h={172} className="dg-public" label="Public subnet · 10.0.2.0/24" lx={709} ly={360} />
      <Box x={310} y={402} w={320} h={248} className="dg-private" label="Private subnet · 10.0.11.0/24" lx={324} ly={640} />
      <Box x={695} y={402} w={320} h={248} className="dg-private" label="Private subnet · 10.0.12.0/24" lx={709} ly={640} />

      {/* Flows (drawn first so icons sit on top) */}
      <Arrow markerId={M} d="M60 366 L60 80 L636 80" label="1  open the website (HTTP)" lx={76} ly={70} anchor="start" />
      <Arrow markerId={M} d="M84 400 L270 400 L270 287" label="2  API calls (HTTP :80)" lx={96} ly={392} anchor="start" />
      <Arrow markerId={M} d="M270 231 L270 218 L662 218 L662 233" />
      <Arrow markerId={M} d="M640 352 L640 412 L500 412 L500 466" label="3  :3000" lx={575} ly={404} />
      <Arrow markerId={M} d="M565 530 L772 530" label="4  :5432" lx={668} ly={521} />
      <Arrow markerId={M} dashed d="M420 466 L420 290" label="apt / npm" lx={412} ly={420} anchor="end" />
      <Arrow markerId={M} dashed d="M396 259 L298 259" />
      <Arrow markerId={M} dashed d="M470 590 L470 695 L634 695" label="CI/CD artifacts" lx={484} ly={687} anchor="start" />
      <Arrow markerId={M} dashed d="M222 566 L384 548" label="shell, no SSH" lx={300} ly={548} />

      {/* Security group outlines */}
      <SecurityGroup x={577} y={224} w={170} h={124} name="shortlink-alb-sg" />
      <SecurityGroup x={385} y={466} w={170} h={126} name="shortlink-api-sg" />
      <SecurityGroup x={770} y={466} w={170} h={126} name="shortlink-db-sg" />

      {/* Services */}
      <Service kind="users" cx={60} cy={400} title="Users" sub="browser" />
      <Service kind="s3" cx={670} cy={80} title="S3 static website" sub="React app · public read" side="right" />
      <Service kind="igw" cx={270} cy={259} title="Internet" sub="gateway" side="left" />
      <Service kind="elb" cx={662} cy={259} title="Load balancer" sub="HTTP :80" />
      <Service kind="nat" cx={420} cy={259} title="NAT gateway" sub="outbound only" side="right" />
      <Service kind="ec2" cx={470} cy={496} title="EC2 · Node.js API" sub="t3.micro · no public IP" />
      <Service kind="rds" cx={855} cy={496} title="RDS PostgreSQL" sub="private · TLS required" />
      <Service kind="endpoint" cx={662} cy={695} title="S3 gateway endpoint" sub="private path to S3" side="right" />
      <Service kind="ssm" cx={196} cy={580} title="Systems Manager" sub="Session Manager" />

      {/* Legend */}
      <g className="dg-legend">
        <rect x="14" y="560" width="14" height="14" rx="3" className="dg-public-key" />
        <text x="36" y="572">Public subnet</text>
        <rect x="14" y="588" width="14" height="14" rx="3" className="dg-private-key" />
        <text x="36" y="600">Private subnet</text>
        <rect x="14" y="616" width="14" height="14" rx="3" className="dg-sg-key" />
        <text x="36" y="628">Security group</text>
      </g>
    </Figure>
  );
}
