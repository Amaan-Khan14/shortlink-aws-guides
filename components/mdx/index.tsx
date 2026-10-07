import type { ComponentPropsWithoutRef } from "react";

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

export const mdxComponents = {
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  table: Table,
  a: Anchor,
};
