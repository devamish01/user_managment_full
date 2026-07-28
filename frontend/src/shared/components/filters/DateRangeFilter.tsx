/**
 * DateRangeFilter
 * Generic reusable date range filter.
 * No module-specific logic.
 *
 * Responsive behaviour:
 *  - The bordered field wraps its children on very narrow containers.
 *  - Each date input can shrink (min-w-0) but keeps a sensible min width.
 *  - The clear button sits outside so it never overlaps the inputs.
 */

import React from "react";
import { CalendarRange, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface DateRangeValue {
  startDate: string;
  endDate: string;
}

export interface DateRangeFilterProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  disabled = false,
  className,
  placeholder,
}) => {
  const hasValue = !!value.startDate || !!value.endDate;

  return (
    <div className={cn("flex w-full items-stretch gap-2", className)}>
      <label
        className={cn(
          "flex min-w-0 flex-1 flex-wrap items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring",
          disabled && "cursor-not-allowed opacity-60",
        )}
        aria-label={placeholder}
      >
        <CalendarRange size={16} className="shrink-0 text-muted-foreground" />
        <span className="sr-only">Start date</span>
        <input
          type="date"
          value={value.startDate}
          onChange={(e) => onChange({ ...value, startDate: e.target.value })}
          disabled={disabled}
          className="min-w-[110px] flex-1 bg-transparent text-sm text-foreground outline-none disabled:cursor-not-allowed [color-scheme:inherit]"
        />
        <span className="shrink-0 select-none text-xs text-muted-foreground">to</span>
        <span className="sr-only">End date</span>
        <input
          type="date"
          value={value.endDate}
          onChange={(e) => onChange({ ...value, endDate: e.target.value })}
          disabled={disabled}
          className="min-w-[110px] flex-1 bg-transparent text-sm text-foreground outline-none disabled:cursor-not-allowed [color-scheme:inherit]"
        />
      </label>
      {hasValue && (
        <button
          type="button"
          onClick={() => onChange({ startDate: "", endDate: "" })}
          disabled={disabled}
          className="shrink-0 rounded-lg border border-input bg-background p-2 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Clear date range"
          title="Clear date range"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
