/**
 * users.store.ts
 *
 * Zustand store for the Users module.
 * Shared across the entire application.
 */

import { create } from "zustand";
import type { User } from "@/lib/types";
import type { UserFormState } from "../types";
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
  getUserById: (id: string) => Promise<Awaited<ReturnType<typeof UserService.getUserById>>>;
  createUser: (
    data: UserFormState
  ) => Promise<Awaited<ReturnType<typeof UserService.createUser>>>;
  // updateUser: (id: string, data: Partial<User>) => Promise<void>;
  updateUser: (
  id: string,
  data: Partial<User>
) => Promise<Awaited<ReturnType<typeof UserService.updateUser>>>;
  deleteUser: (id: string) => Promise<Awaited<ReturnType<typeof UserService.deleteUser>>>;
  resetUserPassword: (id: string, password: string, confirmPassword?: string) => Promise<Awaited<ReturnType<typeof UserService.resetUserPassword>>>;
  reset: () => void;
}

export type UsersStore = UsersState & UsersActions;

export type UsersStoreState = UsersStore;

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

  getUserById: async (id: string) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await UserService.getUserById(id);

      if (!response.success) {
        throw response;
      }

      return response;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load user",
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

      return response;
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

    return response; // ✅ IMPORTANT
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

      return response;
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

 resetUserPassword: async (id, password, confirmPassword = "") => {
  set({
    loading: true,
    error: null,
  });

  try {
    const response = await UserService.resetUserPassword(
      id,
      password,
      confirmPassword
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to reset password");
    }

    return response;
  } catch (error) {
    set({
      error:
        error instanceof Error
          ? error.message
          : "Failed to reset password",
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