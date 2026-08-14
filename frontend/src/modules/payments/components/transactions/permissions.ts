import { useHasPermission } from "@/store";

export const useTransactionPermissions = () => {
  const hasPermission = useHasPermission();

  const canView = hasPermission("transactions.view");
  const canCreate = hasPermission("transactions.create");
  const canEdit = hasPermission("transactions.edit");
  const canDelete = hasPermission("transactions.delete");
  const canExport = hasPermission("transactions.export");

  // Column visibility
  const viewUserCol = hasPermission("transactions.col_user");
  const viewAmountCol = hasPermission("transactions.col_amount");
  const viewDirectionCol = hasPermission("transactions.col_direction");
  const viewStatusCol = hasPermission("transactions.col_status");
  const viewCategoryCol = hasPermission("transactions.col_category");
  const viewSourceCol = hasPermission("transactions.col_source");
  const viewMethodCol = hasPermission("transactions.col_method");
  const viewDateCol = hasPermission("transactions.col_date");
  const viewActionsCol = hasPermission("transactions.col_actions");

  // Filter visibility
  const viewSearchFilter = hasPermission("transactions.ui_search");
  const viewStatusFilter = hasPermission("transactions.ui_status");
  const viewDirectionFilter = hasPermission("transactions.ui_direction");
  const viewCategoryFilter = hasPermission("transactions.ui_category");

  // Stats visibility
  const viewStats = hasPermission("transactions.view");

  return {
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    viewUserCol,
    viewAmountCol,
    viewDirectionCol,
    viewStatusCol,
    viewCategoryCol,
    viewSourceCol,
    viewMethodCol,
    viewDateCol,
    viewActionsCol,
    viewSearchFilter,
    viewStatusFilter,
    viewDirectionFilter,
    viewCategoryFilter,
    viewStats,
  };
};