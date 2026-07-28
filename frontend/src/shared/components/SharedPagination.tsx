/**
 * SharedPagination — generic pagination controls.
 * Presentation only. Renders prev/next buttons and page info.
 * Works with the PaginationMeta shape from the API response.
 */

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SharedButton } from "./SharedButton";
import type { PaginationMeta } from "@/shared/types/pagination";

export interface SharedPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export const SharedPagination: React.FC<SharedPaginationProps> = ({
  meta,
  onPageChange,
  className,
}) => (
  <div className={`flex items-center justify-between text-sm ${className || ""}`}>
    <p className="text-muted-foreground">
      Page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
      <span className="font-semibold text-foreground">{meta.totalPages}</span>
      {meta.total > 0 && (
        <span className="ml-2">({meta.total} total)</span>
      )}
    </p>
    <div className="flex gap-1">
      <SharedButton
        size="icon"
        variant="outline"
        disabled={!meta.hasPrevious}
        onClick={() => onPageChange(meta.page - 1)}
      >
        <ChevronLeft size={14} />
      </SharedButton>
      <SharedButton
        size="icon"
        variant="outline"
        disabled={!meta.hasNext}
        onClick={() => onPageChange(meta.page + 1)}
      >
        <ChevronRight size={14} />
      </SharedButton>
    </div>
  </div>
);
