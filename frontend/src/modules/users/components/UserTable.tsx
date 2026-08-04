import React from "react";
import { SharedTable } from "@/shared/components";
import type { TableColumn } from "@/shared/types/table";
import type { User } from "@/lib/types";

interface UserTableProps {
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

export const UserTable: React.FC<UserTableProps> = ({
  columns,
  data,
  sort,
  onSort,
  onRowClick,
  emptyMessage = "No data available.",
}) => (
  <SharedTable
    columns={columns}
    data={data}
    sort={sort}
    onSort={onSort}
    rowKey={(user) => user.id}
    onRowClick={onRowClick}
    emptyMessage={emptyMessage}
  />
);
