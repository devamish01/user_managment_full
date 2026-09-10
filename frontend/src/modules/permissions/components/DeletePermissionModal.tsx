import { Trash2, Users } from "lucide-react";
import { SharedButton, SharedModal } from "@/shared/components";
import type { Permission } from "@/lib/types";

interface DeletePermissionModalProps {
  permission: Permission | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePermissionModal = ({ permission, onClose, onConfirm }: DeletePermissionModalProps) => {
  return (
    <SharedModal open={!!permission} onClose={onClose} size="sm" title="Delete Permission?">
      <div className="space-y-4 text-center">
        <Trash2 size={40} className="mx-auto text-red-500" />
        <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{permission?.name}</strong>?</p>
        {permission && permission.assignedRolesCount && permission.assignedRolesCount > 0 && (
          <p className="text-sm text-red-500">
            <Users size={12} className="inline mr-1" />
            This permission is assigned to {permission.assignedRolesCount} role{permission.assignedRolesCount !== 1 ? "s" : ""}. It cannot be deleted until removed from all roles.
          </p>
        )}
        <div className="flex justify-center gap-2"><SharedButton variant="outline" onClick={onClose}>Cancel</SharedButton><SharedButton variant="destructive" onClick={onConfirm} disabled={!!(permission && permission.assignedRolesCount && permission.assignedRolesCount > 0)}>Delete</SharedButton></div>
      </div>
    </SharedModal>
  );
};
