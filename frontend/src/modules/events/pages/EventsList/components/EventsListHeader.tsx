import { Plus, Download } from "lucide-react";
import { SharedButton } from "@/shared/components/SharedButton";
import type { UseEventListPermissionsReturn } from "../hooks";

interface EventsListHeaderProps {
  permissions: UseEventListPermissionsReturn;
  onCreate: () => void;
  onExport: () => void;
}

export function EventsListHeader({ permissions, onCreate, onExport }: EventsListHeaderProps) {
  if (!permissions.canView) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-500 mt-1">Manage and track all events</p>
      </div>
      <div className="flex items-center gap-3">
        {permissions.canExport && (
          <SharedButton variant="outline" icon={<Download className="w-4 h-4" />} onClick={onExport}>
            Export
          </SharedButton>
        )}
        {permissions.canCreate && (
          <SharedButton icon={<Plus className="w-4 h-4" />} onClick={onCreate}>
            Add Event
          </SharedButton>
        )}
      </div>
    </div>
  );
}