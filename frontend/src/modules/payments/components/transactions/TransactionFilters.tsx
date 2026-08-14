/**
 * TransactionFilters — Filter UI for transactions table.
 * Extracted from TransactionsPage for modularity.
 */

import { SharedSearch } from "@/shared/components/SharedSearch";
import { SharedSelect } from "@/shared/components/SharedSelect";

import type { PaymentStatus, PaymentDirection, PaymentCategory } from "../../types";

type TransactionFilterStatus = PaymentStatus | "all" | "pending" | "credit" | "debit";

export interface TransactionFiltersProps {
  search: string;
  statusFilter: TransactionFilterStatus;
  directionFilter: PaymentDirection | "all";
  categoryFilter: PaymentCategory | "all";

  onSearchChange: (value: string) => void;
  onStatusChange: (value: TransactionFilterStatus) => void;
  onDirectionChange: (value: PaymentDirection | "all") => void;
  onCategoryChange: (value: PaymentCategory | "all") => void;

  // Permission flags
  canViewSearchFilter?: boolean;
  canViewStatusFilter?: boolean;
  canViewDirectionFilter?: boolean;
  canViewCategoryFilter?: boolean;
}

/**
 * Renders the filter controls for the transactions table.
 */
export function TransactionFilters({
  search,
  statusFilter,
  directionFilter,
  categoryFilter,
  onSearchChange,
  onStatusChange,
  onDirectionChange,
  onCategoryChange,
  canViewSearchFilter = true,
  canViewStatusFilter = true,
  canViewDirectionFilter = true,
  canViewCategoryFilter = true,
}: TransactionFiltersProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {canViewSearchFilter && (
          <div className="relative flex-1 max-w-md">
            <SharedSearch
              placeholder="Search transactions..."
              value={search}
              onChange={onSearchChange}
            />
          </div>
        )}
        {canViewStatusFilter && (
          <SharedSelect
            value={statusFilter}
            onValueChange={(value: string) => onStatusChange(value as PaymentStatus | "all")}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "Pending", label: "Pending" },
              { value: "Completed", label: "Completed" },
              { value: "Rejected", label: "Rejected" },
              { value: "Refunded", label: "Refunded" },
            ]}
            className="w-full sm:w-40"
          />
        )}
        {canViewDirectionFilter && (
          <SharedSelect
            value={directionFilter}
            onValueChange={(value: string) => onDirectionChange(value as PaymentDirection | "all")}
            options={[
              { value: "all", label: "All Directions" },
              { value: "credit", label: "Credit" },
              { value: "debit", label: "Debit" },
            ]}
            className="w-full sm:w-40"
          />
        )}
        {canViewCategoryFilter && (
          <SharedSelect
            value={categoryFilter}
            onValueChange={(value: string) => onCategoryChange(value as PaymentCategory | "all")}
            options={[
              { value: "all", label: "All Categories" },
              { value: "Donation", label: "Donation" },
              { value: "Giveaway", label: "Giveaway" },
              { value: "Event", label: "Event" },
              { value: "Charity", label: "Charity" },
              { value: "Manual", label: "Manual" },
              { value: "Refund", label: "Refund" },
              { value: "Other", label: "Other" },
            ]}
            className="w-full sm:w-48"
          />
        )}
      </div>
    </div>
  );
}