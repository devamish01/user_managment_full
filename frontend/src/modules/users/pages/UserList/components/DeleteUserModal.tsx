import React from "react";
import { Trash2 } from "lucide-react";
import { SharedButton, SharedModal } from "@/shared/components";
import type { User } from "@/lib/types";

interface DeleteUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ open, user, onClose, onConfirm }) => (
  <SharedModal open={open} onClose={onClose} size="sm">
    <div className="space-y-4 text-center">
      <Trash2 size={40} className="mx-auto text-red-500" />
      <h3 className="text-lg font-semibold">Delete User?</h3>
      <p className="text-sm text-muted-foreground">Delete {user?.name}? This cannot be undone.</p>
      <div className="flex justify-center gap-2">
        <SharedButton variant="outline" onClick={onClose}>Cancel</SharedButton>
        <SharedButton variant="destructive" onClick={onConfirm}>Delete</SharedButton>
      </div>
    </div>
  </SharedModal>
);