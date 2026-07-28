/**
 * Shared state primitives barrel.
 *
 * Generic loading / empty / error surfaces used across the application.
 * Feature modules own their own skeletons (e.g. UsersSkeleton) because
 * every page layout is different — these components are the fallback
 * when a skeleton is overkill (dialogs, mutations, small sections).
 */
export { LoadingState } from "./LoadingState";
export type { LoadingStateProps } from "./LoadingState";
export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";
export { ErrorState } from "./ErrorState";
export type { ErrorStateProps } from "./ErrorState";
