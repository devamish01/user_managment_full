/**
 * SharedSelect — generic select dropdown component.
 * Presentation only. Renders a styled select input.
 */

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface SharedSelectOption {
  value: string;
  label: string;
}

export interface SharedSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SharedSelectOption[];
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  "aria-label"?: string;
}

export const SharedSelect: React.FC<SharedSelectProps> = ({
  value,
  onValueChange,
  options,
  className,
  disabled,
  placeholder,
  "aria-label": ariaLabel,
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    disabled={disabled}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    aria-label={ariaLabel}
  >
    {placeholder && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);