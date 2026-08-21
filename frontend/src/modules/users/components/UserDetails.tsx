/**
 * UserDetails — user profile page.
 * Uses shared components, utils, and hooks.
 */

import React from "react";
import {
  ArrowLeft,
  Pencil,
  Save,
  X,
  Calendar,
  Hash,
  Lock,
  ShieldCheck,
  Key,
  ExternalLink,
  Mail,
  Phone,
  User2,
  BadgeCheck,
  ChevronUp,
  ChevronDown,
  Receipt,
} from "lucide-react";
import { useStore } from "@/store";
import { statusToBadgeVariant } from "@/shared/utils/format";
import { formatFullDate, formatTime } from "@/shared/utils/date";
import { cn } from "@/shared/utils/cn";
import { SharedButton, SharedBadge, SharedModal, SharedInput } from "@/shared/components";
import { SharedTable } from "@/shared/components/SharedTable";
import type { Status, User } from "@/lib/types";
import useUsersStore from "@/modules/users/store";
import { useToastError } from "@/core/api/toastUtils";
import { formatCurrency } from "@/lib/helpers";
import { useNavigate } from "react-router-dom";
import type { PaymentRecord, PaymentDirection, PaymentStatus, PaymentCategory } from "@/modules/payments/types";
import { usePaymentsStore } from "@/modules/payments/store";
import { useUserDetailsPermissions } from "./user-details-permissions";

