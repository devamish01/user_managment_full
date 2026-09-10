/**
 * UserList — main user list page.
 * Uses shared components, hooks, and utils.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Eye, Pencil, UserCheck, ShieldBan, Trash2, Key } from "lucide-react";
import { useStore } from "@/store";
import useUsersStore from "@/modules/users/store";
import { useToastError } from "@/core/api/toastUtils";
import { Dropdown, DropdownItem, Switch } from "@/components/ui";
import { SharedBadge, SharedPagination, ErrorState } from "@/shared/components";
import { statusToBadgeVariant } from "@/shared/utils/format";
import { UsersSkeleton } from "./components/UsersSkeleton";
import { useUserForm } from "@/modules/users/hooks/useUserForm";
import { useUserListPermissions ,useUserFilters } from "@/modules/users/pages/UserList/hooks";
import { userRoutesConfig } from "@/modules/users/routes";
import type { User } from "@/lib/types";
import type { TableColumn } from "@/shared/types/table";
import type { PaginationMeta } from "@/shared/types/pagination";
import "@/modules/users/styles/users.css";
import {
  UserListHeader,
  UserStatsBar,
  PeriodTabs,
  UserBulkActionsBar,
  UserFiltersBar,
  UserTableWrapper,
  UserFormModal,
  DeleteUserModal,
} from "./components";

interface UserListProps {}

export const UserList: React.FC<UserListProps> = () => {
  const { roles } = useStore();
  const { users, loading, error, getUsers, createUser, updateUser, deleteUser, pagination } = useUsersStore();
  
  const navigate = useNavigate();
  const { toastError, toastSuccess } = useToastError();

  const {
    roleFilter,
    statusFilter,
    dateRange,
    setRoleFilter,
    setStatusFilter,
    setDateRange,
    resetFilters,
    period,
    setPeriod,
    days,
    setDays,
    searchQuery,
    debouncedSearch,
    setSearchQuery,
    page,
    limit,
    setPage,
    sortKey,
    sortDir,
    setSort,
    setLimit,
  } = useUserFilters();

  const {
    canCreate,
    canEdit,
    canDelete,
    canExport,
    viewId,
    viewName,
    viewEmailCol,
    viewRoles,
    viewStatusCol,
    showTabActive,
    showTabInactive,
    showTabBlocked,
  } = useUserListPermissions();

  const [showStats, setShowStats] = React.useState(true);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [deleteUserObj, setDeleteUserObj] = React.useState<User | null>(null);
  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const { form, setField, resetForm, initializeForm } = useUserForm(roles[0]?.id || "");

  const handlePageSizeChange = React.useCallback((size: number) => {
    setLimit(size);
    setPage(1);
  }, [setLimit, setPage]);



  const hasDateRange = !!dateRange.startDate || !!dateRange.endDate;
  const visibleUsers = React.useMemo(() => {
    if (!hasDateRange) return users;
    return users.filter((user) => {
      const created = new Date(user.createdAt);
      const afterStart = !dateRange.startDate || created >= new Date(`${dateRange.startDate}T00:00:00`);
      const beforeEnd = !dateRange.endDate || created <= new Date(`${dateRange.endDate}T23:59:59`);
      return afterStart && beforeEnd;
    });
  }, [users, dateRange, hasDateRange]);
  
  // Fetch users when params change
  React.useEffect(() => {
    const params: any = {
      search: debouncedSearch || undefined,
      roleId: roleFilter === "all" ? undefined : roleFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      limit,
      sort: sortKey,
      order: sortDir,
    };

    // If explicit date range selected, it takes precedence
    if (dateRange.startDate || dateRange.endDate) {
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
    } else if (period && period !== "all") {
      params.period = period;
      if (period === "custom" && days) params.days = days;
    }

    getUsers(params);
  }, [getUsers, debouncedSearch, roleFilter, statusFilter, sortKey, sortDir, page, limit, dateRange, period, days]);

  // Reset selection whenever filters / data change.
  React.useEffect(() => {
    setSelectedIds([]);
  }, [users, roleFilter, statusFilter, debouncedSearch, dateRange.startDate, dateRange.endDate, page, limit, sortKey, sortDir]);

  // Stable retry callback for the error state (declared before any early return).
  const handleRetry = React.useCallback(() => {
    getUsers({
      search: debouncedSearch || undefined,
      roleId: roleFilter === "all" ? undefined : roleFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      limit,
      sort: sortKey,
      order: sortDir,
    });
  }, [getUsers, debouncedSearch, roleFilter, statusFilter, sortKey, sortDir, page, limit]);

  // ── Standard page lifecycle (declared AFTER all hooks) ──
  if (loading) return <UsersSkeleton />;
  
  if (error) {
    return (
      <ErrorState
        title="Unable to load users"
        description={error}
        onRetry={handleRetry}
      />
    );
  }

  const baseMeta: PaginationMeta = (pagination as PaginationMeta) || { page: 1, limit: 10, total: users.length, totalPages: 1, hasNext: false, hasPrevious: false };
  // When a client-side date range is applied, pagination meta no longer matches visible rows.
  const meta: PaginationMeta = hasDateRange
    ? { page: 1, limit: visibleUsers.length || 1, total: visibleUsers.length, totalPages: 1, hasNext: false, hasPrevious: false }
    : baseMeta;

  // Global stats come from the backend meta so they always reflect the entire dataset (124 etc.)
  // regardless of the current page, filters or search.
  const stats = baseMeta.stats || {
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
  };

  const handleStatClick = (status: "all" | "active" | "inactive" | "blocked") => {
    setStatusFilter(statusFilter === status ? "all" : status);
  };

  const openCreate = () => {
    setEditingUser(null);
    initializeForm(undefined, roles);
    setFormModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    initializeForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      roleId: user.roleId,
      status: user.status,
      location: user.location,
      address: user.address,
      bio: user.bio,
      jobTitle: user.jobTitle,
    }, roles);
    setFormModalOpen(true);
  };

  const closeForm = () => { setFormModalOpen(false); setEditingUser(null); resetForm(); };

  const saveForm = async () => {
    try {
      if (editingUser) {
        const { ...updatePayload } = form;
        const response = await updateUser(editingUser.id, updatePayload);

        toastSuccess(response);
      } else {
        const response = await createUser(form);
        toastSuccess(response);
      }
      closeForm();
    } catch (error: any) {
      const fieldErrors = toastError(error);
      // If there are field errors, they could be used to set form validation state
      if (Object.keys(fieldErrors).length > 0) {
        // Field errors are already shown in toast, but could also be set on form
        console.log("Field errors:", fieldErrors);
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteUserObj) return;
    try {
      const response = await deleteUser(deleteUserObj.id);
      toastSuccess(response);
      setDeleteUserObj(null);
      setSelectedIds([]);
    } catch (error: any) {
      toastError(error, { title: "Delete failed" });
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? visibleUsers.map((u) => u.id) : []);
  };

  const toggleRowSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id),
    );
  };

  const runBulkAction = async (action: "delete" | "activate" | "deactivate" | "block") => {
    if (selectedIds.length === 0) return;
    try {
      if (action === "delete") {
        await Promise.all(selectedIds.map((id) => deleteUser(id)));
      } else {
        const statusMap = {
          activate: "active",
          deactivate: "inactive",
          block: "blocked",
        } as const;
        const nextStatus = statusMap[action];
        await Promise.all(selectedIds.map((id) => updateUser(id, { status: nextStatus })));
      }
      setSelectedIds([]);
      toastSuccess("Bulk action completed");
    } catch (error: any) {
      toastError(error, { title: "Bulk action failed" });
    }
  };

  // Build table columns
  const getColumns = (canEdit: boolean, canDelete: boolean, openEdit: (u: User) => void): TableColumn<User>[] => {
    const cols: TableColumn<User>[] = [];
    cols.push({
      key: "select",
      label: (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border accent-primary"
          checked={visibleUsers.length > 0 && selectedIds.length === visibleUsers.length}
          onChange={(e) => toggleSelectAll(e.target.checked)}
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border accent-primary"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => toggleRowSelection(row.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    });
    if (viewId) cols.push({ key: "id", label: "User ID", sortable: true });
    if (viewName) cols.push({ key: "name", label: "Name", sortable: true });
    if (viewEmailCol) cols.push({ key: "email", label: "Email", sortable: true, hiddenOnMobile: true });
    if (viewRoles) cols.push({ key: "roleId", label: "Role", hiddenOnMobile: true, render: (_, row) => { const role = roles.find(r => r.id === row.roleId); return <SharedBadge variant="outline">{role?.name}</SharedBadge>; } });
    if (viewStatusCol) {
      cols.push({
        key: "status",
        label: "Status",
        render: (_, row) => {
          const isBlocked = row.status === "blocked";
          if (isBlocked) {
            return <SharedBadge variant="destructive">blocked</SharedBadge>;
          }
          return (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={row.status === "active"}
                onCheckedChange={async (checked: boolean) => {
                  const nextStatus = checked ? "active" : "inactive";
                  try {
                    const response = await updateUser(row.id, { status: nextStatus });
                    toastSuccess(response);
                  } catch (error: any) {
                    toastError(error, { title: "Update failed" });
                  }
                }}
                disabled={!canEdit}
              />
              <SharedBadge variant={statusToBadgeVariant(row.status)}>{row.status}</SharedBadge>
            </div>
          );
        },
      });
    }

    cols.push({
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={
              <button className="p-1.5 hover:bg-accent rounded-md text-muted-foreground transition-all hover:text-foreground">
                <MoreHorizontal size={16} />
              </button>
            }
          >
            {(close) => (
              <>
                <DropdownItem
                  onClick={() => {
                    navigate(userRoutesConfig.details(row.id));
                    close();
                  }}
                >
                  <Eye size={14} /> View Details
                </DropdownItem>
              {canEdit && (
                <>
                  <DropdownItem
                    onClick={() => {
                      openEdit(row);
                      close();
                    }}
                  >
                    <Pencil size={14} /> Edit User
                  </DropdownItem>
                  {row.status === "blocked" ? (
                    <DropdownItem
                      onClick={async () => {
                        try {
                          const response = await updateUser(row.id, { status: "active" });
                          toastSuccess(response);
                        } catch (error: any) {
                          toastError(error, { title: "Action failed" });
                        }
                        close();
                      }}
                    >
                      <UserCheck size={14} className="text-emerald-500" /> Unblock User
                    </DropdownItem>
                  ) : (
                    <DropdownItem
                      onClick={async () => {
                        try {
                          const response = await updateUser(row.id, { status: "blocked" });
                          toastSuccess(response);
                        } catch (error: any) {
                          toastError(error, { title: "Action failed" });
                        }
                        close();
                      }}
                    >
                      <ShieldBan size={14} className="text-red-500" /> Block User
                    </DropdownItem>
                  )}
                </>
              )}
              
                {canDelete && (
                  <>
                    <div className="my-1 h-px bg-border" />
                    <DropdownItem
                      destructive
                      onClick={() => {
                        setDeleteUserObj(row);
                        close();
                      }}
                    >
                      <Trash2 size={14} /> Delete
                    </DropdownItem>
                  </>
                )}
              </>
            )}
          </Dropdown>
        </div>
      ),
    });
    
    return cols;
  };

  const columns = getColumns(canEdit, canDelete, openEdit);

  return (
    <div className="users-module-page">
      <div className="users-module-content">
        <UserListHeader
          total={meta.total}
          showStats={showStats}
          onToggleStats={() => setShowStats(!showStats)}
          canExport={canExport}
          onExport={() => toastSuccess("CSV downloaded.", { title: "Exported!" })}
          canCreate={canCreate}
          onCreate={openCreate}
        />

        {showStats && (
          <UserStatsBar
            stats={stats}
            statusFilter={statusFilter}
            onStatusClick={handleStatClick}
            showTabActive={showTabActive}
            showTabInactive={showTabInactive}
            showTabBlocked={showTabBlocked}
          />
        )}

        <PeriodTabs
          period={period}
          onPeriodChange={setPeriod}
          onDaysChange={setDays}
          onDateRangeChange={setDateRange}
          onPageChange={setPage}
        />

        <UserBulkActionsBar
          selectedCount={selectedIds.length}
          onAction={runBulkAction}
        />

        <UserFiltersBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          dateRange={dateRange}
          roles={roles}
          onRoleChange={setRoleFilter}
          onStatusChange={setStatusFilter}
          onDateRangeChange={setDateRange}
          onReset={resetFilters}
        />

        <UserTableWrapper
          columns={columns}
          data={visibleUsers}
          sort={{ key: sortKey, direction: sortDir }}
          onSort={setSort}
          onRowClick={(u) => navigate(userRoutesConfig.details(u.id))}
          emptyMessage="No users match your filters."
        />

        <SharedPagination
          meta={meta}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          className="users-module-pagination"
        />

        <UserFormModal
          open={formModalOpen}
          onClose={closeForm}
          editingUser={editingUser}
          form={form}
          setField={setField}
          roles={roles}
          onSave={saveForm}
        />

        <DeleteUserModal
          open={!!deleteUserObj}
          user={deleteUserObj}
          onClose={() => setDeleteUserObj(null)}
          onConfirm={confirmDelete}
        />

   
      </div>
    </div>
  );
};