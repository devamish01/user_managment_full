/**
 * Backward-compatibility shim for the API layer.
 *
 * Generic infrastructure (ApiClient, mockClient, ApiResponse, response helpers,
 * HTTP types, query-param types) now lives in `@/core/api`. This file simply
 * re-exports them, plus the local feature-neutral endpoint registry, so that
 * every existing `import { ... } from "@/api"` continues to work unchanged.
 */
export * from "@/core/api";
export { mockClient } from "@/core/mock";
export * from "./endpoints";
