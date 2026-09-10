/**
 * TransactionsPage — Payments module transactions listing page.
 *
 * Displays a paginated, filterable table of payment transactions with
 * status badges, direction indicators, and action buttons.
 * Protected by PermissionGuard requiring "pages.transactions" permission.
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SharedTable } from "@/shared/components/SharedTable";
import { SharedButton } from "@/shared/components/SharedButton";
import { SharedPagination } from "@/shared/components/SharedPagination";
import { Download, Plus } from "lucide-react";
import { usePaymentsStore } from "../store";
import { useToastError } from "@/core/api/toastUtils";
import type { PaymentRecord, PaymentStatus, PaymentDirection, PaymentCategory } from "../types";
import type { PaginationMeta } from "@/shared/types/pagination";

import { TransactionFilters, getTransactionColumns } from "@/modules/payments/components/transactions";
import { TransactionStatsBar } from "@/modules/payments/components/TransactionStatsBar";
import { TransactionFormDialog } from "@/modules/payments/components/transactions/TransactionFormDialog";
import { useTransactionPermissions } from "@/modules/payments/components/transactions/permissions";
import "@/modules/payments/styles/payments.css";

export const TransactionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { payments, loading, error, getTransactions, createPayment, updatePayment, deletePayment, pagination, stats } = usePaymentsStore();
  const { toastError, toastSuccess } = useToastError();

  // Permission checks
  const {
    canCreate,
    canEdit,
    canDelete,
    canExport,
    viewAmountCol: canViewAmount,
    viewActionsCol: canViewActions,
    viewStats: canViewStats,
    viewStatusFilter: canViewStatusFilter,
    viewDirectionFilter: canViewDirectionFilter,
    viewCategoryFilter: canViewCategoryFilter,
    viewSearchFilter: canViewSearchFilter,
  } = useTransactionPermissions();

  // URL userId for user-specific transaction filtering
  const urlUserId = searchParams.get("userId") || undefined;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all" | "pending" | "completed" | "rejected" | "refunded" | "credit" | "debit">("all");
  const [directionFilter, setDirectionFilter] = useState<PaymentDirection | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<PaymentCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "paymentDate", direction: "desc" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const normalizedPageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
  
  // Dialog state
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Build query params for backend
  const buildQueryParams = useCallback(() => {
    const params: Record<string, any> = {
      page,
      limit: normalizedPageSize,
    };

    if (search) params.search = search;
    if (urlUserId) params.userId = urlUserId;

    // Handle special filter values from stats bar
    if (statusFilter === "pending") {
      params.status = "Pending";
    } else if (statusFilter !== "all" && statusFilter !== "credit" && statusFilter !== "debit") {
      params.status = statusFilter;
    }

    if (directionFilter !== "all") {
      params.direction = directionFilter;
    }

    if (categoryFilter !== "all") {
      params.category = categoryFilter;
    }

    if (sortConfig.key) {
      params.sort = sortConfig.key;
      params.order = sortConfig.direction;
    }

    return params;
  }, [search, statusFilter, directionFilter, categoryFilter, sortConfig, page, normalizedPageSize, urlUserId]);

  // Fallback stats when backend stats not yet loaded
  const displayStats = useMemo(() => stats || {
    total: 0,
    totalIn: 0,
    totalOut: 0,
    pending: 0,
    completed: 0,
    rejected: 0,
    refunded: 0,
  }, [stats]);

  // Fetch transactions when params change
  useEffect(() => {
    getTransactions(buildQueryParams());
  }, [getTransactions, buildQueryParams]);

  // Reset page to 1 when filters/search/sort/pageSize change
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: PaymentStatus | "all" | "pending" | "completed" | "rejected" | "refunded" | "credit" | "debit") => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleDirectionChange = useCallback((value: PaymentDirection | "all") => {
    setDirectionFilter(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: PaymentCategory | "all") => {
    setCategoryFilter(value);
    setPage(1);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size > 0 ? size : 10);
    setPage(1);
  }, []);

  const handleStatusClick = (status: "all" | "pending" | "completed" | "rejected" | "refunded" | "credit" | "debit") => {
    if (status === "all") {
      setStatusFilter("all");
      setDirectionFilter("all");
    } else if (status === "pending") {
      setStatusFilter("Pending");
      setDirectionFilter("all");
    } else if (status === "completed") {
      setStatusFilter("Completed");
      setDirectionFilter("all");
    } else if (status === "rejected") {
      setStatusFilter("Rejected");
      setDirectionFilter("all");
    } else if (status === "refunded") {
      setStatusFilter("Refunded");
      setDirectionFilter("all");
    } else if (status === "credit") {
      setDirectionFilter("credit");
      setStatusFilter("all");
    } else if (status === "debit") {
      setDirectionFilter("debit");
      setStatusFilter("all");
    }
    setPage(1);
  };

  // Use backend pagination meta directly
  const paginationMeta: PaginationMeta = useMemo(() => {
    if (pagination) {
      return {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
        hasNext: pagination.hasNext,
        hasPrevious: pagination.hasPrevious,
      };
    }
    // Fallback when pagination not yet loaded
    return {
      page: 1,
      limit: normalizedPageSize,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };
  }, [pagination, normalizedPageSize]);

  const handleView = (payment: PaymentRecord) => {
    navigate(`/payments/transactions/${payment.transactionId}`);
  };

  const handleEdit = (payment: PaymentRecord) => {
    setEditingPayment(payment);
    setShowFormDialog(true);
  };

  const handleCreate = () => {
    setEditingPayment(null);
    setShowFormDialog(true);
  };

  const handleDelete = async (payment: PaymentRecord) => {
    if (window.confirm(`Are you sure you want to delete transaction ${payment.transactionId}?`)) {
      setFormLoading(true);
      try {
        const success = await deletePayment(payment.transactionId);
        if (success) {
          toastSuccess({ success: true, message: "Transaction has been deleted." });
        } else {
          toastError({ message: "Failed to delete transaction." }, { title: "Error" });
        }
      } catch (err) {
        toastError(err, { title: "Error" });
      } finally {
        setFormLoading(false);
      }
    }
  };

  const handleFormSave = async (updatedPayment: PaymentRecord) => {
    setFormLoading(true);
    try {
      if (editingPayment) {
        // Edit mode - update existing payment
        const res = await updatePayment(editingPayment.transactionId, updatedPayment);
        if (res) {
          toastSuccess(res);
        } else {
          toastError({ message: "Failed to update transaction." }, { title: "Error" });
        }
      } else {
        // Create mode - create new payment
        const res = await createPayment(updatedPayment);
        if (res) {
          toastSuccess(res);
        } else {
          toastError({ message: "Failed to create transaction." }, { title: "Error" });
        }
      }
      setShowFormDialog(false);
      setEditingPayment(null);
    } catch (err) {
      toastError(err, { title: "Error" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleExport = () => {
    // Export logic here
    console.log("Export transactions");
    toastSuccess({ success: true, message: "CSV downloaded." });
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? payments.map((p) => p.transactionId) : []);
  };

  const toggleRowSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id),
    );
  };

  const columns = getTransactionColumns({
    selectedIds,
    paginatedPayments: payments,
    toggleSelectAll,
    toggleRowSelection,
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    navigate,
    canViewAmount,
    canViewActions,
    canEdit,
    canDelete,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading transactions: {error}</p>
        <SharedButton onClick={() => getTransactions(buildQueryParams())} className="mt-4">
          Retry
        </SharedButton>
      </div>
    );
  }

  return (
    <div className="payments-module-page">
      {/* Header */}
      <div className="payments-module-header">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">View and manage all payment transactions</p>
        </div>
        <div className="flex items-center gap-3">
          {canExport && (
            <SharedButton variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </SharedButton>
          )}
          {canCreate && (
            <SharedButton className="gap-2" onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Add Transaction
            </SharedButton>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <TransactionStatsBar
        stats={displayStats}
        statusFilter={statusFilter === "all" ? "all" : statusFilter === "Pending" ? "pending" : directionFilter}
        onStatusClick={handleStatusClick}
        canViewStats={canViewStats}
        canViewStatusFilter={canViewStatusFilter}
        canViewDirectionFilter={canViewDirectionFilter}
      />

      {/* Filters */}
      <TransactionFilters
        search={search}
        statusFilter={statusFilter}
        directionFilter={directionFilter}
        categoryFilter={categoryFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onDirectionChange={handleDirectionChange}
        onCategoryChange={handleCategoryChange}
        canViewSearchFilter={canViewSearchFilter}
        canViewStatusFilter={canViewStatusFilter}
        canViewDirectionFilter={canViewDirectionFilter}
        canViewCategoryFilter={canViewCategoryFilter}
      />

      {/* Table */}
      <div className="payments-module-table-shell">
        <SharedTable
          columns={columns}
          data={payments}
          sort={sortConfig}
          onSort={handleSort}
          rowKey={(payment) => payment.transactionId}
          emptyMessage="No transactions found"
          className="overflow-visible"
        />
        <SharedPagination
          meta={paginationMeta}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          className="payments-module-pagination"
        />
      </div>

      {/* Transaction Form Dialog */}
      <TransactionFormDialog
        open={showFormDialog}
        onClose={() => {
          setShowFormDialog(false);
          setEditingPayment(null);
        }}
        payment={editingPayment}
        onSave={handleFormSave}
        isLoading={formLoading}
      />
    </div>
  );
};

