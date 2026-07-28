/**
 * EmptyState — generic empty state.
 *
 * Use when a query returns zero items and there is no loading or error.
 * Never render while loading — that is LoadingState / Skeleton territory.
 */
import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/utils/cn";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = "No data found",
  description = "Nothing is available yet.",
  action,
  children,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-10 text-center",
      className,
    )}
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
      {icon ?? <Inbox size={22} />}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    {action && <div className="pt-2">{action}</div>}
    {children}
  </div>
);

export default EmptyState;
