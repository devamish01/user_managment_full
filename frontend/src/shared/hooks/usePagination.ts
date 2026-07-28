/**
 * usePagination — manages page/limit state for server-side pagination.
 * Used by: every list page (Users, Logs, future Payments, Events).
 * No domain knowledge — purely manages numeric page state.
 */

import { useState, useCallback } from "react";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/app";

export interface UsePaginationReturn {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export function usePagination(initialLimit: number = DEFAULT_PAGE_SIZE): UsePaginationReturn {
  const [page, setPageState] = useState(1);
  const [limit, setLimitState] = useState(initialLimit);

  const setPage = useCallback((p: number) => {
    setPageState(Math.max(1, p));
  }, []);

  const setLimit = useCallback((l: number) => {
    setLimitState(l);
    setPageState(1); // Reset to first page when limit changes
  }, []);

  const nextPage = useCallback(() => setPageState((prev) => prev + 1), []);
  const prevPage = useCallback(() => setPageState((prev) => Math.max(1, prev - 1)), []);
  const reset = useCallback(() => { setPageState(1); setLimitState(initialLimit); }, [initialLimit]);

  return { page, limit, setPage, setLimit, nextPage, prevPage, reset };
}
