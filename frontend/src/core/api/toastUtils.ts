/**
 * Centralized Toast Error Handling
 *
 * Provides a consistent way to show error/success toasts across the application.
 * Uses getErrorMessage/getSuccessMessage to extract the best possible message.
 */

import { useToast } from "@/components/ui/toast";
import { getErrorMessage, extractFieldErrors, getSuccessMessage } from "./errorUtils";

/**
 * Hook that provides centralized toast functions
 * Usage:
 *   const { toastError, toastSuccess } = useToastError();
 *   catch (error) { toastError(error); }
 *   .then(response) { toastSuccess(response); }
 */
export function useToastError() {
  const { toast } = useToast();

  const toastError = (
    error: unknown,
    options?: {
      title?: string;
      showFieldErrors?: boolean;
      duration?: number;
    }
  ) => {
    const { title = "Error", showFieldErrors = true } = options || {};

    const message = getErrorMessage(error);
    const fieldErrors = showFieldErrors ? extractFieldErrors(error) : {};

    // If there are field errors, include them in the description
    let description = message;
    if (Object.keys(fieldErrors).length > 0) {
      const fieldMessages = Object.entries(fieldErrors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join("\n");
      description = fieldMessages;
    }

    toast({
      type: "error",
      title,
      description,
    });

    // Return field errors so components can set form validation state if needed
    return fieldErrors;
  };

  const toastSuccess = (
    response: unknown,
    options?: {
      title?: string;
      description?: string;
    }
  ) => {
    const { title = "Success", description } = options || {};
    
    // Try to extract success message from backend response
    const successMessage = getSuccessMessage(response);
    const message = successMessage || (typeof response === "string" ? response : "Operation completed successfully");
    
    toast({
      type: "success",
      title,
      description: description || message,
    });
  };

  const toastInfo = (title: string, description?: string) => {
    toast({ type: "info", title, description });
  };

  const toastWarning = (title: string, description?: string) => {
    toast({ type: "warning", title, description });
  };

  return { toastError, toastSuccess, toastInfo, toastWarning };
}

/**
 * Standalone toastError function for non-React contexts (if needed)
 * Note: This requires a ToastProvider to be active in the React tree
 */
export function createToastError(toast: ReturnType<typeof useToast>["toast"]) {
  return (
    error: unknown,
    options?: {
      title?: string;
      showFieldErrors?: boolean;
    }
  ) => {
    const { title = "Error", showFieldErrors = true } = options || {};

    const message = getErrorMessage(error);
    const fieldErrors = showFieldErrors ? extractFieldErrors(error) : {};

    let description = message;
    if (Object.keys(fieldErrors).length > 0) {
      const fieldMessages = Object.entries(fieldErrors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join("\n");
      description = fieldMessages;
    }

    toast({
      type: "error",
      title,
      description,
    });

    return fieldErrors;
  };
}