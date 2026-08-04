import React from "react";
import { Dropdown, DropdownItem } from "@/components/ui";
import { Eye, Pencil, UserCheck, ShieldBan, MoreHorizontal, Trash2 } from "lucide-react";
import type { User } from "@/lib/types";

interface UserActionsProps {
  user: User;
  canEdit: boolean;
  canDelete: boolean;
  onView: () => void;
  onEdit: () => void;
  onToggleBlock: () => void;
  onDelete: () => void;
}

export const UserActions: React.FC<UserActionsProps> = ({
  user,
  canEdit,
  canDelete,
  onView,
  onEdit,
  onToggleBlock,
  onDelete,
}) => {
  const isBlocked = user.status === "blocked";

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
                onView();
                close();
              }}
            >
              <Eye size={14} /> View Details
            </DropdownItem>
            {canEdit && (
              <>
                <DropdownItem
                  onClick={() => {
                    onEdit();
                    close();
                  }}
                >
                  <Pencil size={14} /> Edit User
                </DropdownItem>
                <DropdownItem
                  onClick={async () => {
                    await onToggleBlock();
                    close();
                  }}
                >
                  {isBlocked ? (
                    <>
                      <UserCheck size={14} className="text-emerald-500" /> Unblock User
                    </>
                  ) : (
                    <>
                      <ShieldBan size={14} className="text-red-500" /> Block User
                    </>
                  )}
                </DropdownItem>
              </>
            )}
            {canDelete && (
              <>
                <div className="my-1 h-px bg-border" />
                <DropdownItem
                  destructive
                  onClick={() => {
                    onDelete();
                    close();
                  }}
                >
                  <Trash2 size={14} /> Delete
                </DropdownItem>
              </>
            )}
          </>
        )}
      </Dropdown>
    </div>
  );
};
