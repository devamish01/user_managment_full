import React from "react";
import { Eye, EyeOff, Download, Plus, Menu, X } from "lucide-react";
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="users-header">
      <div className="w-full md:w-auto">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Users List</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{total} total members</p>
      </div>

      {/* Mobile hamburger menu */}
      <button
        type="button"
        className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-expanded={mobileMenuOpen}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Action buttons - hidden on mobile when menu closed */}
      <div className={`flex flex-wrap items-center gap-2 w-full md:w-auto ${mobileMenuOpen ? "" : "md:flex hidden"}`}>
        <SharedButton variant="outline" onClick={onToggleStats} className="shrink-0">
          {showStats ? <EyeOff size={14} /> : <Eye size={14} />}
          <span className="ml-2 hidden sm:inline">{showStats ? "Hide Stats" : "Show Stats"}</span>
        </SharedButton>
        {canExport && (
          <SharedButton variant="outline" onClick={onExport} className="shrink-0">
            <Download size={14} />
            <span className="ml-2 hidden sm:inline">Export</span>
          </SharedButton>
        )}
        {canCreate && (
          <SharedButton onClick={onCreate} className="shrink-0">
            <Plus size={14} />
            <span className="ml-2 hidden sm:inline">Add User</span>
          </SharedButton>
        )}
      </div>
    </div>
  );
};