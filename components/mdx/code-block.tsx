"use client";

import clsx from "clsx";
import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { SENTINEL_RE, escapeHtml } from "@/lib/variables";
import { useValues } from "../values-provider";

export type CodeEnv = "laptop" | "ec2" | "console" | "output" | "file";

const ENV_LABEL: Record<CodeEnv, string> = {
  laptop: "Your computer",
  ec2: "On the EC2 instance",
  console: "Paste in the AWS console",
  output: "Expected output",
  file: "File",
};

type Props = {
  html: string;
  code: string;
  lang: string;
  title?: string;
  env?: CodeEnv;
};

export function CodeBlock({ html, code, lang, title, env }: Props) {
  const { resolved } = useValues();
  const [copied, setCopied] = useState(false);

  const { shownHtml, copyText, missing } = useMemo(() => {
    const names = new Set<string>();
    const shownHtml = html.replace(SENTINEL_RE, (_m, name: string) => {
      const value = resolved[name];
      if (value) return `<span class="ph ph-filled">${escapeHtml(value)}</span>`;
      names.add(name);
      return `<span class="ph">&lt;${name}&gt;</span>`;
    });
    const copyText = code.replace(SENTINEL_RE, (_m, name: string) => resolved[name] ?? `<${name}>`);
    return { shownHtml, copyText, missing: [...names] };
  }, [html, code, resolved]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = copyText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const label = env ? ENV_LABEL[env] : undefined;
  const showCopy = env !== "output";

  return (
    <figure className={clsx("codeblock", env === "output" && "codeblock-output")}>
      {(label || title || showCopy) && (
        <figcaption className="codeblock-bar">
          <span className="flex min-w-0 items-center gap-2">
            {label && <span className={clsx("codeblock-badge", `codeblock-badge-${env}`)}>{label}</span>}
            {title && <span className="truncate font-mono text-xs text-muted">{title}</span>}
            {!label && !title && <span className="text-xs uppercase tracking-wide text-muted">{lang}</span>}
          </span>
          {showCopy && (
            <button
              type="button"
              onClick={copy}
              className="codeblock-copy"
              aria-label={copied ? "Copied" : "Copy code"}
              title={missing.length ? `Contains unfilled values: ${missing.join(", ")}` : "Copy"}
            >
              {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          )}
        </figcaption>
      )}
      <div className="codeblock-body" dangerouslySetInnerHTML={{ __html: shownHtml }} />
      {missing.length > 0 && showCopy && (
        <p className="codeblock-note">
          Replace <code>{missing.map((m) => `<${m}>`).join(" ")}</code>, or fill it in once under <strong>My values</strong> at the top of the page.
        </p>
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </figure>
  );
}
