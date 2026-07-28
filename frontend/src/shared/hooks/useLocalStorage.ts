/**
 * useLocalStorage — React state backed by localStorage.
 * Used by: theme persistence, user preferences, future settings.
 * No domain knowledge — works with any serializable value.
 */

import { useState, useCallback } from "react";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/shared/utils/storage";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getStorageItem<T>(key, initialValue),
  );

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      setStorageItem(key, value);
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    removeStorageItem(key);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
