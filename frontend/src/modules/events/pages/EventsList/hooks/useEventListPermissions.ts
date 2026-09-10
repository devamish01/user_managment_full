import { useHasPermission } from "@/store";

export function useEventListPermissions() {
  const hasPermission = useHasPermission();

  const canView = hasPermission("pages.events");
  const canCreate = hasPermission("events.create");
  const canEdit = hasPermission("events.edit");
  const canDelete = hasPermission("events.delete");
  const canExport = hasPermission("events.export");
  const canViewFilters = hasPermission("events.ui.filters");
  const canManageColumns = hasPermission("events.ui.columns");
  const canBulkActions = hasPermission("events.ui.actions");
  const canViewAttendees = hasPermission("events.view");

  return {
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canViewFilters,
    canManageColumns,
    canBulkActions,
    canViewAttendees,
  };
}