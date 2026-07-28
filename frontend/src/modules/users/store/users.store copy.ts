/**
 * users.store.ts — adds loading/error for the standard page lifecycle.
 *
 * Mutations (create/update/delete) intentionally do NOT flip the page
 * loading flag — pages use button-level spinners for those instead.
 */
import * as React from "react";
import type { User } from "@/lib/types";
import { UserService } from "../services";
import type { UserQueryParams, Pagination } from "@/api";

export interface UsersStoreState {
  users: User[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  getUsers: (params?: UserQueryParams) => Promise<void>;
  createUser: (data: Omit<User, "id" | "createdAt" | "lastActive">) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsersStore = (): UsersStoreState => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [pagination, setPagination] = React.useState<Pagination>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getUsers = React.useCallback(async (params?: UserQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.getUsers(params);
      if (res.success && res.data) {
        setUsers(res.data);
        if (res.meta) setPagination(res.meta as Pagination);
      } else {
        setError(res.message || "Failed to load users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = React.useCallback(async () => {
    try {
      const res = await UserService.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
        if (res.meta) setPagination(res.meta as Pagination);
      }
    } catch {
      /* swallow — mutation callers surface their own errors */
    }
  }, []);

  const createUser = React.useCallback(
    async (data: Omit<User, "id" | "createdAt" | "lastActive">) => {
      const res = await UserService.createUser(data);
      if (res.success) await refresh();
      else throw new Error(res.message);
    },
    [refresh],
  );

  const updateUser = React.useCallback(
    async (id: string, data: Partial<User>) => {
      const res = await UserService.updateUser(id, data);
      if (res.success) await refresh();
      else throw new Error(res.message);
    },
    [refresh],
  );

  const deleteUser = React.useCallback(
    async (id: string) => {
      const res = await UserService.deleteUser(id);
      if (res.success) await refresh();
      else throw new Error(res.message);
    },
    [refresh],
  );

  return { users, pagination, loading, error, getUsers, createUser, updateUser, deleteUser };
};

export default useUsersStore;
