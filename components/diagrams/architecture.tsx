import { Arrow, Figure, Node, Zone } from "./primitives";

export function ArchitectureDiagram() {
  return (
    <Figure
      title="ShortLink architecture on AWS"
      viewBox="0 0 960 520"
      caption="Browsers load the static site from S3 and call the API through the public load balancer. The API server and database live in private subnets with no public IP."
    >
      <Node x={14} y={218} w={120} h={58} title="Browser" sub="your users" />

      <Node x={372} y={14} w={230} h={58} tone="accent" title="S3 static website" sub="React app · HTTP" />
      <Arrow d="M 74 218 L 74 43 L 372 43" label="1  open the site" lx={90} ly={34} anchor="start" />

      <Zone x={196} y={104} w={750} h={398} label="VPC 10.0.0.0/16" tone="accent" />
      <Node x={170} y={225} w={52} h={30} title="IGW" />
      <Arrow d="M 134 247 L 170 247" />
      <Arrow d="M 222 240 L 262 218" />
      <text x={150} y={274} className="dg-label" textAnchor="middle">
        2  API calls
      </text>

      <Zone x={214} y={134} w={714} h={142} label="Public subnets · 10.0.1.0/24 and 10.0.2.0/24" />
      <Node x={262} y={180} w={220} h={62} tone="accent" title="Application Load Balancer" sub="HTTP :80" />
      <Node x={668} y={180} w={200} h={62} title="NAT gateway" sub="outbound internet only" />

      <Zone x={214} y={302} w={714} h={186} label="Private subnets · 10.0.11.0/24 and 10.0.12.0/24" />
      <Node x={262} y={346} w={220} h={70} tone="tip" title="EC2 · Node.js API" sub="port 3000 · no public IP" />
      <Node x={540} y={346} w={190} h={70} tone="warn" title="RDS PostgreSQL" sub="port 5432 · not public" />
      <Node x={768} y={346} w={140} h={70} title="S3 gateway" sub="endpoint" />

      <Arrow d="M 372 242 L 372 346" label="3  forward :3000" lx={362} ly={298} anchor="end" />
      <Arrow d="M 482 381 L 540 381" label="4" lx={511} ly={372} />
      <Arrow d="M 432 346 L 432 289 L 768 289 L 768 242" dashed label="apt / npm / SSM (outbound)" lx={600} ly={282} />
      <Arrow d="M 330 416 L 330 452 L 838 452 L 838 416" dashed label="CI/CD artifacts via S3 endpoint" lx={584} ly={446} />
    </Figure>
  );
}
