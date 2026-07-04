import { useState, useCallback } from "react";

/**
 * useSessionStorage — sessionStorage-backed state, JSON-serialized, with safe
 * parsing (falls back to initialValue if the stored value is missing or corrupt).
 * Setting the value to null/undefined removes the key entirely.
 *
 * @param {string} key
 * @param {any} initialValue
 * @returns {[value: any, setValue: Function, clearValue: () => void]}
 */
export function useSessionStorage(key, initialValue = null) {
  const [value, setValue] = useState(() => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try {
          if (resolved === null || resolved === undefined) {
            sessionStorage.removeItem(key);
          } else {
            sessionStorage.setItem(key, JSON.stringify(resolved));
          }
        } catch {
          // storage unavailable (private mode, quota, etc.) — state still updates in-memory
        }
        return resolved;
      });
    },
    [key],
  );

  const clear = useCallback(() => set(null), [set]);

  return [value, set, clear];
}
