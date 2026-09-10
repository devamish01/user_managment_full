/**
 * TransactionFormDialog — Unified dialog for creating and editing transactions.
 * Handles both "Add Transaction" and "Edit Transaction" modes.
 * In edit mode, user selection is disabled (read-only).
 * In create mode, user selection is required.
 */

import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from "react";
import { Save, Upload, FileImage, X, Loader2, AlertCircle } from "lucide-react";
import { SharedButton } from "@/shared/components/SharedButton";
import { SharedInput } from "@/shared/components/SharedInput";
import { SharedSelect } from "@/shared/components/SharedSelect";
import { SharedSearchSelect } from "@/shared/components/SharedSearchSelect";
import { SharedModal } from "@/shared/components/SharedModal";
import { SharedTextarea } from "@/shared/components/SharedTextarea";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { cn } from "@/shared/utils/cn";
import { useUsersStore } from "@/modules/users/store/users.store";

import type { PaymentRecord, PaymentStatus, PaymentCategory, PaymentMethod, PaymentDirection, PaymentSource, PaymentTimelineEntry } from "@/modules/payments/types";
import type { User } from "@/lib/types";

interface TransactionFormDialogProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentRecord | null; // null for create mode, payment for edit mode
  onSave: (updated: PaymentRecord) => void;
  isLoading?: boolean;
}

