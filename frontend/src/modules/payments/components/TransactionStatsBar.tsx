import React from "react";
import { Receipt, ArrowDownCircle, ArrowUpCircle, Hourglass } from "lucide-react";
import { TransactionStatCard } from "@/modules/payments/components/TransactionStatCard";

type TransactionFilterStatus = "all" | "pending" | "credit" | "debit";

interface TransactionStatsBarProps {
  stats: {
    total: number;
    totalIn: number;
    totalOut: number;
    pending: number;
  };
  statusFilter: TransactionFilterStatus;
  onStatusClick: (status: TransactionFilterStatus) => void;
  // Permission flags
  canViewStats?: boolean;
  canViewStatusFilter?: boolean;
  canViewDirectionFilter?: boolean;
}

export const TransactionStatsBar: React.FC<TransactionStatsBarProps> = ({
  stats,
  statusFilter,
  onStatusClick,
  canViewStats = true,
  canViewStatusFilter = true,
  canViewDirectionFilter = true,
}) => {
  if (!canViewStats) return null;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-in">
      <TransactionStatCard
        label="Total Transactions"
        count={stats.total}
        icon={<Receipt size={20} />}
        gradient="from-violet-500 to-indigo-600"
        active={statusFilter === "all"}
        onClick={() => onStatusClick("all")}
      />
      {canViewDirectionFilter && (
        <TransactionStatCard
          label="Total Credit"
          count={stats.totalIn}
          icon={<ArrowDownCircle size={20} />}
          gradient="from-emerald-500 to-teal-600"
          active={statusFilter === "credit"}
          onClick={() => onStatusClick("credit")}
        />
      )}
      {canViewDirectionFilter && (
        <TransactionStatCard
          label="Total Debit"
          count={stats.totalOut}
          icon={<ArrowUpCircle size={20} />}
          gradient="from-rose-500 to-pink-600"
          active={statusFilter === "debit"}
          onClick={() => onStatusClick("debit")}
        />
      )}
      {canViewStatusFilter && (
        <TransactionStatCard
          label="Pending Verification"
          count={stats.pending}
          icon={<Hourglass size={20} />}
          gradient="from-amber-500 to-orange-600"
          active={statusFilter === "pending"}
          onClick={() => onStatusClick("pending")}
        />
      )}
    </div>
  );
};