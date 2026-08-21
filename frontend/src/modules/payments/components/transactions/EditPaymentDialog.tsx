/**
 * EditPaymentDialog — comprehensive payment editing dialog.
 * Allows editing all payment fields including user, amount, status, category,
 * payment method, payment source, UTR number, payment date, screenshot, and notes.
 * Automatically adds timeline entries for amount and status changes.
 */

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Save, Upload, FileImage, X } from "lucide-react";
import { SharedButton } from "@/shared/components/SharedButton";
import { SharedInput } from "@/shared/components/SharedInput";
import { SharedSelect } from "@/shared/components/SharedSelect";
import { SharedModal } from "@/shared/components/SharedModal";
import { SharedTextarea } from "@/shared/components/SharedTextarea";
import { mockUsers } from "@/mocks/users";
import { formatCurrency } from "@/lib/helpers";
import { cn } from "@/shared/utils/cn";

import type { PaymentRecord, PaymentStatus, PaymentCategory, PaymentMethod, PaymentDirection, PaymentSource, PaymentTimelineEntry } from "@/modules/payments/types";

interface EditPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
  onSave?: (updated: PaymentRecord) => void;
}

export function EditPaymentDialog({ open, onClose, payment, onSave }: EditPaymentDialogProps) {
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

  useEffect(() => {
    if (payment) {
      setUserId(payment.userId);
      setAmount(payment.amount);
      setDirection(payment.direction);
      setStatus(payment.status);
      setCategory(payment.category);
      setPaymentMethod(payment.paymentMethod);
      setPaymentSource(payment.paymentSource);
      setUtrNumber(payment.utrNumber === "—" ? "" : payment.utrNumber);
      setPaymentDate(payment.paymentDate ? payment.paymentDate.split("T")[0] : "");
      setNotes(payment.notes || "");
      setFileName(payment.screenshotUrl ? "Existing_Screenshot.png" : null);
    }
  }, [payment]);

  if (!payment) return null;

  const currentPayment = payment; // TypeScript narrowing

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const selectedUser = mockUsers.find((u) => u.id === userId);
    const selectedUserName = selectedUser?.name || currentPayment.userName || "Unknown User";
    const numAmount = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
    const oldAmount = currentPayment.amount;
    const oldStatus = currentPayment.status;

    const timelineEntries = [...(currentPayment.timeline || [])] as PaymentTimelineEntry[];
    if (numAmount !== oldAmount) {
      timelineEntries.push({
        label: "Amount Updated",
        timestamp: new Date().toISOString(),
        actor: "Admin User",
        actorRole: "Admin",
        description: `Changed ${formatCurrency(oldAmount)} → ${formatCurrency(numAmount)}`,
      });
    }
    if (status !== oldStatus) {
      timelineEntries.push({
        label: "Status Changed",
        timestamp: new Date().toISOString(),
        actor: "Admin User",
        actorRole: "Admin",
        description: `${oldStatus} → ${status}`,
      });
    }
    timelineEntries.push({
      label: "Edited",
      timestamp: new Date().toISOString(),
      actor: "Admin User",
      actorRole: "Admin",
      description: `Updated payment details`,
    });

    const updatedRecord: PaymentRecord = {
      ...currentPayment,
      userId: selectedUser?.id || currentPayment.userId,
      userName: selectedUserName,
      amount: numAmount,
      direction,
      status,
      category,
      paymentMethod,
      paymentSource,
      utrNumber: utrNumber.trim() || "—",
      paymentDate: paymentDate ? `${paymentDate}T00:00:00Z` : currentPayment.paymentDate,
      notes,
      timeline: timelineEntries,
      transactionId: currentPayment.transactionId,
    };

    if (onSave) {
      onSave(updatedRecord);
    }
    onClose();
  }

  return (
    <SharedModal
      open={open}
      onClose={onClose}
      title={`Edit Payment (${payment.transactionId})`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-muted-foreground">Update any payment field including amount, status, category, and source.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <SharedSelect
              value={userId}
              onValueChange={(value) => setUserId(value)}
              options={mockUsers.map((u) => ({ value: u.id, label: `${u.name} — ${u.email}` }))}
              placeholder="Select a user"
            />
          </div>

          <SharedInput
            type="number"
            step="0.01"
            min={0}
            value={amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            required
          />
          <SharedSelect
            value={status}
            onValueChange={(value) => setStatus(value as PaymentStatus)}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Verified", label: "Verified" },
              { value: "Rejected", label: "Rejected" },
            ]}
          />

          <SharedSelect
            value={direction}
            onValueChange={(value) => setDirection(value as PaymentDirection)}
            options={[
              { value: "credit", label: "Credit" },
              { value: "debit", label: "Debit" },
            ]}
          />
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

          <SharedInput
            value={utrNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUtrNumber(e.target.value)}
            placeholder="e.g. UTR2024081512345"
          />
          <SharedInput
            type="date"
            value={paymentDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentDate(e.target.value)}
            required
          />

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Screenshot Attachment</label>
            <label
              htmlFor="edit-screenshot"
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
                  <span>Click to replace screenshot (PNG, JPG up to 5MB)</span>
                </div>
              )}
              <input
                id="edit-screenshot"
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
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <SharedButton variant="outline" type="button" onClick={onClose}>
            Cancel
          </SharedButton>
          <SharedButton type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </SharedButton>
        </div>
      </form>
    </SharedModal>
  );
}