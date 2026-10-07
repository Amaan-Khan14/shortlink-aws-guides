"use client";

import { Fragment } from "react";
import { ALL_KEYS } from "@/lib/variables";
import { useValues } from "../values-provider";

const TOKEN = /<([A-Z][A-Z0-9_]*)>/g;

/** Inline `code` that contains <PLACEHOLDER> names the reader can fill in. */
export function PlaceholderCode({ text }: { text: string }) {
  const { resolved } = useValues();
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const name = m[1];
    if (!ALL_KEYS.includes(name)) continue;
    if (m.index > last) parts.push(text.slice(last, m.index));
    const value = resolved[name];
    parts.push(
      <span key={`${name}-${m.index}`} className={value ? "ph ph-filled" : "ph"}>
        {value ?? `<${name}>`}
      </span>,
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return (
    <code>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </code>
  );
}
