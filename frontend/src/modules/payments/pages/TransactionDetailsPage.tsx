/**
 * TransactionDetailsPage — Payments module transaction detail view.
 *
 * Displays full transaction details including user info, payment info,
 * attachment, notes, verification, linked modules, timeline, and history.
 * Single-page layout matching the reference design.
 * Protected by PermissionGuard requiring "pages.transactions.details" permission.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Loader2, FileText, User, CreditCard, Clock, History, MessageSquare, Link2, Image, Shield, Download, ExternalLink, Edit } from "lucide-react";
import { SharedButton } from "@/shared/components/SharedButton";
import { SharedBadge } from "@/shared/components/SharedBadge";
import { SharedModal } from "@/shared/components/SharedModal";
import { usePaymentsStore } from "../store";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDateTime } from "@/lib/helpers";
import { cn } from "@/shared/utils/cn";
import { TransactionFormDialog } from "../components/transactions/TransactionFormDialog";
import { useTransactionDetailsPermissions } from "./transaction-details-permissions";

import type { PaymentRecord, PaymentStatus, PaymentDirection, PaymentCategory, PaymentSource, PaymentMethodPaymentTimelineEntry,  } from "../types";

export const TransactionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { payments, getPaymentById, approvePayment, rejectPayment, updatePayment } = usePaymentsStore();
  const { toast } = useToast();

  const [transaction, setTransaction] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [approveNotes, setApproveNotes] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [dialogLoading, setDialogLoading] = useState(false);
  // const [changeHistory, setChangeHistory] = useState<ChangeHistoryEntry[]>([]);
  // const [historyLoading, setHistoryLoading] = useState(false);

  // Permission checks
  const {
    canApprove,
    canReject,
    canEdit,
    viewAmount: canViewAmount,
    editAmount: canEditAmount,
    viewInfoSection: canViewInfoSection,
    viewUserSection: canViewUserSection,
    viewPaymentSection: canViewPaymentSection,
    viewAttachmentSection: canViewAttachmentSection,
    viewNotesSection: canViewNotesSection,
    viewVerificationSection: canViewVerificationSection,
    viewLinkedSection: canViewLinkedSection,
    viewTimelineSection: canViewTimelineSection,
    // viewHistorySection: canViewHistorySection,
    showApproveButton: canShowApproveButton,
    showRejectButton: canShowRejectButton,
    showEditButton: canShowEditButton,
    showViewProfileButton: canShowViewProfileButton,
    showOpenAttachmentButton: canShowOpenAttachmentButton,
    showDownloadAttachmentButton: canShowDownloadAttachmentButton,
    showEditAmountButton: canShowEditAmountButton,
  } = useTransactionDetailsPermissions();



  // Load transaction on mount
  useEffect(() => {
    if (id) {
      loadTransaction();
    }
  }, [id]);

  const loadTransaction = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // First check if we have it in the store
      const cached = payments.find((p) => p.id === id);
      if (cached) {
        setTransaction(cached);
        setLoading(false);
        // Load change history
        // loadChangeHistory(id);
        return;
      }
      // Otherwise fetch from API
      const fetched = await getPaymentById(id);
      if (fetched) {
        setTransaction(fetched);
        // Load change history
        // loadChangeHistory(id);
      } else {
        setError("Transaction not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transaction");
    } finally {
      setLoading(false);
    }
  };

  // const loadChangeHistory = async (transactionId: string) => {
  //   setHistoryLoading(true);
  //   try {
  //     const history = await getTransactionHistory(transactionId);
  //     setChangeHistory(history);
  //   } catch (err) {
  //     console.error('Failed to load change history:', err);
  //     setChangeHistory([]);
  //   } finally {
  //     setHistoryLoading(false);
  //   }
  // };

  const handleApprove = async () => {
    if (!transaction) return;
    setDialogLoading(true);
    try {
      const res = await approvePayment(transaction.id, "Current User", approveNotes);
      if (res) {
        setTransaction(res);
        toast({ type: "success", title: "Approved", description: "Transaction has been approved." });
        setShowApproveDialog(false);
        setApproveNotes("");
      }
    } catch (err) {
      toast({ type: "error", title: "Error", description: err instanceof Error ? err.message : "Failed to approve" });
    } finally {
      setDialogLoading(false);
    }
  };

  const handleReject = async () => {
    if (!transaction) return;
    setDialogLoading(true);
    try {
      const res = await rejectPayment(transaction.id, "Current User", rejectNotes);
      if (res) {
        setTransaction(res);
        toast({ type: "success", title: "Rejected", description: "Transaction has been rejected." });
        setShowRejectDialog(false);
        setRejectNotes("");
      }
    } catch (err) {
      toast({ type: "error", title: "Error", description: err instanceof Error ? err.message : "Failed to reject" });
    } finally {
      setDialogLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: PaymentStatus): "success" | "warning" | "destructive" | "default" => {
    switch (status) {
      case "Completed": return "success";
      case "Pending": return "warning";
      case "Rejected": return "destructive";
      case "Refunded": return "default";
      default: return "default";
    }
  };

  const getDirectionLabel = (direction: PaymentDirection) => {
    return direction === "credit" ? "Credit" : "Debit";
  };

  const formatCategory = (category: PaymentCategory) => {
    return category;
  };

  const formatSource = (source: PaymentSource) => {
    const labels: Record<PaymentSource, string> = {
      ADMIN_ADDED: "Admin Added",
      USER_PAYMENT: "User Payment",
      GATEWAY: "Gateway",
      SYSTEM: "System",
    };
    return labels[source] || source;
  };

  const formatMethod = (method: PaymentMethod) => {
    return method;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (color?: string) => {
    return color || "bg-primary";
  };

  const timelineIcon = (entry: PaymentTimelineEntry) => {
    const done = !!entry.timestamp;
    const cls = cn("h-4 w-4", done ? "text-white" : "text-muted-foreground");
    if (entry.label === "Rejected") return <XCircle className={cls} />;
    if (entry.label === "Approved" || entry.label === "Verification Completed") return <CheckCircle className={cls} />;
    if (entry.label === "Edited" || entry.label === "Amount Updated" || entry.label === "Status Changed") return <Edit className={cls} />;
    return <Clock className={cls} />;
  };

  const timelineTone = (entry: PaymentTimelineEntry, done: boolean) => {
    if (!done) return "bg-muted border border-border";
    if (entry.label === "Rejected") return "bg-destructive";
    if (entry.label === "Approved" || entry.label === "Verification Completed") return "bg-emerald-500";
    if (entry.label === "Edited" || entry.label === "Amount Updated" || entry.label === "Status Changed") return "bg-amber-500";
    return "bg-gradient-to-br from-violet-500 to-indigo-600";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <SharedButton variant="ghost" size="icon" onClick={() => navigate("/payments/transactions")}>
            <ArrowLeft className="h-4 w-4" />
          </SharedButton>
          <div className="animate-pulse space-y-2">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse space-y-4">
              <div className="h-5 w-1/3 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 w-1/2 bg-muted rounded" />
                    <div className="h-6 w-3/4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse space-y-4">
              <div className="h-5 w-1/4 bg-muted rounded" />
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-48 bg-muted rounded" />
                  <div className="h-3 w-40 bg-muted rounded" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse space-y-4">
              <div className="h-5 w-1/4 bg-muted rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 w-1/2 bg-muted rounded" />
                    <div className="h-6 w-3/4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse space-y-4">
              <div className="h-5 w-1/4 bg-muted rounded" />
              <div className="h-56 w-full bg-muted rounded-xl" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse space-y-4">
              <div className="h-5 w-1/4 bg-muted rounded" />
              <div className="divide-y divide-border">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="py-2">
                    <div className="h-3 w-1/3 bg-muted rounded" />
                    <div className="h-5 w-1/2 bg-muted rounded mt-1" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse space-y-4">
              <div className="h-5 w-1/4 bg-muted rounded" />
              <div className="divide-y divide-border">
                <div className="py-2">
                  <div className="h-3 w-1/3 bg-muted rounded" />
                  <div className="h-5 w-1/2 bg-muted rounded mt-1" />
                </div>
                <div className="py-2">
                  <div className="h-3 w-1/3 bg-muted rounded" />
                  <div className="h-5 w-1/2 bg-muted rounded mt-1" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse space-y-4">
              <div className="h-5 w-1/4 bg-muted rounded" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-8 w-8 bg-muted rounded-full shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 w-1/3 bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 animate-pulse space-y-4" id="history">
              <div className="h-5 w-1/4 bg-muted rounded" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 bg-muted rounded-full shrink-0" />
                    <div className="min-w-0 space-y-1">
                      <div className="h-4 w-1/3 bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-muted px-3 py-2">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-5 w-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Transaction Not Found</h2>
        <p className="text-muted-foreground mt-2">{error || `Transaction ${id} does not exist`}</p>
        <SharedButton variant="outline" onClick={() => navigate("/payments/transactions")} className="mt-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Transactions
        </SharedButton>
      </div>
    );
  }

  const t = transaction;

  // Header actions based on transaction status
  const headerActions = (
    <div className="flex flex-wrap items-center gap-2">
      <SharedButton variant="outline" onClick={() => navigate("/payments/transactions")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </SharedButton>

      {t.status === "Pending" && (
        <>
          {canEdit && canShowEditButton && (
            <SharedButton variant="outline" onClick={() => setShowEditDialog(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </SharedButton>
          )}
          {canApprove && canShowApproveButton && (
            <SharedButton onClick={() => setShowApproveDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </SharedButton>
          )}
          {canReject && canShowRejectButton && (
            <SharedButton variant="destructive" onClick={() => setShowRejectDialog(true)}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </SharedButton>
          )}
        </>
      )}

      {t.status !== "Pending" && (
        <>
          {canEdit && canShowEditButton && (
            <SharedButton variant="outline" onClick={() => setShowEditDialog(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </SharedButton>
          )}
          {!canEdit && (
            <span className="rounded-xl bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
              View Only · {t.status}
            </span>
          )}
        </>
      )}
    </div>
  );

  // Edit dialog save handler
  const handleEditSave = async (updated: PaymentRecord) => {
    if (!transaction) return;
    setDialogLoading(true);
    try {
      // Extract correction reason from the latest timeline entry if it's a correction
      let correctionReason: string | undefined;
      if (updated.timeline && updated.timeline.length > 0) {
        const latestEntry = updated.timeline[updated.timeline.length - 1];
        if (latestEntry.label === "Correction Completed" && latestEntry.reason) {
          correctionReason = latestEntry.reason;
        }
      }
      
      const res = await updatePayment(transaction.id, updated, correctionReason);
      if (res) {
        setTransaction(res);
        // Reload change history after successful edit
        // loadChangeHistory(transaction.id);
        toast({ type: "success", title: "Updated", description: "Payment has been updated successfully." });
        setShowEditDialog(false);
      } else {
        toast({ type: "error", title: "Error", description: "Failed to update payment." });
      }
    } catch (err) {
      toast({ type: "error", title: "Error", description: err instanceof Error ? err.message : "Failed to update payment" });
    } finally {
      setDialogLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <SharedButton variant="ghost" size="icon" onClick={() => navigate("/payments/transactions")}>
            <ArrowLeft className="h-4 w-4" />
          </SharedButton>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{t.id}</h1>
              <SharedBadge variant={getStatusBadgeVariant(t.status)} className="text-xs">
                {t.status}
              </SharedBadge>
            </div>
            <p className="text-muted-foreground mt-1">{getDirectionLabel(t.direction)} · {formatCategory(t.category)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {headerActions}
        </div>
      </div>

      {/* Content - Single page layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Main Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Transaction Information */}
          {canViewInfoSection && (
          <section className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Transaction Information</h2>
                <p className="text-sm text-muted-foreground">Core details of this payment record.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SharedBadge variant={getDirectionLabel(t.direction) === "Credit" ? "success" : "secondary"} className="text-xs">
                  {getDirectionLabel(t.direction)}
                </SharedBadge>
                <SharedBadge variant={getStatusBadgeVariant(t.status)} className="text-xs">
                  {t.status}
                </SharedBadge>
              </div>
            </div>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
              <div className="flex items-baseline gap-2">
                {canViewAmount && (
                  <span className="text-3xl font-semibold tracking-tight text-foreground">{formatCurrency(t.amount)}</span>
                )}
                {!canViewAmount && (
                  <span className="text-3xl font-semibold tracking-tight text-foreground">••••••</span>
                )}
                <SharedBadge variant="default" className="text-xs">{formatCategory(t.category)}</SharedBadge>
              </div>
              {canEditAmount && canShowEditAmountButton && (
                <SharedButton variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit Amount
                </SharedButton>
              )}
            </div>
            <div className="divide-y divide-border">
              <InfoRow label="Transaction ID" value={t.id} />
              <InfoRow label="Payment Type" value={getDirectionLabel(t.direction)} />
              <InfoRow label="Category" value={formatCategory(t.category)} />
              <InfoRow label="Payment Source" value={<SharedBadge variant="default" className="text-xs">{formatSource(t.paymentSource)}</SharedBadge>} />
              <InfoRow label="Payment Date" value={formatDateTime(t.paymentDate)} />
              <InfoRow label="Created By" value={
                <span className="flex items-center gap-2">
                  {t.createdByInfo.name}
                  <SharedBadge variant="secondary" className="text-xs">{t.createdByInfo.role}</SharedBadge>
                </span>
              } />
              <InfoRow label="Created At" value={formatDateTime(t.createdAt)} />
            </div>
          </section>
          )}

          {/* User Information */}
          {canViewUserSection && (
          <section className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white", getAvatarColor(t.user.avatarColor))}>
                  {getInitials(t.user.name)}
                </div>
                <div>
                  <button type="button" onClick={() => navigate(`/users/${t.user.id}`)} className="text-sm font-semibold text-primary hover:underline">
                    {t.user.name}
                  </button>
                  <p className="text-sm text-muted-foreground">{t.user.email}</p>
                  {t.user.phone && <p className="text-sm text-muted-foreground">+91 {t.user.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}</p>}
                </div>
              </div>
              {canShowViewProfileButton && (
                <SharedButton variant="outline" size="sm" onClick={() => navigate(`/users/${t.user.id}`)}>
                  <User className="h-3.5 w-3.5 mr-1" />
                  View Profile
                </SharedButton>
              )}
            </div>
          </section>
          )}

          {/* Payment Information */}
          {canViewPaymentSection && (
          <section className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h2>
            <div className="divide-y divide-border">
              <InfoRow label="Payment Method" value={formatMethod(t.paymentMethod)} />
              <InfoRow label="UTR Number" value={<code className="font-mono text-foreground">{t.utrNumber}</code>} />
              <InfoRow label="Reference Module" value={t.referenceModule && t.referenceModule !== "None" ? t.referenceModule : "—"} />
              <InfoRow label="Reference ID" value={t.referenceId ? <code className="font-mono text-foreground">{t.referenceId}</code> : "—"} />
              <InfoRow label="Gateway Transaction ID" value={t.gatewayTransactionId ? <code className="font-mono text-foreground">{t.gatewayTransactionId}</code> : "—"} />
              <InfoRow label="Gateway Order ID" value={t.gatewayOrderId ? <code className="font-mono text-foreground">{t.gatewayOrderId}</code> : "—"} />
            </div>
          </section>
          )}

          {/* Attachment */}
          {canViewAttachmentSection && (
          <section className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Image className="h-5 w-5" />
              Attachment
            </h2>
            {t.screenshotUrl ? (
              <div className="space-y-4">
                <img
                  src={t.screenshotUrl}
                  alt="Screenshot"
                  className="h-56 w-full rounded-xl border border-border object-cover sm:h-64"
                />
                <div className="flex flex-wrap gap-2">
                  {canShowOpenAttachmentButton && (
                    <SharedButton variant="outline" size="sm" onClick={() => window.open(t.screenshotUrl!, "_blank")}>
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Open
                    </SharedButton>
                  )}
                  {canShowDownloadAttachmentButton && (
                    <a href={t.screenshotUrl} download target="_blank" rel="noreferrer">
                      <SharedButton variant="outline" size="sm" type="button">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </SharedButton>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted text-muted-foreground">
                <Image className="h-6 w-6" />
                <span className="text-xs">No screenshot</span>
              </div>
            )}
          </section>
          )}

          {/* Notes */}
          {canViewNotesSection && (
          <section className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notes
            </h2>
            <p className="flex items-start gap-2 text-sm text-foreground">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              {t.notes || "No notes."}
            </p>
          </section>
          )}

          {/* Change History */}
          {/* {canViewHistorySection && (
          <section className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <History className="h-5 w-5 text-violet-500" />
                  Change History
                </h2>
                <p className="text-sm text-muted-foreground">Field-level changes made to this transaction.</p>
              </div>
              {t.isModified && (
                <SharedBadge variant="secondary" className="text-xs self-start">
                  Modified
                </SharedBadge>
              )}
            </div>
 
          </section>
          )} */}
        </div>

        {/* Right Column - Verification, Linked Modules, Timeline, History */}
        <div className="space-y-6">
          {/* Verification Information */}
          {canViewVerificationSection && (
          <section className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification Information
            </h2>
            <div className="divide-y divide-border">
              <InfoRow label="Status" value={<SharedBadge variant={getStatusBadgeVariant(t.status)}>{t.status}</SharedBadge>} />
              <InfoRow label="Verified By" value={t.verifiedBy ?? "—"} />
              <InfoRow label="Verified At" value={t.verifiedAt ? formatDateTime(t.verifiedAt) : "—"} />
            </div>
            <div className="border-t border-border pt-3">
              <p className="mb-1.5 text-sm text-muted-foreground">Verification Notes</p>
              <p className="text-sm font-medium text-foreground">{t.verificationNotes || "No verification notes."}</p>
            </div>
          </section>
          )}

          {/* Linked Modules */}
          {canViewLinkedSection && (
          <section className="bg-card rounded-lg border-dashed border-border bg-muted/50 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Linked Modules
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">Reserved for future.</p>
            <div className="divide-y divide-border opacity-70">
              <InfoRow label="Reference Module" value={t.referenceModule && t.referenceModule !== "None" ? t.referenceModule : "—"} />
              <InfoRow label="Reference ID" value={t.referenceId ? <code className="font-mono text-foreground">{t.referenceId}</code> : "—"} />
            </div>
          </section>
          )}

          {/* Timeline / Activity */}
          {canViewTimelineSection && (
          <section className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline / Activity
            </h2>
            <p className="text-sm text-muted-foreground">Who changed what, and when.</p>
            {t.timeline && t.timeline.length > 0 ? (
              <ol className="space-y-6">
                {t.timeline.map((entry, idx) => {
                  const done = !!entry.timestamp;
                  const isLast = idx === t.timeline!.length - 1;
                  return (
                    <li key={`${entry.label}-${idx}`} className="relative flex gap-3">
                      {!isLast && (
                        <span className={cn("absolute left-[15px] top-8 h-full w-px", done ? "bg-primary/20" : "bg-border")} />
                      )}
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", timelineTone(entry, done))}>
                        {timelineIcon(entry)}
                      </span>
                      <div className="pb-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-sm font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                            {entry.label}
                          </p>
                          {entry.field && (
                            <SharedBadge variant="secondary" className="text-xs px-2 py-0.5">
                              {entry.field}
                            </SharedBadge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {entry.timestamp ? formatDateTime(entry.timestamp) : "Not yet"}
                        </p>
                        {entry.actor && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {entry.actor}
                            {entry.actorRole && (
                              <SharedBadge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                                {entry.actorRole}
                              </SharedBadge>
                            )}
                          </p>
                        )}
                        {entry.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{entry.description}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-muted-foreground text-center py-8">No timeline entries available.</p>
            )}
          </section>
          )}

          {/* Transaction History — chronological lifecycle */}
          {/* {canViewHistorySection && (
          <section id="history" className="bg-card rounded-lg border border-border p-6 space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <History className="h-5 w-5 text-violet-500" />
                Transaction History
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">Complete lifecycle of this transaction.</p>
            {t.timeline && t.timeline.length > 0 ? (
              <>
                <ol className="space-y-4">
                  {t.timeline
                    .filter((e) => !!e.timestamp)
                    .map((e, idx) => (
                      <li key={`hist-${idx}`} className="flex gap-3">
                        <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{e.label}</p>
                            {e.field && (
                              <SharedBadge variant="secondary" className="text-xs px-2 py-0.5">
                                {e.field}
                              </SharedBadge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(e.timestamp)}
                            {e.actor ? ` · ${e.actor}` : ""}
                            {e.actorRole ? ` (${e.actorRole})` : ""}
                          </p>
                          {e.description && <p className="mt-0.5 text-xs text-muted-foreground">{e.description}</p>}
                        </div>
                      </li>
                    ))}
                </ol>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-muted px-3 py-2 border border-border">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current Status</span>
                  <SharedBadge variant={getStatusBadgeVariant(t.status)}>
                    {t.status}
                  </SharedBadge>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">No history entries available.</p>
            )}
          </section>
          )} */}
        </div>
      </div>

      {/* Approve Dialog */}
      <SharedModal
        open={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        title="Approve Payment"
        size="md"
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Mark as verified: <span className="font-semibold">{formatCurrency(t.amount)}</span>
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              value={approveNotes}
              onChange={(e) => setApproveNotes(e.target.value)}
              placeholder="Optional..."
              className="w-full h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <SharedButton variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </SharedButton>
            <SharedButton onClick={handleApprove} disabled={dialogLoading}>
              {dialogLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Approve</>}
            </SharedButton>
          </div>
        </div>
      </SharedModal>

      {/* Reject Dialog */}
      <SharedModal
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        title="Reject Payment"
        size="md"
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reason</label>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Rejection reason..."
              className="w-full h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <SharedButton variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </SharedButton>
            <SharedButton variant="destructive" onClick={handleReject} disabled={dialogLoading}>
              {dialogLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Reject</>}
            </SharedButton>
          </div>
        </div>
      </SharedModal>

      {/* Edit Transaction Dialog */}
      <TransactionFormDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        payment={transaction}
        onSave={handleEditSave}
        isLoading={dialogLoading}
      />
    </div>
  );
};

// Helper component for info rows
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground sm:text-right">{value}</span>
    </div>
  );
}

export default TransactionDetailsPage;