import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  UserCheck,
  ShieldBan,
  Trash2,
} from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useStore } from "@/store";
import useUsersStore from "@/modules/users/store";
import { useToastError } from "@/core/api/toastUtils";
import { Dropdown, DropdownItem, Switch } from "@/components/ui";
import { SharedBadge, SharedPagination, ErrorState } from "@/shared/components";
import { statusToBadgeVariant } from "@/shared/utils/format";
import { UsersSkeleton } from "./components/UsersSkeleton";
import {
  useUserListPermissions,
  useUserFilters,
} from "@/modules/users/pages/UserList/hooks";
import { userRoutesConfig } from "@/modules/users/routes";

import type { User } from "@/lib/types";
import type { TableColumn } from "@/shared/types/table";
import type { PaginationMeta } from "@/shared/types/pagination";

import "@/modules/users/styles/users.css";

interface UserListProps {}

export const UserList: React.FC<UserListProps> = () => {
  const { roles } = useStore();

  const { users, loading, error, getUsers, updateUser, pagination } =
    useUsersStore();

  const navigate = useNavigate();
  const { toastError, toastSuccess } = useToastError();

  const {
    roleFilter,
    statusFilter,
    dateRange,
    period,
    days,
    debouncedSearch,
    page,
    limit,
    setPage,
    sortKey,
    sortDir,
    setSort,
    setLimit,
  } = useUserFilters();

  const {
    canEdit,
    canDelete,
    viewId,
    viewName,
    viewEmailCol,
    viewRoles,
    viewStatusCol,
  } = useUserListPermissions();

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  /*
   * ============================================================
   * DATE FILTER
   * ============================================================
   */

  const hasDateRange = !!dateRange.startDate || !!dateRange.endDate;

  const visibleUsers = React.useMemo(() => {
    if (!hasDateRange) {
      return users;
    }

    return users.filter((user) => {
      const created = new Date(user.createdAt);

      const afterStart =
        !dateRange.startDate ||
        created >= new Date(`${dateRange.startDate}T00:00:00`);

      const beforeEnd =
        !dateRange.endDate ||
        created <= new Date(`${dateRange.endDate}T23:59:59`);

      return afterStart && beforeEnd;
    });
  }, [users, dateRange, hasDateRange]);

  /*
   * ============================================================
   * VIRTUALIZATION
   * ============================================================
   */

  const tableScrollRef = React.useRef<HTMLDivElement>(null);

  /*
   * TEMPORARY TESTING STATE
   *
   * Initially render only 10 rows.
   * When user scrolls, next rows will be released
   * after 1 second.
   *
   * REMOVE THIS LATER FOR NORMAL PRODUCTION
   * VIRTUALIZATION BEHAVIOR.
   */
  const [renderLimit, setRenderLimit] = React.useState(12);
  const [batchLoading, setBatchLoading] = React.useState(false);

  const handleVirtualScroll = React.useCallback(() => {
    const element = tableScrollRef.current;

    if (!element || batchLoading) {
      return;
    }

    const distanceFromBottom =
      element.scrollHeight - (element.scrollTop + element.clientHeight);

    // 2 rows before reaching bottom
    const LOAD_THRESHOLD = 72 * 2;

    if (distanceFromBottom > LOAD_THRESHOLD) {
      return;
    }

    if (renderLimit >= visibleUsers.length) {
      return;
    }

    setBatchLoading(true);

    window.setTimeout(() => {
      setRenderLimit((prev) => Math.min(prev + 2, visibleUsers.length));

      setBatchLoading(false);
    }, 1000);
  }, [batchLoading, renderLimit, visibleUsers.length]);
  
  const rowVirtualizer = useVirtualizer({
    count: Math.min(renderLimit, visibleUsers.length),

    getScrollElement: () => tableScrollRef.current,

    estimateSize: () => 72,

    overscan: 2,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

  const handlePageSizeChange = React.useCallback(
    (size: number) => {
      setLimit(size);
      setPage(1);
    },
    [setLimit, setPage],
  );

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

    if (dateRange.startDate || dateRange.endDate) {
      if (dateRange.startDate) {
        params.startDate = dateRange.startDate;
      }

      if (dateRange.endDate) {
        params.endDate = dateRange.endDate;
      }
    } else if (period && period !== "all") {
      params.period = period;

      if (period === "custom" && days) {
        params.days = days;
      }
    }

    /*
     * Temporary API delay.
     *
     * This is only for testing/loading visibility.
     */
    const timer = window.setTimeout(() => {
      getUsers(params);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    getUsers,
    debouncedSearch,
    roleFilter,
    statusFilter,
    sortKey,
    sortDir,
    page,
    limit,
    dateRange,
    period,
    days,
  ]);

  /*
   * ============================================================
   * RETRY
   * ============================================================
   */

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
  }, [
    getUsers,
    debouncedSearch,
    roleFilter,
    statusFilter,
    sortKey,
    sortDir,
    page,
    limit,
  ]);

  /*
   * ============================================================
   * SELECTION
   * ============================================================
   */

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? visibleUsers.map((user) => user.id) : []);
  };

  const toggleRowSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked
        ? Array.from(new Set([...prev, id]))
        : prev.filter((item) => item !== id),
    );
  };

  /*
   * ============================================================
   * LOADING / ERROR
   * ============================================================
   */

  if (loading) {
    return <UsersSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load users"
        description={error}
        onRetry={handleRetry}
      />
    );
  }

  /*
   * ============================================================
   * PAGINATION META
   * ============================================================
   */

  const baseMeta: PaginationMeta = (pagination as PaginationMeta) || {
    page: 1,
    limit: 10,
    total: users.length,
    filteredTotal: users.length,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  };

  const meta: PaginationMeta = hasDateRange
    ? {
        page: 1,
        limit: visibleUsers.length || 1,
        total: visibleUsers.length,
        filteredTotal: visibleUsers.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      }
    : {
        ...baseMeta,
        page,
        limit,
        filteredTotal: pagination.filteredTotal ?? pagination.total,
      };

  /*
   * ============================================================
   * TABLE COLUMNS
   * ============================================================
   */

  const columns: TableColumn<User>[] = [];

  /*
   * Serial Number
   *
   * This is UI-only.
   * It is NOT part of User type.
   */
  columns.push({
    key: "serialNo" as any,
    label: "S.No.",
  });

  /*
   * Select
   */

  columns.push({
    key: "select",

    label: (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-border accent-primary"
        checked={
          visibleUsers.length > 0 && selectedIds.length === visibleUsers.length
        }
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

  /*
   * User ID
   */

  if (viewId) {
    columns.push({
      key: "id",
      label: "User ID",
      sortable: true,
    });
  }

  /*
   * Name
   */

  if (viewName) {
    columns.push({
      key: "name",
      label: "Name",
      sortable: true,
    });
  }

  /*
   * Email
   */

  if (viewEmailCol) {
    columns.push({
      key: "email",
      label: "Email",
      sortable: true,
      hiddenOnMobile: true,
    });
  }

  /*
   * Role
   */

  if (viewRoles) {
    columns.push({
      key: "roleId",
      label: "Role",
      hiddenOnMobile: true,

      render: (_, row) => {
        const role = roles.find((r) => r.id === row.roleId);

        return <SharedBadge variant="outline">{role?.name}</SharedBadge>;
      },
    });
  }

  /*
   * Status
   */

  if (viewStatusCol) {
    columns.push({
      key: "status",
      label: "Status",

      render: (_, row) => {
        const isBlocked = row.status === "blocked";

        if (isBlocked) {
          return <SharedBadge variant="destructive">blocked</SharedBadge>;
        }

        return (
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Switch
              checked={row.status === "active"}
              onCheckedChange={async (checked: boolean) => {
                const nextStatus = checked ? "active" : "inactive";

                try {
                  const response = await updateUser(row.id, {
                    status: nextStatus,
                  });

                  toastSuccess(response);
                } catch (error: any) {
                  toastError(error, {
                    title: "Update failed",
                  });
                }
              }}
              disabled={!canEdit}
            />

            <SharedBadge variant={statusToBadgeVariant(row.status)}>
              {row.status}
            </SharedBadge>
          </div>
        );
      },
    });
  }

  /*
   * Actions
   */

  columns.push({
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
                <Eye size={14} />
                View Details
              </DropdownItem>

              {canEdit && (
                <>
                  <DropdownItem
                    onClick={() => {
                      close();
                    }}
                  >
                    <Pencil size={14} />
                    Edit User
                  </DropdownItem>

                  {row.status === "blocked" ? (
                    <DropdownItem
                      onClick={async () => {
                        try {
                          const response = await updateUser(row.id, {
                            status: "active",
                          });

                          toastSuccess(response);
                        } catch (error: unknown) {
                          toastError(error, {
                            title: "Action failed",
                          });
                        }

                        close();
                      }}
                    >
                      <UserCheck size={14} className="text-emerald-500" />
                      Unblock User
                    </DropdownItem>
                  ) : (
                    <DropdownItem
                      onClick={async () => {
                        try {
                          const response = await updateUser(row.id, {
                            status: "blocked",
                          });

                          toastSuccess(response);
                        } catch (error: unknown) {
                          toastError(error, {
                            title: "Action failed",
                          });
                        }

                        close();
                      }}
                    >
                      <ShieldBan size={14} className="text-red-500" />
                      Block User
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
                      close();
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </DropdownItem>
                </>
              )}
            </>
          )}
        </Dropdown>
      </div>
    ),
  });

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div
      className="users-module-page"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {" "}
      <div
        className="users-module-content"
        style={{
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* =====================================================
            VIRTUALIZED TABLE
            ===================================================== */}
        <div className="flex h-5 items-center justify-center text-muted-foreground">
          {visibleUsers.length} {renderLimit}
        </div>
        <div
          ref={tableScrollRef}
          onScroll={handleVirtualScroll}
          className="w-full overflow-auto rounded-md border"
          style={{
            flex: 1,
            minHeight: 0,
            position: "relative",
          }}
        >
          {/* ===================================================
              HEADER
              =================================================== */}

          <div className="sticky top-0 z-10 bg-background border-b">
            <div className="flex min-w-max">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="h-12 px-4 flex items-center font-medium whitespace-nowrap"
                  style={{
                    width:
                      column.key === "serialNo"
                        ? 70
                        : column.key === "select"
                          ? 60
                          : column.key === "actions"
                            ? 100
                            : 180,
                  }}
                  onClick={() => {
                    if (column.sortable) {
                      setSort(column.key as string);
                    }
                  }}
                >
                  {column.label}
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================
              VIRTUALIZED BODY
              =================================================== */}

          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
              minWidth: "max-content",
            }}
          >
            {virtualRows.map((virtualRow) => {
              const row = visibleUsers[virtualRow.index];

              if (!row) {
                return null;
              }

              return (
                <div
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  className="absolute left-0 flex min-w-max w-full border-b hover:bg-muted/50 cursor-pointer"
                  style={{
                    top: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                    minHeight: `${virtualRow.size}px`,
                  }}
                  onClick={() => navigate(userRoutesConfig.details(row.id))}
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className="px-4 py-3 flex items-center"
                      style={{
                        width:
                          column.key === "serialNo"
                            ? 70
                            : column.key === "select"
                              ? 60
                              : column.key === "actions"
                                ? 100
                                : 180,
                      }}
                      onClick={(e) => {
                        if (
                          column.key === "select" ||
                          column.key === "actions"
                        ) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {/*
                       * S.No. is generated from
                       * virtual row index.
                       */}
                      {column.key === "serialNo"
                        ? virtualRow.index + 1
                        : column.render
                          ? column.render(row[column.key as keyof User], row)
                          : String(row[column.key as keyof User] ?? "")}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          {batchLoading && (
            <div className="sticky bottom-0 z-20 flex items-center justify-center gap-2 border-t bg-background px-4 py-3 text-sm text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              Loading more users...
            </div>
          )}
          {/* ===================================================
              EMPTY STATE
              =================================================== */}

          {visibleUsers.length === 0 && (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              No users match your filters.
            </div>
          )}
        </div>

        {/* =====================================================
            PAGINATION
            ===================================================== */}

        <SharedPagination
          meta={meta}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          className="users-module-pagination"
        />
      </div>
    </div>
  );
};
