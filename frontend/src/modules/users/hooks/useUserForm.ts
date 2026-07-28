/**
 * useUserForm — manages form state for creating/editing a user.
 * Uses store actions for submission.
 */

import { useState, useCallback } from "react";
import type { UserFormState } from "..";
import type { Role } from "@/lib/types";

export interface UseUserFormReturn {
  form: UserFormState;
  setField: <K extends keyof UserFormState>(key: K, value: UserFormState[K]) => void;
  resetForm: () => void;
  initializeForm: (user?: UserFormState, roles?: Role[]) => void;
}

const emptyForm = (roleId: string): UserFormState => ({
  name: "",
  email: "",
  phone: "",
  roleId,
  status: "active",
});

export function useUserForm(defaultRoleId: string = ""): UseUserFormReturn {
  const [form, setForm] = useState<UserFormState>(emptyForm(defaultRoleId));

  const setField = useCallback(<K extends keyof UserFormState>(key: K, value: UserFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setForm(emptyForm(defaultRoleId));
  }, [defaultRoleId]);

  const initializeForm = useCallback((initialData?: UserFormState, roles?: Role[]) => {
    if (initialData) {
      setForm(initialData);
    } else {
      const fallbackRoleId = roles?.[0]?.id || defaultRoleId;
      setForm(emptyForm(fallbackRoleId));
    }
  }, [defaultRoleId]);

  return { form, setField, resetForm, initializeForm };
}
