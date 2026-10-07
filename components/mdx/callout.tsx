import clsx from "clsx";
import { AlertTriangle, Info, Lightbulb, OctagonAlert, ShieldAlert } from "lucide-react";

const KINDS = {
  note: { label: "Note", icon: Info },
  tip: { label: "Tip", icon: Lightbulb },
  warning: { label: "Warning", icon: AlertTriangle },
  danger: { label: "Careful", icon: OctagonAlert },
  problem: { label: "The problem", icon: ShieldAlert },
} as const;

export type CalloutKind = keyof typeof KINDS;

export function Callout({ type = "note", title, children }: { type?: CalloutKind; title?: string; children: React.ReactNode }) {
  const kind = KINDS[type] ?? KINDS.note;
  const Icon = kind.icon;
  return (
    <aside className={clsx("callout", `callout-${type}`)} role={type === "danger" || type === "problem" ? "alert" : "note"}>
      <div className="callout-head">
        <Icon size={16} aria-hidden />
        <span>{title ?? kind.label}</span>
      </div>
      <div className="callout-body">{children}</div>
    </aside>
  );
}
