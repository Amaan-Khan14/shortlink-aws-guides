import { Tab, Tabs } from "../mdx/tabs";
import { ArchitectureDiagram } from "./architecture";
import { AwsArchitectureDiagram } from "./aws-architecture";

/** One architecture, two views: the request flow, and the AWS resource layout with service icons. */
export function ArchitectureTabs() {
  return (
    <Tabs>
      <Tab label="Request flow">
        <ArchitectureDiagram />
      </Tab>
      <Tab label="AWS architecture">
        <AwsArchitectureDiagram />
      </Tab>
    </Tabs>
  );
}
