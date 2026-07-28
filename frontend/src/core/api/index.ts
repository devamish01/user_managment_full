/**
 * Core API barrel — generic infrastructure reusable by every module.
 *
 * Exposes:
 *   - types      : ApiError, ApiResponse, RequestConfig, Pagination, ...
 *   - response   : successResponse, errorResponse, validationError, ...
 *   - client     : ApiClient class + `api` singleton
 *   - mockClient : the in-memory backend used while no real API is wired
 *
 * Feature-specific constants (endpoint URLs, route constants, etc.) live in
 * `@/api/endpoints`, which `@/api` re-exports for backward compatibility.
 */
export * from "./types";
export * from "./response";
export { api } from "./client";
export type { ApiClient } from "./client";
