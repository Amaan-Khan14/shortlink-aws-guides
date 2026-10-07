import { isValidElement, type ComponentPropsWithoutRef } from "react";
import { Callout } from "./callout";
import { Details, Result, Ui } from "./misc";
import { Pre } from "./pre";
import { Step } from "./step";
import { Tab, Tabs } from "./tabs";
import { TaskItem } from "./task-item";
import { Var } from "./var";

function heading(Tag: "h2" | "h3" | "h4") {
  return function Heading({ id, children, ...rest }: ComponentPropsWithoutRef<"h2">) {
    return (
      <Tag id={id} {...rest}>
        {children}
        {id && (
          <a href={`#${id}`} className="heading-anchor" aria-label="Link to this section">
            #
          </a>
        )}
      </Tag>
    );
  };
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  );
}

function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})} {...rest}>
      {children}
    </a>
  );
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: React.ReactNode }).children);
  return "";
}

function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** GFM task-list items become real, persistent checkboxes. */
function ListItem({ className, children, ...rest }: ComponentPropsWithoutRef<"li">) {
  if (className?.includes("task-list-item")) {
    const parts = Array.isArray(children) ? children : [children];
    const body = parts.filter((c) => !(isValidElement(c) && (c.props as { type?: string }).type === "checkbox"));
    return <TaskItem id={hash(textOf(body))}>{body}</TaskItem>;
  }
  return (
    <li className={className} {...rest}>
      {children}
    </li>
  );
}

export const mdxComponents = {
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  table: Table,
  a: Anchor,
  li: ListItem,
  pre: Pre,
  Var,
  Callout,
  Step,
  Tabs,
  Tab,
  Ui,
  Details,
  Result,
};
