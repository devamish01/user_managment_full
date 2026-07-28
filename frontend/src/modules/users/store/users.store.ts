/**
 * users.store.ts
 *
 * Zustand store for the Users module.
 * Shared across the entire application.
 */

import { create } from "zustand";
import type { User } from "@/lib/types";
import { UserService } from "../services";
import type { UserQueryParams, Pagination } from "@/api";

const defaultPagination: Pagination = {
  page: 1,
  pageSize: 10,
  totalPages: 0,
};

interface UsersState {
  users: User[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

interface UsersActions {
  getUsers: (params?: UserQueryParams) => Promise<void>;
  createUser: (
    data: Omit<User, "id" | "createdAt" | "lastActive">
  ) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  reset: () => void;
}

export type UsersStore = UsersState & UsersActions;

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],
  pagination: defaultPagination,
  loading: false,
  error: null,

  getUsers: async (params?: UserQueryParams) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await UserService.getUsers(params);

      if (!response.success) {
        throw new Error(response.message || "Failed to load users");
      }

      set({
        users: response.data ?? [],
        pagination: (response.meta as Pagination) ?? defaultPagination,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load users",
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  createUser: async (data) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await UserService.createUser(data);

      if (!response.success) {
        throw new Error(response.message || "Failed to create user");
      }

      await get().getUsers();
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create user",
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  updateUser: async (id, data) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await UserService.updateUser(id, data);

      if (!response.success) {
        throw new Error(response.message || "Failed to update user");
      }

      await get().getUsers();
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user",
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  deleteUser: async (id) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await UserService.deleteUser(id);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete user");
      }

      await get().getUsers();
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete user",
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  reset: () => {
    set({
      users: [],
      pagination: defaultPagination,
      loading: false,
      error: null,
    });
  },
}));

export default useUsersStore;