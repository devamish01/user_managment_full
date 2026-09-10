import * as React from "react";
import {
  Mail,
  Phone,
  Save,
  Edit2,
  X,
  Loader2,
  Activity,
  ChevronDown,
  ChevronUp,
  Wallet,
  Receipt,
  XCircle,
  Clock,
  ArrowLeft,
  BadgeCheck,
  User2,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useToast } from "@/components/ui/toast";
import { usePaymentsStore } from "@/modules/payments/store";
import { useUsersStore } from "@/modules/users/store";
import type { User as UserType } from "@/lib/types";
import type { PaymentRecord, PaymentDirection, PaymentStatus, PaymentCategory } from "@/modules/payments/types";
import { formatCurrency } from "@/lib/helpers";
import { formatFullDate } from "@/shared/utils/date";
import { cn } from "@/shared/utils/cn";
import { SharedButton, SharedBadge, SharedTable, SharedInput } from "@/shared/components";
import { statusToBadgeVariant } from "@/shared/utils/format";
import { UserService } from "@/modules/users";
import "@/modules/auth/styles/auth.css";

/**
 * MyProfilePage — logged-in user's own profile page.
 * Uses the SAME data flow as UserDetails:
 * - Fetches user by ID using UserApi.getUserById (same as UserDetails)
 * - Uses useUsersStore for user list and updateUser (same as UserDetails)
 * - Uses usePaymentsStore for payment data (same as UserDetails)
 * - Same editable fields: firstName, lastName, email, phone, location, jobTitle, address, bio
 * - Read-only fields: userId, username, role, status, joinDate, lastLogin
 * - Activity section: Shows payment operations performed by the user (same as UserDetails)
 */
