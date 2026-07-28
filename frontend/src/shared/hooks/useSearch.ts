/**
 * useSearch — combines a search input with debounced server-side query.
 * Used by: UserList, Permissions, ActivityLogs, future modules.
 * No domain knowledge — manages a string value with debounce.
 */

import { useState } from "react";
import { useDebounce } from "./useDebounce";
import { SEARCH_DEBOUNCE_MS } from "@/shared/constants/app";

export interface UseSearchReturn {
  query: string;
  debouncedQuery: string;
  setQuery: (q: string) => void;
  clear: () => void;
}

export function useSearch(delay: number = SEARCH_DEBOUNCE_MS): UseSearchReturn {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, delay);
  const clear = () => setQuery("");

  return { query, debouncedQuery, setQuery, clear };
}
