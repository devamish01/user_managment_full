/**
 * Generic table column definition.
 * Used by shared Table component and every list page.
 */

import type { SortDirection } from "./common";

export interface TableColumn<T = any> {
  /** Unique key matching a field on the data row */
  key: string;
  /** Display header label (supports text or custom React node e.g. checkbox) */
  label: React.ReactNode;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column is hidden on mobile */
  hiddenOnMobile?: boolean;
  /** Custom render function */
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableSortState {
  key: string;
  direction: SortDirection;
}
