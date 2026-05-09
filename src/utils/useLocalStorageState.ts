'use client';

import { useCallback, useSyncExternalStore } from 'react';

const CUSTOM_EVENT = 'windtodo:localstorage';

function subscribe(callback: () => void) {
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(CUSTOM_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(CUSTOM_EVENT, handler);
  };
}

export function useLocalStorageState<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const getSnapshot = useCallback((): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const raw = useSyncExternalStore<string | null>(
    subscribe,
    getSnapshot,
    () => null,
  );

  const hydrated = typeof window !== 'undefined';
  let value: T = initial;
  if (raw != null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = initial;
    }
  }

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      let prev: T = initial;
      try {
        const cur = localStorage.getItem(key);
        if (cur != null) prev = JSON.parse(cur) as T;
      } catch {
        prev = initial;
      }
      const updated =
        typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(updated));
        window.dispatchEvent(new Event(CUSTOM_EVENT));
      } catch {
        // ignore
      }
    },
    [key, initial],
  );

  return [value, setValue, hydrated];
}
