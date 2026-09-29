import React from "react";
import { SharedButton, SharedSearch } from "@/shared/components";
import { DateRangeFilter } from "@/shared/components/filters";
import type { DateRangeValue } from "@/shared/components/filters";
import type { Role } from "@/lib/types";

interface UserFiltersBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  roleFilter: string;
  statusFilter: string;
  dateRange: DateRangeValue;
  roles: Role[];
  onRoleChange: (role: string) => void;
  onStatusChange: (status: string) => void;
  onDateRangeChange: (value: DateRangeValue) => void;
  onReset: () => void;
}

export const UserFiltersBar: React.FC<UserFiltersBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  roleFilter,
  statusFilter,
  dateRange,
  roles,
  onRoleChange,
  onStatusChange,
  onDateRangeChange,
  onReset,
}) => (
  <div className="users-filters-grid">
    <div className="min-w-0">
      <SharedSearch value={searchQuery} onChange={onSearchQueryChange} placeholder="Search users..." />
    </div>
    <div className="min-w-0">
      <select
        className="flex h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm"
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        <option value="all">All Roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>{role.name}</option>
        ))}
      </select>
    </div>
    <div className="min-w-0">
      <select
        className="flex h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="blocked">Blocked</option>
        <option value="pending">Pending</option>
      </select>
    </div>
    <div className="min-w-0">
      <DateRangeFilter value={dateRange} onChange={onDateRangeChange} placeholder="Filter by join date" />
    </div>
    <div className="min-w-0">
      <SharedButton variant="outline" className="w-full" onClick={onReset}>Reset</SharedButton>
    </div>
  </div>
);