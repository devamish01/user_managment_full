/**
 * TransactionColumns — Column definitions for the transactions table.
 * Extracted from TransactionsPage for modularity and reusability.
 */

import { SharedBadge } from "@/shared/components/SharedBadge";
import { Eye, Edit, Trash2, MoreHorizontal, User } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui";

import type { PaymentRecord, PaymentStatus, PaymentDirection, PaymentCategory, PaymentSource, PaymentMethod } from "../../types";
import { formatDate, formatCurrency } from "@/lib/helpers";

/**
 * Color mappings for status badges with dark mode support.
 */
export const statusColors: Record<PaymentStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Refunded: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

/**
 * Color mappings for direction badges with dark mode support.
 */
export const directionColors: Record<PaymentDirection, string> = {
  credit: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  debit: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

/**
 * Color mappings for category badges with dark mode support.
 */
export const categoryColors: Record<PaymentCategory, string> = {
  Donation: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Giveaway: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  Event: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  Charity: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Manual: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  Refund: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Other: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
};

/**
 * Color mappings for source badges with dark mode support.
 */
export const sourceColors: Record<PaymentSource, string> = {
  ADMIN_ADDED: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  USER_PAYMENT: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  GATEWAY: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  SYSTEM: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

/**
 * Color mappings for method badges with dark mode support.
 */
export const methodColors: Record<PaymentMethod, string> = {
  "PhonePe": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Google Pay": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "UPI": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Bank Transfer": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "Cash": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "Other": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export interface TransactionColumnsProps {
  selectedIds: string[];
  paginatedPayments: PaymentRecord[];
  toggleSelectAll: (checked: boolean) => void;
  toggleRowSelection: (id: string, checked: boolean) => void;
  onView: (payment: PaymentRecord) => void;
  onEdit: (payment: PaymentRecord) => void;
  onDelete: (payment: PaymentRecord) => void;
  navigate: (path: string) => void;
  // Permission flags
  canViewAmount?: boolean;
  canViewActions?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

/**
 * Returns the complete column definitions for the transactions table.
 * Uses the SharedTable column format with render callbacks receiving (_, payment).
 */
export function getTransactionColumns(props: TransactionColumnsProps) {
  const {
    selectedIds,
    paginatedPayments,
    toggleSelectAll,
    toggleRowSelection,
    onView,
    onEdit,
    onDelete,
    navigate,
    canViewAmount = true,
    canViewActions = true,
    canEdit = true,
    canDelete = true,
  } = props;

  return [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border accent-primary"
          checked={paginatedPayments.length > 0 && selectedIds.length === paginatedPayments.length}
          onChange={(e) => toggleSelectAll(e.target.checked)}
        />
      ),
      render: (_: unknown, row: PaymentRecord) => (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border accent-primary"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => toggleRowSelection(row.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (_: unknown, payment: PaymentRecord) => <span className="font-mono text-sm">{payment.id}</span>,
    },
    {
      key: "user",
      label: "User",
      sortable: true,
      render: (_: unknown, payment: PaymentRecord) => {
        const user = payment.user;
        if (!user) {
          return <span className="text-muted-foreground">Unknown User</span>;
        }
        return (
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
            ) : user.avatarColor ? (
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: user.avatarColor }}>
                <span className="text-sm font-medium text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/users/${user.id}`);
                }}
                className="font-medium text-primary hover:underline flex items-center gap-1"
              >
                {user.name}
                <User className="h-3.5 w-3.5" />
              </button>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (_: unknown, payment: PaymentRecord) => canViewAmount ? <span className="font-medium">{formatCurrency(payment.amount)}</span> : <span className="font-medium text-muted-foreground">••••••</span>,
    },
    {
      key: "direction",
      label: "Payment Type",
      sortable: true,
      render: (_: unknown, payment: PaymentRecord) => {
        const direction = payment.direction;
        if (!direction) return <SharedBadge className="bg-muted text-muted-foreground">Unknown</SharedBadge>;
        const label = direction === "credit" ? "Credit" : "Debit";
        return (
          <SharedBadge className={directionColors[direction as PaymentDirection]}>
            {label}
          </SharedBadge>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_: unknown, payment: PaymentRecord) => {
        const status = payment.status;
        if (!status) return <SharedBadge className="bg-muted text-muted-foreground">Unknown</SharedBadge>;
        return (
          <div className="flex items-center gap-1.5">
            <SharedBadge className={statusColors[status as PaymentStatus]}>{status}</SharedBadge>
            {payment.isModified && (
              <SharedBadge variant="outline" className="text-xs px-1.5 py-0.5 h-5 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700" title="This transaction has been edited">
                Edited
              </SharedBadge>
            )}
          </div>
        );
      },
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (_: unknown, payment: PaymentRecord) => {
        const category = payment.category;
        if (!category) return <SharedBadge className="bg-muted text-muted-foreground">Unknown</SharedBadge>;
        return <SharedBadge className={categoryColors[category as PaymentCategory]}>{category}</SharedBadge>;
      },
    },
    {
      key: "paymentSource",
      label: "Source",
      sortable: true,
      render: (_: unknown, payment: PaymentRecord) => {
        const source = payment.paymentSource;
        if (!source) return <SharedBadge className="bg-muted text-muted-foreground">Unknown</SharedBadge>;
        return (
          <SharedBadge className={sourceColors[source as PaymentSource]}>
            {source.replace("_", " ")}
          </SharedBadge>
        );
      },
    },
    {
      key: "paymentMethod",
      label: "Method",
      sortable: true,
      render: (_: unknown, payment: PaymentRecord) => {
        const method = payment.paymentMethod;
        if (!method) return <SharedBadge className="bg-muted text-muted-foreground">Unknown</SharedBadge>;
        return <SharedBadge className={methodColors[method as PaymentMethod]}>{method}</SharedBadge>;
      },
    },
    {
      key: "paymentDate",
      label: "Date",
      sortable: true,
      render: (_: unknown, payment: PaymentRecord) => <span className="text-sm text-muted-foreground">{formatDate(payment.paymentDate)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, payment: PaymentRecord) => canViewActions ? (
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
                    onView(payment);
                    close();
                  }}
                >
                  <Eye size={14} /> View Details
                </DropdownItem>
                {canEdit && (
                  <DropdownItem
                    onClick={() => {
                      onEdit(payment);
                      close();
                    }}
                  >
                    <Edit size={14} /> Edit
                  </DropdownItem>
                )}
                {canDelete && (
                  <>
                    <div className="my-1 h-px bg-border" />
                    <DropdownItem
                      destructive
                      onClick={() => {
                        onDelete(payment);
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
      ) : null,
    },
  ];
}