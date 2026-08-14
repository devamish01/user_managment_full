import { useHasPermission } from "@/store";

export const useUserDetailsPermissions = () => {
  const hasPermission = useHasPermission();

  // Action permissions
  const canEdit = hasPermission("users.update");
  const canResetPassword = hasPermission("users.reset_password");

  // Section visibility
  const viewPaymentsSection = hasPermission("users.sec_payments");
  const viewPaymentStats = hasPermission("users.sec_payment_stats");
  const viewRecentTransactions = hasPermission("users.sec_recent_transactions");

  // Amount visibility
  const viewPaymentAmount = hasPermission("users.view_payment_amount");

  return {
    // Actions
    canEdit,
    canResetPassword,
    // Sections
    viewPaymentsSection,
    viewPaymentStats,
    viewRecentTransactions,
    // Amount
    viewPaymentAmount,
  };
};