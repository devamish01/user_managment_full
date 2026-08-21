/* ==========================================================
 * Common API type definitions used across the client layer.
 * Part of the core API infrastructure — reusable by every module.
 * ========================================================== */

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

/** Aggregate counts returned by list endpoints that support stats. */
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  pending: number;
}

export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  /** Optional aggregate stats computed across the entire dataset (not the filtered page). */
  stats?: UserStats;
}

export interface ApiResponseMeta extends Pagination {
  [key: string]: unknown;
}

/* HTTP-like status codes used across the mock backend */
export type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 500;

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: HttpStatus;
  message: string;
  data: T | null;
  meta: ApiResponseMeta;
  errors: ApiError[] | null;
  /** Backend error code (e.g., "VALIDATION_ERROR", "CONFLICT", "UNAUTHORIZED") */
  errorCode?: string;
  /** Field-level validation errors: { fieldName: ["error message 1", "error message 2"] } */
  fields?: Record<string, string[]>;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface UserQueryParams {
  search?: string;
  roleId?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}

export interface GenericQueryParams {
  search?: string;
  module?: string;
  type?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}
