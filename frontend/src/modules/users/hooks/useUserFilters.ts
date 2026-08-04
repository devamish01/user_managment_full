/**
 * useUserFilters — manages filter state for the user list page.
 * Uses shared useSearch, usePagination hooks for consistency.
 */

import { useState, useCallback } from "react";
import { useSearch, usePagination } from "@/shared/hooks";
import type { DateRangeValue } from "@/shared/components";

export interface UseUserFiltersReturn {
  roleFilter: string;
  statusFilter: string;
  dateRange: DateRangeValue;
  period: string;
  days?: number | undefined;
  setRoleFilter: (role: string) => void;
  setStatusFilter: (status: string) => void;
  setDateRange: (value: DateRangeValue) => void;
  setPeriod: (p: string) => void;
  setDays: (d?: number) => void;
  resetFilters: () => void;
  // From shared hooks
  searchQuery: string;
  debouncedSearch: string;
  setSearchQuery: (q: string) => void;
  clearSearch: () => void;
  page: number;
  limit: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  resetPagination: () => void;
  sortKey: string;
  sortDir: "asc" | "desc";
  setSort: (key: string) => void;
}

export function useUserFilters(): UseUserFiltersReturn {
  const { query, debouncedQuery, setQuery, clear } = useSearch(300);
  const { page, limit, setPage, setLimit, nextPage, prevPage, reset } = usePagination(10);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRangeValue>({ startDate: "", endDate: "" });
  const [period, setPeriod] = useState<string>("all");
  const [days, setDays] = useState<number | undefined>(undefined);
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const setSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }, [sortKey]);

  const resetFilters = useCallback(() => {
    setRoleFilter("all");
    setStatusFilter("all");
    setDateRange({ startDate: "", endDate: "" });
    setPeriod("all");
    setDays(undefined);
    clear();
    reset();
    setSortKey("id");
    setSortDir("asc");
  }, [clear, reset]);

  return {
    roleFilter,
    statusFilter,
    dateRange,
    period,
    days,
    setRoleFilter,
    setStatusFilter,
    setDateRange,
    setPeriod,
    setDays,
    resetFilters,
    searchQuery: query,
    debouncedSearch: debouncedQuery,
    setSearchQuery: setQuery,
    clearSearch: clear,
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    resetPagination: reset,
    sortKey,
    sortDir,
    setSort,
  };
}
