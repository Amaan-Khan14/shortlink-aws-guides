import { ArchitectureDiagram } from "./architecture";
import { PipelineDiagram } from "./pipeline";

const DIAGRAMS = {
  architecture: () => <ArchitectureDiagram />,
  "pipeline-api": () => <PipelineDiagram variant="api" />,
  "pipeline-web": () => <PipelineDiagram variant="web" />,
  "pipeline-full": () => <PipelineDiagram variant="full" />,
} as const;

export function Diagram({ name }: { name: keyof typeof DIAGRAMS }) {
  const render = DIAGRAMS[name];
  return render ? render() : null;
}
