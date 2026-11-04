"use client";
import { useSyncExternalStore } from "react";

/** Tiny localStorage-backed store usable with useSyncExternalStore (SSR-safe, hydration-safe). */
export function createPersistedStore<T extends string>(key: string, fallback: T, valid: readonly T[]) {
  const listeners = new Set<() => void>();
  let cached: T | null = null;
  const read = (): T => {
    if (cached) return cached;
    try {
      const v = window.localStorage.getItem(key) as T | null;
      if (v && valid.includes(v)) return (cached = v);
    } catch {}
    return (cached = fallback);
  };
  return {
    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    get: read,
    set(v: T) {
      cached = v;
      try {
        window.localStorage.setItem(key, v);
      } catch {}
      listeners.forEach((l) => l());
    },
    use(serverValue: T = fallback): T {
      return useSyncExternalStore(this.subscribe, read, () => serverValue);
    },
  };
}
