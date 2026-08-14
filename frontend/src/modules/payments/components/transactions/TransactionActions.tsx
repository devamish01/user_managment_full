/**
 * TransactionActions — Row action dropdown for transactions table.
 * Extracted from TransactionsPage for modularity.
 */

import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui";

import type { PaymentRecord } from "../../types";

export interface TransactionActionsProps {
  payment: PaymentRecord;
  onView: (payment: PaymentRecord) => void;
  onEdit: (payment: PaymentRecord) => void;
  onDelete: (payment: PaymentRecord) => void;
}

/**
 * Renders the action dropdown menu for a transaction row.
 */
export function TransactionActions({ payment, onView, onEdit, onDelete }: TransactionActionsProps) {
  return (
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
            <DropdownItem
              onClick={() => {
                onEdit(payment);
                close();
              }}
            >
              <Edit size={14} /> Edit
            </DropdownItem>
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
      </Dropdown>
    </div>
  );
}