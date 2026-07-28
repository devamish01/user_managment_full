import { useUsersStore } from "./users.store";

/**
 * State Selectors
 */

export const useUsers = () =>
  useUsersStore((state) => state.users);

export const useUsersLoading = () =>
  useUsersStore((state) => state.loading);

export const useUsersError = () =>
  useUsersStore((state) => state.error);

export const useUsersPagination = () =>
  useUsersStore((state) => state.pagination);

/**
 * Action Selectors
 */

export const useGetUsers = () =>
  useUsersStore((state) => state.getUsers);

export const useCreateUser = () =>
  useUsersStore((state) => state.createUser);

export const useUpdateUser = () =>
  useUsersStore((state) => state.updateUser);

export const useDeleteUser = () =>
  useUsersStore((state) => state.deleteUser);

export const useResetUsers = () =>
  useUsersStore((state) => state.reset);