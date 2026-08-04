import React from "react";
import { Users, UserCheck, UserMinus, ShieldBan, Clock } from "lucide-react";
import { UserStatCard } from "./UserStatCard";
import type { User } from "@/lib/types";

export interface UserStatusProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    blocked: number;
    pending: number;
  };
  activeStatus: "all" | "active" | "inactive" | "blocked" | "pending";
  showTabActive: boolean;
  showTabInactive: boolean;
  showTabBlocked: boolean;
  showTabPending: boolean;
  onStatusClick: (status: "all" | "active" | "inactive" | "blocked" | "pending") => void;
}

export const UserStatus: React.FC<UserStatusProps> = ({
  stats,
  activeStatus,
  showTabActive,
  showTabInactive,
  showTabBlocked,
  showTabPending,
  onStatusClick,
}) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 animate-in">
    <UserStatCard
      label="Total Users"
      count={stats.total}
      icon={<Users size={20} />}
      gradient="from-violet-500 to-indigo-600"
      active={activeStatus === "all"}
      onClick={() => onStatusClick("all")}
    />
    {showTabActive && (
      <UserStatCard
        label="Active Users"
        count={stats.active}
        icon={<UserCheck size={20} />}
        gradient="from-emerald-500 to-teal-500"
        active={activeStatus === "active"}
        onClick={() => onStatusClick("active")}
      />
    )}
    {showTabInactive && (
      <UserStatCard
        label="Inactive Users"
        count={stats.inactive}
        icon={<UserMinus size={20} />}
        gradient="from-slate-400 to-slate-600"
        active={activeStatus === "inactive"}
        onClick={() => onStatusClick("inactive")}
      />
    )}
    {showTabBlocked && (
      <UserStatCard
        label="Blocked Users"
        count={stats.blocked}
        icon={<ShieldBan size={20} />}
        gradient="from-red-500 to-rose-600"
        active={activeStatus === "blocked"}
        onClick={() => onStatusClick("blocked")}
      />
    )}
    {showTabPending && (
      <UserStatCard
        label="Pending Users"
        count={stats.pending || 0}
        icon={<Clock size={20} />}
        gradient="from-amber-500 to-orange-600"
        active={activeStatus === "pending"}
        onClick={() => onStatusClick("pending")}
      />
    )}
  </div>
);
