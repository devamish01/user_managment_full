import { Search, Filter, X, Calendar } from "lucide-react";
import { SharedInput } from "@/shared/components/SharedInput";
import { SharedSelect } from "@/shared/components/SharedSelect";
import { SharedButton } from "@/shared/components/SharedButton";
import type { EventStatus, EventCategory } from "../../types";
import type { UseEventFiltersReturn } from "../hooks";
import type { UseEventListPermissionsReturn } from "../hooks";

interface EventFiltersBarProps {
  filters: UseEventFiltersReturn;
  permissions: UseEventListPermissionsReturn;
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
  { value: "webinar", label: "Webinar" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

export function EventFiltersBar({ filters, permissions }: EventFiltersBarProps) {
  const { search, setSearch, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter, dateRange, setDateRange, hasActiveFilters, resetFilters } = filters;

  if (!permissions.canViewFilters) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <SharedInput
            placeholder="Search events..."
            value={search}
            onChange={setSearch}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <SharedSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Status"
            className="w-40"
          />
          <SharedSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="Category"
            className="w-48"
          />
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-40"
              placeholder="Start"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-40"
              placeholder="End"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <SharedButton variant="outline" icon={<X className="w-4 h-4" />} onClick={resetFilters} size="sm">
            Clear Filters
          </SharedButton>
        )}
      </div>
    </div>
  );
}