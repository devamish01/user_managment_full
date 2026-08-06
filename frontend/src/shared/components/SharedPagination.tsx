/**
 * SharedPagination — generic pagination controls.
 * Presentation only. Renders prev/next buttons, page info, and page size selector.
 * Works with the PaginationMeta shape from the API response.
 */

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SharedButton } from "./SharedButton";
import { SharedSelect } from "./SharedSelect";
import type { PaginationMeta } from "@/shared/types/pagination";

export interface SharedPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  /** Show page size selector */
  showPageSize?: boolean;
  /** Available page size options */
  pageSizeOptions?: number[];
}

export const SharedPagination: React.FC<SharedPaginationProps> = ({
  meta,
  onPageChange,
  onPageSizeChange,
  className,
  showPageSize = true,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-sm ${className || ""}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
          <span className="font-semibold text-foreground">{endItem}</span> of{" "}
          <span className="font-semibold text-foreground">{meta.total}</span> users
        </p>
        {showPageSize && onPageSizeChange && (
          <SharedSelect
            value={meta.limit}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            options={pageSizeOptions.map((size) => ({ value: String(size), label: `${size} per page` }))}
            className="w-auto min-w-[140px]"
          />
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
        <p className="text-muted-foreground hidden sm:block">
          Page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
          <span className="font-semibold text-foreground">{meta.totalPages}</span>
        </p>
        <div className="flex gap-1">
          <SharedButton
            size="icon"
            variant="outline"
            disabled={!meta.hasPrevious}
            onClick={() => onPageChange(meta.page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </SharedButton>
          <SharedButton
            size="icon"
            variant="outline"
            disabled={!meta.hasNext}
            onClick={() => onPageChange(meta.page + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </SharedButton>
        </div>
      </div>
    </div>
  );
};
