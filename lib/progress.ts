/**
 * Tiny localStorage-backed store for "I did this step" checkboxes.
 * Keys look like "/guides/deployment/network#create-the-vpc" for steps and
 * "/guides/deployment/network" for finished chapters.
 */
const STORAGE_KEY = "slw.progress.v1";
const listeners = new Set<() => void>();
let cache: ReadonlySet<string> | null = null;
const EMPTY: ReadonlySet<string> = new Set();

function read(): ReadonlySet<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function getSnapshot(): ReadonlySet<string> {
  cache ??= read();
  return cache;
}

export function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY;
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function setDone(key: string, done: boolean) {
  const next = new Set(getSnapshot());
  if (done) next.add(key);
  else next.delete(key);
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    /* storage blocked: progress lasts until reload */
  }
  listeners.forEach((l) => l());
}

export function clearAll() {
  cache = new Set();
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export const normalizePath = (p: string) => p.replace(/\/$/, "");
