/**
 * SharedBadge — generic status/label badge.
 * Presentation only. Maps variant to visual style.
 */

import React from "react";
import { cn } from "@/shared/utils/cn";
import type { BadgeVariant } from "@/shared/types/common";

export interface SharedBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-transparent",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  destructive: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  outline: "border-border text-foreground",
};

export const SharedBadge: React.FC<SharedBadgeProps> = ({
  className,
  variant = "default",
  ...props
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
      variantStyles[variant],
      className,
    )}
    {...props}
  />
);
