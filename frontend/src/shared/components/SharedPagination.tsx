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
  const safePage = Number.isFinite(meta.page) && Number(meta.page) > 0 ? Number(meta.page) : 1;
  const safeLimit = Number.isFinite(meta.limit) && Number(meta.limit) > 0 ? Number(meta.limit) : Number(meta.pageSize) > 0 ? Number(meta.pageSize) : 10;
  const safeTotal = Number.isFinite(meta.total) ? Number(meta.total) : 0;
  const computedTotalPages = Number.isFinite(meta.totalPages) && Number(meta.totalPages) > 0
    ? Number(meta.totalPages)
    : Math.max(1, Math.ceil(safeTotal / safeLimit));

  const startItem = safeTotal === 0 ? 0 : (safePage - 1) * safeLimit + 1;
  const endItem = safeTotal === 0 ? 0 : Math.min(safePage * safeLimit, safeTotal);
  const hasPrevious = Boolean(meta.hasPrevious ?? safePage > 1);
  const hasNext = Boolean(meta.hasNext ?? safePage < computedTotalPages);

  return (
    <div
      className={`mt-auto rounded-2xl border border-border/80 bg-gradient-to-r from-background/90 via-card/90 to-background/90 px-3 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className || ""}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
            <span className="font-semibold text-foreground">{endItem}</span> of{" "}
            <span className="font-semibold text-foreground">{safeTotal}</span> users
          </p>
          {showPageSize && onPageSizeChange && (
            <div className="rounded-xl border border-border/80 bg-background/70 px-2 py-1.5 shadow-inner shadow-black/5">
              <SharedSelect
                value={safeLimit}
                onValueChange={(value) => onPageSizeChange(Number(value))}
                options={pageSizeOptions.map((size) => ({ value: String(size), label: `${size} per page` }))}
                className="w-auto min-w-[140px]"
              />
            </div>
          )}
        </div>

        <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-4">
          <p className="rounded-xl border border-border/80 bg-background/70 px-2.5 py-1.5 text-sm text-muted-foreground shadow-inner shadow-black/5">
            Page <span className="font-semibold text-foreground">{safePage}</span> of{" "}
            <span className="font-semibold text-foreground">{computedTotalPages}</span>
          </p>
          <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-background/70 p-1 shadow-inner shadow-black/5">
            <SharedButton
              size="icon"
              variant="outline"
              disabled={!hasPrevious}
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
              aria-label="Previous page"
              className="h-8 w-8 rounded-lg"
            >
              <ChevronLeft size={14} />
            </SharedButton>
            <SharedButton
              size="icon"
              variant="outline"
              disabled={!hasNext}
              onClick={() => onPageChange(safePage + 1)}
              aria-label="Next page"
              className="h-8 w-8 rounded-lg"
            >
              <ChevronRight size={14} />
            </SharedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
