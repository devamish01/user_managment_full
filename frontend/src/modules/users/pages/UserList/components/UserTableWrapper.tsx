import React from "react";
import { SharedTable } from "@/shared/components";
import type { TableColumn } from "@/shared/types/table";
import type { User } from "@/lib/types";

interface UserTableWrapperProps {
  columns: TableColumn<User>[];
  data: User[];
  sort: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort: (key: string) => void;
  onRowClick: (row: User) => void;
  emptyMessage?: string;
}

export const UserTableWrapper: React.FC<UserTableWrapperProps> = ({
  columns,
  data,
  sort,
  onSort,
  onRowClick,
  emptyMessage = "No users match your filters.",
}) => (
  <div className="flex-1 min-h-0">
    <SharedTable
      columns={columns}
      data={data}
      sort={sort}
      onSort={onSort}
      rowKey={(user) => user.id}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage}
    />
  </div>
);