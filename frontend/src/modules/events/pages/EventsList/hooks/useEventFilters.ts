import { useState, useCallback, useMemo } from "react";
import type { EventQueryParams, EventStatus, EventCategory } from "../../types";

interface UseEventFiltersReturn {
  // Search
  search: string;
  setSearch: (value: string) => void;
  
  // Filters
  statusFilter: EventStatus | "";
  setStatusFilter: (value: EventStatus | "") => void;
  categoryFilter: EventCategory | "";
  setCategoryFilter: (value: EventCategory | "") => void;
  
  // Date range
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  
  // Pagination
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  
  // Sorting
  sort: string;
  order: "asc" | "desc";
  setSort: (sort: string) => void;
  setOrder: (order: "asc" | "desc") => void;
  
  // Computed
  queryParams: EventQueryParams;
  hasActiveFilters: boolean;
  resetFilters: () => void;
}

export function useEventFilters(initialPageSize = 10): UseEventFiltersReturn {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "">("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState("startDate");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const queryParams = useMemo<EventQueryParams>(() => ({
    page,
    limit: pageSize,
    search: search || undefined,
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
    startDate: dateRange.start || undefined,
    endDate: dateRange.end || undefined,
    sort,
    order,
  }), [page, pageSize, search, statusFilter, categoryFilter, dateRange, sort, order]);

  const hasActiveFilters = useMemo(() => 
    Boolean(search || statusFilter || categoryFilter || dateRange.start || dateRange.end),
    [search, statusFilter, categoryFilter, dateRange]
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setDateRange({ start: "", end: "" });
    setPage(1);
  }, []);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    dateRange,
    setDateRange,
    page,
    setPage,
    pageSize,
    setPageSize,
    sort,
    order,
    setSort,
    setOrder,
    queryParams,
    hasActiveFilters,
    resetFilters,
  };
}