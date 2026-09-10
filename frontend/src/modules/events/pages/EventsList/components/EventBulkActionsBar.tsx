import { Trash2, UserCheck, UserX, Ban } from "lucide-react";
import { SharedButton } from "@/shared/components/SharedButton";
import type { UseEventListPermissionsReturn } from "../hooks";

type BulkAction = "delete" | "publish" | "draft" | "cancel";

interface EventBulkActionsBarProps {
  selectedIds: string[];
  permissions: UseEventListPermissionsReturn;
  onAction: (action: BulkAction) => void;
  onClearSelection: () => void;
}

const bulkActions: { value: BulkAction; label: string; icon: React.ComponentType<{ className?: string }>; variant: "destructive" | "secondary" | "outline" }[] = [
  { value: "delete", label: "Delete", icon: Trash2, variant: "destructive" },
  { value: "publish", label: "Publish", icon: UserCheck, variant: "secondary" },
  { value: "draft", label: "Move to Draft", icon: UserX, variant: "outline" },
  { value: "cancel", label: "Cancel", icon: Ban, variant: "outline" },
];

export function EventBulkActionsBar({ selectedIds, permissions, onAction, onClearSelection }: EventBulkActionsBarProps) {
  if (selectedIds.length === 0 || !permissions.canBulkActions) return null;

  const canDelete = permissions.canDelete;
  const canEdit = permissions.canEdit;

  return (
    <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-primary-800">
          {selectedIds.length} event{selectedIds.length > 1 ? "s" : ""} selected
        </span>
        <div className="flex items-center gap-2">
          {bulkActions.map(({ value, label, icon: Icon, variant }) => {
            const isDisabled = 
              (value === "delete" && !canDelete) ||
              (["publish", "draft", "cancel"].includes(value) && !canEdit);
            
            if (isDisabled) return null;

            return (
              <SharedButton
                key={value}
                variant={variant}
                size="sm"
                icon={<Icon className="w-3.5 h-3.5" />}
                onClick={() => onAction(value)}
                disabled={selectedIds.length === 0}
              >
                {label}
              </SharedButton>
            );
          })}
        </div>
      </div>
      <SharedButton variant="ghost" size="sm" onClick={onClearSelection}>
        Clear selection
      </SharedButton>
    </div>
  );
}