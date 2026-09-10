import { MoreVertical, Eye, Edit2, Trash2, Calendar, Users, MapPin } from "lucide-react";
import { SharedTable } from "@/shared/components/SharedTable";
import { SharedPagination } from "@/shared/components/SharedPagination";
import { SharedBadge } from "@/shared/components/SharedBadge";
import { SharedButton } from "@/shared/components/SharedButton";
import { SharedModal } from "@/shared/components/SharedModal";
import { formatDate } from "@/lib/helpers";
import type { Event, EventStatus } from "../../types";
import type { UseEventListPermissionsReturn } from "../hooks";

interface EventTableWrapperProps {
  events: Event[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  permissions: UseEventListPermissionsReturn;
  selectedIds: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectRow: (id: string, selected: boolean) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onView: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const statusColors: Record<EventStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const statusLabels: Record<EventStatus, string> = {
  draft: "Draft",
  published: "Published",
  cancelled: "Cancelled",
  completed: "Completed",
};

export function EventTableWrapper({
  events,
  pagination,
  loading,
  permissions,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
}: EventTableWrapperProps) {
  const columns = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={selectedIds.length === events.length && events.length > 0}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
      render: (event: Event) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(event.id)}
          onChange={(e) => onSelectRow(event.id, e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
      width: "w-12",
    },
    {
      key: "name",
      header: "Event Name",
      render: (event: Event) => (
        <div>
          <p className="font-medium text-gray-900">{event.name}</p>
          {event.description && (
            <p className="text-sm text-gray-500 truncate max-w-xs">{event.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (event: Event) => (
        <SharedBadge variant="outline" className="capitalize">
          {event.category}
        </SharedBadge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (event: Event) => (
        <SharedBadge className={statusColors[event.status]}>
          {statusLabels[event.status]}
        </SharedBadge>
      ),
    },
    {
      key: "dates",
      header: "Dates",
      render: (event: Event) => (
        <div className="text-sm">
          <p className="text-gray-900">
            <Calendar className="inline w-3.5 h-3.5 mr-1" />
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </p>
          {event.location && (
            <p className="text-gray-500">
              <MapPin className="inline w-3.5 h-3.5 mr-1" />
              {event.location}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (event: Event) => (
        <div className="text-sm">
          <p className="text-gray-900">
            <Users className="inline w-3.5 h-3.5 mr-1" />
            {event.attendeesCount || 0} / {event.capacity}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (event: Event) => (
        <div className="flex items-center gap-2">
          {permissions.canView && (
            <SharedButton
              variant="ghost"
              size="sm"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => onView(event)}
              aria-label="View event"
            />
          )}
          {permissions.canEdit && (
            <SharedButton
              variant="ghost"
              size="sm"
              icon={<Edit2 className="w-4 h-4" />}
              onClick={() => onEdit(event)}
              aria-label="Edit event"
            />
          )}
          {permissions.canDelete && (
            <SharedButton
              variant="ghost"
              size="sm"
              icon={<Trash2 className="w-4 h-4 text-red-600" />}
              onClick={() => onDelete(event)}
              aria-label="Delete event"
            />
          )}
        </div>
      ),
      width: "w-48",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <SharedTable
        columns={columns}
        data={events}
        loading={loading}
        emptyMessage="No events found"
        selectable={permissions.canBulkActions}
        selectedIds={selectedIds}
        onSelectAll={onSelectAll}
        onSelectRow={onSelectRow}
      />
      {pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200">
          <SharedPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            pageSize={pagination.pageSize}
            onPageSizeChange={onPageSizeChange}
            totalItems={pagination.total}
          />
        </div>
      )}
    </div>
  );
}