"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { normalizePath, setDone } from "@/lib/progress";
import { useProgress } from "../use-progress";

/** A GitHub-style "- [ ] item" that can really be ticked and is remembered. */
export function TaskItem({ id, children }: { id: string; children: React.ReactNode }) {
  const pathname = normalizePath(usePathname() ?? "");
  const key = `${pathname}::task:${id}`;
  const done = useProgress().has(key);
  return (
    <li className={clsx("task-item", done && "task-item-done")}>
      <label>
        <input type="checkbox" checked={done} onChange={(e) => setDone(key, e.target.checked)} />
        <span>{children}</span>
      </label>
    </li>
  );
}
