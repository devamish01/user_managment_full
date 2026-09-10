/**
 * Pagination types for list pages.
 * Used by every module that renders a paginated table.
 * Mirrors the meta shape returned by the API layer.
 */

/** Aggregate counts returned by list endpoints that support stats. */
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  pending: number;
}

/** Generic stats shape - modules can extend with their own stats */
export interface GenericStats {
  [key: string]: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  /** Optional aggregate counts across the entire dataset. */
  stats?: UserStats | GenericStats;
}

export interface PaginationState {
  page: number;
  limit: number;
}

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
