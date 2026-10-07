"use client";

import clsx from "clsx";
import { Children, isValidElement, useId, useState, type ReactElement } from "react";

export function Tab({ children }: { label: string; children: React.ReactNode }) {
  return <>{children}</>;
}

/** <Tabs><Tab label="macOS / Linux">…</Tab><Tab label="Windows">…</Tab></Tabs> */
export function Tabs({ children }: { children: React.ReactNode }) {
  const tabs = Children.toArray(children).filter(isValidElement) as ReactElement<{ label: string; children: React.ReactNode }>[];
  const [active, setActive] = useState(0);
  const base = useId();

  return (
    <div className="tabs">
      <div role="tablist" className="tabs-list">
        {tabs.map((t, i) => (
          <button
            key={t.props.label}
            role="tab"
            type="button"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setActive((active + 1) % tabs.length);
              if (e.key === "ArrowLeft") setActive((active - 1 + tabs.length) % tabs.length);
            }}
            className={clsx("tabs-tab", i === active && "tabs-tab-active")}
          >
            {t.props.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.props.label} role="tabpanel" id={`${base}-panel-${i}`} aria-labelledby={`${base}-tab-${i}`} hidden={i !== active} className="tabs-panel">
          {t}
        </div>
      ))}
    </div>
  );
}
