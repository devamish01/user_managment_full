/**
 * SettingsSkeleton — matches the Settings form layout.
 */
import * as React from "react";

export const SettingsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <div className="h-7 w-40 animate-pulse rounded bg-muted" />
      <div className="h-3 w-72 animate-pulse rounded bg-muted" />
    </div>
    <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-8 w-24 animate-pulse rounded-md bg-background/60" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
        <div className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-3">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  </div>
);

export default SettingsSkeleton;
