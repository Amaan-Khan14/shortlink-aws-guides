import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";

/** Copies the text after the language of a code fence (```bash title="x") onto the <code> element. */
export function rehypeCodeMeta() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const meta = (node.data as { meta?: string } | undefined)?.meta;
      if (node.tagName === "code" && meta) {
        node.properties = { ...node.properties, "data-meta": meta };
      }
    });
  };
}
