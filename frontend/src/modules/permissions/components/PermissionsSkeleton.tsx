/**
 * PermissionsSkeleton — matches the Permissions page list layout.
 */
import * as React from "react";

const ItemSkeleton = () => (
  <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
    <div className="flex-1 space-y-2">
      <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-2.5 w-2/3 animate-pulse rounded bg-muted" />
    </div>
    <div className="h-6 w-6 animate-pulse rounded bg-muted" />
  </div>
);

const GroupSkeleton = () => (
  <div className="space-y-3">
    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <ItemSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const PermissionsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <div className="h-7 w-48 animate-pulse rounded bg-muted" />
      <div className="h-3 w-72 animate-pulse rounded bg-muted" />
    </div>
    <div className="h-9 w-full max-w-md animate-pulse rounded-md bg-muted" />
    {Array.from({ length: 3 }).map((_, i) => (
      <GroupSkeleton key={i} />
    ))}
  </div>
);

export default PermissionsSkeleton;
