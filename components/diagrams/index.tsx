import { ArchitectureTabs } from "./architecture-tabs";
import { PipelineDiagram } from "./pipeline";

const DIAGRAMS = {
  architecture: () => <ArchitectureTabs />,
  "pipeline-api": () => <PipelineDiagram variant="api" />,
  "pipeline-web": () => <PipelineDiagram variant="web" />,
  "pipeline-full": () => <PipelineDiagram variant="full" />,
} as const;

export function Diagram({ name }: { name: keyof typeof DIAGRAMS }) {
  const render = DIAGRAMS[name];
  return render ? render() : null;
}
