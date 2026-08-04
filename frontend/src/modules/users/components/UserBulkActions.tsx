import React from "react";
import { SharedButton } from "@/shared/components";

interface UserBulkActionsProps {
  selectedCount: number;
  onAction: (action: "delete" | "activate" | "deactivate" | "block") => void;
}

export const UserBulkActions: React.FC<UserBulkActionsProps> = ({ selectedCount, onAction }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm">
        <span className="font-semibold">{selectedCount}</span> user{selectedCount > 1 ? "s" : ""} selected
      </p>
      <div className="flex flex-wrap gap-2">
        <SharedButton variant="outline" size="sm" onClick={() => onAction("activate")}>Activate Selected</SharedButton>
        <SharedButton variant="outline" size="sm" onClick={() => onAction("deactivate")}>Deactivate Selected</SharedButton>
        <SharedButton variant="outline" size="sm" onClick={() => onAction("block")}>Block Selected</SharedButton>
        <SharedButton variant="destructive" size="sm" onClick={() => onAction("delete")}>Delete Selected</SharedButton>
      </div>
    </div>
  );
};
