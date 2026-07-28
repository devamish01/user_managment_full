/**
 * UserList — main user list page.
 * Uses shared components, hooks, and utils.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, UserMinus, ShieldBan, Plus, Download, Eye, EyeOff, Trash2, MoreHorizontal, Pencil } from "lucide-react";
import { useStore, useHasPermission } from "@/store";
import useUsersStore from "@/modules/users/store";
import { useToast } from "@/components/ui/toast";
import { Dropdown, DropdownItem, Switch } from "@/components/ui";
import { SharedButton, SharedBadge, SharedModal, SharedSearch, SharedPagination, SharedTable, DateRangeFilter, ErrorState } from "@/shared/components";
import { statusToBadgeVariant } from "@/shared/utils/format";
import { UserStatCard } from "./UserStatCard";
import { UsersSkeleton } from "./UsersSkeleton";
import { useUserFilters } from "../hooks/useUserFilters";
import { useUserForm } from "../hooks/useUserForm";
import { userRoutesConfig } from "../routes";
import type { User, Status } from "@/lib/types";
import type { TableColumn } from "@/shared/types/table";
import type { PaginationMeta } from "@/shared/types/pagination";

interface UserListProps {}

export const UserList: React.FC<UserListProps> = () => {
  console.count('render user list')
  const { roles } = useStore();
  const { users, loading, error, getUsers, createUser, updateUser, deleteUser, pagination } = useUsersStore();
  
  const navigate = useNavigate();
  const hasPermission = useHasPermission();
  const { toast } = useToast();

  const {
    roleFilter,
    statusFilter,
    dateRange,
    setRoleFilter,
    setStatusFilter,
    setDateRange,
    resetFilters,
    searchQuery,
    debouncedSearch,
    setSearchQuery,
    page,
    limit,
    setPage,
    sortKey,
    sortDir,
    setSort,
  } = useUserFilters();

  const canCreate = hasPermission("users.create");
  const canEdit = hasPermission("users.update");
  const canDelete = hasPermission("users.delete");
  const canExport = hasPermission("users.export");
  const viewId = hasPermission("users.col_id");
  const viewName = hasPermission("users.col_name");
  const viewEmailCol = hasPermission("users.col_email");
  const viewRoles = hasPermission("users.col_role");
  const viewStatusCol = hasPermission("users.col_status");
  const showTabActive = hasPermission("users.tab_active");
  const showTabInactive = hasPermission("users.tab_inactive");
  const showTabBlocked = hasPermission("users.tab_blocked");

  const [showStats, setShowStats] = React.useState(true);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [deleteUserObj, setDeleteUserObj] = React.useState<User | null>(null);
  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const { form, setField, resetForm, initializeForm } = useUserForm(roles[0]?.id || "");

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
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      status: user.status,
    }, roles);
    setFormModalOpen(true);
  };

  const closeForm = () => { setFormModalOpen(false); setEditingUser(null); resetForm(); };

  const saveForm = async () => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, form);
        toast({ type: "success", title: "User updated" });
      } else {
        await createUser({
          ...form,
          departmentId: "d1",
          jobTitle: "",
          location: "",
          address: "",
          bio: "",
        });
        toast({ type: "success", title: "User created" });
      }
      closeForm();
    } catch (error: any) {
      toast({ type: "error", title: "Error", description: error.message });
    }
  };

  const confirmDelete = async () => {
    if (!deleteUserObj) return;
    try {
      await deleteUser(deleteUserObj.id);
      toast({ type: "success", title: "User deleted" });
      setDeleteUserObj(null);
      setSelectedIds([]);
    } catch (error: any) {
      toast({ type: "error", title: "Delete failed", description: error.message });
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
      toast({ type: "success", title: "Bulk action completed" });
    } catch (error: any) {
      toast({ type: "error", title: "Bulk action failed", description: error.message });
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
                    await updateUser(row.id, { status: nextStatus });
                    toast({ type: "success", title: "Status updated" });
                  } catch (error: any) {
                    toast({ type: "error", title: "Update failed", description: error.message });
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
                          await updateUser(row.id, { status: "active" });
                          toast({ type: "success", title: "User unblocked" });
                        } catch (error: any) {
                          toast({ type: "error", title: "Action failed", description: error.message });
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
                          await updateUser(row.id, { status: "blocked" });
                          toast({ type: "success", title: "User blocked" });
                        } catch (error: any) {
                          toast({ type: "error", title: "Action failed", description: error.message });
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
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Users List</h1>
          <p className="mt-1 text-sm text-muted-foreground">{meta.total} total members</p>
        </div>
        <div className="flex gap-2">
          <SharedButton variant="outline" onClick={() => setShowStats(!showStats)}>
            {showStats ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="ml-2">{showStats ? "Hide Stats" : "Show Stats"}</span>
          </SharedButton>
          {canExport && (
            <SharedButton variant="outline" onClick={() => toast({ type: "info", title: "Exported!", description: "CSV downloaded." })}>
              <Download size={14} /> Export
            </SharedButton>
          )}
          {canCreate && (
            <SharedButton onClick={openCreate}>
              <Plus size={14} /> Add User
            </SharedButton>
          )}
        </div>
      </div>

      {showStats && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-in">
          <UserStatCard
            label="Total Users"
            count={stats.total}
            icon={<Users size={20} />}
            gradient="from-violet-500 to-indigo-600"
            active={statusFilter === "all"}
            onClick={() => handleStatClick("all")}
          />
          {showTabActive && (
            <UserStatCard
              label="Active Users"
              count={stats.active}
              icon={<UserCheck size={20} />}
              gradient="from-emerald-500 to-teal-500"
              active={statusFilter === "active"}
              onClick={() => handleStatClick("active")}
            />
          )}
          {showTabInactive && (
            <UserStatCard
              label="Inactive Users"
              count={stats.inactive}
              icon={<UserMinus size={20} />}
              gradient="from-slate-400 to-slate-600"
              active={statusFilter === "inactive"}
              onClick={() => handleStatClick("inactive")}
            />
          )}
          {showTabBlocked && (
            <UserStatCard
              label="Blocked Users"
              count={stats.blocked}
              icon={<ShieldBan size={20} />}
              gradient="from-red-500 to-rose-600"
              active={statusFilter === "blocked"}
              onClick={() => handleStatClick("blocked")}
            />
          )}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm">
            <span className="font-semibold">{selectedIds.length}</span> user{selectedIds.length > 1 ? "s" : ""} selected
          </p>
          <div className="flex flex-wrap gap-2">
            <SharedButton variant="outline" size="sm" onClick={() => runBulkAction("activate")}>Activate Selected</SharedButton>
            <SharedButton variant="outline" size="sm" onClick={() => runBulkAction("deactivate")}>Deactivate Selected</SharedButton>
            <SharedButton variant="outline" size="sm" onClick={() => runBulkAction("block")}>Block Selected</SharedButton>
            <SharedButton variant="destructive" size="sm" onClick={() => runBulkAction("delete")}>Delete Selected</SharedButton>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-6 lg:col-span-4">
          <SharedSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search users..." />
        </div>
        <div className="md:col-span-3 lg:col-span-2">
          <select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-3 lg:col-span-2">
          <select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <div className="md:col-span-10 lg:col-span-3">
          <DateRangeFilter value={dateRange} onChange={setDateRange} placeholder="Filter by join date" />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <SharedButton variant="outline" className="w-full" onClick={resetFilters}>Reset</SharedButton>
        </div>
      </div>

      <SharedTable
        columns={columns}
        data={visibleUsers}
        sort={{ key: sortKey, direction: sortDir }}
        onSort={setSort}
        rowKey={(u) => u.id}
        onRowClick={(u) => navigate(userRoutesConfig.details(u.id))}
        emptyMessage="No users match your filters."
      />

      <SharedPagination meta={meta} onPageChange={setPage} className="px-4" />

      <SharedModal open={formModalOpen} onClose={closeForm} size="lg" title={editingUser ? "Edit User" : "Add New User"}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2 space-y-1.5"><label className="text-sm font-medium">Full Name *</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.name} onChange={(e) => setField("name", e.target.value)} /></div>
          <div className="space-y-1.5"><label className="text-sm font-medium">Email *</label><input type="email" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.email} onChange={(e) => setField("email", e.target.value)} /></div>
          <div className="space-y-1.5"><label className="text-sm font-medium">Mobile</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.phone} onChange={(e) => setField("phone", e.target.value)} /></div>
          <div className="space-y-1.5"><label className="text-sm font-medium">Role</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.roleId} onChange={(e) => setField("roleId", e.target.value)}>{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
          <div className="space-y-1.5"><label className="text-sm font-medium">Status</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setField("status", e.target.value as Status)}><option value="active">Active</option><option value="inactive">Inactive</option><option value="blocked">Blocked</option></select></div>
        </div>
        <div className="flex justify-end gap-2 mt-6"><SharedButton variant="outline" onClick={closeForm}>Cancel</SharedButton><SharedButton onClick={saveForm}>{editingUser ? "Save Changes" : "Create User"}</SharedButton></div>
      </SharedModal>

      <SharedModal open={!!deleteUserObj} onClose={() => setDeleteUserObj(null)} size="sm">
        <div className="space-y-4 text-center">
          <Trash2 size={40} className="mx-auto text-red-500" />
          <h3 className="text-lg font-semibold">Delete User?</h3>
          <p className="text-sm text-muted-foreground">Delete {deleteUserObj?.name}? This cannot be undone.</p>
          <div className="flex justify-center gap-2"><SharedButton variant="outline" onClick={() => setDeleteUserObj(null)}>Cancel</SharedButton><SharedButton variant="destructive" onClick={confirmDelete}>Delete</SharedButton></div>
        </div>
      </SharedModal>
    </div>
  );
};
