import { isValidElement, type ReactElement, type ReactNode } from "react";
import { highlight } from "@/lib/highlight";
import { protectPlaceholders } from "@/lib/variables";
import { CodeBlock, type CodeEnv } from "./code-block";

type CodeProps = { className?: string; children?: ReactNode; "data-meta"?: string };

const ENVS: CodeEnv[] = ["laptop", "ec2", "console", "output", "file"];

function textOf(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return "";
}

function parseMeta(meta = ""): { title?: string; env?: CodeEnv } {
  const title = /title="([^"]*)"/.exec(meta)?.[1];
  const envRaw = /env="([^"]*)"/.exec(meta)?.[1] as CodeEnv | undefined;
  const env = envRaw && ENVS.includes(envRaw) ? envRaw : title && !envRaw ? undefined : undefined;
  return { title, env };
}

export async function Pre({ children }: { children?: ReactNode }) {
  const child = (Array.isArray(children) ? children[0] : children) as ReactElement<CodeProps> | undefined;
  if (!child || !isValidElement(child)) return <pre>{children}</pre>;

  const props = child.props;
  const lang = /language-([\w-]+)/.exec(props.className ?? "")?.[1] ?? "text";
  const code = textOf(props.children).replace(/\n$/, "");
  const { title, env } = parseMeta(props["data-meta"]);
  const protectedCode = protectPlaceholders(code);
  const html = await highlight(protectedCode, lang);

  return <CodeBlock html={html} code={protectedCode} lang={lang} title={title} env={env} />;
}
