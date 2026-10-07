import { Arrow, Figure, Node } from "./primitives";

type Variant = "api" | "web" | "full";

const COPY: Record<Variant, { title: string; caption: string }> = {
  api: {
    title: "Backend CI/CD pipeline",
    caption: "A push to main on your fork starts CodePipeline. CodeBuild tests and packages the API, CodeDeploy hands it to the agent on EC2, and the lifecycle hooks restart the service.",
  },
  web: {
    title: "Frontend CI/CD pipeline",
    caption: "A push to main on your fork starts CodePipeline. CodeBuild tests and builds the React app with your API URL baked in, then a second CodeBuild project syncs it to the S3 website bucket.",
  },
  full: {
    title: "Combined CI/CD pipeline",
    caption: "One pipeline can run both paths. The API and web builds run in parallel; the web deploy waits for the API deploy to succeed.",
  },
};

export function PipelineDiagram({ variant = "api" }: { variant?: Variant }) {
  const { title, caption } = COPY[variant];
  const single = variant !== "full";
  const h = single ? 230 : 330;
  const midY = single ? 60 : 130;

  return (
    <Figure title={title} caption={caption} viewBox={`0 0 960 ${h}`}>
      <Node x={10} y={midY} w={150} h={64} title="GitHub" sub="your fork · main" />
      <Arrow d={`M 160 ${midY + 32} L 205 ${midY + 32}`} label="push" lx={182} ly={midY + 22} />
      <Node x={205} y={midY} w={160} h={64} tone="accent" title="Source" sub="CodeConnections" />

      {single ? (
        <>
          <Arrow d={`M 365 ${midY + 32} L 410 ${midY + 32}`} />
          <Node x={410} y={midY} w={170} h={64} tone="accent" title="Build" sub={variant === "api" ? "CodeBuild · test + package" : "CodeBuild · test + vite build"} />
          <Arrow d={`M 580 ${midY + 32} L 625 ${midY + 32}`} label="artifact" lx={602} ly={midY + 22} />
          <Node x={625} y={midY} w={150} h={64} tone="accent" title="Deploy" sub={variant === "api" ? "CodeDeploy" : "CodeBuild · s3 sync"} />
          <Arrow d={`M 775 ${midY + 32} L 815 ${midY + 32}`} />
          <Node x={815} y={midY} w={135} h={64} tone="tip" title={variant === "api" ? "EC2 API" : "S3 website"} sub={variant === "api" ? "agent + hooks" : "public static files"} />
          <Node x={410} y={170} w={365} h={44} title="Private artifact bucket" sub="codepipeline-<region>-…" />
          <Arrow d={`M 495 ${midY + 64} L 495 170`} dashed />
          <Arrow d={`M 690 170 L 690 ${midY + 64}`} dashed />
        </>
      ) : (
        <>
          <Arrow d="M 365 162 L 392 162 L 392 82 L 410 82" />
          <Arrow d="M 365 162 L 392 162 L 392 242 L 410 242" />
          <Node x={410} y={50} w={170} h={64} tone="accent" title="API Build" sub="CodeBuild" />
          <Node x={410} y={210} w={170} h={64} tone="accent" title="Web Build" sub="CodeBuild" />
          <Arrow d="M 580 82 L 625 82" />
          <Arrow d="M 580 242 L 625 242" />
          <Node x={625} y={50} w={150} h={64} tone="accent" title="DeployAPI" sub="CodeDeploy" />
          <Node x={625} y={210} w={150} h={64} tone="accent" title="DeployWeb" sub="CodeBuild · s3 sync" />
          <Arrow d="M 700 114 L 700 210" dashed label="web waits" lx={708} ly={168} anchor="start" />
          <Arrow d="M 775 82 L 815 82" />
          <Arrow d="M 775 242 L 815 242" />
          <Node x={815} y={50} w={135} h={64} tone="tip" title="EC2 API" sub="agent + hooks" />
          <Node x={815} y={210} w={135} h={64} tone="tip" title="S3 website" sub="static files" />
        </>
      )}
    </Figure>
  );
}
