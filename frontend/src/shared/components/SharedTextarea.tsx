/**
 * SharedTextarea — generic textarea input.
 * Presentation only. No validation logic.
 */

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface SharedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const SharedTextarea = React.forwardRef<HTMLTextAreaElement, SharedTextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className,
      )}
      {...props}
    />
  ),
);
SharedTextarea.displayName = "SharedTextarea";