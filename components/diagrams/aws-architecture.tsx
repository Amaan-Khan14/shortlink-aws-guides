import { AwsIcon, type IconKind } from "./aws-icons";
import { Arrow, Figure } from "./primitives";

const M = "dg-arrow-aws";

function Zone({ x, y, w, h, className, label }: { x: number; y: number; w: number; h: number; className: string; label: string }) {
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={h} rx={12} />
      <text x={x + 16} y={y + 24} className="dg-zone-label dg-lg">
        {label}
      </text>
    </g>
  );
}

/** An icon with its name and one short line of description underneath. */
function Service({ kind, cx, cy, title, sub }: { kind: IconKind; cx: number; cy: number; title: string; sub?: string }) {
  return (
    <g>
      <AwsIcon kind={kind} cx={cx} cy={cy} />
      <text x={cx} y={cy + 44} textAnchor="middle" className="dg-title dg-lg">
        {title}
      </text>
      {sub && (
        <text x={cx} y={cy + 64} textAnchor="middle" className="dg-sub dg-lg">
          {sub}
        </text>
      )}
    </g>
  );
}

/** Red dashed outline with the security group name at the bottom. */
function SecurityGroup({ cx, top, name }: { cx: number; top: number; name: string }) {
  return (
    <g className="dg-sg">
      <rect x={cx - 95} y={top} width={190} height={138} rx={10} />
      <text x={cx} y={top + 128} textAnchor="middle">
        {name}
      </text>
    </g>
  );
}

export function AwsArchitectureDiagram() {
  return (
    <Figure
      title="ShortLink on AWS: resources, subnets and security groups"
      viewBox="-20 0 1040 640"
      markerId={M}
      className="dg-wide"
      caption="Only the load balancer faces the internet. The API server and the database live in private subnets, and each security group (red dashed) accepts traffic only from the tier in front of it."
    >
      {/* Network boundaries */}
      <Zone x={230} y={110} w={770} h={510} className="dg-vpc" label="VPC · 10.0.0.0/16 · two Availability Zones" />
      <Zone x={255} y={150} w={720} h={210} className="dg-public" label="Public subnets" />
      <Zone x={255} y={385} w={720} h={235} className="dg-private" label="Private subnets" />

      {/* Request path */}
      <Arrow markerId={M} d="M80 216 L80 60 L488 60" label="1  website files (HTTP)" lx={100} ly={50} anchor="start" />
      <Arrow markerId={M} d="M104 240 L206 240" label="2  HTTP :80" lx={155} ly={230} />
      <Arrow markerId={M} d="M254 240 L376 240" />
      <Arrow markerId={M} d="M400 342 L400 422" label="3  :3000" lx={386} ly={388} anchor="end" />
      <Arrow markerId={M} d="M495 466 L555 466" label="4  :5432" lx={525} ly={456} />

      {/* Supporting paths (dashed) */}
      <Arrow markerId={M} dashed d="M455 422 L455 372 L650 372 L650 314" label="installs and updates" lx={662} ly={350} anchor="start" />
      <Arrow markerId={M} dashed d="M104 466 L305 466" label="shell, no SSH" lx={180} ly={456} />

      {/* Security groups */}
      <SecurityGroup cx={400} top={200} name="shortlink-alb-sg" />
      <SecurityGroup cx={400} top={426} name="shortlink-api-sg" />
      <SecurityGroup cx={650} top={426} name="shortlink-db-sg" />

      {/* Services */}
      <Service kind="users" cx={80} cy={240} title="Users" sub="browser" />
      <Service kind="s3" cx={520} cy={60} title="S3 static website" sub="React app" />
      <Service kind="igw" cx={230} cy={240} title="Internet" sub="gateway" />
      <Service kind="elb" cx={400} cy={240} title="Load balancer" sub="HTTP :80" />
      <Service kind="nat" cx={650} cy={240} title="NAT gateway" sub="outbound only" />
      <Service kind="ec2" cx={400} cy={466} title="EC2 API" sub="Node.js · no public IP" />
      <Service kind="rds" cx={650} cy={466} title="RDS PostgreSQL" sub="private · TLS" />
      <Service kind="endpoint" cx={870} cy={466} title="S3 endpoint" sub="private path to S3" />
      <Service kind="ssm" cx={80} cy={466} title="Systems Manager" sub="Session Manager" />

      {/* Legend */}
      <g className="dg-legend dg-lg">
        <rect x="-10" y="560" width="14" height="14" rx="3" className="dg-public-key" />
        <text x="12" y="572">Public subnet</text>
        <rect x="-10" y="584" width="14" height="14" rx="3" className="dg-private-key" />
        <text x="12" y="596">Private subnet</text>
        <rect x="-10" y="608" width="14" height="14" rx="3" className="dg-sg-key" />
        <text x="12" y="620">Security group</text>
      </g>
    </Figure>
  );
}
