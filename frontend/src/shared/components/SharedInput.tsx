/**
 * SharedInput — generic text input.
 * Presentation only. No validation logic.
 */

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface SharedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SharedInput = React.forwardRef<HTMLInputElement, SharedInputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
SharedInput.displayName = "SharedInput";
