import React from "react";
import { Eye, EyeOff, Download, Plus } from "lucide-react";
import { SharedButton } from "@/shared/components";

interface UserListHeaderProps {
  total: number;
  showStats: boolean;
  onToggleStats: () => void;
  canExport: boolean;
  onExport: () => void;
  canCreate: boolean;
  onCreate: () => void;
}

export const UserListHeader: React.FC<UserListHeaderProps> = ({
  total,
  showStats,
  onToggleStats,
  canExport,
  onExport,
  canCreate,
  onCreate,
}) => (
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
    <div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Users List</h1>
      <p className="mt-1 text-sm text-muted-foreground">{total} total members</p>
    </div>
    <div className="flex gap-2">
      <SharedButton variant="outline" onClick={onToggleStats}>
        {showStats ? <EyeOff size={14} /> : <Eye size={14} />}
        <span className="ml-2">{showStats ? "Hide Stats" : "Show Stats"}</span>
      </SharedButton>
      {canExport && (
        <SharedButton variant="outline" onClick={onExport}>
          <Download size={14} /> Export
        </SharedButton>
      )}
      {canCreate && (
        <SharedButton onClick={onCreate}>
          <Plus size={14} /> Add User
        </SharedButton>
      )}
    </div>
  </div>
);