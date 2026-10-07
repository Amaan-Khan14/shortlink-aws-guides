import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

/** Console navigation path: <Ui>EC2 → Instances → Launch instances</Ui> */
export function Ui({ children }: { children: string }) {
  const parts = String(children).split("→").map((p) => p.trim()).filter(Boolean);
  return (
    <span className="ui-path">
      {parts.map((p, i) => (
        <Fragment key={`${p}-${i}`}>
          {i > 0 && <ChevronRight size={12} aria-hidden className="ui-sep" />}
          <span className="ui-part">{p}</span>
        </Fragment>
      ))}
    </span>
  );
}

/** Collapsible section, handy for "if it did not work" help. */
export function Details({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="details">
      <summary>{title}</summary>
      <div className="details-body">{children}</div>
    </details>
  );
}

/** Show something is the expected result of the previous action. */
export function Result({ children }: { children: React.ReactNode }) {
  return (
    <div className="result">
      <span className="result-label">You should see</span>
      <div>{children}</div>
    </div>
  );
}
