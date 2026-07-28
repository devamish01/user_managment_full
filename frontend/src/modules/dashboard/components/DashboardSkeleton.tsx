
/**
 * DashboardSkeleton — matches the Dashboard layout: 4 stat cards,
 * chart placeholder, and a recent-users table placeholder.
 */
import * as React from "react";

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <div className="h-7 w-56 animate-pulse rounded bg-muted" />
      <div className="h-3 w-80 animate-pulse rounded bg-muted" />
    </div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-7 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
        <div className="space-y-3">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-40 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-3">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-full animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-border px-6 py-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardSkeleton;
