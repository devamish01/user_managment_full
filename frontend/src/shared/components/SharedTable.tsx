/**
 * SharedTable — generic data table shell.
 * Presentation only. Renders header + rows via column definitions.
 * Every module's list page can use this instead of raw <table>.
 */

/* SharedTable uses JSX but no React API directly */
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { TableColumn, TableSortState } from "@/shared/types/table";

export interface SharedTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  sort?: TableSortState;
  onSort?: (key: string) => void;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function SharedTable<T>({
  columns,
  data,
  sort,
  onSort,
  rowKey,
  onRowClick,
  emptyMessage = "No results found.",
  className,
}: SharedTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left",
                  col.hiddenOnMobile && "hidden md:table-cell",
                  col.sortable && "cursor-pointer select-none hover:text-foreground",
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && <ArrowUpDown size={12} className={sort?.key === col.key ? "text-foreground" : ""} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={rowKey(row)}
                className={cn(
                  "transition-colors hover:bg-accent/30",
                  onRowClick && "cursor-pointer",
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-sm",
                      col.hiddenOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {col.render
                      ? col.render((row as any)[col.key], row)
                      : String((row as any)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
