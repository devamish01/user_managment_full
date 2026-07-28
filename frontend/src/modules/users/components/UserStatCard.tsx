/**
 * UserStatCard — interactive stat card for the Users List header.
 * Clicking toggles a status filter on the table; the active state is visually distinct
 * (ring + tinted background + "filtering" pill) so the interaction is perceptible.
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
      "group relative flex items-center gap-4 overflow-hidden rounded-xl border p-4 text-left transition-all duration-200",
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
        "pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-300",
        gradient,
        active ? "opacity-30" : "group-hover:opacity-20",
      )}
    />
    <div
      className={cn(
        "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-200 group-hover:scale-105",
        gradient,
      )}
    >
      {icon}
    </div>
    <div className="relative min-w-0 flex-1">
      <p className="text-2xl font-bold leading-none tracking-tight tabular-nums">{count}</p>
      <div className="mt-1 flex items-center gap-2">
        <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
        {active && (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            filtering
          </span>
        )}
      </div>
    </div>
  </button>
);
