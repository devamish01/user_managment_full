/**
 * Common generic types used across all modules.
 * No domain-specific types here (no User, Role, etc.).
 */

/** Generic key-value option for Select, Radio, Checkbox components */
export interface SelectOption {
  label: string;
  value: string;
}

/** Generic status badge variant mapping */
export type BadgeVariant = "default" | "success" | "warning" | "destructive" | "secondary" | "outline";

/** Generic sort direction */
export type SortDirection = "asc" | "desc";

/** Generic sort state for any list */
export interface SortState {
  key: string;
  direction: SortDirection;
}

/** Generic filter state */
export interface FilterState {
  [key: string]: string | number | boolean | undefined;
}

/** Generic ID-bearing entity (every domain model has at least an id) */
export interface Identifiable {
  id: string;
}

/** Nullable wrapper */
export type Nullable<T> = T | null;
