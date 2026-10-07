import type { ReactNode } from "react";

export function Defs() {
  return (
    <defs>
      <marker id="dg-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" className="dg-arrowhead" />
      </marker>
    </defs>
  );
}

type NodeProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  tone?: "default" | "accent" | "tip" | "warn";
};

export function Node({ x, y, w, h, title, sub, tone = "default" }: NodeProps) {
  return (
    <g className={`dg-node dg-${tone}`}>
      <rect x={x} y={y} width={w} height={h} rx={8} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 5} textAnchor="middle" className="dg-title">
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className="dg-sub">
          {sub}
        </text>
      )}
    </g>
  );
}

export function Zone({ x, y, w, h, label, tone = "default" }: { x: number; y: number; w: number; h: number; label: string; tone?: "default" | "accent" }) {
  return (
    <g className={`dg-zone dg-zone-${tone}`}>
      <rect x={x} y={y} width={w} height={h} rx={12} />
      <text x={x + 12} y={y + 20} className="dg-zone-label">
        {label}
      </text>
    </g>
  );
}

export function Arrow({ d, dashed, label, lx, ly, anchor = "middle" }: { d: string; dashed?: boolean; label?: string; lx?: number; ly?: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <g>
      <path d={d} className={dashed ? "dg-line dg-dashed" : "dg-line"} markerEnd="url(#dg-arrow)" fill="none" />
      {label && lx !== undefined && ly !== undefined && (
        <text x={lx} y={ly} textAnchor={anchor} className="dg-label">
          {label}
        </text>
      )}
    </g>
  );
}

export function Figure({ title, caption, viewBox, children }: { title: string; caption: string; viewBox: string; children: ReactNode }) {
  return (
    <figure className="diagram">
      <svg viewBox={viewBox} role="img" aria-label={title} className="dg">
        <title>{title}</title>
        <Defs />
        {children}
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
