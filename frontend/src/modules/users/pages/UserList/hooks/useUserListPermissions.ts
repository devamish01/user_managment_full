import { useHasPermission } from "@/store";

export const useUserListPermissions = () => {
  const hasPermission = useHasPermission();

  const canCreate = hasPermission("users.create");
  const canEdit = hasPermission("users.update");
  const canDelete = hasPermission("users.delete");
  const canExport = hasPermission("users.export");
  const canResetPassword = hasPermission("users.reset_password");

  const viewId = hasPermission("users.col_id");
  const viewName = hasPermission("users.col_name");
  const viewEmailCol = hasPermission("users.col_email");
  const viewRoles = hasPermission("users.col_role");
  const viewStatusCol = hasPermission("users.col_status");

  const showTabActive = hasPermission("users.tab_active");
  const showTabInactive = hasPermission("users.tab_inactive");
  const showTabBlocked = hasPermission("users.tab_blocked");

  return {
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canResetPassword,
    viewId,
    viewName,
    viewEmailCol,
    viewRoles,
    viewStatusCol,
    showTabActive,
    showTabInactive,
    showTabBlocked,
  };
};