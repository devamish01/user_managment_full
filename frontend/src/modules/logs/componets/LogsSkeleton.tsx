/**
 * LogsSkeleton — matches the ActivityLogs list layout.
 */
import * as React from "react";

const LogRowSkeleton = () => (
  <div className="flex items-center gap-3 border-b border-border px-6 py-4">
    <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-2.5 w-1/3 animate-pulse rounded bg-muted" />
    </div>
    <div className="h-5 w-16 animate-pulse rounded bg-muted" />
  </div>
);

export const LogsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <div className="h-7 w-48 animate-pulse rounded bg-muted" />
      <div className="h-3 w-72 animate-pulse rounded bg-muted" />
    </div>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="h-9 w-full animate-pulse rounded-md bg-muted md:col-span-3" />
      <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
    </div>
    <div className="rounded-xl border border-border bg-card">
      {Array.from({ length: 8 }).map((_, i) => (
        <LogRowSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default LogsSkeleton;