export function TransactionFormDialog({ open, onClose, payment, onSave, isLoading = false }: TransactionFormDialogProps) {
  const isEditMode = !!payment;
  const isCompletedTransaction = payment?.status === "Completed";
  
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [direction, setDirection] = useState<PaymentDirection>("credit");
  const [status, setStatus] = useState<PaymentStatus>("Pending");
  const [category, setCategory] = useState<PaymentCategory>("Donation");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [paymentSource, setPaymentSource] = useState<PaymentSource>("ADMIN_ADDED");
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [correctionReason, setCorrectionReason] = useState("");
  const [showCorrectionReason, setShowCorrectionReason] = useState(false);

  // Users store for real user data
  const { users, loading: usersLoading, getUsers } = useUsersStore();

  // Load users when dialog opens (for create mode)
  const loadUsers = useCallback(async () => {
    if (!isEditMode) {
      await getUsers({ page: 1, limit: 50, sort: "name", order: "asc" });
    }
  }, [isEditMode, getUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Load payment data when in edit mode
  useEffect(() => {
    if (payment) {
      setUserId(payment.userId);
      setAmount(payment.amount);
      setDirection(payment.direction);
      setStatus(payment.status);
      setCategory(payment.category);
      setPaymentMethod(payment.paymentMethod);
      setPaymentSource(payment.paymentSource);
      setUtrNumber(payment.utrNumber);
      setPaymentDate(payment.paymentDate ? payment.paymentDate.split("T")[0] : "");
      setNotes(payment.notes || "");
      setFileName(payment.screenshotUrl ? "Existing_Screenshot.png" : null);
      setFormError(null);
    } else {
      // Reset form for create mode
      setUserId("");
      setAmount("");
      setDirection("credit");
      setStatus("Pending");
      setCategory("Donation");
      setPaymentMethod("UPI");
      setPaymentSource("ADMIN_ADDED");
      setUtrNumber("");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setFileName(null);
      setFormError(null);
    }
  }, [payment, isEditMode]);

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!userId) {
      setFormError("Please select a user");
      return;
    }
    if (!amount || parseFloat(amount.toString()) <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }
    if (!paymentDate) {
      setFormError("Please select a payment date");
      return;
    }
    // UTR number is required for create mode
    if (!isEditMode && !utrNumber.trim()) {
      setFormError("UTR number is required");
      return;
    }

    // For completed transactions, require correction reason
    if (isEditMode && isCompletedTransaction && !correctionReason.trim()) {
      setFormError("Correction reason is required for completed transactions");
      setShowCorrectionReason(true);
      return;
    }

    const selectedUserData = users.find((u: User) => u.id === userId);
    const selectedUserName = selectedUserData?.name || payment?.userName || "Unknown User";
    if (!selectedUserData) {
      setFormError("Selected user not found");
      return;
    }

    const numAmount = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
    const oldAmount = payment?.amount;
    const oldStatus = payment?.status;
    const oldDirection = payment?.direction;
    const oldCategory = payment?.category;
    const oldPaymentMethod = payment?.paymentMethod;
    const oldPaymentSource = payment?.paymentSource;
    const oldUtrNumber = payment?.utrNumber;
    const oldNotes = payment?.notes;
    const oldPaymentDate = payment?.paymentDate;

    const timelineEntries = [...(payment?.timeline || [])] as PaymentTimelineEntry[];
    const now = new Date().toISOString();
    
    // Track all field changes for audit history
    const changes: Array<{ field: string; oldValue: string; newValue: string }> = [];
    
    if (isEditMode) {
      if (numAmount !== oldAmount) {
        changes.push({ 
          field: "Amount", 
          oldValue: formatCurrency(oldAmount || 0), 
          newValue: formatCurrency(numAmount) 
        });
      }
      if (status !== oldStatus) {
        changes.push({ 
          field: "Status", 
          oldValue: oldStatus || "", 
          newValue: status 
        });
      }
      if (direction !== oldDirection) {
        changes.push({ 
          field: "Payment Type", 
          oldValue: oldDirection || "", 
          newValue: direction 
        });
      }
      if (category !== oldCategory) {
        changes.push({ 
          field: "Category", 
          oldValue: oldCategory || "", 
          newValue: category 
        });
      }
      if (paymentMethod !== oldPaymentMethod) {
        changes.push({ 
          field: "Payment Method", 
          oldValue: oldPaymentMethod || "", 
          newValue: paymentMethod 
        });
      }
      if (paymentSource !== oldPaymentSource) {
        changes.push({ 
          field: "Payment Source", 
          oldValue: oldPaymentSource || "", 
          newValue: paymentSource 
        });
      }
      if (utrNumber.trim() !== (oldUtrNumber || "").trim()) {
        changes.push({ 
          field: "UTR Number", 
          oldValue: oldUtrNumber || "—", 
          newValue: utrNumber.trim() || "—" 
        });
      }
      if (notes !== oldNotes) {
        changes.push({ 
          field: "Notes", 
          oldValue: oldNotes || "—", 
          newValue: notes || "—" 
        });
      }
      if (paymentDate !== oldPaymentDate?.split("T")[0]) {
        changes.push({ 
          field: "Payment Date", 
          oldValue: oldPaymentDate ? formatDate(oldPaymentDate) : "—", 
          newValue: paymentDate 
        });
      }

      // Add individual timeline entries for each change
      changes.forEach(change => {
        timelineEntries.push({
          label: isCompletedTransaction ? "Corrected" : "Edited",
          timestamp: now,
          actor: "Admin User",
          actorRole: "Admin",
          description: `${change.field}: ${change.oldValue} → ${change.newValue}${correctionReason ? ` (Reason: ${correctionReason})` : ""}`,
          field: change.field,
          oldValue: change.oldValue,
          newValue: change.newValue,
          reason: correctionReason || undefined,
        });
      });

      // Add a summary entry
      if (changes.length > 0) {
        timelineEntries.push({
          label: isCompletedTransaction ? "Correction Completed" : "Edited",
          timestamp: now,
          actor: "Admin User",
          actorRole: "Admin",
          description: `Updated ${changes.length} field(s)${correctionReason ? ` — Reason: ${correctionReason}` : ""}`,
        });
      }
    } else {
      timelineEntries.push({
        label: "Created",
        timestamp: now,
        actor: "Admin User",
        actorRole: "Admin",
        description: `Transaction created with amount ${formatCurrency(numAmount)}`,
      });
    }

    // Create base record with all required fields
    const baseRecord: PaymentRecord = {
      transactionId: isEditMode ? payment!.transactionId : `TXN-${String(Date.now()).slice(-6).padStart(6, "0")}`,
      userId: selectedUserData.id,
      userName: selectedUserName,
      amount: numAmount,
      direction,
      status,
      category,
      paymentMethod,
      paymentSource,
      utrNumber: utrNumber.trim(),
      paymentDate: paymentDate ? `${paymentDate}T00:00:00Z` : (payment?.paymentDate || now),
      notes,
      timeline: timelineEntries,
      updatedAt: now,
      createdAt: isEditMode ? payment!.createdAt : now,
      createdByInfo: isEditMode ? payment!.createdByInfo : {
        id: "USR-00001",
        name: "Admin User",
        role: "Admin",
      },
      screenshotUrl: isEditMode ? payment!.screenshotUrl : null,
      verifiedBy: isEditMode ? payment!.verifiedBy : null,
      verifiedAt: isEditMode ? payment!.verifiedAt : null,
      verificationNotes: isEditMode ? payment!.verificationNotes : null,
    };

    // Add audit fields for edit mode
    const updatedRecord: PaymentRecord = isEditMode
      ? {
          ...baseRecord,
          isModified: true,
          lastModifiedAt: now,
          lastModifiedBy: "Admin User",
        }
      : baseRecord;

    if (onSave) {
      onSave(updatedRecord);
    }
    onClose();
  }

  return (
    <SharedModal
      open={open}
      onClose={onClose}
      title={isEditMode ? `Edit Transaction (${payment?.transactionId})` : "Add New Transaction"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {isEditMode 
            ? "Update transaction details. User cannot be changed in edit mode." 
            : "Fill in all required fields to create a new transaction."}
        </p>

        {formError && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              User {isEditMode && <span className="text-xs text-muted-foreground ml-1">(Read-only)</span>}
            </label>
            <SharedSearchSelect
              value={userId}
              onValueChange={(value) => setUserId(value)}
              options={users.map((u: User) => ({ 
                value: u.id, 
                label: u.name, 
                description: u.email 
              }))}
              placeholder="Select a user"
              disabled={isEditMode}
              searchPlaceholder="Search users by name or email..."
              noResultsMessage={usersLoading ? "Loading users..." : users.length === 0 ? "No users found" : "No users found"}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Amount *</label>
            <SharedInput
              type="number"
              step="0.01"
              min={0}
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Payment Type *</label>
            <SharedSelect
              value={direction}
              onValueChange={(value) => setDirection(value as PaymentDirection)}
              options={[
                { value: "credit", label: "Credit (Money Received)" },
                { value: "debit", label: "Debit (Money Sent)" },
              ]}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Status *</label>
            <SharedSelect
              value={status}
              onValueChange={(value) => setStatus(value as PaymentStatus)}
              options={[
                { value: "Pending", label: "Pending" },
                { value: "Completed", label: "Completed" },
                { value: "Rejected", label: "Rejected" },
                { value: "Refunded", label: "Refunded" },
              ]}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Category *</label>
            <SharedSelect
              value={category}
              onValueChange={(value) => setCategory(value as PaymentCategory)}
              options={[
                { value: "Donation", label: "Donation" },
                { value: "Giveaway", label: "Giveaway" },
                { value: "Event", label: "Event" },
                { value: "Charity", label: "Charity" },
                { value: "Manual", label: "Manual" },
                { value: "Refund", label: "Refund" },
                { value: "Other", label: "Other" },
              ]}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Payment Method *</label>
            <SharedSelect
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              options={[
                { value: "PhonePe", label: "PhonePe" },
                { value: "Google Pay", label: "Google Pay" },
                { value: "UPI", label: "UPI" },
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Cash", label: "Cash" },
                { value: "Other", label: "Other" },
              ]}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Payment Source *</label>
            <SharedSelect
              value={paymentSource}
              onValueChange={(value) => setPaymentSource(value as PaymentSource)}
              options={[
                { value: "ADMIN_ADDED", label: "Admin Added" },
                { value: "USER_PAYMENT", label: "User Payment" },
                { value: "GATEWAY", label: "Gateway" },
                { value: "SYSTEM", label: "System" },
              ]}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              UTR Number {!isEditMode && <span className="text-destructive">*</span>}
            </label>
            <SharedInput
              value={utrNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUtrNumber(e.target.value)}
              placeholder="e.g. UTR2024081512345"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Payment Date *</label>
            <SharedInput
              type="date"
              value={paymentDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentDate(e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Screenshot Attachment</label>
            <label
              htmlFor="transaction-screenshot"
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors",
                fileName
                  ? "border-primary bg-primary/5 hover:border-primary/50"
                  : "border-border bg-muted/50 hover:border-primary/30"
              )}
            >
              {fileName ? (
                <div className="flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{fileName}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFileName(null);
                    }}
                    className="ml-2 inline-flex items-center gap-1 text-xs text-destructive hover:text-destructive/80"
                  >
                    <X className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Upload className="h-4 w-4" />
                  <span>Click to upload screenshot (PNG, JPG up to 5MB)</span>
                </div>
              )}
              <input
                id="transaction-screenshot"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFileName(f.name);
                }}
              />
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Notes</label>
            <SharedTextarea
              value={notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Add any internal payment notes..."
            />
          </div>

          {/* Correction Reason - Required for completed transactions */}
          {isEditMode && isCompletedTransaction && (
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground flex items-center gap-1">
                Correction Reason <span className="text-destructive">*</span>
                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
              </label>
              <SharedTextarea
                value={correctionReason}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setCorrectionReason(e.target.value);
                  setShowCorrectionReason(false);
                }}
                placeholder="Explain why this completed transaction is being corrected (e.g., 'Wrong amount entered', 'Incorrect category selected')"
                rows={3}
                className={cn(
                  showCorrectionReason && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {showCorrectionReason && (
                <p className="mt-1 text-xs text-destructive">Correction reason is required for completed transactions</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                This reason will be recorded in the transaction history for audit purposes.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <SharedButton variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </SharedButton>
          <SharedButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? "Save Changes" : "Create Transaction"}
              </>
            )}
          </SharedButton>
        </div>
      </form>
    </SharedModal>
  );
}