export interface UserDetailsProps {
  id: string;
  onBack: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ id, onBack }) => {
  const { roles } = useStore();
  const { updateUser, getUserById, resetUserPassword  } = useUsersStore();
  const { getPaymentsByUserId } = usePaymentsStore();
  const navigate = useNavigate();
  // Permission checks - must be before conditional returns
  const {
    canEdit,
    canResetPassword,
    viewPaymentsSection: canViewPaymentsSection,
    viewPaymentStats: canViewPaymentStats,
    viewRecentTransactions: canViewRecentTransactions,
    viewPaymentAmount: canViewPaymentAmount,
  } = useUserDetailsPermissions();

  const { toastError, toastSuccess } = useToastError();

  const [user, setUser] = React.useState<User | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(false);
  const [userError, setUserError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState(true);

  // Payment state - local to this component
  const [userPayments, setUserPayments] = React.useState<PaymentRecord[]>([]);
  const [loadingPayments, setLoadingPayments] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);

  // Form state
  const [isEditing, setIsEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    roleId: "",
    status: "active" as Status,
    location: "",
    jobTitle: "",
    address: "",
    bio: "",
  });

  // Reset Password Modal State
  const [resetPasswordOpen, setResetPasswordOpen] = React.useState(false);
  const [resetPassword, setResetPassword] = React.useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = React.useState("");
  const [resetLoading, setResetLoading] = React.useState(false);
  const [resetErrors, setResetErrors] = React.useState<Record<string, string>>({});

  const role = roles.find((r) => r.id === user?.roleId);

  // Load user's payments when user is loaded
  const loadUserPayments = React.useCallback(async (userId: string) => {
    setLoadingPayments(true);
    setPaymentError(null);
    try {
      const payments = await getPaymentsByUserId(userId);
      setUserPayments(payments);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPaymentError(err instanceof Error ? err.message : "Failed to load payments");
    } finally {
      setLoadingPayments(false);
    }
  }, [getPaymentsByUserId]);

  React.useEffect(() => {
    if (user?.id) {
      loadUserPayments(user.id);
    }
  }, [user?.id, loadUserPayments]);

  // Compute payment stats
  const paymentStats = React.useMemo(() => {
    const userTxns = userPayments;
    return {
      total: userTxns.length,
      totalCredit: userTxns.filter(p => p.direction === "credit").reduce((sum, p) => sum + p.amount, 0),
      totalDebit: userTxns.filter(p => p.direction === "debit").reduce((sum, p) => sum + p.amount, 0),
      pending: userTxns.filter(p => p.status === "Pending").length,
    };
  }, [userPayments]);

  // Recent transactions (latest 5)
  const recentTransactions = React.useMemo(() => {
    return [...userPayments].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).slice(0, 5);
  }, [userPayments]);

  // Table columns for recent transactions - must be before conditional returns
  const transactionColumns = React.useMemo(() => [
    { key: "id", label: "Transaction ID", render: (_value: string, row: PaymentRecord) => <span className="font-medium text-foreground">{row.id}</span> },
    { key: "amount", label: "Amount", render: (_value: number, row: PaymentRecord) => <span className="font-semibold text-foreground">{formatCurrency(row.amount)}</span> },
    { key: "direction", label: "Payment Type", render: (_value: PaymentDirection, row: PaymentRecord) => getDirectionBadge(row.direction) },
    { key: "status", label: "Status", render: (_value: PaymentStatus, row: PaymentRecord) => getStatusBadge(row.status) },
    { key: "category", label: "Category", render: (_value: PaymentCategory, row: PaymentRecord) => getCategoryBadge(row.category) },
    { key: "paymentDate", label: "Date", render: (_value: string, row: PaymentRecord) => <span className="text-muted-foreground">{formatFullDate(row.paymentDate)}</span> },
    { key: "actions", label: "Actions", render: (_value: unknown, row: PaymentRecord) => (
      <SharedButton variant="ghost" size="sm" onClick={() => navigate(`/payments/transactions/${row.id}`)}>
        <ExternalLink className="h-3.5 w-3.5" /> View Details
      </SharedButton>
    ) },
  ], []);

  // Helper for direction badge
  const getDirectionBadge = (direction: PaymentDirection) => {
    if (direction === "credit") {
      return <SharedBadge variant="success" className="text-xs">Credit</SharedBadge>;
    }
    return <SharedBadge variant="destructive" className="text-xs">Debit</SharedBadge>;
  };

  // Helper for status badge
  const getStatusBadge = (status: PaymentStatus) => {
    const variant = status === "Completed" ? "success" : status === "Pending" ? "warning" : status === "Rejected" ? "destructive" : "default";
    return <SharedBadge variant={variant} className="text-xs">{status}</SharedBadge>;
  };

  // Helper for category badge
  const getCategoryBadge = (category: PaymentCategory) => {
    return <SharedBadge variant="secondary" className="text-xs">{category}</SharedBadge>;
  };

  const validateResetForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!resetPassword) {
      newErrors.password = "Password is required";
    } else if (resetPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(resetPassword)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(resetPassword)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(resetPassword)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(resetPassword)) {
      newErrors.password = "Password must contain at least one special character";
    }

    if (!resetConfirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (resetPassword !== resetConfirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setResetErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleResetPassword = async () => {
  if (!user || !validateResetForm()) return;

  setResetLoading(true);

  try {
    const response = await resetUserPassword(
      user.id,
      resetPassword,
      resetConfirmPassword
    );

    toastSuccess(response);

    setResetPasswordOpen(false);
    setResetPassword("");
    setResetConfirmPassword("");
    setResetErrors({});
  } catch (error: unknown) {
    const fieldErrors = toastError(error, { title: "Reset failed" });

    if (Object.keys(fieldErrors).length > 0) {
      setResetErrors(fieldErrors);
    }
  } finally {
    setResetLoading(false);
  }
};

  const openResetPassword = () => {
    setResetPasswordOpen(true);
  };

  const closeResetPassword = () => {
    setResetPasswordOpen(false);
    setResetPassword("");
    setResetConfirmPassword("");
    setResetErrors({});
  };

  // Sync form with user when it changes
  React.useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.username || "",
        roleId: user.roleId || "",
        status: user.status,
        location: user.location || "",
        jobTitle: user.jobTitle || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (!id) return;

    setLoadingUser(true);
    setUserError(null);

    getUserById(id)
      .then((response) => {
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setUserError(response.message || "User not found.");
        }
      })
      .catch((error: unknown) => {
        setUserError(
          error instanceof Error
            ? error.message
            : "Failed to load user."
        );
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [id, getUserById]);

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">{userError ?? "User not found."}</p>
        <SharedButton className="mt-4" onClick={onBack}>Back to users</SharedButton>
      </div>
    );
  }

  // Editable fields that can be sent to backend
  const editableFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "username",
    "roleId",
    "status",
    "location",
    "jobTitle",
    "address",
    "bio",
  ] as const;

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      return;
    }

    // Build payload with only changed fields
    const originalUser = user;
    const changedFields: Record<string, any> = {};

    for (const field of editableFields) {
      const formValue = form[field];
      const originalValue = originalUser[field];
      
      // Only include if value actually changed
      if (formValue !== originalValue) {
        changedFields[field] = formValue;
      }
    }

    // If nothing changed, just exit edit mode
    if (Object.keys(changedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await updateUser(id, changedFields);

      toastSuccess(response);
      setIsEditing(false);
    } catch (error: unknown) {
      toastError(error, { title: "Update failed" });
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      username: user.username || "",
      roleId: user.roleId || "",
      status: user.status,
      location: user.location || "",
      jobTitle: user.jobTitle || "",
      address: user.address || "",
      bio: user.bio || "",
    });
    setIsEditing(false);
  };

  const handleViewAllTransactions = () => {
    navigate(`/payments/transactions?userId=${user.id}`);
  };

  return (
    <>
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SharedButton variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Users List
        </SharedButton>
      </div>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* User Header */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 py-6 px-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br font-semibold text-white ring-4 ring-card from-indigo-500 to-purple-500 w-16 h-16 text-xl")}>
                <span>{user.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase() : "NU"}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" />{user.email}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" />{user.phone || "—"}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SharedBadge variant="secondary">{role?.name || "—"}</SharedBadge>
                  <SharedBadge variant={statusToBadgeVariant(user.status)}>{user.status}</SharedBadge>
                  <span className="text-xs text-muted-foreground">User ID · {user.id}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SharedButton variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back</SharedButton>
              {!isEditing && canEdit && (
                <SharedButton variant="outline" onClick={() => setIsEditing(true)}><Pencil className="h-4 w-4" /> Edit User</SharedButton>
              )}
              {isEditing && (
                <>
                  <SharedButton variant="outline" onClick={handleCancel}><X className="h-4 w-4" /> Cancel</SharedButton>
                  <SharedButton onClick={handleSave}><Save className="h-4 w-4" /> Save Changes</SharedButton>
                </>
              )}
            </div>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-6 animate-in">
            {/* Personal Information + Account Information side by side */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Personal Information */}
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <User2 className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Profile details for this user.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><label className="text-sm font-medium">First Name</label><p className="text-lg font-medium">{user.firstName}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Last Name</label><p className="text-lg font-medium">{user.lastName}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Email</label><p className="font-medium">{user.email}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Mobile Number</label><p className="font-medium">{user.phone || "—"}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Location</label><p className="font-medium">{user.location || "—"}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Job Title</label><p className="font-medium">{user.jobTitle || "—"}</p></div>
                    <div className="sm:col-span-2 space-y-1.5"><label className="text-sm font-medium">Address</label><p className="font-medium">{user.address || "—"}</p></div>
                    <div className="sm:col-span-2 space-y-1.5"><label className="text-sm font-medium">Bio</label><p className="font-normal text-muted-foreground">{user.bio || "—"}</p></div>
                  </div>
                </div>
              </div>

              {/* Account Information (read-only for most fields) */}
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Account Information</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Account metadata. Role, status and dates are read-only.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><label className="text-sm font-medium">User ID</label><p className="font-mono text-sm bg-muted px-3 py-1.5 rounded-md w-fit">{user.id}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Username</label><p className="font-medium">{user.username || "—"}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Role</label><p className="font-medium">{role?.name || "—"}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Status</label><SharedBadge variant={statusToBadgeVariant(user.status)}>{user.status}</SharedBadge></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Join Date</label><p className="font-medium">{formatFullDate(user.createdAt)}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Last Login</label><p className="font-medium">—</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Account Created</label><p className="font-medium">{formatFullDate(user.createdAt)}</p></div>
                    <div className="space-y-1.5"><label className="text-sm font-medium">Last Updated</label><p className="font-medium">{formatFullDate(user.updatedAt)}</p></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Privacy */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-lg font-semibold">Security & Privacy</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Account security settings and activity.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className="text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium">Two-Factor Auth</p>
                        <p className="text-xs text-muted-foreground">Enabled via Authenticator</p>
                      </div>
                    </div>
                    <SharedBadge variant="success">Active</SharedBadge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Last Login</p>
                        <p className="text-xs text-muted-foreground">—</p>
                      </div>
                    </div>
                  </div>
                  {canResetPassword && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key size={18} className="text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">Reset Password</p>
                          <p className="text-xs text-muted-foreground">Generate a new password for this user</p>
                        </div>
                      </div>
                      <SharedButton variant="outline" size="sm" onClick={openResetPassword}>
                        <Key size={14} className="mr-2" /> Reset Password
                      </SharedButton>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payments */}
            {canViewPaymentsSection && (
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Payments</h3>
                    <p className="text-sm text-muted-foreground mt-1">Aggregated payment activity for <span className="font-medium text-foreground">{user.firstName} {user.lastName}</span>.</p>
                  </div>
                  <SharedButton variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {expanded ? "Collapse" : "Expand"}
                  </SharedButton>
                </div>
              </div>

              {expanded && (
                <div className="p-6 space-y-6">
                  {loadingPayments ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">Loading payments...</p>
                    </div>
                  ) : paymentError ? (
                    <div className="text-center py-8 text-destructive">
                      <p>Failed to load payments: {paymentError}</p>
                    </div>
                  ) : (
                    <>
                      {/* Payment Stats */}
                      {canViewPaymentStats && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-muted-foreground">Total Transactions</p>
                          <p className="text-2xl font-bold text-foreground">{paymentStats.total}</p>
                        </div>
                        {canViewPaymentAmount && (
                        <>
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-muted-foreground">Total Credit</p>
                          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(paymentStats.totalCredit)}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-muted-foreground">Total Debit</p>
                          <p className="text-2xl font-bold text-red-600">{formatCurrency(paymentStats.totalDebit)}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-muted-foreground">Net Amount</p>
                          <p className="text-2xl font-bold">{formatCurrency(paymentStats.totalCredit - paymentStats.totalDebit)}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-muted-foreground">First Payment</p>
                          <p className="text-lg font-medium">{userPayments.length > 0 ? formatFullDate([...userPayments].sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())[0].paymentDate) : "—"}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="text-xs text-muted-foreground">Last Payment</p>
                          <p className="text-lg font-medium">{userPayments.length > 0 ? formatFullDate([...userPayments].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0].paymentDate) : "—"}</p>
                        </div>
                        </>
                        )}
                      </div>
                      )}

                      {/* Recent Transactions Table */}
                      {canViewRecentTransactions && (
                      <div className="border-t border-border pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-base font-semibold">Recent Transactions</h4>
                            <p className="text-sm text-muted-foreground">Showing latest {recentTransactions.length} of {userPayments.length} transactions.</p>
                          </div>
                          <SharedButton variant="outline" size="sm" onClick={handleViewAllTransactions}>View All Transactions</SharedButton>
                        </div>
                        {recentTransactions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Receipt className="h-7 w-7 mx-auto mb-2 opacity-50" />
                            <p>No transactions yet</p>
                            <p className="text-sm">This user has no payment records in the Payments module.</p>
                          </div>
                        ) : (
                          <SharedTable
                            columns={transactionColumns}
                            data={recentTransactions}
                            rowKey={(row) => row.id}
                            emptyMessage="No transactions found."
                          />
                        )}
                      </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><label className="text-sm font-medium">First Name *</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Last Name *</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Email *</label><input type="email" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Mobile Number</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Username</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Location</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Job Title</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Role</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-sm font-medium">Status</label><select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}><option value="active">Active</option><option value="inactive">Inactive</option><option value="blocked">Blocked</option><option value="pending">Pending</option></select></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-sm font-medium">Address</label><input className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-sm font-medium">Bio</label><textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
              </div>
              <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Hash size={14} /><span>User ID (non-editable):</span><span className="font-mono text-foreground">{user.id}</span></div>
                <div className="flex items-center gap-2 mt-1"><Calendar size={14} /><span>Joined on:</span><span className="font-medium text-foreground">{formatFullDate(user.createdAt)} at {formatTime(user.createdAt)}</span></div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <SharedButton variant="outline" onClick={handleCancel}><X size={14} className="mr-2" /> Cancel</SharedButton>
                <SharedButton onClick={handleSave}><Save size={14} className="mr-2" /> Save Changes</SharedButton>
              </div>
            </div>
          </div>
        )}
      </div>

    <SharedModal
      open={resetPasswordOpen}
      onClose={closeResetPassword}
      title={`Reset Password for ${user?.firstName} ${user?.lastName}`}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter a new password for <strong>{user?.firstName} {user?.lastName}</strong> ({user?.email}).
          The user will need to use this new password to log in.
        </p>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">New Password *</label>
          <SharedInput
            type="password"
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={resetLoading}
          />
          {resetErrors.password && <p className="text-xs text-destructive">{resetErrors.password}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Confirm Password *</label>
          <SharedInput
            type="password"
            value={resetConfirmPassword}
            onChange={(e) => setResetConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={resetLoading}
          />
          {resetErrors.confirmPassword && <p className="text-xs text-destructive">{resetErrors.confirmPassword}</p>}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Password requirements:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <SharedButton variant="outline" onClick={closeResetPassword} disabled={resetLoading}>
            Cancel
          </SharedButton>
          <SharedButton onClick={handleResetPassword} disabled={resetLoading}>
            {resetLoading ? "Resetting..." : "Reset Password"}
          </SharedButton>
        </div>
      </div>
    </SharedModal>
    </div>
  </>
  );
};