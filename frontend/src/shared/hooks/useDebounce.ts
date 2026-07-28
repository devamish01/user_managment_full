/**
 * useDebounce — delays a value update until the user stops typing.
 * Used by: search inputs on every list page (Users, Logs, Permissions).
 * No domain knowledge — works with any string/number value.
 */

import { useState, useEffect } from "react";
import { SEARCH_DEBOUNCE_MS } from "@/shared/constants/app";

export function useDebounce<T>(value: T, delay: number = SEARCH_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
