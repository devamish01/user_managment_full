/**
 * UsersSkeleton — matches the UserList layout.
 *
 * Renders a table-like skeleton with a filter row placeholder and ~6 rows
 * of avatar + text placeholders so the user never sees an empty flash.
 */
import * as React from "react";

const RowSkeleton = () => (
  <div className="flex items-center gap-4 border-b border-border px-4 py-3">
    <div className="h-4 w-4 animate-pulse rounded bg-muted" />
    <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-2.5 w-2/3 animate-pulse rounded bg-muted" />
    </div>
    <div className="h-5 w-20 animate-pulse rounded bg-muted" />
    <div className="h-5 w-16 animate-pulse rounded bg-muted" />
    <div className="h-5 w-5 animate-pulse rounded bg-muted" />
  </div>
);

export const UsersSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3 w-56 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-12 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="h-9 flex-1 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default UsersSkeleton;
