"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { resolveValues, sanitizeValue, type RawValues, type ResolvedValues } from "@/lib/variables";

type Ctx = {
  raw: RawValues;
  resolved: ResolvedValues;
  setValue: (key: string, value: string) => void;
  reset: () => void;
};

const STORAGE_KEY = "slw.values.v1";
const ValuesContext = createContext<Ctx | null>(null);

export function ValuesProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<RawValues>({});

  // Read after mount so server and first client render match.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setRaw(JSON.parse(saved) as RawValues);
    } catch {
      /* storage blocked: values just won't persist */
    }
  }, []);

  const persist = useCallback((next: RawValues) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const setValue = useCallback(
    (key: string, value: string) => {
      setRaw((prev) => {
        const next = { ...prev, [key]: sanitizeValue(value) };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    setRaw({});
    persist({});
  }, [persist]);

  const value = useMemo<Ctx>(() => ({ raw, resolved: resolveValues(raw), setValue, reset }), [raw, setValue, reset]);
  return <ValuesContext.Provider value={value}>{children}</ValuesContext.Provider>;
}

export function useValues(): Ctx {
  const ctx = useContext(ValuesContext);
  if (!ctx) throw new Error("useValues must be used inside <ValuesProvider>");
  return ctx;
}
