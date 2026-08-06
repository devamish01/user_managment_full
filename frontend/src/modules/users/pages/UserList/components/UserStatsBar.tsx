import React from "react";
import { Users, UserCheck, UserMinus, ShieldBan } from "lucide-react";
import { UserStatCard } from "@/modules/users/components";

interface UserStatsBarProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    blocked: number;
  };
  statusFilter: string;
  showTabActive: boolean;
  showTabInactive: boolean;
  showTabBlocked: boolean;
  onStatusClick: (status: "all" | "active" | "inactive" | "blocked") => void;
}

export const UserStatsBar: React.FC<UserStatsBarProps> = ({
  stats,
  statusFilter,
  showTabActive,
  showTabInactive,
  showTabBlocked,
  onStatusClick,
}) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-in">
    <UserStatCard
      label="Total Users"
      count={stats.total}
      icon={<Users size={20} />}
      gradient="from-violet-500 to-indigo-600"
      active={statusFilter === "all"}
      onClick={() => onStatusClick("all")}
    />
    {showTabActive && (
      <UserStatCard
        label="Active Users"
        count={stats.active}
        icon={<UserCheck size={20} />}
        gradient="from-emerald-500 to-teal-500"
        active={statusFilter === "active"}
        onClick={() => onStatusClick("active")}
      />
    )}
    {showTabInactive && (
      <UserStatCard
        label="Inactive Users"
        count={stats.inactive}
        icon={<UserMinus size={20} />}
        gradient="from-slate-400 to-slate-600"
        active={statusFilter === "inactive"}
        onClick={() => onStatusClick("inactive")}
      />
    )}
    {showTabBlocked && (
      <UserStatCard
        label="Blocked Users"
        count={stats.blocked}
        icon={<ShieldBan size={20} />}
        gradient="from-red-500 to-rose-600"
        active={statusFilter === "blocked"}
        onClick={() => onStatusClick("blocked")}
      />
    )}
  </div>
);