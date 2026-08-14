/**
 * TransactionsPage — Payments module transactions listing page.
 *
 * Displays a paginated, filterable table of payment transactions with
 * status badges, direction indicators, and action buttons.
 * Protected by PermissionGuard requiring "pages.transactions" permission.
 */

import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SharedTable } from "@/shared/components/SharedTable";
import { SharedButton } from "@/shared/components/SharedButton";
import { SharedPagination } from "@/shared/components/SharedPagination";
import { Download, Plus, ArrowLeft, User } from "lucide-react";
import { usePaymentsStore } from "../store";
import { useToast } from "@/components/ui/toast";
import { useHasPermission } from "@/store";
import type { PaymentRecord, PaymentStatus, PaymentDirection, PaymentCategory } from "../types";
import type { PaginationMeta } from "@/shared/types/pagination";

import { TransactionFilters, getTransactionColumns } from "@/modules/payments/components/transactions";
import { TransactionStatsBar } from "@/modules/payments/components/TransactionStatsBar";
import { TransactionFormDialog } from "@/modules/payments/components/transactions/TransactionFormDialog";
import { useTransactionPermissions } from "@/modules/payments/components/transactions/permissions";

export const TransactionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const { payments, loading, error, getPayments, createPayment, updatePayment, deletePayment } = usePaymentsStore();
  const { toast } = useToast();

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

  // Debug: log payments state
//   React.useEffect(() => {
//     console.log('TransactionsPage - payments:', payments);
//     console.log('TransactionsPage - loading:', loading);
//     console.log('TransactionsPage - error:', error);
//   }, [payments, loading, error]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all" | "pending" | "credit" | "debit">("all");
  const [directionFilter, setDirectionFilter] = useState<PaymentDirection | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<PaymentCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "paymentDate", direction: "desc" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Dialog state
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch user data if userId is provided
  const [userData, setUserData] = useState<{ id: string; name: string; email: string } | null>(null);
  
  useEffect(() => {
    if (userId) {
      // Find user in payments data
      const user = payments.find(p => p.user?.id === userId)?.user;
      if (user) {
        setUserData({ id: user.id, name: user.name, email: user.email });
      }
    } else {
      setUserData(null);
    }
  }, [userId, payments]);

  // Compute stats from all payments (not just filtered)
  const stats = useMemo(() => ({
    total: payments.length,
    totalIn: payments.filter(p => p.direction === "credit").reduce((sum, p) => sum + p.amount, 0),
    totalOut: payments.filter(p => p.direction === "debit").reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === "Pending").length,
  }), [payments]);

  const handleStatusClick = (status: "all" | "pending" | "credit" | "debit") => {
    if (status === "all") {
      setStatusFilter("all");
      setDirectionFilter("all");
    } else if (status === "pending") {
      setStatusFilter("Pending");
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

  useEffect(() => {
    getPayments(userId || undefined);
  }, [getPayments, userId]);

  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.user?.name?.toLowerCase().includes(s) ||
          p.user?.email?.toLowerCase().includes(s) ||
          p.utrNumber?.toLowerCase().includes(s) ||
          p.notes?.toLowerCase().includes(s) ||
          p.id?.toLowerCase().includes(s)
      );
    }

    // Handle special filter values from stats bar
    if (statusFilter === "pending") {
      result = result.filter((p) => p.status === "Pending");
    } else if (statusFilter !== "all" && statusFilter !== "credit" && statusFilter !== "debit") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (directionFilter !== "all") {
      result = result.filter((p) => p.direction === directionFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortConfig.key as keyof typeof a];
      const bVal = b[sortConfig.key as keyof typeof b];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bVal == null) return sortConfig.direction === "asc" ? 1 : -1;
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [payments, search, statusFilter, directionFilter, categoryFilter, sortConfig]);

  const paginatedPayments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, page, pageSize]);

  // Pagination meta for SharedPagination component
  const paginationMeta: PaginationMeta = useMemo(() => ({
    page,
    limit: pageSize,
    total: filteredPayments.length,
    totalPages: Math.ceil(filteredPayments.length / pageSize),
    hasNext: page < Math.ceil(filteredPayments.length / pageSize),
    hasPrevious: page > 1,
  }), [filteredPayments.length, page, pageSize]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleView = (payment: PaymentRecord) => {
    navigate(`/payments/transactions/${payment.id}`);
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
    if (window.confirm(`Are you sure you want to delete transaction ${payment.id}?`)) {
      setFormLoading(true);
      try {
        const success = await deletePayment(payment.id);
        if (success) {
          toast({ type: "success", title: "Deleted", description: "Transaction has been deleted." });
        } else {
          toast({ type: "error", title: "Error", description: "Failed to delete transaction." });
        }
      } catch (err) {
        toast({ type: "error", title: "Error", description: err instanceof Error ? err.message : "Failed to delete transaction" });
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
        const res = await updatePayment(editingPayment.id, updatedPayment);
        if (res) {
          toast({ type: "success", title: "Updated", description: "Transaction has been updated successfully." });
        } else {
          toast({ type: "error", title: "Error", description: "Failed to update transaction." });
        }
      } else {
        // Create mode - create new payment
        const res = await createPayment(updatedPayment);
        if (res) {
          toast({ type: "success", title: "Created", description: "Transaction has been created successfully." });
        } else {
          toast({ type: "error", title: "Error", description: "Failed to create transaction." });
        }
      }
      setShowFormDialog(false);
      setEditingPayment(null);
    } catch (err) {
      toast({ type: "error", title: "Error", description: err instanceof Error ? err.message : "Failed to save transaction" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleExport = () => {
    // Export logic here
    console.log("Export transactions");
    toast({ type: "info", title: "Exported!", description: "CSV downloaded." });
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedPayments.map((p) => p.id) : []);
  };

  const toggleRowSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id),
    );
  };

  const columns = getTransactionColumns({
    selectedIds,
    paginatedPayments,
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
        <SharedButton onClick={() => getPayments(userId || undefined)} className="mt-4">
          Retry
        </SharedButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {userData && (
            <SharedButton variant="ghost" size="icon" onClick={() => navigate(`/users/${userData.id}`)}>
              <ArrowLeft className="h-4 w-4" />
            </SharedButton>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {userData ? `Transactions for ${userData.name}` : "Transactions"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {userData 
                ? `Viewing transactions for ${userData.name} (${userData.email})` 
                : "View and manage all payment transactions"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {userData && (
            <SharedButton variant="outline" onClick={() => navigate(`/users/${userData.id}`)} className="gap-2">
              <User className="h-4 w-4" />
              Back to User Details
            </SharedButton>
          )}
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
        stats={stats}
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
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onDirectionChange={setDirectionFilter}
        onCategoryChange={setCategoryFilter}
        canViewSearchFilter={canViewSearchFilter}
        canViewStatusFilter={canViewStatusFilter}
        canViewDirectionFilter={canViewDirectionFilter}
        canViewCategoryFilter={canViewCategoryFilter}
      />

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <SharedTable
          columns={columns}
          data={paginatedPayments}
          sort={sortConfig}
          onSort={handleSort}
          rowKey={(payment) => payment.id}
          emptyMessage="No transactions found"
        />
        <SharedPagination
          meta={paginationMeta}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
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

