/**
 * UserStatCard — interactive stat card for the Users List header.
 * Clicking toggles a status filter on the table; the active state is visually distinct
 * (ring + tinted background + "filtering" pill) so the interaction is perceptible.
 * 
 * Responsive: shrinks with container, uses clamp() for text, min-w-0 for flex shrink
 */

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface UserStatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  gradient: string;
  active: boolean;
  onClick: () => void;
}

export const UserStatCard: React.FC<UserStatCardProps> = ({
  label,
  count,
  icon,
  gradient,
  active,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "group relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 min-w-0",
      "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      active
        ? "border-primary/50 bg-primary/5 shadow-sm ring-1 ring-primary/30"
        : "border-border bg-card hover:border-primary/30",
    )}
  >
    {/* ambient gradient glow when active */}
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-300 shrink-0",
        gradient,
        active ? "opacity-30" : "group-hover:opacity-20",
      )}
    />
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-200 group-hover:scale-105",
        gradient,
      )}
    >
      {icon}
    </div>
    <div className="relative min-w-0 flex-1">
      <p className="text-xl font-bold leading-none tracking-tight tabular-nums truncate">{count}</p>
      <div className="mt-0.5 flex items-center gap-1.5">
        <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
        {active && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            filtering
          </span>
        )}
      </div>
    </div>
  </button>
);
