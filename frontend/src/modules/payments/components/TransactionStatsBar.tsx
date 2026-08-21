import React from "react";
import { Receipt, ArrowDownCircle, ArrowUpCircle, Hourglass, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { TransactionStatCard } from "@/modules/payments/components/TransactionStatCard";

type TransactionFilterStatus = "all" | "pending" | "completed" | "rejected" | "refunded" | "credit" | "debit";

interface TransactionStatsBarProps {
  stats: {
    total: number;
    totalIn: number;
    totalOut: number;
    pending: number;
    completed: number;
    rejected: number;
    refunded: number;
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
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-7 animate-in">
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
          subtitle="Awaiting review"
          icon={<Hourglass size={20} />}
          gradient="from-amber-500 to-orange-600"
          active={statusFilter === "pending"}
          onClick={() => onStatusClick("pending")}
        />
      )}
      {canViewStatusFilter && (
        <TransactionStatCard
          label="Completed"
          count={stats.completed}
          subtitle="Approved payments"
          icon={<CheckCircle2 size={20} />}
          gradient="from-emerald-500 to-teal-600"
          active={statusFilter === "completed"}
          onClick={() => onStatusClick("completed")}
        />
      )}
      {canViewStatusFilter && (
        <TransactionStatCard
          label="Rejected"
          count={stats.rejected}
          subtitle="Rejected payments"
          icon={<XCircle size={20} />}
          gradient="from-rose-500 to-pink-600"
          active={statusFilter === "rejected"}
          onClick={() => onStatusClick("rejected")}
        />
      )}
      {canViewStatusFilter && (
        <TransactionStatCard
          label="Refunded"
          count={stats.refunded}
          subtitle="Refunded payments"
          icon={<RotateCcw size={20} />}
          gradient="from-blue-500 to-cyan-600"
          active={statusFilter === "refunded"}
          onClick={() => onStatusClick("refunded")}
        />
      )}
    </div>
  );
};