import { useSyncExternalStore } from "react";

// BUG: this store is module-scoped and shared across BOTH /recipes and /ingredients.
// Selecting a tag on /recipes leaks the same value into /ingredients on navigation.
// Intended fix: scope per route (separate stores) or use URL search params per route.

let currentTag: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export const filterStore = {
  getTag(): string | null {
    return currentTag;
  },
  setTag(tag: string | null): void {
    currentTag = tag;
    notify();
  },
  subscribe(cb: () => void): () => void {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
};

export function useTagFilter(): [string | null, (tag: string | null) => void] {
  const tag = useSyncExternalStore(
    filterStore.subscribe,
    filterStore.getTag,
    filterStore.getTag,
  );
  return [tag, filterStore.setTag];
}
