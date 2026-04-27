import { useSyncExternalStore } from "react";

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
