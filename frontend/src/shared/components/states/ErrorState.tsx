/**
 * ErrorState — generic error state.
 *
 * Use after a failed fetch or mutation where the user can retry.
 * Never render while loading. Pair with the retry callback exposed by the
 * owning store or page.
 */
import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ErrorStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  icon,
  title = "Something went wrong",
  description = "We could not complete your request. Please try again.",
  onRetry,
  retryLabel = "Try again",
  action,
  children,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-red-500/30 bg-red-500/5 p-10 text-center",
      className,
    )}
    role="alert"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
      {icon ?? <AlertTriangle size={22} />}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <RefreshCw size={12} />
        {retryLabel}
      </button>
    )}
    {action && <div className="pt-2">{action}</div>}
    {children}
  </div>
);

export default ErrorState;
