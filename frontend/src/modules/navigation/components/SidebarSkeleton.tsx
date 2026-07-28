/**
 * SidebarSkeleton — placeholder shown while navigation data is loading.
 *
 * Mirrors the sidebar's layout (header + section + item rows) so the user
 * never sees the "no permission" empty state during the initial fetch.
 * Pure presentational — no data, no store access.
 */

import * as React from "react";

const ItemBar = () => (
  <div className="flex items-center gap-3 rounded-lg px-3 py-2">
    <div className="h-4 w-4 animate-pulse rounded bg-muted" />
    <div className="h-3 flex-1 animate-pulse rounded bg-muted" />
  </div>
);

const SectionBlock = () => (
  <div className="mb-5">
    <div className="mb-2 h-2.5 w-16 animate-pulse rounded bg-muted px-3" />
    <div className="space-y-1">
      <ItemBar />
      <ItemBar />
      <ItemBar />
    </div>
  </div>
);

export const SidebarSkeleton: React.FC = () => (
  <div className="flex h-full flex-col">
    {/* Brand header placeholder (matches the real sidebar header height). */}
    <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
      <div className="h-9 w-9 animate-pulse rounded-xl bg-muted" />
      <div className="space-y-1.5">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-2 w-20 animate-pulse rounded bg-muted" />
      </div>
    </div>

    {/* Nav placeholder */}
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <SectionBlock />
      <SectionBlock />
      <SectionBlock />
    </nav>

    {/* Footer placeholder */}
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-3 rounded-lg p-3">
        <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2.5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-2 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  </div>
);

export default SidebarSkeleton;
