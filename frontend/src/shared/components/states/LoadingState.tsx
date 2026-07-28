/**
 * LoadingState — generic loading indicator.
 *
 * Use where a skeleton is not appropriate: button actions, dialogs,
 * API mutations, small inline sections. For full page loads, prefer the
 * feature-specific skeleton (e.g. UsersSkeleton, RolesSkeleton).
 */
import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export interface LoadingStateProps {
  title?: string;
  description?: string;
  spinner?: boolean;
  fullPage?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  title,
  description,
  spinner = true,
  fullPage = false,
  className,
  size = "md",
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 text-center",
      fullPage && "min-h-[60vh] p-8",
      className,
    )}
    role="status"
    aria-live="polite"
  >
    {spinner && (
      <Loader2
        className={cn("animate-spin text-muted-foreground", sizeMap[size])}
      />
    )}
    {title && <p className="text-sm font-semibold text-foreground">{title}</p>}
    {description && (
      <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
    )}
  </div>
);

export default LoadingState;