export const MyProfilePage = () => {
  const { currentUser, loading: authLoading, loadCurrentUser } = useAuthStore();
  const { users, updateUser, getUsers ,getUserById} = useUsersStore();
  const { getPaymentsByUserId } = usePaymentsStore();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [expanded, setExpanded] = React.useState(true);

  // Remote user state (same pattern as UserDetails)
  const [remoteUser, setRemoteUser] = React.useState<UserType | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(false);
  const [userError, setUserError] = React.useState<string | null>(null);

  // Payment state - local to this component (same as UserDetails)
  const [userPayments, setUserPayments] = React.useState<PaymentRecord[]>([]);
  const [loadingPayments, setLoadingPayments] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);

  // Form state for editable fields (same as UserDetails)
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    address: "",
    bio: "",
  });

  // Use currentUser.id or currentUser.userId as the user ID (same pattern as UserDetails uses props.id)
  // The /auth/me endpoint returns userId, but the User type uses id
  const userId = currentUser?.id || currentUser?.userId;

  // Find user in store or use remote user (same as UserDetails)
  const user = users.find((u) => u.id === userId) ?? remoteUser;

  // Load user's payments when user is loaded (same as UserDetails)
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

  // Compute payment stats (same as UserDetails)
  const paymentStats = React.useMemo(() => {
    const userTxns = userPayments;
    return {
      total: userTxns.length,
      totalCredit: userTxns.filter(p => p.direction === "credit").reduce((sum, p) => sum + p.amount, 0),
      totalDebit: userTxns.filter(p => p.direction === "debit").reduce((sum, p) => sum + p.amount, 0),
      pending: userTxns.filter(p => p.status === "Pending").length,
    };
  }, [userPayments]);

  // Recent transactions (latest 5) (same as UserDetails)
  const recentTransactions = React.useMemo(() => {
    return [...userPayments].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).slice(0, 5);
  }, [userPayments]);

  // Load user data using same pattern as UserDetails
  React.useEffect(() => {
    if (user || !userId) return;

    setLoadingUser(true);
    setUserError(null);

    getUserById(userId)
      .then((response) => {
        if (response.success && response.data) {
          setRemoteUser(response.data);
        } else {
          setUserError(response.message || "User not found.");
        }
      })
      .catch((error: unknown) => {
        setUserError(error instanceof Error ? error.message : "Failed to load user.");
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [userId, user]);

  // Initialize form when user data is available (same as UserDetails)
  React.useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        jobTitle: user.jobTitle || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Reset remote user when userId changes
  React.useEffect(() => {
    setRemoteUser(null);
    setUserError(null);
  }, [userId]);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Use the SAME update mechanism as UserDetails: useUsersStore.updateUser
      await updateUser(user.id, form);
      await getUsers(); // Refresh users list
      await loadCurrentUser(); // Refresh current user in auth store
      setIsEditing(false);
      
      toast({
        type: "success",
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        type: "error",
        title: "Failed to save",
        description: error instanceof Error ? error.message : "An error occurred while saving.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current user data (same as UserDetails)
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        jobTitle: user.jobTitle || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
    setIsEditing(false);
  };

  const getStatusBadge = (status: UserType["status"]) => {
    return <SharedBadge variant={statusToBadgeVariant(status)}>{status}</SharedBadge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return formatFullDate(dateString);
  };

  // Helper for direction badge (same as UserDetails)
  const getDirectionBadge = (direction: PaymentDirection) => {
    if (direction === "credit") {
      return <SharedBadge variant="success" className="text-xs">Credit</SharedBadge>;
    }
    return <SharedBadge variant="destructive" className="text-xs">Debit</SharedBadge>;
  };

  // Helper for status badge (same as UserDetails)
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const variant = status === "Completed" ? "success" : status === "Pending" ? "warning" : status === "Rejected" ? "destructive" : "default";
    return <SharedBadge variant={variant} className="text-xs">{status}</SharedBadge>;
  };

  // Helper for category badge (same as UserDetails)
  const getCategoryBadge = (category: PaymentCategory) => {
    return <SharedBadge variant="secondary" className="text-xs">{category}</SharedBadge>;
  };

  // Table columns for recent transactions (same as UserDetails)
  const transactionColumns = React.useMemo(() => [
    { key: "id", label: "Transaction ID", render: (_value: string, row: PaymentRecord) => <span className="font-medium text-foreground">{row.id}</span> },
    { key: "amount", label: "Amount", render: (_value: number, row: PaymentRecord) => <span className="font-semibold text-foreground">{formatCurrency(row.amount)}</span> },
    { key: "direction", label: "Payment Type", render: (_value: PaymentDirection, row: PaymentRecord) => getDirectionBadge(row.direction) },
    { key: "status", label: "Status", render: (_value: PaymentStatus, row: PaymentRecord) => getPaymentStatusBadge(row.status) },
    { key: "category", label: "Category", render: (_value: PaymentCategory, row: PaymentRecord) => getCategoryBadge(row.category) },
    { key: "paymentDate", label: "Date", render: (_value: string, row: PaymentRecord) => <span className="text-muted-foreground">{formatFullDate(row.paymentDate)}</span> },
    { key: "actions", label: "Actions", render: (_value: unknown, row: PaymentRecord) => (
      <SharedButton variant="ghost" size="sm" onClick={() => window.open(`/payments/transactions/${row.id}`, '_blank')}>
        <ExternalLink className="h-3.5 w-3.5" /> View Details
      </SharedButton>
    ) },
  ], []);

  if (authLoading && !currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.name || "Unknown User";
  const role = user.role; // User type has role as string

  return (
    <div className="auth-module-profile-page space-y-6 pb-12">
      {/* Page Header */}
      <div className="auth-module-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your own account information.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SharedButton variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft size={14} className="mr-1" />
            Back
          </SharedButton>
          <SharedButton variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit2 size={14} className="mr-1" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </SharedButton>
          {isEditing && (
            <SharedButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} className="mr-1" />
                  Save Changes
                </>
              )}
            </SharedButton>
          )}
        </div>
      </div>

      <div className="auth-module-profile-shell mx-auto w-full max-w-[1500px] space-y-6 px-2 sm:px-4 lg:px-6">
        {/* Profile Header */}
        <div className="auth-module-card rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 py-6 px-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br font-semibold text-white ring-4 ring-card from-indigo-500 to-purple-500 w-16 h-16 text-xl")}>
                <span>{fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" />{user.email}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" />{user.phone || "—"}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SharedBadge variant="secondary">{role || "—"}</SharedBadge>
                  <SharedBadge variant={statusToBadgeVariant(user.status)}>{user.status}</SharedBadge>
                  <span className="text-xs text-muted-foreground">User ID · {user.id}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SharedButton variant="outline" onClick={() => window.history.back()}><ArrowLeft className="h-4 w-4" /> Back</SharedButton>
              {!isEditing && (
                <SharedButton variant="outline" onClick={() => setIsEditing(true)}><Edit2 className="h-4 w-4" /> Edit Profile</SharedButton>
              )}
              {isEditing && (
                <>
                  <SharedButton variant="outline" onClick={handleCancel}><X className="h-4 w-4" /> Cancel</SharedButton>
                  <SharedButton onClick={handleSave} disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {isSaving ? "Saving..." : "Save Changes"}</SharedButton>
                </>
              )}
            </div>
          </div>
        </div>

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
                <div className="space-y-1.5"><label className="text-sm font-medium">First Name</label>{isEditing ? <SharedInput value={form.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} /> : <p className="text-lg font-medium">{user.firstName}</p>}</div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Last Name</label>{isEditing ? <SharedInput value={form.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} /> : <p className="text-lg font-medium">{user.lastName}</p>}</div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Email</label>{isEditing ? <SharedInput type="email" value={form.email} onChange={(e) => handleInputChange("email", e.target.value)} /> : <p className="font-medium">{user.email}</p>}</div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Phone</label>{isEditing ? <SharedInput type="tel" value={form.phone} onChange={(e) => handleInputChange("phone", e.target.value)} /> : <p className="font-medium">{user.phone || "—"}</p>}</div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Location</label>{isEditing ? <SharedInput value={form.location} onChange={(e) => handleInputChange("location", e.target.value)} /> : <p className="font-medium">{user.location || "—"}</p>}</div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Job Title</label>{isEditing ? <SharedInput value={form.jobTitle} onChange={(e) => handleInputChange("jobTitle", e.target.value)} /> : <p className="font-medium">{user.jobTitle || "—"}</p>}</div>
                <div className="sm:col-span-2 space-y-1.5"><label className="text-sm font-medium">Address</label>{isEditing ? <SharedInput value={form.address} onChange={(e) => handleInputChange("address", e.target.value)} /> : <p className="font-medium">{user.address || "—"}</p>}</div>
                <div className="sm:col-span-2 space-y-1.5"><label className="text-sm font-medium">Bio</label>{isEditing ? <SharedInput value={form.bio} onChange={(e) => handleInputChange("bio", e.target.value)} /> : <p className="font-medium text-muted-foreground">{user.bio || "—"}</p>}</div>
              </div>
            </div>
          </div>

          {/* Account Information (read-only) */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
                <h3 className="text-lg font-semibold">Account Information</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Read-only account metadata.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                <div className="space-y-1.5"><label className="text-sm font-medium">User ID</label><p className="text-lg font-medium">{user.id}</p></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Username</label><p className="text-lg font-medium">{user.username}</p></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Role</label><p className="text-lg font-medium">{role || "—"}</p></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Status</label><p className="text-lg font-medium">{getStatusBadge(user.status)}</p></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Join Date</label><p className="text-lg font-medium">{formatDate(user.createdAt)}</p></div>
                <div className="space-y-1.5"><label className="text-sm font-medium">Last Login</label><p className="text-lg font-medium">{formatDate(user.lastActive)}</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* My Activity / Transactions */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-violet-500" />
              <div>
                <h2 className="text-base font-semibold text-foreground">My Activity / Transactions</h2>
                <p className="text-sm text-muted-foreground">Payment operations performed by you.</p>
              </div>
            </div>
            <SharedButton variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? "Collapse" : "Expand"}
            </SharedButton>
          </div>

          {expanded && (
            <>
              <div className="auth-module-stat-grid mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-card shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                      <p className="text-3xl font-bold tracking-tight">{paymentStats.total}</p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 border border-violet-500/20 shadow-lg">
                      <Receipt size={20} />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Credit</p>
                      <p className="text-3xl font-bold tracking-tight text-emerald-600">{formatCurrency(paymentStats.totalCredit)}</p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-lg">
                      <Wallet size={20} />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Debit</p>
                      <p className="text-3xl font-bold tracking-tight text-rose-600">{formatCurrency(paymentStats.totalDebit)}</p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-lg">
                      <Wallet size={20} />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold tracking-tight text-amber-600">{paymentStats.pending}</p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-lg">
                      <Clock size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="auth-module-card rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="auth-module-table-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-border">
                  <div>
                    <h3 className="text-lg font-semibold">Recent Transactions</h3>
                    <p className="text-sm text-muted-foreground">Latest {recentTransactions.length} of {paymentStats.total} transactions.</p>
                  </div>
                  <SharedButton variant="outline" size="sm" onClick={() => window.open(`/payments/transactions?userId=${userId}`, '_blank')}>
                    <ExternalLink size={12} className="mr-1" />
                    View All
                  </SharedButton>
                </div>
                {loadingPayments ? (
                  <div className="p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-muted-foreground">Loading transactions...</p>
                  </div>
                ) : paymentError ? (
                  <div className="p-12 text-center">
                    <XCircle size={28} className="text-destructive mx-auto" />
                    <p className="mt-2 text-lg font-medium">Failed to load transactions</p>
                    <p className="text-sm text-muted-foreground">{paymentError}</p>
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="p-12 text-center">
                    <Receipt size={28} className="text-muted-foreground mx-auto" />
                    <p className="mt-3 text-lg font-medium">No transactions yet</p>
                    <p className="text-sm text-muted-foreground">You have not performed any payment actions.</p>
                  </div>
                ) : (
                  <SharedTable
                    columns={transactionColumns}
                    data={recentTransactions}
                    rowKey={(row) => row.id}
                    emptyMessage="No transactions found"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;