"use client";

import { useValues } from "../values-provider";

/** Inline placeholder for prose and tables: <Var name="AWS_REGION" /> */
export function Var({ name }: { name: string }) {
  const { resolved } = useValues();
  const value = resolved[name];
  return (
    <code className={value ? "ph ph-filled ph-inline" : "ph ph-inline"}>{value ?? `<${name}>`}</code>
  );
}
