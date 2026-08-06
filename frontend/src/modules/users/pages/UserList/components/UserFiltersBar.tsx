import React from "react";
import { SharedButton, SharedSearch } from "@/shared/components";
import { DateRangeFilter } from "@/shared/components";
import type { DateRangeValue } from "@/shared/components";
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
  <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
    <div className="md:col-span-6 lg:col-span-4">
      <SharedSearch value={searchQuery} onChange={onSearchQueryChange} placeholder="Search users..." />
    </div>
    <div className="md:col-span-3 lg:col-span-2">
      <select
        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        <option value="all">All Roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>{role.name}</option>
        ))}
      </select>
    </div>
    <div className="md:col-span-3 lg:col-span-2">
      <select
        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
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
    <div className="md:col-span-10 lg:col-span-3">
      <DateRangeFilter value={dateRange} onChange={onDateRangeChange} placeholder="Filter by join date" />
    </div>
    <div className="md:col-span-2 lg:col-span-1">
      <SharedButton variant="outline" className="w-full" onClick={onReset}>Reset</SharedButton>
    </div>
  </div>
);